 
const key = '<INSERT_YOUR_API_KEY>';
const resultsContainer = document.getElementById('results-container');
const movieSearchBox = document.getElementById('movieSearchBox');

//Create list of movie results based on the search box
function searchForMovies() {
  let queryValue = movieSearchBox.value;
  let encodedQueryValue = encodeURI(queryValue);
  let url = `http://api.themoviedb.org/3/search/movie?api_key=${key}&query=${encodedQueryValue}`;
  let searchResults;

  resultsContainer.innerHTML = `<h3>Results for "${queryValue}"</h3>`;

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
  let resultDiv = document.createElement('div');
  resultDiv.innerHTML = `<div class='results-box'>${title}</div>`;
  resultsContainer.appendChild(resultDiv);
}

//Display detailed data for a specified movie
function getMovieData() {
  let movieData;

  //AJAX request to retrieve movie data
  let request = new XMLHttpRequest();  
  request.open('GET', 'http://api.themoviedb.org/3/movie/209112?api_key=' + key);  
  request.setRequestHeader('Accept', 'application/json');  

  request.onreadystatechange = function() {
    if (request.readyState === 4) {
      movieData = JSON.parse(request.responseText);
      resultsContainer.innerHTML = movieData.title + '<br>' + movieData.overview;
    }
  };

  request.send();
}//end of search