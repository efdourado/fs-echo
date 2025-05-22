import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Player from './components/Player';
import Header from './components/Header';
import Footer from './components/Footer';

import { PlayerProvider } from './context/PlayerContext';

import Home from './pages/Home';
import Artist from './pages/Artist';
import Song from './pages/Song';

const App = () => {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/artist/:id" element={<Artist />} />
            <Route path="/song/:id" element={<Song />} />
          </Routes>
        <Footer />
        <Player />
      </BrowserRouter>
    </PlayerProvider>
); };

export default App;