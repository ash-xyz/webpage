// Main initialization function
document.addEventListener('DOMContentLoaded', () => {
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
    const spotify = 'https://spotify-ash-xyz.fly.dev/api';
    try {
        const response = await fetch(spotify);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        updateSpotifyUI(data);
    } catch (error) {
        console.error('Error fetching data from Spotify API:', error);
        updateErrorState();
    }
}

// Create a clickable link element
function createLinkElement(text, href) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    link.target = '_blank'; // Open in new tab
    link.rel = 'noopener noreferrer'; // Security best practice
    return link;
}

// Function to update the UI with Spotify data
function updateSpotifyUI(data) {
    // Update currently playing
    const currentTrack = document.getElementById('current-track');
    currentTrack.innerHTML = ''; // Clear existing content
    
    if (data.currently_playing) {
        const song = data.currently_playing;
        const songLink = createLinkElement(song.name, song.link);
        const artistLink = createLinkElement(song.artist.name, song.artist.link);
        currentTrack.appendChild(songLink);
        currentTrack.appendChild(document.createTextNode(' - '));
        currentTrack.appendChild(artistLink);
    } else {
        currentTrack.textContent = "I'm not playing any music right now, check back later";
    }

    // Update top artists
    const artistsList = document.getElementById('artists-list');
    artistsList.innerHTML = ''; // Clear existing list
    if (data.top_artists && Array.isArray(data.top_artists)) {
        data.top_artists.forEach(artist => {
            const li = document.createElement('li');
            const artistLink = createLinkElement(artist.name, artist.link);
            li.appendChild(artistLink);
            artistsList.appendChild(li);
        });
    }

    // Update top songs
    const songsList = document.getElementById('songs-list');
    songsList.innerHTML = ''; // Clear existing list
    if (data.top_songs && Array.isArray(data.top_songs)) {
        data.top_songs.forEach(song => {
            const li = document.createElement('li');
            const songLink = createLinkElement(song.name, song.link);
            const artistLink = createLinkElement(song.artist.name, song.artist.link);
            li.appendChild(songLink);
            li.appendChild(document.createTextNode(' by '));
            li.appendChild(artistLink);
            songsList.appendChild(li);
        });
    }
}

// Function to update UI in case of error
function updateErrorState() {
    const currentTrack = document.getElementById('current-track');
    currentTrack.textContent = 'Unable to load Spotify data';
    
    const artistsList = document.getElementById('artists-list');
    const songsList = document.getElementById('songs-list');
    artistsList.innerHTML = '<li>Failed to load artists</li>';
    songsList.innerHTML = '<li>Failed to load songs</li>';
}

// Original doSomething function for IP guide
function doSomething() {
    const apiUrl = 'https://ip.guide';
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            return fetch('/api', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Referer': window.document.referrer,
                },
                body: JSON.stringify(data)
            });
        })
        .then(response => response.text())
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            console.error('Error in IP guide flow:', error);
        });
}