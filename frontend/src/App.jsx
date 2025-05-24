import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Player from './components/Player';
import Header from './components/Header';
import Footer from './components/Footer';

import { PlayerProvider } from './context/PlayerContext';

import Home from './pages/Home';
import Artist from './pages/Artist';
import Song from './pages/Song';

import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';

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
    <PlayerProvider> {/* PlayerProvider remains here or can be moved if AuthProvider is outermost in main.jsx */}
      <BrowserRouter>
        <Header />
        <main style={{ flex: 1, paddingTop: '72px' }}>
          <Routes>
            {/* Public Routes */}
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

// Make sure useAuth can be used in UserProfilePage by ensuring AuthProvider wraps it.
// Since AuthProvider is in main.jsx wrapping App, this should be fine.
// If UserProfilePage were defined outside App's context, you might need to pass auth data or ensure context availability.
import { useAuth } from './context/AuthContext'; // Added for UserProfilePage example

export default App;