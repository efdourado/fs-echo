import React, { useContext, useRef, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes,
  faBackwardStep, 
  faCirclePlay, 
  faForwardStep, 
  faCirclePause,
  faPause,
  faPlay
} from '@fortawesome/free-solid-svg-icons';

import { PlayerContext } from '../context/PlayerContext';
import { formatDuration } from '../helpers/duration';

const Player = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlayPause,
    skipTrack,
    currentTime, 
    duration, 
    seek
  } = useContext(PlayerContext);
  
  const progressBarRef = useRef(null);
  const effectiveDuration = duration || currentTrack?.duration || 0;

  const handleProgressClick = (e) => {
    if (!progressBarRef.current || effectiveDuration <= 0) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const seekTime = clickPosition * effectiveDuration;
    
    seek(seekTime);
  };

  useEffect(() => {
    if (!progressBarRef.current || effectiveDuration <= 0) return;
    
    const progressPercent = (currentTime / effectiveDuration) * 100;
    progressBarRef.current.style.setProperty("--progress", `${progressPercent}%`);
  }, [currentTime, effectiveDuration]);

  if (!currentTrack) return null;

  return (
    <div className={`player ${isPlaying ? 'player--active' : ''}`}>
      <div className="player__content">
        <div className="player__track-info">
          <img 
            src={currentTrack.coverImage || '/fb.png'}
            alt={`Capa do álbum ${currentTrack.title}`} 
            className="player__cover"
            onError={(e) => {
              e.target.src = '/fb.png';
            }}
          />
          <div className="player__track-details">
            <h3 className="player__title">{currentTrack.title}</h3>
            <p className="player__artist">
              {currentTrack.artist?.name || 'Artista Desconhecido'}
            </p>
          </div>
        </div>

        <div className="player__controls">
          <div className="player__main-controls">
            <button 
              className="player__nav-button"
              onClick={() => skipTrack('backward')}
              aria-label="Previous track"
            >
              <FontAwesomeIcon icon={faBackwardStep} />
            </button>

            <button 
              className="player__play-button"
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size="lg" />
            </button>

            <button 
              className="player__nav-button"
              onClick={() => skipTrack('forward')}
              aria-label="Next track"
            >
              <FontAwesomeIcon icon={faForwardStep} />
            </button>
          </div>

          <div className="player__progress-container">
            <span className="player__time">
              {formatDuration(currentTime)}
            </span>
            
            <div
              ref={progressBarRef}
              className="player__progress-bar"
              onClick={handleProgressClick}
              role="progressbar"
              aria-valuenow={(currentTime / effectiveDuration) * 100 || 0}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div className="player__progress-fill" />
            </div>
            
            <span className="player__time">
              {formatDuration(effectiveDuration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;