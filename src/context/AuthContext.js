// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { api } from '../api/tmdb'; // Import the centralized api object

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('moviebuzz-token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('moviebuzz-token');
        if (storedToken) {
            try {
                const decodedToken = jwtDecode(storedToken);
                if (decodedToken.exp * 1000 < new Date().getTime()) {
                    logout();
                } else {
                    setUser({ id: decodedToken.id, email: decodedToken.email });
                    setToken(storedToken);
                }
            } catch (error) {
                console.error("Invalid token:", error);
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Use the centralized api.login function
        const data = await api.login(email, password);
        localStorage.setItem('moviebuzz-token', data.token);
        setToken(data.token);
        setUser(data.result);
    };
    
    const register = async (email, password) => {
        // Use the centralized api.register function
        await api.register(email, password);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('moviebuzz-token');
    };

    const value = {
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
