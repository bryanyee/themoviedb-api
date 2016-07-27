 
const key = '<INSERT_YOUR_API_KEY>';
const resultsContainer = document.getElementById('results-container');
const movieSearchBox = document.getElementById('movieSearchBox');
let resultsIndex = 0;

//Request and display list of movie results based on the search box
function searchForMovies() {
  //Prepare for AJAX request
  let queryValue = movieSearchBox.value;
  let encodedQueryValue = encodeURI(queryValue);
  let url = `http://api.themoviedb.org/3/search/movie?api_key=${key}&query=${encodedQueryValue}`;
  let searchResults;

  //Reset resultsContainer
  preFormatResults('resultsList', queryValue);

  //AJAX request to search for movies by title
  let request = new XMLHttpRequest();
  request.open('GET', url);  
  request.setRequestHeader('Accept', 'application/json');  

  request.onreadystatechange = function() {
    if (this.readyState === 4) {
      searchResults = JSON.parse(request.responseText).results;
      searchResults.forEach(showResult);
    }
  };  

  request.send();
}

function preFormatResults(option, queryValue) {
  if (option === 'resultsList') {
    resultsContainer.innerHTML = `<h3>Results for "${queryValue}"</h3><br><br>`;
    resultsContainer.style.display = 'block';
    resultsContainer.style.backgroundColor = 'white';
    resultsIndex = 0;
  }
  else if (option === 'movieData') {
    resultsContainer.innerHTML = "";
    resultsContainer.style.backgroundColor = '#e9e9e9';
  }
}

//Display summary data for a movie search result
function showResult(result) {
  let title = result.title;
  let id = result.id;
  let releaseDate = `<span class='year'>(${result.release_date.slice(0,4)})</span>` || `<span class='year'>(release date unavailable)</span>`;

  let resultDiv = document.createElement('div');
  let colorClass = (resultsIndex % 2 === 0 ) ? 'bc-light-gray' : 'bc-light-gray2';

  resultDiv.innerHTML = `<div class='results-box ${colorClass}' onclick='getMovieData(${id})'>${title} ${releaseDate}</div>`;
  resultsContainer.appendChild(resultDiv);

  resultsIndex++;
}

//Request and display detailed data for a specified movie
function getMovieData(id) {
  let movieData;
  let url = `http://api.themoviedb.org/3/movie/${id}?api_key=${key}`;

  //AJAX request to retrieve movie data
  let request = new XMLHttpRequest();  
  request.open('GET', url);  
  request.setRequestHeader('Accept', 'application/json');  

  request.onreadystatechange = function() {
    if (request.readyState === 4) {
      movieData = JSON.parse(request.responseText);
      preFormatResults('movieData');
      let title = movieData.title || 'No title available';
      let overview = movieData.overview || 'No overview available.';
      let posterPath = `http://image.tmdb.org/t/p/w500${movieData.poster_path}`;
      let releaseYear = movieData.release_date ? `(${movieData.release_date.slice(0,4)})` : 'No release date available';
      let rating = movieData.vote_average ? `${movieData.vote_average} / 10` : 'No rating available';

      resultsContainer.innerHTML =  movieData.poster_path ? `<img src='${posterPath}'>` : '';
      resultsContainer.innerHTML += `<h1>${title}</h1>`;
      resultsContainer.innerHTML += `<span class='color-dark-gray'>${releaseYear}</span>`;
      resultsContainer.innerHTML += `<div id='rating'>${rating}</div><br><br>`;
      resultsContainer.innerHTML += `<span>${overview}</span>`;
    }
  };

  request.send();
}//end of search