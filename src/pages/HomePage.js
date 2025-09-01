// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { getPopularMovies, getTrendingMovies } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

const HomePage = () => {
    const [featured, setFeatured] = useState([]);
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const [featuredMovies, trendingMovies] = await Promise.all([
                    getPopularMovies(),        // Featured movies
                    getTrendingMovies('week')  // Trending this week
                ]);
                setFeatured(featuredMovies.slice(0, 5));
                setTrending(trendingMovies.slice(0, 10));
            } catch (err) {
                setError('Failed to fetch movies.');
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    if (loading) return <p className="text-white text-center mt-10">Loading movies...</p>;
    if (error) return <p className="text-red-400 text-center mt-10">{error}</p>;

    return (
        <div className="p-4 sm:p-6 md:p-8">
            {/* Featured Section */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Featured Movies</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {featured.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                </div>
            </section>

            {/* Trending Section */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Trending This Week</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {trending.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
