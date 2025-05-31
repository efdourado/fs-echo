import React, { useContext, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBackwardStep,
  faPlay, // Changed from faCirclePlay for consistency with faPause
  faForwardStep,
  faPause, // Changed from faCirclePause
} from '@fortawesome/free-solid-svg-icons';

import { PlayerContext } from '../../context/PlayerContext';
import { formatDuration } from '../../utils/duration';
import fallbackImage from '/images/fb.jpeg'; // Ensure you have a fallback image

const Player = () => {
  const {
    currentTrack, // currentTrack is actually currentSong in your context, let's assume it's the song object
    isPlaying,
    togglePlayPause,
    skipTrack,
    currentTime,
    duration,
    seek
  } = useContext(PlayerContext);

  const progressBarRef = useRef(null);
  // Use currentTrack.duration as a fallback if the live duration isn't available yet
  const effectiveDuration = duration || currentTrack?.duration || 0;

  const handleProgressClick = (e) => {
    if (!progressBarRef.current || effectiveDuration <= 0) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const seekTime = clickPosition * effectiveDuration;

    seek(seekTime);
  };

  useEffect(() => {
    if (progressBarRef.current) { // Check if ref is mounted
      const progressPercent = effectiveDuration > 0 ? (currentTime / effectiveDuration) * 100 : 0;
      progressBarRef.current.style.setProperty("--progress", `${progressPercent}%`);
    }
  }, [currentTime, effectiveDuration]);

  if (!currentTrack) return null;

  return (
    // The 'player--active' class can be added based on isPlaying if desired for specific active styles
    <div className={`player ${isPlaying ? 'player--active' : ''}`}>
      <div className="player__content">
        {/* Updated class name here */}
        <div className="player__song-info">
          <img
            src={currentTrack.coverImage || fallbackImage}
            alt={`Cover for ${currentTrack.title}`} // More descriptive alt text
            className="player__cover"
            onError={(e) => {
              e.target.src = fallbackImage; // Use imported fallback
              e.target.onerror = null; // Prevent infinite loop if fallback also fails
            }}
          />
          {/* Updated class name here */}
          <div className="player__song-details">
            <h3 className="player__title" title={currentTrack.title}>{currentTrack.title}</h3>
            <p className="player__artist" title={currentTrack.artist?.name || 'Unknown Artist'}>
              {currentTrack.artist?.name || 'Unknown Artist'}
            </p>
          </div>
        </div>

        <div className="player__controls">
          <div className="player__main-controls">
            <button
              className="player__nav-button"
              onClick={() => skipTrack('backward')}
              aria-label="Previous song" // Changed from "track"
            >
              <FontAwesomeIcon icon={faBackwardStep} />
            </button>

            <button
              className="player__play-button"
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {/* Using faPlay and faPause for better visual consistency */}
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size="lg" />
            </button>

            <button
              className="player__nav-button"
              onClick={() => skipTrack('forward')}
              aria-label="Next song" // Changed from "track"
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
              aria-valuenow={effectiveDuration > 0 ? (currentTime / effectiveDuration) * 100 : 0}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Song progress" // Added aria-label
            >
              <div className="player__progress-fill" />
            </div>

            <span className="player__time">
              {formatDuration(effectiveDuration)}
            </span>
          </div>
        </div>
        {/* Example of how you might add other controls like volume - not in original scope but for context */}
        {/* <div className="player__volume-controls">
           Volume slider, mute button etc.
        </div> 
        */}
      </div>
    </div>
  );
};

export default Player;