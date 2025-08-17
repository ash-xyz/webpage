// Main initialization function
document.addEventListener("DOMContentLoaded", () => {
  initializeSpotifyData();
  doSomething();
});

// Initialize Spotify data and set up periodic refresh
function initializeSpotifyData() {
  fetchSpotifyData();
  // Refresh data every 30 seconds
  setInterval(fetchSpotifyData, 30000);
}

// Function to fetch data from Spotify API
async function fetchSpotifyData() {
  const spotify = "https://spotify.ash.xyz/api";
  try {
    const response = await fetch(spotify);
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

// Create a clickable link element
function createLinkElement(text, href) {
  const link = document.createElement("a");
  link.href = href;
  link.textContent = text;
  link.target = "_blank"; // Open in new tab
  link.rel = "noopener noreferrer"; // Security best practice
  return link;
}

// Function to update the UI with Spotify data
function updateSpotifyUI(data) {
  // Update currently playing
  const currentTrack = document.getElementById("current-track");
  currentTrack.innerHTML = ""; // Clear existing content

  if (data.currently_playing && data.currently_playing.track) {
    const track = data.currently_playing.track;
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
  const songsList = document.getElementById("songs-list");
  artistsList.innerHTML = "<li>Failed to load artists</li>";
  songsList.innerHTML = "<li>Failed to load songs</li>";
}

// Original doSomething function for IP guide
function doSomething() {
  const apiUrl = "https://ip.guide";
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      return fetch("/api", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Referer": window.document.referrer,
        },
        body: JSON.stringify(data),
      });
    })
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error("Error in IP guide flow:", error);
    });
}
