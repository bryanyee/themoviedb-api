 
var request = new XMLHttpRequest();
var key = 'd396c67805d03e62ce8fb5ca26923338';
var movieData;
var mainContainer = document.getElementById('main-container');

request.open('GET', 'http://api.themoviedb.org/3/movie/209112?api_key=' + key);

request.setRequestHeader('Accept', 'application/json');

request.onreadystatechange = function (response) {
  if (this.readyState === 4) {
    console.log('Status:', this.status);
    console.log('Headers:', this.getAllResponseHeaders());
    movieData = JSON.parse(this.responseText);
    console.log(movieData.original_title);
    console.log(movieData.overview);


    mainContainer.innerHTML = movieData.original_title + '<br>' + movieData.overview;
  }
};

request.send();