import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Player from './components/layout/Player';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import { PlayerProvider } from './context/PlayerContext';
import { useAuth } from './context/AuthContext';

import Home from './pages/HomePage/HomePage';
import Artist from './pages/ArtistPage';
import Song from './pages/SongPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

import ProtectedRoute from './components/auth/ProtectedRoute';

const UserProfilePage = () => {
  const { currentUser } = useAuth();
  return (
    <div style={{ padding: '20px', color: 'var(--text-color)'}}>
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
  return (
    <PlayerProvider>
      <BrowserRouter>
        <Header />
        <main style={{ flex: 1, paddingTop: '72px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/artist/:id" element={<Artist />} />
            <Route path="/song/:id" element={<Song />} />

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
        <Footer />
        <Player />
      </BrowserRouter>
    </PlayerProvider>
); };

export default App;