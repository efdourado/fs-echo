import React, { createContext, useState, useContext } from 'react';

const SongMenuContext = createContext();

export const useSongMenu = () => useContext(SongMenuContext);

export const SongMenuProvider = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [song, setSong] = useState(null);
  
  const openMenu = (selectedSong) => {
    setSong(selectedSong);
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setSong(null);
  };

  const value = {
    isMenuOpen,
    song,
    openMenu,
    closeMenu,
  };

  return (
    <SongMenuContext.Provider value={value}>
      {children}
    </SongMenuContext.Provider>
); };