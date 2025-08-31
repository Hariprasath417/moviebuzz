// src/pages/AuthPage.js
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Navigate } from 'react-router-dom';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
                navigate('/films');
            } else {
                await register(email, password);
                setMessage('Registration successful! Please sign in.');
                setIsLogin(true); // Switch to login form
            }
        } catch (err) {
            setError(err.message || 'An error occurred.');
        }
        setLoading(false);
    };

    if (isAuthenticated) {
        return <Navigate to="/films" />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen -mt-20">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-white text-center mb-6">{isLogin ? 'Sign In' : 'Create Account'}</h2>
                {error && <p className="bg-red-200 text-red-800 p-3 rounded-md mb-4 text-center">{error}</p>}
                {message && <p className="bg-green-200 text-green-800 p-3 rounded-md mb-4 text-center">{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2" htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-700 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-300 mb-2" htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-700 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-gray-500">{loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}</button>
                </form>
                <button onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }} className="w-full mt-4 text-blue-400 hover:text-blue-300">{isLogin ? 'Need an account? Sign Up' : 'Have an account? Sign In'}</button>
            </div>
        </div>
    );
};

export default AuthPage;