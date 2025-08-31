// src/pages/ReviewsPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { api, getMovieById } from '../api/tmdb';
import StarRating from '../components/StarRating';

const ReviewsPage = () => {
    const { isAuthenticated, user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const userReviews = await api.getUserReviews(user.id);
                const movieIds = [...new Set(userReviews.map(r => r.movieId))];
                const moviePromises = movieIds.map(id => getMovieById(id));
                const moviesData = await Promise.all(moviePromises);
                const moviesMap = moviesData.reduce((acc, movie) => {
                    acc[movie.id] = movie;
                    return acc;
                }, {});

                const populatedReviews = userReviews.map(review => ({
                    ...review,
                    movie: moviesMap[review.movieId]
                }));
                setReviews(populatedReviews);
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [isAuthenticated, user]);

    if (!isAuthenticated) {
        return <Navigate to="/auth" />;
    }
    if (loading) {
        return <div className="p-8 text-white text-center">Loading your reviews...</div>;
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 text-white max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">My Reviews</h1>
            {reviews.length === 0 ? (
                <p className="text-gray-400">You haven't reviewed any films yet.</p>
            ) : (
                <div className="space-y-6">
                    {reviews.map(review => (
                        <div key={review._id} className="bg-gray-800 p-4 rounded-lg flex items-start space-x-4">
                            {review.movie && (
                                <Link to={`/film/${review.movie.id}`}>
                                    <img src={review.movie.posterUrl} alt={`${review.movie.title} poster`} className="w-24 rounded-md flex-shrink-0" />
                                </Link>
                            )}
                            <div>
                                {review.movie && <h3 className="text-xl font-bold text-white">{review.movie.title}</h3>}
                                <div className="flex my-2">
                                    <StarRating rating={review.rating} setRating={() => {}} />
                                </div>
                                <p className="text-gray-300">{review.text}</p>
                                <p className="text-xs text-gray-500 mt-2">Reviewed on {new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewsPage;
