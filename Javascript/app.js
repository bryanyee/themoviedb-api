 
const key = '<INSERT_YOUR_API_KEY>';
const resultsContainer = document.getElementById('results-container');
const movieSearchBox = document.getElementById('movieSearchBox');
let resultsIndex = 0, sortIndex = 0;
let searchResults, queryValue;
let castContainer;

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
      preFormatResults('resultsList');                                  //Format page
      searchResults = JSON.parse(request.responseText).results.slice(); //Collect search results
      console.log('Search Reponse:', searchResults);
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
  let url = `http://api.themoviedb.org/3/movie/${id}?api_key=${key}&append_to_response=credits`;
  //Note the inclusion of the 'append_to_response=credits' parameter to make an additional request.
  //The response will be appended to the original JSON response.

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
  console.log('Response with movie data:', movieData); 

  let title = movieData.title || 'No title available';
  let overview = movieData.overview || 'No overview available.';
  let posterPath = `http://image.tmdb.org/t/p/w500${movieData.poster_path}`;
  let releaseYear = movieData.release_date ? `(${movieData.release_date.slice(0,4)})` : 'No release date available';
  let rating = movieData.vote_average ? `${movieData.vote_average} / 10` : 'No rating available';
  let runtime = movieData.runtime ? `${movieData.runtime}min` : 'No runtime available.';
  let homepageURL = movieData.homepage || '';
  let directors = movieData.credits.crew.filter( person => person.job === 'Director' );
  let cast = movieData.credits.cast;

  resultsContainer.innerHTML =  movieData.poster_path ? `<img src='${posterPath}'>` : '';
  resultsContainer.innerHTML += `<h1>${title}</h1>`
                              + `<span class='color-dark-gray'>${releaseYear}</span>`
                              + `<div id='rating'>${rating}</div><br><br>`
                              + `<span>${overview}</span><br><br><br>`
                              + `<span class='fw-bold'>Runtime:</span> ${runtime}<br>`
                              + `<span class='fw-bold'>Homepage:</span> `;
  resultsContainer.innerHTML += (homepageURL !== '') ? `<a href='${homepageURL}'>${homepageURL}</a><br>` : 'No homepage available.<br>';

  appendPeopleInfo(directors, cast);
}

function appendPeopleInfo(directors, cast) {
  //append director(s) info
  resultsContainer.innerHTML += (directors.length > 1) ? `<span class='fw-bold'>Directors:</span> ` : `<span class='fw-bold'>Director:</span> `;
  for (let i = 0; i < directors.length; i++){
    resultsContainer.innerHTML += `${directors[i].name}`;
    if ( i < directors.length - 1) resultsContainer.innerHTML += ', ';
  }
  resultsContainer.innerHTML += '<br>';

  //append cast info
  castContainer = document.createElement('div');
  castContainer.id = 'castContainer';
  castContainer.innerHTML += `<span class='fw-bold'>Cast:</span><br>`;

  for (let i = 0; i < cast.length; i++){
    castContainer.innerHTML += `<span class='castName'>${cast[i].name}</span>:  ${cast[i].character}<br>`;
  }
  
  resultsContainer.appendChild(castContainer);
}