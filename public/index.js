// Main initialization function
document.addEventListener("DOMContentLoaded", () => {
  initializeSpotifyData();
});

const SPOTIFY_API = "https://spotify.ash.xyz";
const NOW_PLAYING_INTERVAL = 5000;

// The API caches currently playing for 5 seconds, which bounds how stale a
// response can honestly be. fetched_at_ms comes from the server's clock, so
// comparing it against ours mixes two clocks — a visitor whose clock is off by
// minutes would otherwise see the counter fly off. Clamping caps how far wrong
// that can go at the width of the cache window.
const MAX_STALENESS_MS = 6000;

// Below this much disagreement, keep our own clock running instead of snapping
// to the reported figure. Cache age differs from one response to the next, so
// re-anchoring every poll makes the seconds visibly stutter back and forth.
const RESYNC_THRESHOLD_MS = 1500;

let nowPlaying = null;
// Where playback was, and when we knew it. Measured with performance.now(),
// which is monotonic, so this survives the system clock changing mid-track.
let anchor = null;
let renderedKey = null;
let tickTimer = null;
let pollTimer = null;

// Initialize Spotify data and set up periodic refresh
function initializeSpotifyData() {
  // The top charts move on the order of days, so they're fetched once per load.
  // The first fetch fills in the current track too, which is then kept live on
  // its own much cheaper endpoint.
  fetchSpotifyData();
  startPolling();

  // Nothing worth polling or ticking for a tab nobody is looking at. Coming
  // back resyncs, so the counter doesn't resume from a stale figure.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopPolling();
      stopTicking();
      return;
    }

    fetchNowPlaying();
    startPolling();
  });
}

function startPolling() {
  stopPolling();
  pollTimer = setInterval(fetchNowPlaying, NOW_PLAYING_INTERVAL);
}

function stopPolling() {
  clearInterval(pollTimer);
  pollTimer = null;
}

