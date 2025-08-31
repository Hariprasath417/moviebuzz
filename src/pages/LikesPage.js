// src/pages/LikesPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { api, getMovieById } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

const LikesPage = () => {
    const { isAuthenticated, user } = useAuth();
    const [likedMovies, setLikedMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }
        const fetchLikes = async () => {
            try {
                setLoading(true);
                const interactions = await api.getUserInteractions(user.id);
                const movieIds = interactions.likes || [];
                const moviePromises = movieIds.map(id => getMovieById(id));
                const movies = await Promise.all(moviePromises);
                setLikedMovies(movies);
            } catch (error) {
                console.error("Failed to fetch liked movies", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLikes();
    }, [isAuthenticated, user]);

    if (!isAuthenticated) {
        return <Navigate to="/auth" />;
    }
    if (loading) {
        return <div className="p-8 text-white text-center">Loading your liked films...</div>;
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 text-white">
            <h1 className="text-3xl font-bold mb-6">Liked Films</h1>
            {likedMovies.length === 0 ? (
                <p className="text-gray-400">You haven't liked any films yet.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {likedMovies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                </div>
            )}
        </div>
    );
};

export default LikesPage;
