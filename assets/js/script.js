// tastedive
const tasteDiveApi = "404780-HeatherK-F0AYR43I";
let tasteDiveUrl = "https://tastedive.com/api/similar?q=";
let artistInputEl = document.querySelector('#artist');
let artistContainerEl = document.querySelector('#artist-container');
let userForm = document.querySelector("#user-form");
const topTracks = document.getElementById('top-tracks');

// spotify
const spotifyId = "a7d89107396f413598b8ee57ef143c21";
const spotifySecret = "a7dc91eae51d4a60b734bb9fb1423496";
const spotifyApi = 'https://api.spotify.com/v1/search?type=album&q=';
const redirectUri = "https://jakech617.github.io/beatzilla/callback";

var formSubmitHandler = function (event) {
    event.preventDefault();

    let artistSearch = artistInputEl.value.trim();

    console.log(artistSearch);
    if (artistSearch) {
        getArtists(artistSearch);

        artistContainerEl.textContent = '';
        artistInputEl.value = '';
    } else {
        alert('Please enter a valid artist name');
    }
};

userForm.addEventListener("submit", formSubmitHandler);

function getArtists(artist) {
    artistContainerEl.innerHTML = '';
    fetch(tasteDiveUrl + artist + "&k=" + tasteDiveApi).then(function (response) {
        return response.json();

    })
        .then(function (data) {
            console.log(data.Similar.Results);
            if (data.Similar.Results.length > 1) {
                data.Similar.Results.forEach(result => {
                    let createDiv = document.createElement('div');
                    let name = document.createElement('p');
    
                    name.textContent = result.Name;
                    createDiv.appendChild(name);
    
                    artistContainerEl.appendChild(createDiv);
                });
            } else {
                const image = document.createElement('img');
                image.src = './assets/images/shin-godzilla.jpg';
                artistContainerEl.appendChild(image);
            }

        }).catch(function() {
            const image = document.createElement('img');
            image.src = './assets/images/shin-godzilla.jpg';
            artistContainerEl.appendChild(image);
        });
}

topTracks.addEventListener('click', async function() {
    artistContainerEl.innerHTML = '';
    const token = await getSpotifyToken(spotifyId, spotifySecret)
    const artist = await fetch(`https://api.spotify.com/v1/search?q=${artistInputEl.value}&type=artist`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.json());

    try {
        const data = await fetch(`https://api.spotify.com/v1/artists/${artist.artists.items[0].id}/top-tracks?market=US`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => response.json())


        data.tracks.forEach(track => {
            let createTable = document.createElement('div');
            let name = document.createElement('p');

            name.textContent = track.name;
            createTable.appendChild(name);

            artistContainerEl.appendChild(createTable);
        });
    } catch(error) {
        // So something with the error
        const image = document.createElement('img');
        image.src = './assets/images/shin-godzilla.jpg';
        artistContainerEl.appendChild(image);
        
    }

});

function getSpotifyToken(clientId, clientSecret) {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    return fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        },
        body: formData.toString()
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            return data.access_token;
        });
}