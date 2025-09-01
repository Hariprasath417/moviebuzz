import React, { useState, useEffect } from "react";
import { getPopularMovies, searchMovies } from "../api/tmdb";
import MovieCard from "../components/MovieCard";

const FilmsPage = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ genre: "", year: "", rating: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const results = await getPopularMovies(filters); // pass filters
        setMovies(results);
      } catch (err) {
        setError("Could not fetch movies.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [filters]); // refetch whenever filters change

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const results = await searchMovies(searchTerm, filters); // pass filters
      setMovies(results);
    } catch (err) {
      setError("Could not perform search.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Search for a film..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 text-white p-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          Search
        </button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        {/* Genre Filter */}
        <select
          value={filters.genre}
          onChange={(e) =>
            setFilters((f) => ({ ...f, genre: e.target.value }))
          }
          className="bg-gray-800 text-white p-3 rounded-lg"
        >
          <option value="">All Genres</option>
          <option value="28">Action</option>
          <option value="18">Drama</option>
          <option value="35">Comedy</option>
          <option value="27">Horror</option>
        </select>

        {/* Year Filter */}
        <select
          value={filters.year}
          onChange={(e) => setFilters((f) => ({ ...f, year: e.target.value }))}
          className="bg-gray-800 text-white p-3 rounded-lg"
        >
          <option value="">All Years</option>
          {Array.from({ length: 25 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>

        {/* Rating Filter */}
        <select
          value={filters.rating}
          onChange={(e) => setFilters((f) => ({ ...f, rating: e.target.value }))}
          className="bg-gray-800 text-white p-3 rounded-lg"
        >
          <option value="">All Ratings</option>
          <option value="8">8+ stars</option>
          <option value="7">7+ stars</option>
          <option value="6">6+ stars</option>
          <option value="5">5+ stars</option>
        </select>
      </div>

      {/* Content */}
      {loading && <p className="text-center text-white">Loading films...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {movies.length > 0 ? (
            movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
          ) : (
            <p className="text-center col-span-full text-gray-400">
              No movies found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FilmsPage;
