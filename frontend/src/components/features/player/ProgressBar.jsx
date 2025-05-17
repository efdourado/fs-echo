import React, { useContext, useRef, useEffect } from "react";
import { PlayerContext } from "../../../context/PlayerContext";
import { formatTime, timeInSeconds } from "../../../helpers/time";

const ProgressBar = () => {
  const { currentTrack, currentTime, duration, seek } = useContext(PlayerContext);
  const progressBar = useRef(null);
  const durationInSeconds = duration || (currentTrack?.duration ? timeInSeconds(currentTrack.duration) : 0);

  const handleProgressClick = (e) => {
    if (!progressBar.current || durationInSeconds <= 0) return;
    const rect = progressBar.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    seek(pos * durationInSeconds);
  };

  useEffect(() => {
    if (!progressBar.current || durationInSeconds <= 0) return;
    const progress = (currentTime / durationInSeconds) * 100;
    progressBar.current.style.setProperty("--progress", `${progress}%`);
  }, [currentTime, durationInSeconds]);

  if (!currentTrack) return null;

  return (
    <div className="player__progress-container">
      <span className="player__time">{formatTime(currentTime)}</span>
      <div
        ref={progressBar}
        className="player__progress-bar"
        onClick={handleProgressClick}
        role="progressbar"
        aria-valuenow={(currentTime / durationInSeconds) * 100}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div className="player__progress-fill"></div>
      </div>
      <span className="player__time">{formatTime(durationInSeconds)}</span>
    </div>
); };

export default ProgressBar;