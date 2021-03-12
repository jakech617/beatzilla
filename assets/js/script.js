// tastedive
const tasteDiveApi = "404780-HeatherK-F0AYR43I";
let tasteDiveUrl = "https://tastedive.com/api/similar?q=";
let artistInputEl = document.querySelector('#artist');
let artistContainerEl = document.querySelector('#artist-container');
let userForm = document.querySelector("#user-form");
const topTracks = document.querySelector('#top-tracks');
const similarArtists = document.querySelector("#similar-artists");

// spotify
const spotifyId = "a7d89107396f413598b8ee57ef143c21";
const spotifySecret = "a7dc91eae51d4a60b734bb9fb1423496";
const spotifyApi = 'https://api.spotify.com/v1/search?type=album&q=';
const redirectUri = "https://jakech617.github.io/beatzilla/callback";

let formSubmitHandler = function (event) {
    event.preventDefault();

    let artistSearch = artistInputEl.value.trim();

    console.log(artistSearch);
    if (artistSearch) {
        getArtists(artistSearch);
        // if itemSearch in local storage does not exist or is an empty string, create a new array/if not, then take the existing array.
        let artistArray = JSON.parse(localStorage.getItem("search")) || [];
        // after we have our new array we push to the new array.
        artistArray.push(artistSearch);
        // stringify and set to local storage.
        localStorage.setItem("search",JSON.stringify(artistArray));
        artistContainerEl.textContent = '';
        artistInputEl.value = '';

    }

};

similarArtists.addEventListener("click", formSubmitHandler);

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
                image.src = './assets/images/shin-godzilla-editted.jpg';
                artistContainerEl.appendChild(image);
            }

        }).catch(function() {
            const image = document.createElement('img');
            image.src = './assets/images/shin-godzilla-editted.jpg';
            artistContainerEl.appendChild(image);
        });
}

topTracks.addEventListener('click', async function(event) {
    event.preventDefault();
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
        // do something with the error
        const image = document.createElement('img');
        image.src = './assets/images/shin-godzilla-editted.jpg';
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
// on page load, parse from local storage to stringify and append.