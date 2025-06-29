import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

import Player from './components/layout/Player';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';

import SongMenu from './components/songs/SongMenu';

import { PlayerProvider } from './context/PlayerContext';
import { useAuth } from './context/AuthContext';


import AdminPage from './pages/Admin/AdminPage';
import ArtistForm from './pages/Admin/ArtistForm';
import SongForm from './pages/Admin/SongForm';
import AlbumForm from './pages/Admin/AlbumForm';
import UserForm from './pages/Admin/UserForm';

import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

import Home from './pages/HomePage/HomePage';
import CollectionPage from './pages/CollectionPage';

import ComingSoonPage from './pages/ComingSoonPage';
import LibraryPage from './pages/LibraryPage';


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
  const { currentUser, loadingAuth } = useAuth();
  
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loadingAuth && currentUser) {
      const savedState = localStorage.getItem(`sidebarState_${currentUser._id}`);
      setSidebarOpen(savedState ? JSON.parse(savedState) : false);
    }
  }, [currentUser, loadingAuth]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`sidebarState_${currentUser._id}`, JSON.stringify(isSidebarOpen));
    }
  }, [isSidebarOpen, currentUser]);


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


                <Route path="/artist/:id" element={<CollectionPage type="artist" />} />
                <Route path="/song/:id" element={<CollectionPage type="song" />} />
                <Route path="/playlist/:id" element={<CollectionPage type="playlist" />} />
                <Route path="/album/:id" element={<CollectionPage type="album" />} />


                <Route path="/artists" element={<ComingSoonPage />} />
                <Route path="/discover" element={<ComingSoonPage />} />
                <Route path="/archived" element={<ComingSoonPage />} />
                <Route path="/help" element={<ComingSoonPage />} />
                <Route path="/settings" element={<ComingSoonPage />} />
                <Route path="/feedback" element={<ComingSoonPage />} />


                <Route path="/library/songs" element={<ComingSoonPage />} />
                <Route path="/library/playlists" element={<ComingSoonPage />} />

                <Route
                  path="/library"
                  element={
                    <ProtectedRoute>
                      <LibraryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <UserProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  }
                />
                <Route path="/admin/new/artist" element={<AdminRoute><ArtistForm /></AdminRoute>} />
                <Route path="/admin/new/song" element={<AdminRoute><SongForm /></AdminRoute>} />
                <Route path="/admin/new/album" element={<AdminRoute><AlbumForm /></AdminRoute>} />

                <Route path="/admin/edit/artist/:id" element={<AdminRoute><ArtistForm /></AdminRoute>} />
                <Route path="/admin/edit/song/:id" element={<AdminRoute><SongForm /></AdminRoute>} />
                <Route path="/admin/edit/album/:id" element={<AdminRoute><AlbumForm /></AdminRoute>} />
                <Route path="/admin/edit/user/:id" element={<AdminRoute><UserForm /></AdminRoute>} />

                <Route path="/admin/users" element={<AdminRoute><ComingSoonPage /></AdminRoute>} />
              </Routes>
            </main>
            <Footer companyName={'Echo'} />
            <SongMenu />
          </div>
        </div>
        <Player isSidebarOpen={isSidebarOpen} />
    </PlayerProvider>
); };

export default App;