import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { usePlayer } from '../../../hooks/usePlayer';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';

const Player = () => {
  const { 
    currentTrack, 
    pauseTrack, 
    isPlaying 
  } = usePlayer();
  
  if (!currentTrack) return null;

  return (
    <div className={`player-container ${isPlaying ? 'active' : ''}`}>
      <div className="player-content">
        <button 
          className="player-close" 
          onClick={pauseTrack}
          aria-label="Close player"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        
        <div className="player-controls">
          <PlayerControls />
          <ProgressBar />
          <VolumeControl />
        </div>
      </div>
    </div>
); };

export default Player;