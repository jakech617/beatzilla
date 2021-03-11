// tastedive
const tasteDiveApi = "404780-HeatherK-F0AYR43I";
let tasteDiveUrl = "https://tastedive.com/api/similar?q=";
let artistInputEl = document.querySelector('#artist');
let artistContainerEl = document.querySelector('#artist-container');
let userForm = document.querySelector("#user-form");
const discography = document.getElementById('discogs')

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
    fetch(tasteDiveUrl + artist + "&k=" + tasteDiveApi).then(function (response) {
        return response.json();

    })
        .then(function (data) {
            console.log(data.Similar.Results);
            
            // let createArtistsTableRow = document.createElement('tr');

            data.Similar.Results.forEach(result => {
                let createTable = document.createElement('div');
                // let similarListData = document.createElement('td');
                let name = document.createElement('p');

                name.textContent = result.Name;
                createTable.appendChild(name);

                // createArtistsTableRow.appendChild(similarListData);

                // createTable.appendChild(createArtistsTableRow);
                artistContainerEl.appendChild(createTable);
            });

            // for (var i = 0; i < data.Similar.Results.length; i++) {
            //     console.log(data);

                // et createArtistsTableRow = document.createElement('tr');
                // let similarListData = document.createElement('td');
                // let name = document.createElementl('p');

            //     name.textContent = data[i].html;

                // similarListData.appendChild(name);
                // createArtistsTableRow.appendChild(similarListData);
                // tableBody.appendChild(createArtistsTableRow);

                // similarArtistsContainer.appendChild(similarList);

            //     // similarList.textContent(data[i].results[0].name);
            //     console.log(similarList);
            // }
        });
}

discography.addEventListener('click', async function () {
    const token = await getSpotifyToken(spotifyId, spotifySecret)

    const artist = await fetch(`https://api.spotify.com/v1/search?q=${artistInputEl.value}&type=artist`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.json())

    return fetch(`https://api.spotify.com/v1/artists/${artist.artists.items[0].id}/top-tracks?market=US`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response => response.json()).then(data => console.log(data)).catch(error => console.log(error));


})


// let displayedArtists = document.createElement("h2");
// displayedArtists.setAttribute("id", "displayedArtists");
// displayedArtists.textContent = (response.tracks.tracks[0].artists[0].name);
// // $("#artist").text(response.tracks[0]);
// console.log(displayedArtists);


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
        })
}

// getSpotifyToken(spotifyId, spotifySecret).then(token => {
//     return fetch('https://api.spotify.com/v1/artists/a7d89107396f413598b8ee57ef143c21/top-tracks?market=US', {
//         method: 'GET',
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     }).then(response => response.json()).then(data => console.log(data))
// });

// getSpotifyToken(spotifyId, spotifySecret).then(function(token) {
//     return fetch('https://api.spotify.com/v1/artists/0rvjqX7ttXeg3mTy8Xscbt/top-tracks/2TpxZ7JUBn3uw46aR7qd6V', {
//         method: 'GET',
//         headers: { 
//              Authorization: `Bearer ${token}`
//         }
//     }).then(function(response) {
//         return response.json();
//     }).then(function(data) {
//         console.log(data);
//     })
// })
