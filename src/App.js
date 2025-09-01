import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import FilmsPage from './pages/FilmsPage';
import MovieDetailPage from './pages/MovieDetailPage';
import AuthPage from './pages/AuthPage';
import DiaryPage from './pages/DiaryPage';
import ReviewsPage from './pages/ReviewsPage';
import WatchlistPage from './pages/WatchlistPage';
import LikesPage from './pages/LikesPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <div className="bg-gray-900 min-h-screen text-gray-100 font-sans">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/" element={<FilmsPage />} />
            <Route path="/films" element={<FilmsPage />} />
            <Route path="/film/:id" element={<MovieDetailPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/diary" element={<DiaryPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/likes" element={<LikesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
