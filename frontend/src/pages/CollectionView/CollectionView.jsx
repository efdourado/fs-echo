import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';

import { fetchPlaylistById, fetchAlbumById } from '../../api/api';
import { usePlayer } from '../../hooks/usePlayer';

import LoadingSpinner from '../../components/ui/LoadingSpinner';
import SongList from '../../components/songs/SongList';
import fallbackImage from '/images/fb.jpeg';

const CollectionView = ({ type }) => {
  const { id } = useParams();
  const { setSongs, playTrack } = usePlayer();

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCollection = async () => {
      setLoading(true);
      setError('');
      try {
        const fetcher = type === 'playlist' ? fetchPlaylistById : fetchAlbumById;
        const data = await fetcher(id);
        setCollection(data);
      } catch (err) {
        setError(`Could not find or load this ${type}.`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCollection();
  }, [id, type]);

  const handlePlayCollection = () => {
    // Normalize tracks based on type
    const tracks = type === 'playlist'
      ? collection.songs.map(item => item.song).filter(Boolean)
      : collection.songs.filter(Boolean);
      
    if (tracks && tracks.length > 0) {
      setSongs(tracks);
      playTrack(tracks[0]);
    }
  };

  if (loading) {
    return <LoadingSpinner message={`Loading ${type}...`} />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!collection) {
    return <div className="error-message">Collection not found.</div>;
  }

  // Normalize data for rendering
  const displayData = {
    name: collection.name || collection.title,
    description: collection.description || `An album by ${collection.artist?.name}`,
    coverImage: collection.coverImage || fallbackImage,
    ownerName: type === 'playlist' ? `Created by ${collection.owner?.username || 'Unknown'}` : `Album by ${collection.artist?.name}`,
    tracks: type === 'playlist' ? collection.songs.map(item => item.song).filter(Boolean) : collection.songs.filter(Boolean),
    collectionType: type.charAt(0).toUpperCase() + type.slice(1),
  };

  return (
    <div className="collection-page">
      <div className="collection-header">
        <div className="collection-cover-art">
          <img 
            src={displayData.coverImage} 
            alt={`Cover for ${displayData.name}`}
            onError={(e) => { e.target.src = fallbackImage; }}
          />
        </div>
        <div className="collection-details">
          <p className="collection-type-label">{displayData.collectionType}</p>
          <h1 className="collection-name">{displayData.name}</h1>
          <p className="collection-description">{displayData.description}</p>
          <div className="collection-meta">
            <span className="collection-owner">{displayData.ownerName}</span>
            <span className="meta-divider">•</span>
            <span>{displayData.tracks.length} songs</span>
          </div>
        </div>
      </div>

      <div className="collection-actions">
        <button className="play-button-large" onClick={handlePlayCollection}>
          <FontAwesomeIcon icon={faPlayCircle} />
          <span>Play</span>
        </button>
      </div>

      <div className="collection-song-list">
        <SongList songs={displayData.tracks} showHeader={false} displayAll={true} />
      </div>
    </div>
  );
};

CollectionView.propTypes = {
  type: PropTypes.oneOf(['playlist', 'album']).isRequired,
};

export default CollectionView;