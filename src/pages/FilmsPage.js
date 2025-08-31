import React, { useState, useEffect } from 'react';
import { getPopularMovies, searchMovies } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

const FilmsPage = () => {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const results = await getPopularMovies();
                setMovies(results);
            } catch (err) {
                setError('Could not fetch movies.');
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const results = await searchMovies(searchTerm);
            setMovies(results);
        } catch (err) {
            setError('Could not perform search.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <form onSubmit={handleSearch} className="mb-8 flex gap-2">
                <input type="text" placeholder="Search for a film..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-gray-800 text-white p-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition">Search</button>
            </form>
            {loading && <p className="text-center text-white">Loading films...</p>}
            {error && <p className="text-center text-red-400">{error}</p>}
            {!loading && !error && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                </div>
            )}
        </div>
    );
};

export default FilmsPage;
