import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faEllipsisH,
  faExclamation
} from "@fortawesome/free-solid-svg-icons";

import { usePlayer } from "../../hooks/usePlayer";
import { formatDuration } from "../../utils/duration";

const SongItem = React.memo(({ song, onMenuClick }) => {
  const player = usePlayer();

  if (!song) return null;

  const isCurrent = player?.currentTrack?._id === song._id;
  const progress =
    isCurrent && player?.duration ? (player.currentTime / player.duration) * 100 : 0;
  const hasAudio = !!song.audioUrl;

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!hasAudio) return;

    if (isCurrent) {
      player.togglePlayPause();
    } else {
      player.playTrack(song);
  } };

  const handleMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onMenuClick?.(song._id, e.currentTarget);
  };

  return (
    <div
      className={`song-item ${isCurrent ? "song-item--active" : ""} ${
        !hasAudio ? "song-item--disabled" : ""
      }`}
      aria-current={isCurrent ? "true" : undefined}
    >
      <div className="song-item__number">
        {isCurrent && player?.isPlaying ? (
          <button 
            className="song-item__play-button"
            onClick={handlePlayClick}
            aria-label="Pause"
          >
            <FontAwesomeIcon icon={faPause} />
          </button>
        ) : (
          <button
            className="song-item__play-button"
            onClick={handlePlayClick}
            aria-label="Play"
            disabled={!hasAudio}
          >
            {hasAudio ? (
              <FontAwesomeIcon icon={faPlay} />
            ) : (
              <FontAwesomeIcon icon={faExclamation} />
            )}
          </button>
        )}
      </div>

      <div className="song-item__content">
        <div className="song-item__info">
          <div className="song-item__title-container">
            <p className="song-item__title">
              {song.title}
              {song.isExplicit && (
                <span className="song-item__explicit" aria-label="Explicit">
                  E
                </span>
              )}
            </p>
            <div className="song-item__meta">
              <span className="song-item__artist">
                {song.artist?.name || "unknown artist"}
              </span>
              {song.plays > 0 && (
                <>
                  •
                  <span className="song-item__plays">
                    {song.plays.toLocaleString()} plays
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="song-item__duration">
          {formatDuration((hasAudio && isCurrent && player.duration) ? player.duration : song.duration || 0)}
        </div>

        <button
          className="song-item__menu"
          onClick={handleMenuClick}
          aria-haspopup="true"
          aria-label="More options"
        >
          <FontAwesomeIcon icon={faEllipsisH} />
        </button>

        {isCurrent && (
          <div
            className="song-item__progress-container"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              className="song-item__progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
); });

SongItem.propTypes = {
  song: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
    }).isRequired,
    album: PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string,
    }),
    coverImage: PropTypes.string,
    audioUrl: PropTypes.string,
    isExplicit: PropTypes.bool,
    genre: PropTypes.arrayOf(PropTypes.string),
    plays: PropTypes.number,
    releaseDate: PropTypes.instanceOf(Date),
}), onMenuClick: PropTypes.func, };

export default SongItem;