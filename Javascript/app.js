 
var key = '<INSERT_YOUR_API_KEY>';
var movieData;
var resultsContainer = document.getElementById('results-container');

function movieSearch() {
  var request = new XMLHttpRequest();  

  request.open('GET', 'http://api.themoviedb.org/3/movie/209112?api_key=' + key);  

  request.setRequestHeader('Accept', 'application/json');  

  request.onreadystatechange = function() {
    if (request.readyState === 4) {
      console.log('Status:', request.status);
      console.log('Headers:', request.getAllResponseHeaders());
      movieData = JSON.parse(request.responseText);
      console.log(movieData.original_title);
      console.log(movieData.overview);  
  

      resultsContainer.innerHTML = movieData.original_title + '<br>' + movieData.overview;
    }
  };

  request.send();
}//end of search