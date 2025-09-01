import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { api, getMovieById } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

const ProfilePage = () => {
    const { isAuthenticated, user } = useAuth();

    const [reviews, setReviews] = useState([]);
    const [watchlistMovies, setWatchlistMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const fetchProfileData = async () => {
            setLoading(true);
            try {
                // 1️⃣ Fetch user reviews
                const userReviews = await api.getUserReviews(user.id);

                // 2️⃣ Attach movie details (including poster) for each review
                const reviewsWithMovies = await Promise.all(
                    userReviews.map(async (r) => {
                        try {
                            const movie = await getMovieById(r.movieId);
                            return { ...r, movie };
                        } catch {
                            return { ...r, movie: null };
                        }
                    })
                );
                setReviews(reviewsWithMovies);

                // 3️⃣ Fetch watchlist
                const interactions = await api.getUserInteractions(user.id);
                const watchlistIds = interactions.watchlist || [];

                const watchlistDetails = await Promise.all(
                    watchlistIds.map(id => getMovieById(id).catch(() => null))
                );

                setWatchlistMovies(watchlistDetails.filter(Boolean)); // remove nulls
            } catch (err) {
                console.error('Failed to fetch profile data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [isAuthenticated, user]);

    if (!isAuthenticated) {
        return <Navigate to="/auth" />;
    }

    if (loading) {
        return <div className="p-8 text-white text-center">Loading profile...</div>;
    }

    return (
        <div className="p-8 text-white max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-center">Profile</h1>

            <div className="mt-8 bg-gray-800 p-6 rounded-lg">
                <p className="text-lg">
                    <span className="font-semibold text-gray-400">Username:</span>{" "}
                    {profileData?.username || user.email.split('@')[0]}
                </p>
                <p className="text-lg mt-2">
                    <span className="font-semibold text-gray-400">Email:</span>{" "}
                    {profileData?.email || user.email}
                </p>
                <p className="text-lg mt-2">
                    <span className="font-semibold text-gray-400">Joined:</span>{" "}
                    {profileData?.createdAt
                        ? new Date(profileData.createdAt).toLocaleDateString()
                        : "N/A"}
                </p>
            </div>

            {loading ? (
                <p className="text-center mt-6">Loading your profile data...</p>
            ) : (
                <>
                    {/* Reviews Section */}
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Your Reviews</h2>
                        {reviews.length === 0 ? (
                            <p className="text-gray-400">You haven't reviewed any movies yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map(r => (
                                    <div key={r._id} className="bg-gray-800 p-4 rounded-lg flex gap-4">
                                        {/* Movie Poster */}
                                        {r.movie?.posterUrl ? (
                                            <img
                                                src={r.movie.posterUrl}
                                                alt={r.movie.title}
                                                className="w-20 h-28 rounded object-cover"
                                            />
                                        ) : (
                                            <div className="w-20 h-28 bg-gray-700 flex items-center justify-center text-xs text-gray-400">
                                                No Poster
                                            </div>
                                        )}

                                        {/* Movie Info */}
                                        <div>
                                            <p className="font-bold text-xl">{r.movie?.title || "Unknown Movie"}</p>
                                            <p className="text-yellow-400">⭐ {r.rating}/5</p>
                                            {r.text && <p className="text-gray-300 mt-2">{r.text}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Watchlist Section */}
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Your Watchlist</h2>
                        {watchlistMovies.length === 0 ? (
                            <p className="text-gray-400">Your watchlist is empty.</p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {watchlistMovies.map(movie => (
                                    <MovieCard key={movie.id} movie={movie} />
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ProfilePage;
