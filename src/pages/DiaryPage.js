import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { api, getMovieById } from '../api/tmdb';
import StarRating from '../components/StarRating';

const DiaryPage = () => {
    const { isAuthenticated, user } = useAuth();
    const [diaryEntries, setDiaryEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        const fetchDiary = async () => {
            try {
                const entries = await api.getDiary(user.id);
                const movieIds = [...new Set(entries.map(e => e.movieId))];
                const movieDataPromises = movieIds.map(id => getMovieById(id));
                const movies = await Promise.all(movieDataPromises);
                const moviesMap = movies.reduce((acc, movie) => {
                    acc[movie.id] = movie;
                    return acc;
                }, {});

                const populatedEntries = entries.map(entry => ({
                    ...entry,
                    movie: moviesMap[entry.movieId]
                }));

                setDiaryEntries(populatedEntries);
            } catch (error) {
                console.error("Failed to fetch diary", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDiary();
    }, [isAuthenticated, user]);

    if (!isAuthenticated) {
        return <Navigate to="/auth" />;
    }

    if (loading) {
        return <div className="p-8 text-white text-center">Loading your diary...</div>;
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 text-white max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">My Diary</h1>
            {diaryEntries.length === 0 ? (
                <p className="text-gray-400">You haven't logged any films yet.</p>
            ) : (
                <div className="space-y-6">
                    {diaryEntries.map(entry => (
                        <div key={entry.id} className="bg-gray-800 p-4 rounded-lg flex items-start space-x-4">
                            {entry.movie && (
                                <Link to={`/film/${entry.movie.id}`}>
                                    <img src={entry.movie.posterUrl} alt={`${entry.movie.title} poster`} className="w-24 rounded-md flex-shrink-0" />
                                </Link>
                            )}
                            <div>
                                {entry.movie && <h3 className="text-xl font-bold text-white">{entry.movie.title} <span className="text-gray-400 font-normal">({entry.movie.year})</span></h3>}
                                <p className="text-sm text-gray-400 mt-1">
                                    Watched on {new Date(entry.watchedDate).toLocaleDateString()}
                                </p>
                                <div className="my-2">
                                    <StarRating rating={entry.rating} setRating={() => {}} />
                                </div>
                                {entry.reviewText && <p className="text-gray-300 italic">"{entry.reviewText}"</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DiaryPage;
