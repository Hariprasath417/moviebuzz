// src/api/tmdb.js

// --- TMDB Config ---
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Change this to your backend deployment URL
const BACKEND_URL = "https://moviebuzz-backend-2.onrender.com";

// --- TMDB API Functions ---
export const getPopularMovies = async () => {
    const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`);
    if (!response.ok) throw new Error("Failed to fetch popular movies.");
    const data = await response.json();
    return data.results.map(formatMovie);
};

export const searchMovies = async (query) => {
    if (!query) return getPopularMovies();
    const response = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("Failed to search movies.");
    const data = await response.json();
    return data.results.map(formatMovie);
};

export const getMovieById = async (movieId) => {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits`);
    if (!response.ok) throw new Error("Failed to fetch movie details.");
    const data = await response.json();
    return formatMovie(data);
};

// Helper function to shape movie data
const formatMovie = (movie) => ({
    id: movie.id.toString(),
    title: movie.title,
    year: movie.release_date ? movie.release_date.substring(0, 4) : 'N/A',
    posterUrl: movie.poster_path 
        ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` 
        : 'https://placehold.co/500x750/2d3748/ffffff?text=No+Image',
    synopsis: movie.overview,
    director: movie.credits?.crew?.find(c => c.job === 'Director')?.name || 'N/A',
});

// --- Backend API Helper ---
const fetchOptions = (method = 'GET', body = null) => {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    return options;
};

// --- Backend API Functions ---
export const api = {
    // ---------- AUTH ----------
    login: async (email, password) => {
        const response = await fetch(`${BACKEND_URL}/api/auth/login`, fetchOptions('POST', { email, password }));
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to log in.');
        return data;
    },
    register: async (email, password) => {
        const response = await fetch(`${BACKEND_URL}/api/auth/register`, fetchOptions('POST', { email, password }));
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to register.');
        return data;
    },

    // ---------- REVIEWS ----------
    getReviewsForMovie: async (movieId) => {
        const response = await fetch(`${BACKEND_URL}/api/reviews/${movieId}`);
        return response.json();
    },
    getUserReviews: async (userId) => {
        const response = await fetch(`${BACKEND_URL}/api/user/${userId}/reviews`);
        return response.json();
    },
    addReview: async (reviewData) => {
        const response = await fetch(`${BACKEND_URL}/api/reviews`, fetchOptions('POST', reviewData));
        return response.json();
    },

    // ---------- USER INTERACTIONS ----------
    getUserInteractions: async (userId) => {
        const response = await fetch(`${BACKEND_URL}/api/user/${userId}/interactions`);
        return response.json();
    },
    toggleLike: async (userId, movieId) => {
        await fetch(`${BACKEND_URL}/api/user/${userId}/likes/toggle`, fetchOptions('POST', { movieId }));
    },
    toggleWatchlist: async (userId, movieId) => {
        await fetch(`${BACKEND_URL}/api/user/${userId}/watchlist/toggle`, fetchOptions('POST', { movieId }));
    },

    // ---------- DIARY ----------
    getDiary: async (userId) => {
        const response = await fetch(`${BACKEND_URL}/api/user/${userId}/diary`);
        return response.json();
    },
    addDiaryEntry: async (userId, entryData) => {
        // Log for debugging
        console.log(`tmdb.js: Sending POST request to ${BACKEND_URL}/api/user/${userId}/diary with payload:`, entryData);

        // If diary includes review/rating → also add to reviews collection
        if (entryData.rating > 0 || entryData.reviewText) {
            await api.addReview({
                ...entryData,
                userId: userId,
                username: entryData.username,
            });
        }

        const response = await fetch(`${BACKEND_URL}/api/user/${userId}/diary`, fetchOptions('POST', entryData));
        return response.json();
    }
};
