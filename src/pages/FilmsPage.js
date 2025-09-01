import React, { useState, useEffect } from 'react';
import { getPopularMovies, getGenres, searchMoviesWithFilters } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

const FilmsPage = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedRating, setSelectedRating] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [moviesList, genresList] = await Promise.all([
                    getPopularMovies(),
                    getGenres()
                ]);
                setMovies(moviesList);
                setGenres(genresList);
            } catch (err) {
                setError('Failed to fetch movies or genres.');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const fetchFilteredMovies = async () => {
        try {
            setLoading(true);
            const results = await searchMoviesWithFilters({
                query: searchTerm,
                genre: selectedGenre,
                year: selectedYear,
                minRating: selectedRating
            });
            setMovies(results);
        } catch (err) {
            setError('Failed to fetch filtered movies.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchFilteredMovies();
    };

    // Fetch filtered movies on filter change
    useEffect(() => {
        fetchFilteredMovies();
    }, [selectedGenre, selectedYear, selectedRating]);

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                <input
                    type="text"
                    placeholder="Search for a film..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-800 text-white p-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition">
                    Search
                </button>
            </form>

            <div className="mb-8 flex flex-wrap gap-4">
                <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className="bg-gray-800 text-white p-2 rounded-lg">
                    <option value="">All Genres</option>
                    {genres.map(genre => <option key={genre.id} value={genre.id}>{genre.name}</option>)}
                </select>

                <input type="number" placeholder="Year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="bg-gray-800 text-white p-2 rounded-lg w-24" />

                <select value={selectedRating} onChange={(e) => setSelectedRating(e.target.value)} className="bg-gray-800 text-white p-2 rounded-lg">
                    <option value="">Min Rating</option>
                    {[1,2,3,4,5,6,7,8,9,10].map(r => <option key={r} value={r}>{r}+</option>)}
                </select>
            </div>

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
