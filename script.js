const searchForm = document.getElementById('search-form');
const searchBar = document.getElementById('search-bar');
const moviesContainer = document.getElementById("movies-container");
const searchMessage = document.getElementById("search-message");
const mainTag = document.getElementById("main-tag");
const movieContainerBackground = document.getElementById("movie-container-background");

// Function to fetch movies list based on search query
async function handleFetch() {
    try {
        const res = await fetch(`http://www.omdbapi.com/?s=${searchBar.value}&apikey=14f1307`);
        const data = await res.json();
        console.log(data);
        return data;
    } catch (error) {
        searchMessage.textContent = 'Something went wrong. Please try again.';
        console.error(error);
    }
}

// Function to fetch detailed movie information
async function fetchMovieDetails(imdbID) {
    try {
        const res = await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=14f1307`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(`Error fetching details for IMDb ID ${imdbID}:`, error);
    }
}

// Function to render movies in the container
async function renderMovies(data) {
    if (data.Response === "False") {
        movieNotFound();
        return;
    }

    const moviesHtml = await Promise.all(data.Search.map(async (movie) => {
        const details = await fetchMovieDetails(movie.imdbID);
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
                    <button class="add-to-watchlist" id="add-to-watchlist"><i class="fa-solid fa-circle-plus"></i>Watchlist</button>
                </div>
                <div class="movie-description">
                    <p>${details.Plot}</p>
                </div>
            </div>`;
    }));

    moviesContainer.innerHTML = moviesHtml.join('');
    moviesFound();
}

// Function to handle when movies are found
function moviesFound() {
    mainTag.style.height = "auto";
    mainTag.style.display = "block";
    mainTag.style.removeProperty('align-items');
    movieContainerBackground.style.display = "none";
    moviesContainer.style.display = 'block'
}

// Function to handle when no movies are found
function movieNotFound() {
    mainTag.style.height = '500px'
    mainTag.style.display = 'flex'
    mainTag.style.alignItems = 'center'
    movieContainerBackground.style.display = "flex";
    searchMessage.textContent = 'No results found. Try a different search.';
    moviesContainer.style.display = 'none'
}

// Event handler for form submission
async function handleSearch(e) {
    e.preventDefault();
    const data = await handleFetch();
    if (data) {
        renderMovies(data);
    }
}

searchForm.addEventListener('submit', handleSearch);

