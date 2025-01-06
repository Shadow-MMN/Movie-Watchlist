const movieId = JSON.parse(localStorage.getItem('movie')) || [];
const searchForm = document.getElementById('search-form');
const searchBar = document.getElementById('search-bar');
const moviesContainer = document.getElementById("movies-container");
const searchMessage = document.getElementById("search-message");
const mainTag = document.getElementById("main-tag");
const movieContainerBackground = document.getElementById("movie-container-background");

// Function to fetch movies list based on search query
function handleFetch() {
    return fetch(`http://www.omdbapi.com/?s=${searchBar.value}&apikey=14f1307`)
        .then(res => res.json())
        .catch(error => {
            searchMessage.textContent = 'Something went wrong. Please try again.';
            console.error(error);
        });
}

// Function to fetch detailed movie information
function fetchMovieDetails(imdbID) {
    return fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=14f1307`)
        .then(res => res.json())
        .catch(error => {
            console.error(`Error fetching details for IMDb ID ${imdbID}:`, error);
        });
}

// Function to render movies in the container
function renderMovies(data) {
    if (data.Response === "False") {
        movieNotFound();
        return;
    }

    const moviesHtmlPromises = data.Search.map(movie => {
        return fetchMovieDetails(movie.imdbID).then(details => {
            return `
                <div class="movie-container">
                    <img src="${details.Poster}" alt="A poster of the movie ${details.Title}">
                    <div class="movie-header">
                        <h3>${details.Title}</h3>
                        <i class="fa-solid fa-star"></i>
                        <p>${details.imdbRating}</p>
                    </div>
                    <div class="movie-info">
                        <p>${details.Runtime}</p>
                        <p class="middle-man-for-info-gap">${details.Genre}</p>
                        <button class="add-to-watchlist" id="add-to-watchlist" data-id="${details.imdbID}"><i class="fa-solid fa-circle-plus"></i>Watchlist</button>
                    </div>
                    <div class="movie-description">
                        <p>${details.Plot}</p>
                    </div>
                </div>`;
        });
    });

    Promise.all(moviesHtmlPromises).then(moviesHtml => {
        moviesContainer.innerHTML = moviesHtml.join('');
        moviesFound();
    });
}

// Function to handle when movies are found
function moviesFound() {
    mainTag.style.height = "auto";
    mainTag.style.display = "block";
    mainTag.style.removeProperty('align-items');
    movieContainerBackground.style.display = "none";
    moviesContainer.style.display = 'block';
}

// Function to handle when no movies are found
function movieNotFound() {
    mainTag.style.height = '500px';
    mainTag.style.display = 'flex';
    mainTag.style.alignItems = 'center';
    movieContainerBackground.style.display = "flex";
    searchMessage.textContent = 'No results found. Try a different search.';
    moviesContainer.style.display = 'none';
}

// Event handler for form submission
function handleSearch(e) {
    e.preventDefault();
    handleFetch().then(data => {
        if (data) {
            renderMovies(data);
        }
    });
}

searchForm.addEventListener('submit', handleSearch);

document.addEventListener('click', function(e) {
    if (e.target.dataset.id) {
        saveToLocalStorage(e.target.dataset.id);
    }
});

function saveToLocalStorage(movie) {
    if (!movieId.includes(movie)) {
        movieId.push(movie);
        localStorage.setItem("movie", JSON.stringify(movieId));
    } 
    console.log(JSON.parse(localStorage.getItem("movie")));
}

console.log(movieId);
