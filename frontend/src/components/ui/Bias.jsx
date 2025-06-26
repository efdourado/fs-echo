import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faEllipsis, faSpinner } from '@fortawesome/free-solid-svg-icons';

import { fetchAlbumById, fetchPlaylistById } from '../../api/api';

import { useSongMenu } from "../../context/SongMenuContext";

import { usePlayer } from '../../hooks/usePlayer';

import SoundWave from './SoundWave';

import fallbackImage from '/images/fb.jpeg';

const Bias = ({ item, type }) => {
  const player = usePlayer();
  const { openMenu } = useSongMenu();
  
  
  const [isLoading, setIsLoading] = useState(false);

  if (!item) return null;

  const isSong = type === 'song';
  const title = item.title || item.name;
  const imageUrl = item.coverImage || item.image || fallbackImage;
  const detailPath = `/${type}/${item._id}`;

  const getIsPlaying = () => {
    if (!player.isPlaying) return false;
    if (isSong) return player.currentTrack?._id === item._id;
    if (type === 'playlist' || type === 'album') {
      return player.playContext?.type === type && player.playContext?.id === item._id;
    }
    return false;
  };

  const isPlaying = getIsPlaying();

  const handlePlayClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPlaying) {
      player.togglePlayPause();
      return;
    }

    if (isSong && item.audioUrl) {
      player.playTrack(item);
      return;
    }

    if (type === 'playlist' || type === 'album') {
      setIsLoading(true);
      try {
        const fetcher = type === 'playlist' ? fetchPlaylistById : fetchAlbumById;
        const collectionData = await fetcher(item._id);
        
        const tracks = (
            type === 'playlist' 
            ? collectionData.songs.map(i => i.song) 
            : collectionData.songs
        ).filter(Boolean);

        if (tracks.length > 0) {
          player.startPlayback(tracks, { type, id: item._id });
        }
      } catch (err) {
        console.error(`Failed to fetch ${type} for playback`, err);
      } finally {
        setIsLoading(false);
  } } };

  const getSubtitle = () => {
    if (isSong) return item.artist?.name || "Unknown Artist";
    if (type === 'playlist') return `Playlist by ${item.owner?.username || "Unknown"}`;
    if (type === 'album') return item.artist?.name || "Unknown Artist";
    return "";
  };

  const handleMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSong) {
      openMenu(item);
  } };
  
  return (
    <Link to={detailPath} className="bias-card-link-wrapper">
      <div className={`bias-card ${isPlaying ? 'is-playing' : ''}`}>
        <div className="bias-card__cover">
          <img
            src={imageUrl}
            alt={`Cover for ${title}`}
            onError={(e) => { e.target.src = fallbackImage; e.target.onerror = null; }}
          />
        </div>
        
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
              disabled={isLoading || (isSong && !item.audioUrl)}
            >
              {isLoading 
                ? <FontAwesomeIcon icon={faSpinner} spin /> 
                : <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
              }
            </button>

            <button
              className="action-btn menu"
              onClick={handleMenuClick}
              aria-label="More options"
            >
              <FontAwesomeIcon icon={faEllipsis} />
            </button>

          </div>
        </div>
      </div>
    </Link>
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