// Function to fetch data from Spotify API
async function fetchSpotifyData() {
  try {
    const response = await fetch(`${SPOTIFY_API}/api`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    updateSpotifyUI(data);
  } catch (error) {
    console.error("Error fetching data from Spotify API:", error);
    updateErrorState();
  }
}

// Function to fetch just the current track, polled far more often than the
// charts because it's the only part that changes while the page is open
async function fetchNowPlaying() {
  try {
    const response = await fetch(`${SPOTIFY_API}/api/now-playing`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const currentlyPlaying = await response.json();
    updateCurrentTrack(currentlyPlaying);
  } catch (error) {
    // Leave the last known track on screen. A single failed poll shouldn't
    // blank out what was playing a few seconds ago.
    console.error("Error fetching currently playing from Spotify API:", error);
  }
}

// Create a clickable link element
function createLinkElement(text, href) {
  const link = document.createElement("a");
  link.href = href;
  link.textContent = text;
  link.target = "_blank"; // Open in new tab
  link.rel = "noopener noreferrer"; // Security best practice
  return link;
}

// Function to update the currently playing track. Takes the currently_playing
// object, which is null when nothing is playing.
function updateCurrentTrack(currentlyPlaying) {
  if (!currentlyPlaying || !currentlyPlaying.track) {
    nowPlaying = null;
    anchor = null;
    renderedKey = null;
    stopTicking();

    const currentTrack = document.getElementById("current-track");
    currentTrack.innerHTML = "";
    currentTrack.textContent = "nothing ⛰️";
    return;
  }

  const key = trackKey(currentlyPlaying);
  const reported = anchorFrom(currentlyPlaying);

  // Re-anchor on a new track or a play/pause change, and otherwise only once
  // our own clock has drifted noticeably from what the server reports.
  if (
    !anchor ||
    key !== renderedKey ||
    Math.abs(currentProgressMs() - reported.progressMs) > RESYNC_THRESHOLD_MS
  ) {
    anchor = reported;
  }

  nowPlaying = currentlyPlaying;

  // Rebuilding the line every poll would recreate the links underneath the
  // cursor, so it only happens when what it says actually changes.
  if (key !== renderedKey) {
    renderTrackLine(currentlyPlaying);
    renderedKey = key;
  }

  renderTime();
  scheduleTick();
}

// trackKey changes whenever the line needs rebuilding: a different track, or
// the same one pausing or resuming.
function trackKey(currentlyPlaying) {
  const track = currentlyPlaying.track;
  const id = track.spotify_url || track.name || "";

  return `${id}|${currentlyPlaying.is_playing !== false}`;
}

// anchorFrom converts a response into a local starting point for the counter.
function anchorFrom(currentlyPlaying) {
  const playing = currentlyPlaying.is_playing !== false;
  let staleness = 0;

  // A paused track hasn't moved on while the response sat in cache, so only
  // playback gets the correction.
  if (playing && Number.isFinite(currentlyPlaying.fetched_at_ms)) {
    const age = Date.now() - currentlyPlaying.fetched_at_ms;
    staleness = Math.min(Math.max(age, 0), MAX_STALENESS_MS);
  }

  return {
    progressMs: (currentlyPlaying.progress_ms || 0) + staleness,
    at: performance.now(),
  };
}

function currentProgressMs() {
  if (!anchor) {
    return 0;
  }

  const playing = nowPlaying ? nowPlaying.is_playing !== false : false;
  const duration = trackDurationMs();
  const progress = anchor.progressMs + (playing ? performance.now() - anchor.at : 0);

  return duration ? Math.min(progress, duration) : progress;
}

function trackDurationMs() {
  return nowPlaying && nowPlaying.track ? nowPlaying.track.duration_ms || 0 : 0;
}

function renderTrackLine(currentlyPlaying) {
  const currentTrack = document.getElementById("current-track");
  currentTrack.innerHTML = ""; // Clear existing content

  const track = currentlyPlaying.track;
  const songLink = createLinkElement(track.name, track.spotify_url || "#");

  // Handle multiple artists with null checks
  if (track.artists && track.artists.length > 0) {
    const artistNames = track.artists.map((artist) => artist.name).join(", ");
    const firstArtistUrl = track.artists[0].spotify_url || "#";
    const firstArtistLink = createLinkElement(artistNames, firstArtistUrl);

    currentTrack.appendChild(songLink);
    currentTrack.appendChild(document.createTextNode(" - "));
    currentTrack.appendChild(firstArtistLink);
  } else {
    currentTrack.appendChild(songLink);
  }

  // The time goes last so that proportional digits only ever nudge the end of
  // the line, rather than shifting the artist name on every tick.
  const time = document.createElement("span");
  time.id = "track-time";
  currentTrack.appendChild(time);

  // Spotify keeps returning the track after you hit pause, so without this
  // it reads as though I'm still listening to it.
  if (currentlyPlaying.is_playing === false) {
    currentTrack.appendChild(document.createTextNode(" (paused)"));
  }
}

function renderTime() {
  const time = document.getElementById("track-time");
  if (!time) {
    return;
  }

  // Podcasts and local files don't always report a length, and a position
  // without one says nothing.
  const duration = trackDurationMs();
  time.textContent = duration
    ? ` · ${formatTime(currentProgressMs())} / ${formatTime(duration)}`
    : "";
}

// scheduleTick lands each update just past the next whole second of playback,
// rather than on a flat interval that drifts out of phase and makes the counter
// skip a second or linger on one.
function scheduleTick() {
  stopTicking();

  const playing = nowPlaying ? nowPlaying.is_playing !== false : false;
  if (!playing || document.hidden || !trackDurationMs()) {
    return;
  }

  const delay = 1000 - (currentProgressMs() % 1000);

  tickTimer = setTimeout(() => {
    renderTime();
    scheduleTick();
  }, delay);
}

function stopTicking() {
  clearTimeout(tickTimer);
  tickTimer = null;
}

function formatTime(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

// Function to update the UI with Spotify data
function updateSpotifyUI(data) {
  updateCurrentTrack(data.currently_playing);

  // Update top artists
  const artistsList = document.getElementById("artists-list");
  artistsList.innerHTML = ""; // Clear existing list
  if (
    data.top_artists &&
    data.top_artists.artists &&
    Array.isArray(data.top_artists.artists)
  ) {
    data.top_artists.artists.forEach((artist) => {
      const li = document.createElement("li");
      const artistLink = createLinkElement(
        artist.name,
        artist.spotify_url || "#",
      );
      li.appendChild(artistLink);
      artistsList.appendChild(li);
    });
  }

  const songsList = document.getElementById("songs-list");
  songsList.innerHTML = ""; // Clear existing list
  if (
    data.top_tracks &&
    data.top_tracks.tracks &&
    Array.isArray(data.top_tracks.tracks)
  ) {
    data.top_tracks.tracks.forEach((track) => {
      const li = document.createElement("li");
      const songLink = createLinkElement(track.name, track.spotify_url || "#");

      // Handle multiple artists with null checks
      if (track.artists && track.artists.length > 0) {
        const artistNames = track.artists
          .map((artist) => artist.name)
          .join(", ");
        const firstArtistUrl = track.artists[0].spotify_url || "#";
        const firstArtistLink = createLinkElement(artistNames, firstArtistUrl);

        li.appendChild(songLink);
        li.appendChild(document.createTextNode(" by "));
        li.appendChild(firstArtistLink);
      } else {
        li.appendChild(songLink);
      }

      songsList.appendChild(li);
    });
  }
}

// Function to update UI in case of error
function updateErrorState() {
  const currentTrack = document.getElementById("current-track");
  currentTrack.textContent = "Unable to load Spotify data";
  renderedKey = null;

  const artistsList = document.getElementById("artists-list");
  artistsList.textContent = "";
  const artistsError = document.createElement("li");
  artistsError.textContent = "Failed to load artists";
  artistsList.appendChild(artistsError);

  const songsList = document.getElementById("songs-list");
  songsList.textContent = "";
  const songsError = document.createElement("li");
  songsError.textContent = "Failed to load songs";
  songsList.appendChild(songsError);
}

