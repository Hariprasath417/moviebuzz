// src/pages/WatchlistPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { api, getMovieById } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

const WatchlistPage = () => {
    const { isAuthenticated, user } = useAuth();
    const [watchlistMovies, setWatchlistMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }
        const fetchWatchlist = async () => {
            try {
                setLoading(true);
                const interactions = await api.getUserInteractions(user.id);
                const movieIds = interactions.watchlist || [];
                const moviePromises = movieIds.map(id => getMovieById(id));
                const movies = await Promise.all(moviePromises);
                setWatchlistMovies(movies);
            } catch (error) {
                console.error("Failed to fetch watchlist", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWatchlist();
    }, [isAuthenticated, user]);

    if (!isAuthenticated) {
        return <Navigate to="/auth" />;
    }
    if (loading) {
        return <div className="p-8 text-white text-center">Loading your watchlist...</div>;
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 text-white">
            <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>
            {watchlistMovies.length === 0 ? (
                <p className="text-gray-400">Your watchlist is empty. Add films to your watchlist to see them here.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {watchlistMovies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                </div>
            )}
        </div>
    );
};

export default WatchlistPage;
