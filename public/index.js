// Main initialization function
document.addEventListener("DOMContentLoaded", () => {
  initializeSpotifyData();
});

const SPOTIFY_API = "https://spotify.ash.xyz";
const NOW_PLAYING_INTERVAL = 5000;

// Initialize Spotify data and set up periodic refresh
function initializeSpotifyData() {
  // The top charts move on the order of days, so they're fetched once per load.
  // The first fetch fills in the current track too, which is then kept live on
  // its own much cheaper endpoint.
  fetchSpotifyData();
  setInterval(fetchNowPlaying, NOW_PLAYING_INTERVAL);
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
  const currentTrack = document.getElementById("current-track");
  currentTrack.innerHTML = ""; // Clear existing content

  if (currentlyPlaying && currentlyPlaying.track) {
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
  } else {
    currentTrack.textContent =
      "I'm not playing any music right now, check back later";
  }
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

