// tastedive
const tasteDiveApi = "404780-HeatherK-F0AYR43I";
let tasteDiveUrl = "https://tastedive.com/api/similar?q=";
let artistInputEl = document.querySelector('#artist');
let artistContainerEl = document.querySelector('#artist-container');
let userForm = document.querySelector("#user-form");

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
          if (response.ok) {
              return response.json();
          }
      }).then(function(data) {
          console.log(data);
      })
  }


// var buttonClickHandler = function (event) {
//     var language = event.target.getAttribute('data-language');
  
//     if (language) {
//       getFeaturedRepos(language);
  
//       repoContainerEl.textContent = '';
//     }
//   };

