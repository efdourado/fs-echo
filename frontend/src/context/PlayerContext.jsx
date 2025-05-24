import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useAudio } from '../hooks/useAudio';
import PropTypes from 'prop-types';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [state, setState] = useState({
    currentTrack: null,
    isPlaying: false,
    volume: 0.7,
    isMuted: false
  });

  const skipTrack = useCallback((direction) => {
    if (!state.currentTrack || !songs.length) return;
    
    const currentIndex = songs.findIndex(song => song._id === state.currentTrack._id);
    if (currentIndex === -1) return;

    let nextIndex;
    if (direction === 'forward') {
      nextIndex = (currentIndex + 1) % songs.length;
    } else {
      nextIndex = (currentIndex - 1 + songs.length) % songs.length;
    }

    setState(prev => ({
      ...prev,
      currentTrack: songs[nextIndex],
      isPlaying: true
    }));
  }, [state.currentTrack, songs]);

  const playTrack = useCallback((track) => {
    if (!track?.audioUrl) return;
    setState(prev => ({
      ...prev,
      currentTrack: track,
      isPlaying: true
    }));
  }, []);

  const togglePlayPause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const toggleMute = useCallback(() => {
    setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  const setVolume = useCallback((volume) => {
    setState(prev => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }));
  }, []);

  const audio = useAudio({
    src: state.currentTrack?.audioUrl || '',
    volume: state.isMuted ? 0 : state.volume,
    isPlaying: state.isPlaying,
    onPlay: () => setState(prev => ({ ...prev, isPlaying: true })),
    onPause: () => setState(prev => ({ ...prev, isPlaying: false })),
    onEnded: () => skipTrack('forward')
  });

  const value = useMemo(() => ({
    ...state,
    songs,
    currentTime: audio.currentTime,
    duration: audio.duration,
    playTrack,
    togglePlayPause,
    toggleMute,
    setVolume,
    skipTrack,
    seek: audio.seek,
    setSongs
  }), [state, audio, playTrack, togglePlayPause, toggleMute, setVolume, skipTrack, songs]);

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
); };

PlayerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};