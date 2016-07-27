 
const key = '<INSERT_YOUR_API_KEY>';
const resultsContainer = document.getElementById('results-container');
const movieSearchBox = document.getElementById('movieSearchBox');
let resultsIndex = 0, sortIndex = 0;
let searchResults, queryValue;

//Request and display list of movie results based on the search box
function searchForMovies() {
  //Prepare for AJAX request
  queryValue = movieSearchBox.value;
  let encodedQueryValue = encodeURI(queryValue);
  let url = `http://api.themoviedb.org/3/search/movie?api_key=${key}&query=${encodedQueryValue}`;

  //AJAX request to search for movies by title
  let request = new XMLHttpRequest();
  request.open('GET', url);  
  request.setRequestHeader('Accept', 'application/json');  

  request.onreadystatechange = function() {
    if (this.readyState === 4) {
      preFormatResults('resultsList');                      //Format page
      searchResults = JSON.parse(request.responseText).results.slice(); //Collect search results
      searchResults.forEach(showQueryResult);                           //Show search results
    }
  };  

  request.send();
}

function preFormatResults(option) {
  if (option === 'resultsList') {
    resultsContainer.style.display = 'block';
    resultsContainer.style.backgroundColor = 'white';
    resultsIndex = 0;
    sortIndex = 0;
    searchResults = undefined;

    resultsContainer.innerHTML = `<h3>Results for "${queryValue}"</h3>`;
    resultsContainer.innerHTML += `<button class='fr' onclick='sortResultsByDate()'>Sort by Release Date</button><br><br>`
  }
  else if (option === 'movieData') {
    resultsContainer.innerHTML = "";
    resultsContainer.style.backgroundColor = '#e9e9e9';
  }
}

function sortResultsByDate() {
  if (sortIndex % 2 === 0) {
    searchResults.sort((a, b) => {
      let releaseA = Number(a.release_date.replace(/-/g, ''));
      let releaseB = Number(b.release_date.replace(/-/g, ''));
      return releaseB - releaseA;
    });
  }
  else {
    searchResults.sort((a, b) => {
      let releaseA = Number(a.release_date.replace(/-/g, ''));
      let releaseB = Number(b.release_date.replace(/-/g, ''));
      return releaseA - releaseB;
    });
  }

  resultsContainer.innerHTML = `<h3>Results for "${queryValue}"</h3>`;
  resultsContainer.innerHTML += `<button class='fr' onclick='sortResultsByDate()'>Sort by Release Date</button><br><br>`
  searchResults.forEach(showQueryResult); 

  sortIndex++;
}

//Display summary data for a movie search result
function showQueryResult(result) {
  let title = result.title;
  let id = result.id;
  let releaseDate = `<span class='year'>(${result.release_date.slice(0,4)})</span>` || `<span class='year'>(release date unavailable)</span>`;

  let resultDiv = document.createElement('div');
  let colorClass = (resultsIndex % 2 === 0 ) ? 'bc-light-gray' : 'bc-light-gray2';

  resultDiv.innerHTML = `<div class='results-box ${colorClass}' onclick='requestMovieData(${id})'>${title} ${releaseDate}</div>`;
  resultsContainer.appendChild(resultDiv);

  resultsIndex++;
}

//Request detailed data for a specified movie
function requestMovieData(id) {
  let movieData;
  let url = `http://api.themoviedb.org/3/movie/${id}?api_key=${key}`;

  //AJAX request to retrieve movie data
  let request = new XMLHttpRequest();  
  request.open('GET', url);  
  request.setRequestHeader('Accept', 'application/json');  

  request.onreadystatechange = function() {
    if (request.readyState === 4) {
      preFormatResults('movieData');
      displayMovieData(request);
    }
  };

  request.send();
}

//Display detailed data for a specified movie
function displayMovieData(request){
  movieData = JSON.parse(request.responseText);
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