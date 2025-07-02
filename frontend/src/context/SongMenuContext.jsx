import React, { createContext, useState, useContext } from 'react';

const SongMenuContext = createContext();

export const useSongMenu = () => useContext(SongMenuContext);

export const SongMenuProvider = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [song, setSong] = useState(null);
  const [menuContext, setMenuContext] = useState(null);
  
  const openMenu = (selectedSong, context = null) => {
    setSong(selectedSong);
    setMenuContext(context);
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setSong(null);
    setMenuContext(null);
  };

  const value = {
    isMenuOpen,
    song,
    menuContext,
    openMenu,
    closeMenu,
  };

  return (
    <SongMenuContext.Provider value={value}>
      {children}
    </SongMenuContext.Provider>
); };