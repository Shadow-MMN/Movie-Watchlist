// Retrieve messages from localStorage
const messages = JSON.parse(localStorage.getItem('movie')) || [];
const moviesContainerWatchlist = document.getElementById('movies-container-watchlist');

// UI elements
const searchMessageWatchlist = document.getElementById("search-message-watchlist");
const mainTagWatchlist = document.getElementById("main-tag-watchlist");
const movieContainerBackgroundWatchlist = document.getElementById("movie-container-background-watchlist");

// Function to render movies in the watchlist
function renderWatchlist() {
    if (messages === null || messages.length === 0) {
        noWatchlist();
        return;
    }

    let html = '';
    
    // Loop through each message and fetch movie data
    messages.forEach(message => {
        fetch(`http://www.omdbapi.com/?i=${message}&apikey=14f1307`)
            .then(res => res.json())
            .then(data => {
                html += `
                    <div class="movie-container">
                        <img src="${data.Poster}" alt="A poster of the movie ${data.Title}">
                        <div class="movie-header">
                            <h3>${data.Title}</h3>
                            <i class="fa-solid fa-star"></i>
                            <p>${data.imdbRating}</p>
                        </div>
                        <div class="movie-info">
                            <p>${data.Runtime}</p>
                            <p class="middle-man-for-info-gap">${data.Genre}</p>
                            <button class="add-to-watchlist" data-id="${data.imdbID}">
                                <i class="fa-solid fa-circle-minus"></i> Remove
                            </button>
                        </div>
                        <div class="movie-description">
                            <p>${data.Plot}</p>
                        </div>
                    </div>
                `;

                // Update the UI after each movie fetch
                moviesContainerWatchlist.innerHTML = html;
                watchlistExist();
            })
            .catch(error => console.error('Error fetching movie data:', error));
    });
}

// Function to handle when movies are found
function watchlistExist() {
    mainTagWatchlist.style.height = "auto";
    mainTagWatchlist.style.display = "block";
    mainTagWatchlist.style.removeProperty('align-items');
    movieContainerBackgroundWatchlist.style.display = "none";
    moviesContainerWatchlist.style.display = "block";
}

// Function to handle when no movies are found
function noWatchlist() {
    mainTagWatchlist.style.height = "500px";
    mainTagWatchlist.style.display = "flex";
    mainTagWatchlist.style.alignItems = "center";
    movieContainerBackgroundWatchlist.style.display = "flex";
    searchMessageWatchlist.textContent = "Start Exploring";
    moviesContainerWatchlist.style.display = "none";
}

// Call the function to display the watchlist
renderWatchlist();

// Event listener for delete button
document.addEventListener('click', function(e) {
    if (e.target.dataset.id) {
        deleteMovie(e.target.dataset.id);
    }
});

// Updated function to delete a movie from the watchlist
function deleteMovie(movie) {
    // Remove movie from messages array
    const index = messages.indexOf(movie);
    if (index !== -1) {
        messages.splice(index, 1);
    }

    // Update localStorage
    localStorage.setItem('movie', JSON.stringify(messages));

    // Refresh the UI
    renderWatchlist();
}

console.log(messages);
