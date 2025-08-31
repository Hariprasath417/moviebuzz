import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api/tmdb';
import StarRating from './StarRating';

const ReviewForm = ({ movieId, onReviewAdded }) => {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { isAuthenticated, user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0 && !reviewText) {
            setError('Please add a rating or a review.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await api.addReview({ 
                movieId, 
                rating, 
                text: reviewText,
                userId: user.id,
                username: user.email.split('@')[0]
            });
            setRating(0);
            setReviewText('');
            if(onReviewAdded) onReviewAdded();
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    };

    if (!isAuthenticated) {
        return <p className="text-gray-400 bg-gray-800 p-6 rounded-lg mt-8 text-center">Please log in to leave a review.</p>;
    }

    return (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-bold text-white mb-4">Add Your Review</h3>
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
            <div className="mb-4">
                <label className="block text-gray-300 mb-2">Your Rating</label>
                <StarRating rating={rating} setRating={setRating} />
            </div>
            <div className="mb-4">
                <label htmlFor="reviewText" className="block text-gray-300 mb-2">Your Review</label>
                <textarea id="reviewText" value={reviewText} onChange={(e) => setReviewText(e.target.value)} className="w-full bg-gray-700 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows="4" placeholder="Tell us what you think..."></textarea>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-gray-500">
                {isLoading ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
};

export default ReviewForm;
