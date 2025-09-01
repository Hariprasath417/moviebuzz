// src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
    const { isAuthenticated, user } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

    // ✅ Always call hooks at the top level
    useEffect(() => {
        const fetchProfile = async () => {
            if (!isAuthenticated) {
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get(`${API_URL}/users/${user.id}`);
                setProfileData(res.data);
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [isAuthenticated, user, API_URL]);

    if (!isAuthenticated) {
        return <Navigate to="/auth" />;
    }

    if (loading) {
        return <div className="p-8 text-white text-center">Loading profile...</div>;
    }

    return (
        <div className="p-8 text-white max-w-2xl mx-auto">
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
            <div className="mt-6 text-center text-gray-500">
                More profile stats and features coming soon!
            </div>
        </div>
    );
};

export default ProfilePage;
