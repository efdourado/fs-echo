import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Player from './components/layout/Player';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';

import { PlayerProvider } from './context/PlayerContext';
import { useAuth } from './context/AuthContext';

import Home from './pages/HomePage/HomePage';
import Artist from './pages/ArtistPage';
import Song from './pages/SongPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

import ComingSoonPage from './pages/ComingSoonPage';

import ProtectedRoute from './components/auth/ProtectedRoute';

const UserProfilePage = () => {
  const { currentUser } = useAuth();
  return (
    <div style={{ padding: '20px', color: 'var(--text-color)' }}>
      <h1>User Profile</h1>
      {currentUser ? (
        <>
          <p>Welcome, {currentUser.username}!</p>
          <p>Email: {currentUser.email}</p>
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
); };

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <PlayerProvider>
        <div className="app-container">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

          <div className={`content-pusher ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <Header toggleSidebar={toggleSidebar} />
            <main style={{ flex: 1, paddingTop: '72px' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/artist/:id" element={<Artist />} />
                <Route path="/song/:id" element={<Song />} />

                <Route path="/artists" element={<ComingSoonPage />} />
                <Route path="/discover" element={<ComingSoonPage />} />
                <Route path="/library" element={<ComingSoonPage />} />
                <Route path="/archived" element={<ComingSoonPage />} />
                <Route path="/help" element={<ComingSoonPage />} />
                <Route path="/settings" element={<ComingSoonPage />} />
                <Route path="/feedback" element={<ComingSoonPage />} />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <UserProfilePage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer companyName={'Echo'} />
          </div>
        </div>
        <Player />
    </PlayerProvider>
); };

export default App;