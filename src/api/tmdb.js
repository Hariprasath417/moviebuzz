// src/api/tmdb.js
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKEND_URL = "http://localhost:5000";

// --- TMDB API Functions ---
export const getPopularMovies = async () => {
    const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`);
    if (!response.ok) throw new Error("Failed to fetch popular movies.");
    const data = await response.json();
    return data.results.map(formatMovie);
};

export const getTrendingMovies = async (timeWindow = 'week') => {
    const response = await fetch(`${TMDB_BASE_URL}/trending/movie/${timeWindow}?api_key=${TMDB_API_KEY}`);
    if (!response.ok) throw new Error("Failed to fetch trending movies.");
    const data = await response.json();
    return data.results.map(formatMovie);
};

export const searchMoviesWithFilters = async ({ query = '', genre = '', year = '', minRating = '' }) => {
    const params = new URLSearchParams({
        api_key: TMDB_API_KEY,
        query,
        with_genres: genre,
        primary_release_year: year,
        'vote_average.gte': minRating,
        sort_by: 'popularity.desc'
    });

    const url = query
        ? `${TMDB_BASE_URL}/search/movie?${params.toString()}`
        : `${TMDB_BASE_URL}/discover/movie?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch movies with filters.");
    const data = await response.json();
    return data.results.map(formatMovie);
};

export const getGenres = async () => {
    const response = await fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`);
    if (!response.ok) throw new Error("Failed to fetch genres.");
    const data = await response.json();
    return data.genres;
};

export const getMovieById = async (movieId) => {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits`);
    if (!response.ok) throw new Error("Failed to fetch movie details.");
    const data = await response.json();
    return formatMovie(data);
};

// Helper function to shape movie data
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
    genre_ids: movie.genre_ids || [],
    vote_average: movie.vote_average || 0,
    release_date: movie.release_date || ''
});

// --- Backend API Functions ---
const fetchOptions = (method = 'GET', body = null) => {
    const options = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) options.body = JSON.stringify(body);
    return options;
};

export const api = {
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
    getReviewsForMovie: async (movieId) => {
        const response = await fetch(`${BACKEND_URL}/api/reviews/${movieId}`);
        return response.json();
    },
    getUserReviews: async (userId) => {
        const response = await fetch(`${BACKEND_URL}/api/users/${userId}/reviews`);
        return response.json();
    },
    addReview: async (reviewData) => {
        const response = await fetch(`${BACKEND_URL}/api/reviews`, fetchOptions('POST', reviewData));
        return response.json();
    },
    getUserInteractions: async (userId) => {
        const response = await fetch(`${BACKEND_URL}/api/users/${userId}/interactions`);
        return response.json();
    },
    toggleLike: async (userId, movieId) => {
        await fetch(`${BACKEND_URL}/api/users/${userId}/likes/toggle`, fetchOptions('POST', { movieId }));
    },
    toggleWatchlist: async (userId, movieId) => {
        await fetch(`${BACKEND_URL}/api/users/${userId}/watchlist/toggle`, fetchOptions('POST', { movieId }));
    },
    getDiary: async (userId) => {
        const response = await fetch(`${BACKEND_URL}/api/users/${userId}/diary`);
        return response.json();
    },
    addDiaryEntry: async (userId, entryData) => {
        if (entryData.rating > 0 || entryData.reviewText) {
            await api.addReview({ ...entryData, userId, username: entryData.username });
        }
        const response = await fetch(`${BACKEND_URL}/api/users/${userId}/diary`, fetchOptions('POST', entryData));
        return response.json();
    },
    getUserProfile: async (userId) => {
        const response = await fetch(`${BACKEND_URL}/api/users/${userId}`);
        return response.json();
    },
    updateUserProfile: async (userId, profileData) => {
        const response = await fetch(`${BACKEND_URL}/api/users/${userId}`, fetchOptions('PUT', profileData));
        return response.json();
    }
};
