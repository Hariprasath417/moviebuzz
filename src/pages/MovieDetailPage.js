import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieById, api } from '../api/tmdb';
import { useAuth } from '../hooks/useAuth';
import ReviewForm from '../components/ReviewForm';
import StarRating from '../components/StarRating';
import DiaryModal from './DiaryModal';

const MovieDetailPage = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [isOnWatchlist, setIsOnWatchlist] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDiaryModalOpen, setDiaryModalOpen] = useState(false);
    const { isAuthenticated, user } = useAuth();

    const fetchAllData = useCallback(async () => {
        try {
            const movieDetails = await getMovieById(id);
            setMovie(movieDetails);

            const movieReviews = await api.getReviewsForMovie(id);
            setReviews(movieReviews);

            if (isAuthenticated && user?.id) {
                const interactions = await api.getUserInteractions(user.id);
                setIsLiked(interactions.likes.includes(id));
                setIsOnWatchlist(interactions.watchlist.includes(id));
            }
        } catch (err) {
            setError('Could not load movie details.');
        } finally {
            setLoading(false);
        }
    }, [id, isAuthenticated, user]);

    useEffect(() => {
        setLoading(true);
        fetchAllData();
    }, [fetchAllData]);

    const handleLikeToggle = async () => {
        if (!isAuthenticated) return;
        await api.toggleLike(user.id, id);
        setIsLiked((prev) => !prev);
    };

    const handleWatchlistToggle = async () => {
        if (!isAuthenticated) return;
        await api.toggleWatchlist(user.id, id);
        setIsOnWatchlist((prev) => !prev);
    };

    const handleDiarySave = async (entryData) => {
        console.log('MovieDetailPage: handleDiarySave called. Calling api.addDiaryEntry.');
        await api.addDiaryEntry(user.id, {
            ...entryData,
            movieId: id,
            username: user.email.split('@')[0],
        });
        setDiaryModalOpen(false);
        fetchAllData();
    };

    if (loading) return <div className="text-white text-center p-10">Loading...</div>;
    if (error) return <div className="text-red-400 text-center p-10">{error}</div>;
    if (!movie) return <div className="text-white text-center p-10">Movie not found.</div>;

    return (
        <>
            <DiaryModal 
                isOpen={isDiaryModalOpen} 
                onClose={() => setDiaryModalOpen(false)}
                onSave={handleDiarySave}
            />
            <div className="p-4 sm:p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3 flex-shrink-0">
                        <img src={movie.posterUrl} alt={`${movie.title} Poster`} className="rounded-lg shadow-lg w-full" />
                        {isAuthenticated && (
                            <div className="mt-4 flex flex-col space-y-2">
                                <button 
                                    onClick={() => setDiaryModalOpen(true)} 
                                    className="w-full py-3 rounded-lg font-semibold transition bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Log Film...
                                </button>
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={handleLikeToggle} 
                                        className={`w-1/2 py-3 rounded-lg font-semibold transition ${isLiked ? 'bg-pink-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                                    >
                                        {isLiked ? '♥ Liked' : '♡ Like'}
                                    </button>
                                    <button 
                                        onClick={handleWatchlistToggle} 
                                        className={`w-1/2 py-3 rounded-lg font-semibold transition ${isOnWatchlist ? 'bg-green-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                                    >
                                        {isOnWatchlist ? '✓ On Watchlist' : '+ Watchlist'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="md:w-2/3">
                        <h1 className="text-4xl font-bold text-white">
                            {movie.title} <span className="text-gray-400 font-normal text-2xl">({movie.year})</span>
                        </h1>
                        <p className="text-gray-300 mt-2 text-lg">
                            Directed by <span className="font-semibold text-white">{movie.director}</span>
                        </p>
                        <p className="text-gray-400 mt-4">{movie.synopsis}</p>
                        <ReviewForm movieId={id} onReviewAdded={fetchAllData} />
                    </div>
                </div>
                <div className="mt-8">
                    <h3 className="text-2xl font-bold text-white mb-4">Community Reviews</h3>
                    {reviews.length === 0 ? (
                        <p className="text-gray-400">No reviews yet. Be the first!</p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review._id} className="bg-gray-800 p-4 rounded-lg">
                                    <div className="flex items-center mb-2">
                                        <p className="text-white font-bold mr-4">{review.username}</p>
                                        <StarRating rating={review.rating} setRating={() => {}} />
                                    </div>
                                    <p className="text-gray-300">{review.text}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MovieDetailPage;
