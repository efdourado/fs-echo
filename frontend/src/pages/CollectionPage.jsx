// frontend/src/pages/CollectionPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckDouble, faPlay, faPause, faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';

import * as api from '../api/api';
import { normalizeDataForPage } from '../utils/syncer';

import { usePlayer } from '../hooks/usePlayer';

import LoadingSpinner from '../components/ui/LoadingSpinner';
import SongList from '../components/songs/SongList';
import Card from '../components/ui/Card';
import fallbackImage from '/fb.jpeg';

const fetchers = {
  artist: api.fetchArtistById,
  album: api.fetchAlbumById,
  playlist: api.fetchPlaylistById,
  song: api.fetchSongById,
};

const CollectionPage = ({ type }) => {
  const { id } = useParams();
  const [normalizedData, setNormalizedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isFollowing, setIsFollowing] = useState(false);
  const { startPlayback, playContext, isPlaying, togglePlayPause, playTrack } = usePlayer();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const fetcher = fetchers[type];
        if (!fetcher) throw new Error(`Invalid page type: ${type}`);
        
        const rawData = await fetcher(id);
        const data = normalizeDataForPage(type, rawData);
        if (!data) throw new Error('Could not load data for this page.');

        setNormalizedData(data);
      } catch (err) {
        setError(err.message);
        console.error(`Failed to load ${type} data:`, err);
      } finally {
        setLoading(false);
    } };

    if (id && type) {
      loadData();
    }
  }, [id, type]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <div className="error-message">{error}</div>;
  if (!normalizedData) return null;

  const {
    pageType, title, description, primaryImage, backgroundImage, mainContent, subContent, stats, isVerified
  } = normalizedData;

  const isMainContentPlaying = playContext?.type === `${type}-main` && playContext?.id === id;

  const handlePlayMainContent = () => {
    if (type === 'song') {
      if (isPlaying && playContext?.id === id) {
        togglePlayPause();
      } else {
        api.fetchSongById(id).then(songData => playTrack(songData));
      }
    } else {
      if (isMainContentPlaying) {
        togglePlayPause();
      } else if (mainContent?.items?.length > 0) {
        startPlayback(mainContent.items, { type: `${type}-main`, id });
  } } };

  return (
    <div className="collection-page">
      <aside className="collection-page__left-column" style={{ backgroundImage: `url(${backgroundImage || fallbackImage})` }}>
        <div className="collection-page__metadata">
          <div className="collection-page__image-container">
            <img src={primaryImage || fallbackImage} alt={title} className="collection-page__image" />
          </div>
          {isVerified && (
            <p className="collection-page__verified-badge">
              <FontAwesomeIcon icon={faCheckDouble} /> Verified {pageType}
            </p>
          )}
          <h1 className="collection-page__title">{title}</h1>
          {stats && (
            <div className="collection-page__stats">
              {stats.map(stat => `${stat.value} ${stat.label}`).join(' • ')}
            </div>
          )}
          <p className="collection-page__description">{description}</p>

          <div className="collection-page__actions">
            <button className="action-button primary" onClick={handlePlayMainContent}>
              <FontAwesomeIcon icon={isMainContentPlaying && isPlaying ? faPause : faPlay} />
              <span>{isMainContentPlaying && isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button className="action-button secondary" onClick={() => setIsFollowing(!isFollowing)}>
              <FontAwesomeIcon icon={isFollowing ? faSolidHeart : faRegularHeart} />
              <span>{isFollowing ? 'Following' : 'Follow'}</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="collection-page__right-column">
        {mainContent && mainContent.type === 'songs' && (
          <section className="entity-content-section">
            <h2 className="entity-content-section__title">{mainContent.title}</h2>
            <SongList songs={mainContent.items} showHeader={false} displayAll={true} showNumber={true} />
          </section>
        )}

        {mainContent && mainContent.type === 'lyrics' && (
          <section className="entity-content-section">
            <h2 className="entity-content-section__title">{mainContent.title}</h2>
            <pre className="lyrics-text">{mainContent.items}</pre>
          </section>
        )}
        
        {subContent && subContent.type === 'albums' && (
           <section className="entity-content-section">
              <h2 className="entity-content-section__title">{subContent.title}</h2>
              <div className="albums-grid">
                  {subContent.items.map(album => (
                      <Card key={album._id} item={album} type="album" />
                  ))}
              </div>
          </section>
        )}
      </main>
    </div>
  );
};

CollectionPage.propTypes = {
  type: PropTypes.oneOf(['artist', 'album', 'playlist', 'song']).isRequired,
};

export default CollectionPage;