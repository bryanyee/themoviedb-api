 
const key = '<INSERT_YOUR_API_KEY>';
const resultsContainer = document.getElementById('results-container');
const movieSearchBox = document.getElementById('movieSearchBox');
let resultsIndex = 0;

//Create list of movie results based on the search box
function searchForMovies() {
  //Prepare for AJAX request
  let queryValue = movieSearchBox.value;
  let encodedQueryValue = encodeURI(queryValue);
  let url = `http://api.themoviedb.org/3/search/movie?api_key=${key}&query=${encodedQueryValue}`;
  let searchResults;

  //Reset resultsContainer
  resultsContainer.innerHTML = `<h3>Results for "${queryValue}"</h3><br><br>`;
  resultsContainer.style.display = 'block';
  resultsIndex = 0;

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

//Display summary data for a movie search result
function showResult(result) {
  let title = result.title;
  let id = result.id;
  let resultDiv = document.createElement('div');
  let colorClass = (resultsIndex % 2 === 0 ) ? 'bc-light-gray' : 'bc-light-gray2';

  resultDiv.innerHTML = `<div class='results-box ${colorClass}' onclick='getMovieData(${id})'>${title}</div>`;
  resultsContainer.appendChild(resultDiv);

  resultsIndex++;
}

//Display detailed data for a specified movie
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
      let title = movieData.title;
      let overview = movieData.overview || "No overview available.";

      resultsContainer.innerHTML = `${title}<br>${overview}`;
    }
  };

  request.send();
}//end of search