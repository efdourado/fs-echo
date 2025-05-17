import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Artists from './pages/artists/Artists';
import Artist from './pages/artists/Artist';
import Songs from './pages/songs/Songs';
import Song from './pages/songs/index';

const App = () => {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/artist/:id" element={<Artist />} />
            <Route path="/songs" element={<Songs />} />
            <Route path="/song/:id" element={<Song />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </PlayerProvider>
  );
};

export default App;