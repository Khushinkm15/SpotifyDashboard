async function getAccessToken(clientId, clientSecret) {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });
    const data = await response.json();
    return data.access_token;
}

async function getSpotifyData(accessToken) {
    const trackEndpoint = 'https://api.spotify.com/v1/search?q=genre%3A%22bollywood%22%20year%3A2023&type=track&market=global&limit=5&sort=popularity';

    const trackResponse = await fetch(trackEndpoint, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });
    const data = await trackResponse.json();
    console.log('Track Response:', data);
    return data.tracks.items;
}

async function getTopBollywoodHits(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/search?q=genre%3A%22bollywood%22&type=track&market=IN&limit=5&year=2023&sort=popularity', 
        {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });
    const data = await response.json();
    console.log('Bollywood Hits Response:', data);
    return data.tracks.items;
}

function displayTracksChart(tracks) {
    const trackNames = tracks.map(track => track.name);
    const trackPopularity = tracks.map(track => track.popularity);

    console.log('Track Names:', trackNames);
    console.log('Track Popularity:', trackPopularity);

    new Chart(document.getElementById('topTracksChart'), {
        type: 'bar',
        data: {
            labels: trackNames,
            datasets: [{
                label: 'Popularity',
                data: trackPopularity,
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function displayTracks(tracks) {
    const trackGrid = document.getElementById('trackGrid');

    tracks.forEach(track => {
        const trackDiv = document.createElement('div');
        trackDiv.classList.add('track');

        const trackImage = document.createElement('img');
        trackImage.src = track.album.images[0].url;
        trackImage.alt = `${track.name} - Cover`;
        trackDiv.appendChild(trackImage);

        const trackDetails = document.createElement('div');
        trackDetails.classList.add('track-details');

        const trackTitle = document.createElement('div');
        trackTitle.classList.add('track-title');
        trackTitle.textContent = track.name;
        trackDetails.appendChild(trackTitle);

        const trackArtist = document.createElement('div');
        trackArtist.classList.add('track-artist');
        trackArtist.textContent = track.artists.map(artist => artist.name).join(', ');
        trackDetails.appendChild(trackArtist);

        const trackInfo = document.createElement('div');
        trackInfo.classList.add('track-info');
        trackInfo.textContent = `Album: ${track.album.name}, Popularity: ${track.popularity}`;
        trackDetails.appendChild(trackInfo);

        trackDiv.appendChild(trackDetails);

        trackGrid.appendChild(trackDiv);
    });
}

const clientId = 'fc2fc2e8eef9467ab0380a4d9a4d40a8';
const clientSecret = '5660f92212cc45bea34dd6235ae6b197';

getAccessToken(clientId, clientSecret).then(accessToken => {
    getSpotifyData(accessToken).then(tracks => {
        displayTracksChart(tracks);
    });
    getTopBollywoodHits(accessToken).then(tracks => {
        displayTracks(tracks);
    });
});
