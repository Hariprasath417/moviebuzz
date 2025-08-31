import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();

    const activeLinkStyle = {
        color: '#60a5fa', // text-blue-400
        borderBottom: '2px solid #60a5fa'
    };

    return (
        <nav className="bg-gray-800/70 backdrop-blur-md shadow-lg p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center space-x-8">
                <Link to="/" className="text-2xl font-bold text-white tracking-wider">
                    Movie<span className="text-blue-400">Buzz</span>
                </Link>
                <div className="hidden md:flex items-center space-x-6">
                    <NavLink to="/films" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-300 hover:text-white transition pb-1">Films</NavLink>
                    {isAuthenticated && (
                        <>
                            <NavLink to="/reviews" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-300 hover:text-white transition pb-1">Reviews</NavLink>
                            <NavLink to="/watchlist" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-300 hover:text-white transition pb-1">Watchlist</NavLink>
                            <NavLink to="/likes" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-300 hover:text-white transition pb-1">Likes</NavLink>
                        </>
                    )}
                </div>
            </div>
            <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                    <>
                        <Link to="/profile" className="text-gray-300 hover:text-white transition">Profile</Link>
                        <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition">Logout</button>
                    </>
                ) : (
                    <Link to="/auth" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">Sign In</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
