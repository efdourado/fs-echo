import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';

import { fetchAlbumById, fetchPlaylistById } from "../../../api/api";
import SongList from "../../../components/songs/SongList";
// import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const Collection = ({ collectionId, type = "album" }) => {
  const [collection, setCollection] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const loadCollectionData = async () => {
      try {
        setLoading(true);
        const fetcher = type === 'album' ? fetchAlbumById : fetchPlaylistById;
        const collectionData = await fetcher(collectionId);
        
        setCollection(collectionData);
        setSongs(collectionData.songs || []);
      } catch (error) {
        console.error(`Error loading ${type} data:`, error);
      } finally {
        setLoading(false);
      }
    };

    if (collectionId) {
      loadCollectionData();
    }
  }, [collectionId, type]);

  if (loading) return <div className="collection-view loading">Loading...</div>;
  if (!collection) return <div className="collection-view error">Failed to load collection.</div>;

  const handlePlayCollection = () => {
    console.log("Playing collection:", collection.title);
  };

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const ownerName = type === 'playlist' 
    ? (collection.owner?.username || collection.owner?.name) 
    : collection.artist?.name;

  return (
    <div className="collection-view">
      <h2 className="collection-view__main-title">
        Featured {type === 'album' ? 'Album' : 'Playlist'}
      </h2>
      
      <div className="collection-view__content">
        {/* Left Panel for Info */}
        <div className="collection-view__info-panel">
          <div className="collection-view__cover-art">
            <img 
              src={collection.coverImage || "/images/fb.jpeg"} 
              alt={collection.title}
            />
          </div>
          <div className="collection-view__details">
            <h1 className="collection-view__title">{collection.title}</h1>
            <p className="collection-view__owner">By {ownerName}</p>
            <div className="collection-view__meta">
              {type === 'album' && collection.releaseDate && (
                <span>{new Date(collection.releaseDate).getFullYear()}</span>
              )}
              {songs.length > 0 && <span className="meta-divider">•</span>}
              {songs.length > 0 && <span>{songs.length} songs</span>}
            </div>
            <p className="collection-view__description">
              {collection.description}
            </p>
          </div>
          <div className="collection-view__actions">
            <button className="action-button primary" onClick={handlePlayCollection}>
              <FontAwesomeIcon icon={faPlay} />
              <span>Play</span>
            </button>
            <button className={`action-button secondary ${isFollowing ? 'following' : ''}`} onClick={toggleFollow}>
              <FontAwesomeIcon icon={isFollowing ? faHeart : faRegularHeart} />
              <span>{isFollowing ? 'Following' : (type === 'album' ? 'Follow' : 'Save')}</span>
            </button>
          </div>
        </div>

        {/* Right Panel for Tracks */}
        <div className="collection-view__tracks-panel">
          <SongList 
            songs={songs} 
            showHeader={false}
            initialItems={10}
          />
        </div>
      </div>
    </div>
  );
};

Collection.propTypes = {
  collectionId: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['album', 'playlist'])
};

export default Collection;