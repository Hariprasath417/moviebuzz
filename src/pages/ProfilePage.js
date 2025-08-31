import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/auth" />;
    }

    return (
        <div className="p-8 text-white max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-center">Profile</h1>
            <div className="mt-8 bg-gray-800 p-6 rounded-lg">
                <p className="text-lg">
                    <span className="font-semibold text-gray-400">Username:</span> {user.email.split('@')[0]}
                </p>
                <p className="text-lg mt-2">
                    <span className="font-semibold text-gray-400">Email:</span> {user.email}
                </p>
            </div>
            <div className="mt-6 text-center text-gray-500">
                More profile stats and features coming soon!
            </div>
        </div>
    );
};

export default ProfilePage;
