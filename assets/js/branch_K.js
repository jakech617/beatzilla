// tastedive
const tasteDiveApi = "404780-HeatherK-F0AYR43I"; 
let tasteDiveUrl = "https://tastedive.com/api/similar?q=";
let artistInputEl = document.querySelector('#artist');
let artistContainerEl = document.querySelector('#artist-container');
let userForm = document.querySelector("#user-form");
const discography = document.getElementById('discogs');
let artistSearch = artistInputEl.value.trim();

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
    artistSearch(artistInputEl);
    searchHistory.push(searchInputEl);
    localStorage.setItem("search",JSON.stringify(searchHistory));
};

// userForm.addEventListener("submit", formSubmitHandler);

// artistSearch.addEventListener("click", function() {
//     const searchTerm = artistInputEl.value;
//     getArtists(artistSearch);
//     searchHistory.push(artistSearch);
//     localStorage.setItem("search",JSON.stringify(searchHistory));
//     renderSearchHistory();
// })
// clearEl.addEventListener("click",function() {
//     searchHistory = [];
//     renderSearchHistory();
// })

// var resultTextEl = document.querySelector('#result-text');
// var resultContentEl = document.querySelector('#result-content');
// var searchFormEl = document.querySelector('#search-form');
// function getParams() {
//     var searchParamsArr = document.location.search.split('&');
// }
// function initPage() {
//     let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
//     console.log(searchHistory);
// }
// function openSearch() {
//     document.getElementById("myOverlay").style.display = "block";
//   }
//   function closeSearch() {
//     document.getElementById("myOverlay").style.display = "none";
//   }

function getArtists(artist) {
    fetch(tasteDiveUrl + artist + "&k=" + tasteDiveApi).then(function (response) {
        if (response.ok) {
            return response.json();
        }
    }).then(function(data) {
        console.log(data);
    })
};


discography.addEventListener('click', async function() {
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
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        return data.access_token;
    })
}

