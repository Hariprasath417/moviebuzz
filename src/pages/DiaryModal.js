// src/components/DiaryModal.js
import React, { useState } from 'react';
import StarRating from '../components/StarRating';

const DiaryModal = ({ isOpen, onClose, onSave }) => {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [watchedDate, setWatchedDate] = useState(new Date().toISOString().split('T')[0]);

    if (!isOpen) return null;

    const handleSave = () => {
        // 1. First log: When the save button is clicked inside the modal
        console.log('DiaryModal: Save button clicked. Calling onSave prop.');
        onSave({ rating, reviewText, watchedDate });
        // Reset form
        setRating(0);
        setReviewText('');
        setWatchedDate(new Date().toISOString().split('T')[0]);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-4">Log this film</h2>
                <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Date Watched</label>
                    <input 
                        type="date" 
                        value={watchedDate}
                        onChange={(e) => setWatchedDate(e.target.value)}
                        className="w-full bg-gray-700 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Your Rating</label>
                    <StarRating rating={rating} setRating={setRating} />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Review (optional)</label>
                    <textarea 
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="w-full bg-gray-700 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        rows="4" 
                        placeholder="This film is..."
                    ></textarea>
                </div>
                <div className="flex justify-end space-x-4">
                    <button onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
                    <button onClick={handleSave} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg">Save</button>
                </div>
            </div>
        </div>
    );
};

export default DiaryModal;