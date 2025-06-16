import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SongList from "../../../components/songs/SongList";
import { fetchAlbumById, fetchPlaylistById } from "../../../api/api";

const Collection = ({ collectionId, type = "album" }) => {
  const [collection, setCollection] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCollectionData = async () => {
      try {
        setLoading(true);
        
        const collectionData = type === 'album' 
          ? await fetchAlbumById(collectionId)
          : await fetchPlaylistById(collectionId);
        
        setCollection(collectionData);
        
        if (collectionData.songs && collectionData.songs.length > 0) {
          setSongs(collectionData.songs);
        } else {
          console.warn('A coleção não veio com as músicas completas - considere ajustar o endpoint da API');
          setSongs([]);
        }

      } catch (error) {
        console.error(`Error loading ${type} data:`, error);
      } finally {
        setLoading(false);
    } };

    if (collectionId) {
      loadCollectionData();
    }
  }, [collectionId, type]);

  if (loading) {
    return <div className="featured-collection loading">Loading {type}...</div>;
  }

  if (!collection) {
    return <div className="featured-collection error">Failed to load {type}</div>;
  }

  return (
    <div className="featured-collection">
      <div className="featured-collection__header">
        <h2 className="featured-collection__title">
          Featured {type === 'album' ? 'Album' : 'Playlist'}
        </h2>
      </div>
      
      <div className="featured-collection__content">
        <div className="featured-collection__info">
          <div className="collection-cover">
            <img 
              src={collection.coverImage || "/images/fb.jpeg"} 
              alt={collection.title} 
              className="collection-cover__image"
            />
          </div>
          
          <div className="collection-details">
            <h3 className="collection-details__title">{collection.title}</h3>
            
            {type === 'album' && collection.artist && (
              <p className="collection-details__artist">
                {collection.artist.name}
              </p>
            )}
            
            {type === 'playlist' && collection.owner && (
              <p className="collection-details__owner">
                Created by: {collection.owner.username || collection.owner.name}
              </p>
            )}
            
            <div className="collection-stats">
              {type === 'album' && collection.releaseDate && (
                <span className="collection-stats__item">
                  {new Date(collection.releaseDate).getFullYear()}
                </span>
              )}
              
              <span className="collection-stats__item">
                {collection.totalPlays?.toLocaleString() || '0'} plays
              </span>
              
              {collection.genre && collection.genre.length > 0 && (
                <span className="collection-stats__item">
                  {collection.genre[0]}
                </span>
              )}
            </div>
            
            <p className="collection-details__description">
              {collection.description || `Popular ${type} featuring top tracks`}
            </p>
            
            <div className="collection-actions">
              <button className="collection-actions__play">Play</button>
              <button className="collection-actions__follow">
                {type === 'album' ? 'Follow' : 'Save'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="featured-collection__tracks">
          <SongList 
            songs={songs} 
            loading={loading && songs.length === 0}
            showCount={false}
            initialItems={8}
          />
        </div>
      </div>
    </div>
); };

Collection.propTypes = {
  collectionId: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['album', 'playlist'])
};

export default Collection;