import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faEllipsis } from '@fortawesome/free-solid-svg-icons';

import { usePlayer } from '../../hooks/usePlayer';
import fallbackImage from '/images/fb.jpeg';

const SoundWave = () => (
  <div className="sound-wave">
    <div className="sound-wave__bar"></div>
    <div className="sound-wave__bar"></div>
    <div className="sound-wave__bar"></div>
    <div className="sound-wave__bar"></div>
  </div>
);

const Bias = ({ item, type }) => {
  const player = usePlayer();
  const navigate = useNavigate();

  if (!item) return null;

  const isSong = type === 'song';
  const title = item.title || item.name;
  const imageUrl = item.coverImage || item.image || fallbackImage;
  const detailPath = `/${type}/${item._id}`;

  const isCurrentTrack = isSong && player?.currentTrack?._id === item._id;
  const isPlaying = isCurrentTrack && player.isPlaying;

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSong && item.audioUrl) {
      if (isCurrentTrack) {
        player.togglePlayPause();
      } else {
        player.playTrack(item);
      }
    } else {
      navigate(detailPath);
    }
  };

  const getSubtitle = () => {
    if (isSong) return item.artist?.name || "Unknown Artist";
    if (type === 'playlist') return `Playlist by ${item.owner?.username || "Unknown"}`;
    if (type === 'album') return item.artist?.name || "Unknown Artist";
    return "";
  };
  
  return (
    <div className={`bias-card ${isPlaying ? 'is-playing' : ''}`}>
      <Link to={detailPath} className="bias-card__cover">
        <img
          src={imageUrl}
          alt={`Cover for ${title}`}
          onError={(e) => { e.target.src = fallbackImage; e.target.onerror = null; }}
        />
      </Link>
      
      <div className="bias-card__content">
        <div className="bias-card__text">
          <h3 className="bias-card__title">
            {title}
            {isPlaying && <SoundWave />}
          </h3>
          <p className="bias-card__subtitle">{getSubtitle()}</p>
        </div>

        <div className="bias-card__actions">
          <button 
            className="action-btn play" 
            onClick={handlePlayClick} 
            aria-label={isPlaying ? "Pause" : "Play"}
            disabled={isSong && !item.audioUrl}
          >
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </button>

          <button
            className="action-btn menu"
            aria-label="More options"
          >
            <FontAwesomeIcon icon={faEllipsis} />
          </button>

        </div>
      </div>
    </div>
); };

Bias.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    name: PropTypes.string,
    coverImage: PropTypes.string,
    image: PropTypes.string,
    artist: PropTypes.shape({ name: PropTypes.string }),
    owner: PropTypes.shape({ username: PropTypes.string }),
    audioUrl: PropTypes.string,
  }).isRequired,
  type: PropTypes.oneOf(['song', 'playlist', 'album']).isRequired,
};

export default Bias;