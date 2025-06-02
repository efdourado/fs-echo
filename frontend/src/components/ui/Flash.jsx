import React from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faMusic, faList } from '@fortawesome/free-solid-svg-icons';
import { usePlayer } from '../../hooks/usePlayer';
import fallbackImage from '/images/fb.jpeg';
import { formatDuration } from '../../utils/duration'; // Importar a função de formatação de duração

const Flash = ({ item, type, isEditorPick = false }) => {
  const player = usePlayer();
  const navigate = useNavigate();

  if (!item) return null;

  const isSong = type === 'song';
  const isPlaylist = type === 'playlist';

  const title = item.title || item.name;
  const imageUrl = item.coverImage || item.image || fallbackImage;
  const detailPath = `/${type}/${item._id}`;
  const isCurrentPlaying = isSong && player?.currentTrack?._id === item._id;

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSong && item.audioUrl) {
      if (isCurrentPlaying) {
        player.togglePlayPause();
      } else {
        player.playTrack(item);
      }
    } else if (isPlaylist) {
      // For playlist, navigate to the playlist page
      navigate(detailPath);
    }
  };

  const renderDetails = () => {
    if (isSong) {
      const artistName = item.artist?.name || "Unknown Artist";
      const songDuration = item.duration || player.duration || 0; // Use live duration if playing
      const currentProgress = isCurrentPlaying && player.duration ? (player.currentTime / player.duration) * 100 : 0;

      return (
        <div className="flash__song-details">
          <span className="flash__subtitle">{artistName}</span>
          <div className="flash__song-meta">
            {item.isExplicit && <span className="flash__explicit">E</span>}
            {item.genre && item.genre.length > 0 && <span>{item.genre[0]}</span>}
            {item.plays > 0 && <span>{item.plays.toLocaleString()} plays</span>}
            {songDuration > 0 && <span>{formatDuration(songDuration)}</span>}
          </div>
           {isCurrentPlaying && (
            <div className="flash__progress-container">
              <div className="flash__progress-bar" style={{ width: `${currentProgress}%` }}></div>
            </div>
          )}
        </div>
      );
    } else if (isPlaylist) {
      const ownerName = item.owner?.username || item.owner?.name || "Unknown";
      return (
        <div className="flash__playlist-details">
          <span className="flash__subtitle">by {ownerName}</span>
          <span className="flash__meta">{item.songs?.length || 0} songs</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`flash-card flash-card--${type} ${isCurrentPlaying ? 'flash-card--playing' : ''}`}>
      <Link to={detailPath} className="flash-card__link">
        <div className="flash-card__cover">
          <img
            src={imageUrl}
            alt={`Cover for ${title}`}
            onError={(e) => { e.target.src = fallbackImage; e.target.onerror = null; }}
          />
          {isEditorPick && (
            <span className="flash-card__badge">Editor's Pick</span>
          )}
        </div>
        <div className="flash-card__info">
          <h3 className="flash-card__title">{title}</h3>
          {renderDetails()}
        </div>
        <button
          className="flash-card__play-button"
          onClick={handlePlayClick}
          aria-label={isCurrentPlaying ? "Pause" : "Play"}
          disabled={isSong && !item.audioUrl} // Disable play button for songs without audio
        >
          {isSong && isCurrentPlaying ? (
            <FontAwesomeIcon icon={faPause} />
          ) : (
            <FontAwesomeIcon icon={faPlay} />
          )}
        </button>
      </Link>
    </div>
  );
};

Flash.propTypes = {
  item: PropTypes.oneOfType([
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string,
      name: PropTypes.string, // For playlists
      coverImage: PropTypes.string,
      image: PropTypes.string, // For artists (if we ever use it for artists)
      artist: PropTypes.shape({ name: PropTypes.string }), // For songs/albums
      audioUrl: PropTypes.string, // For songs
      duration: PropTypes.number, // For songs
      isExplicit: PropTypes.bool, // For songs
      genre: PropTypes.arrayOf(PropTypes.string), // For songs
      plays: PropTypes.number, // For songs
    }),
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string,
      coverImage: PropTypes.string,
      owner: PropTypes.shape({ username: PropTypes.string, name: PropTypes.string }),
      songs: PropTypes.array, // For playlists
    }),
  ]).isRequired,
  type: PropTypes.oneOf(['song', 'playlist', 'album']).isRequired, // Added album for future use, though currently song/playlist are primary
  isEditorPick: PropTypes.bool,
};

export default Flash;