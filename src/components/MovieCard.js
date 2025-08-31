import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => (
    <Link to={`/film/${movie.id}`} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 block">
        <img src={movie.posterUrl} alt={`${movie.title} Poster`} className="w-full h-auto object-cover" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/300x450/2d3748/ffffff?text=Image+Not+Found'; }}/>
        <div className="p-4">
            <h3 className="text-lg font-bold text-white truncate">{movie.title}</h3>
            <p className="text-gray-400">{movie.year}</p>
        </div>
    </Link>
);

export default MovieCard;