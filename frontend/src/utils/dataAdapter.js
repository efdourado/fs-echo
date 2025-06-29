// frontend/src/pages/CollectionPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckDouble, faPlay, faPause, faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';

// API and Adapter
import * as api from '../../api/api';
import { normalizeDataForPage } from '../utils/dataAdapter';

// Hooks and Contexts
import { usePlayer } from '../hooks/usePlayer';

// Components
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SongList from '../components/songs/SongList';
import Card from '../components/ui/Card';
import fallbackImage from '/fb.jpeg';

// Mapping of types to their API fetch functions
const fetchers = {
  artist: api.fetchArtistById,
  album: api.fetchAlbumById,
  playlist: api.fetchPlaylistById,
  song: api.fetchSongById,
};

// frontend/src/utils/dataAdapter.js

// A helper function to format large numbers
const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num?.toString() || '0';
};

// The main adapter function
export const normalizeDataForPage = (type, data) => {
  if (!data) return null;

  switch (type) {
    case 'artist':
      return {
        // Main Info
        pageType: 'Artist',
        title: data.name,
        description: data.description,
        
        // Images
        primaryImage: data.image,
        backgroundImage: data.banner || data.image,
        
        // Content for the right column
        mainContent: {
          title: 'Popular Songs',
          type: 'songs',
          items: data.topSongs || [],
        },
        subContent: {
          title: 'Albums',
          type: 'albums',
          items: data.albums || [],
        },

        // Stats for the left column
        stats: [
          { label: 'Followers', value: formatNumber(data.followers) },
          { label: 'Monthly Listeners', value: formatNumber(data.monthlyListeners) },
        ],
        isVerified: data.verified,
      };

    case 'album':
      return {
        pageType: data.type ? data.type.charAt(0).toUpperCase() + data.type.slice(1) : 'Album',
        title: data.title,
        description: `Album by ${data.artist?.name || 'Unknown Artist'}`,
        primaryImage: data.coverImage,
        backgroundImage: data.coverImage,
        
        mainContent: {
          title: 'Tracklist',
          type: 'songs',
          items: data.songs || [],
        },
        // Albums don't have secondary content in this view
        subContent: null,

        stats: [
          { label: 'Songs', value: data.songs?.length || 0 },
          { label: 'Released', value: new Date(data.releaseDate).getFullYear() },
        ],
        isVerified: data.artist?.verified,
      };

    case 'playlist':
      return {
        pageType: 'Playlist',
        title: data.name,
        description: data.description || `A playlist by ${data.owner?.username || 'Unknown'}`,
        primaryImage: data.coverImage,
        backgroundImage: data.coverImage,
        
        mainContent: {
          title: 'Tracklist',
          type: 'songs',
          // Note: Playlist songs are nested under item.song
          items: data.songs ? data.songs.map(item => item.song).filter(Boolean) : [],
        },
        subContent: null,

        stats: [
          { label: 'Songs', value: data.songs?.length || 0 },
          { label: 'Created by', value: data.owner?.username || 'Anonymous' },
        ],
        isVerified: false, // Playlists aren't "verified" in the same way as artists
      };

    // We will add a case for 'song' here in the future.

    default:
      return null;
  }
};


const CollectionPage = ({ type }) => {
  const { id } = useParams();
  const [normalizedData, setNormalizedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // States for interactive elements
  const [isFollowing, setIsFollowing] = useState(false);
  const { startPlayback, playContext, isPlaying, togglePlayPause } = usePlayer();

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
      }
    };

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
    if (isMainContentPlaying) {
      togglePlayPause();
    } else if (mainContent?.items?.length > 0) {
      startPlayback(mainContent.items, { type: `${type}-main`, id });
    }
  };

  return (
    <div className="entity-page">
      <div className="entity-page__background" style={{ backgroundImage: `url(${backgroundImage || fallbackImage})` }} />
      <div className="entity-page__overlay" />
      
      <div className="entity-page__content">
        {/* Left Column */}
        <aside className="entity-page__left-column">
          <div className="entity-page__metadata">
            <div className="entity-page__image-container">
              <img src={primaryImage || fallbackImage} alt={title} className="entity-page__image" />
            </div>
            {isVerified && (
              <p className="entity-page__verified-badge">
                <FontAwesomeIcon icon={faCheckDouble} /> Verified {pageType}
              </p>
            )}
            <h1 className="entity-page__title">{title}</h1>
            {stats && (
              <div className="entity-page__stats">
                {stats.map(stat => `${stat.value} ${stat.label}`).join(' • ')}
              </div>
            )}
            <p className="entity-page__description">{description}</p>

            <div className="entity-page__actions">
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

        {/* Right Column */}
        <main className="entity-page__right-column">
          {mainContent && (
            <section className="entity-content-section">
              <h2 className="entity-content-section__title">{mainContent.title}</h2>
              <SongList songs={mainContent.items} showHeader={false} displayAll={true} showNumber={true} />
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
    </div>
  );
};

CollectionPage.propTypes = {
  type: PropTypes.oneOf(['artist', 'album', 'playlist', 'song']).isRequired,
};

export default CollectionPage;