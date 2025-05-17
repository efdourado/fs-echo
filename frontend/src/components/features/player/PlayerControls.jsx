import React, { useContext } from "react";
import { PlayerContext } from "../../../context/PlayerContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBackwardStep, 
  faCirclePlay, 
  faForwardStep, 
  faCirclePause 
} from "@fortawesome/free-solid-svg-icons";

const PlayerControls = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlayPause,
    skipTrack 
  } = useContext(PlayerContext);

  if (!currentTrack) return null;

  return (
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
        <FontAwesomeIcon icon={isPlaying ? faCirclePause : faCirclePlay} />
      </button>

      <button 
        className="player__nav-button"
        onClick={() => skipTrack('forward')}
        aria-label="Next track"
      >
        <FontAwesomeIcon icon={faForwardStep} />
      </button>
    </div>
); };

export default PlayerControls;