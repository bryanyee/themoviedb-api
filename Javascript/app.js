 
const key = '<INSERT_YOUR_API_KEY>';
const resultsContainer = document.getElementById('results-container');
const movieSearchBox = document.getElementById('movieSearchBox');
let resultsIndex = 0, sortIndex = 0;
let searchResults, queryValue, castContainer, cast;

//Request and display list of movie results based on the search box
function searchForMovies() {
  //Prepare for AJAX request
  queryValue = movieSearchBox.value;
  let encodedQueryValue = encodeURI(queryValue);
  let url = `http://api.themoviedb.org/3/search/movie?api_key=${key}&query=${encodedQueryValue}`;

  //AJAX request to search for movies by title
  let request = new XMLHttpRequest();
  request.open('GET', url);  

  request.onreadystatechange = function() {
    if (request.readyState === 4) {
      preFormatResults('resultsList');                                  //Format page
      searchResults = JSON.parse(request.responseText).results;         //Collect search results
      resultsContainer.innerHTML = `<h3>${searchResults.length} Results for "${queryValue}"</h3>`;
      resultsContainer.innerHTML += `<button class='fr' onclick='sortResultsByDate()'>Sort by Release Date</button><br><br>`;
      searchResults.forEach(showQueryResult);                           //Show search results

      console.log('/search/movie parsed response: ', JSON.parse(request.responseText));
    }
  };  

  request.send();
}

movieSearchBox.addEventListener('keyup', function(event) {
  if (event.key === 'Enter') searchForMovies();
});

function preFormatResults(option) {
  if (option === 'resultsList') {
    resultsContainer.style.display = 'block';
    resultsContainer.style.backgroundColor = 'white';
    resultsIndex = 0;
    sortIndex = 0;
    searchResults = undefined;
    castContainer = undefined;
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

  resultsContainer.innerHTML = `<h3>${searchResults.length} Results for "${queryValue}"</h3>`;
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
  console.log('/movie/id parsed response: ', movieData); 

  let title = movieData.title || 'No title available';
  let overview = movieData.overview || 'No overview available.';
  let posterPath = `http://image.tmdb.org/t/p/w500${movieData.poster_path}`;
  let releaseYear = movieData.release_date ? `(${movieData.release_date.slice(0,4)})` : 'No release date available';
  let rating = movieData.vote_average ? `${movieData.vote_average} / 10` : 'No rating available';
  let runtime = movieData.runtime ? `${movieData.runtime} min` : 'No runtime available.';
  let homepageURL = movieData.homepage || '';
  let directors = movieData.credits.crew.filter( person => person.job === 'Director' );
  cast = movieData.credits.cast;

  resultsContainer.innerHTML =  movieData.poster_path ? `<img src='${posterPath}'>` : '';
  resultsContainer.innerHTML += `<h1>${title}</h1>`
                              + `<span class='color-dark-gray'>${releaseYear}</span>`
                              + `<div id='rating'>${rating}</div><br><br>`
                              + `<span>${overview}</span><br><br><br>`
                              + `<span class='fw-bold'>Runtime:</span> ${runtime}<br>`
                              + `<span class='fw-bold'>Homepage:</span> `;
  resultsContainer.innerHTML += (homepageURL !== '') ? `<a href='${homepageURL}'>${homepageURL}</a><br>` : 'No homepage available.<br>';

  appendDirectorInfo(directors);
  appendCastInfo('short');
}

function appendDirectorInfo(directors) {
  //append director(s) info
  resultsContainer.innerHTML += (directors.length > 1) ? `<span class='fw-bold'>Directors:</span> ` : `<span class='fw-bold'>Director:</span> `;
  for (let i = 0; i < directors.length; i++){
    resultsContainer.innerHTML += `${directors[i].name}`;
    if ( i < directors.length - 1) resultsContainer.innerHTML += ', ';
  }
  resultsContainer.innerHTML += '<br>';
}

function appendCastInfo(length) {
  if (castContainer) {
    castContainer = resultsContainer.removeChild(castContainer);
  }
  castContainer = document.createElement('div');
  castContainer.id = 'castContainer';
  castContainer.innerHTML += `<span class='fw-bold'>Cast:</span><br>`;
  
  if (length === 'short') {
    let totalMembers = (cast.length < 10) ? cast.length : 10;
    for (let i = 0; i < totalMembers; i++){
      castContainer.innerHTML += `<span class='castName'>${cast[i].name}</span>:  ${cast[i].character}<br>`;
    }

    //add button to show all cast members, if necessary
    if (cast.length > 10) {
      castContainer.innerHTML += `<br><button onclick="appendCastInfo('long')">Show Full Cast</button><br>`;
    }
  }//end of 'short' code block
  else if (length === 'long') {
    for (let i = 0; i < cast.length; i++){
      castContainer.innerHTML += `<span class='castName'>${cast[i].name}</span>:  ${cast[i].character}<br>`;
    }

    //add button to show less cast members
    castContainer.innerHTML += `<br><button onclick="appendCastInfo('short')">Show Less</button><br>`;
  }//end of 'long' code block

  resultsContainer.appendChild(castContainer);
}

function hideResults() {
  resultsContainer.style.display = 'none';
  movieSearchBox.value = '';
}
