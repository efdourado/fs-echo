import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faFire, faList, faTags } from '@fortawesome/free-solid-svg-icons';
import { usePlayer } from '../../hooks/usePlayer';
import fallbackImage from '/images/fb.jpeg';

const Hero = ({
  title,
  subtitle,
  highlight,
  talents = [],
  bgImage,
  allSongs = [],
  allArtists = [],
  allAlbums = [],
  allPlaylists = [],
}) => {
  const player = usePlayer();
  const navigate = useNavigate();
  const [activeFeatureTab, setActiveFeatureTab] = useState('songs');

  const highlightLink = highlight?._id ? `/${highlight.type}/${highlight._id}` : '#';

  const handlePlayHighlight = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (highlight.type === 'song' && highlight.audioUrl) {
      player.playTrack(highlight);
    } else {
      navigate(highlightLink);
  } };
  
  const heroStyle = {
    backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.55)), url(${bgImage})`,
  };

  const getUniqueGenres = (data) => {
    const genres = new Set();
    data.forEach(item => {
      if (item.genre) {
        item.genre.forEach(g => genres.add(g));
    } });
    return Array.from(genres);
  };

  const renderFeatureContent = () => {
    switch (activeFeatureTab) {
      case 'songs':
        const topSongs = allSongs.slice(0, 2);
        return (
          <div className="feature-card top-songs-card">
            <h4 className="feature-title"><FontAwesomeIcon icon={faFire} />
              Songs
            </h4>
            <p className="feature-description">
                Here, we share more than just songs.
                From raw demos to final versions, Echo reveals the creative process, inspiration, and memories tied to each release.
                It's a growing archive. Whether you're here to vibe, learn, or connect — welcome to the echo of our work
            </p>
            
            {topSongs.length > 0 ? (
              <div className="top-hit-list">
                {topSongs.map((song, index) => (
                  <div key={song._id || index} className="top-hit-item" onClick={() => player.playTrack(song)}>
                    <img 
                      src={song.coverImage || fallbackImage} 
                      alt={song.title} 
                      onError={(e) => { e.target.src = fallbackImage; }}
                    />
                    <div className="top-hit-info">
                      <span className="top-hit-title">{song.title}</span>
                      <span className="top-hit-artist">{song.artist?.name || "Unknown Artist"}</span>
                    </div>
                    <button className="play-small-btn" aria-label={`Play ${song.title}`}>
                      <FontAwesomeIcon icon={faPlay} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No top songs available.</p>
            )}
            <button type="button" className="cta-button" onClick={() => navigate('/songs')}>
              View All Songs
            </button>
          </div>
        );
      case 'playlists':
        const popularPlaylists = allPlaylists.slice(0, 3);
        return (
          <div className="feature-card featured-playlist-card">
            <h4 className="feature-title"><FontAwesomeIcon icon={faList} /> Playlists</h4>
            {popularPlaylists.length > 0 ? (
              <div className="playlist-list">
                {popularPlaylists.map((playlist, index) => (
                  <Link to={`/playlist/${playlist._id}`} key={playlist._id || index} className="playlist-link-item">
                    <img 
                      src={playlist.coverImage || fallbackImage} 
                      alt={playlist.name} 
                      onError={(e) => { e.target.src = fallbackImage; }}
                    />
                    <div className="playlist-info">
                      <span className="playlist-title">{playlist.name}</span>
                      <span className="playlist-owner">by {playlist.owner?.username || 'Unknown'}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p>No popular playlists available.</p>
            )}
            <button type="button" className="cta-button secondary-cta" onClick={() => navigate('/playlists')}>
              Explore All Playlists
            </button>
          </div>
        );
      case 'genres':
        const genres = getUniqueGenres(allSongs);
        return (
          <div className="feature-card explore-genres-card">
            <h4 className="feature-title"><FontAwesomeIcon icon={faTags} /> Genres</h4>
            {genres.length > 0 ? (
              <div className="genre-list">
                {genres.slice(0, 5).map((genre, index) => (
                  <span key={index} className="genre-tag">
                    {genre}
                  </span>
                ))}
              </div>
            ) : (
              <p>No genres available.</p>
            )}
            <button type="button" className="cta-button secondary-cta">
              Discover More Genres
            </button>
          </div>
        );
      default:
        return null;
  } };

  return (
    <div className="music-hero" style={heroStyle}>
      <div className="hero-content">
        {/* left side */}
        <aside className="hero-talents">
          <h4 className="talents-title">Talents</h4>
          <ul className="talents-list">
            {talents.map((talent) => (
              <li key={talent._id} className="talent-item">
                <Link to={`/artist/${talent._id}`}>
                  <img
                    src={talent.image || fallbackImage}
                    alt={talent.name}
                    title={talent.name}
                    onError={(e) => { e.target.src = fallbackImage; }}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className="hero-main">
          <div className="text-content">
            <h1 className="title">{title}</h1>
            <p className="subtitle">{subtitle}</p>
          </div>

          <div className="music-highlight">
            <Link to={highlightLink} className="highlight-link">
              <div className="cover-art" onClick={handlePlayHighlight}>
                <img
                  src={highlight.coverImage || fallbackImage}
                  alt={highlight.title || 'Highlight cover'}
                  onError={(e) => { e.target.src = fallbackImage; }}
                />
                <div className="play-icon-overlay">
                  <FontAwesomeIcon icon={faPlay} />
                </div>
              </div>
            </Link>
            <div className="highlight-info">
              <span className="highlight-label">
                #1
                {(highlight?.type).toUpperCase()}
              </span>
              <h3>{highlight.title}</h3>
              {highlight.artist && (
                <p className="artist">{highlight.artist}</p>
              )}
              <div className="highlight-meta">
                {highlight.plays ? (
                  <span className="plays">
                    {highlight.plays.toLocaleString()} plays
                  </span>
                ) : null}
                {highlight.releaseDate && (
                  <span className="release-year">
                    {new Date(highlight.releaseDate).getFullYear()}
                  </span>
                )}
                {highlight.genre && highlight.genre.length > 0 && (
                  <span className="genre-display">
                    {highlight.genre.join(', ')}
                  </span>
                )}
                {highlight.isTrending && (
                  <span className="trending-badge">TRENDING</span>
                )}
              </div>
            </div>
          </div>

          <div className="hero-tabs-nav">
            <button 
              className={`hero-tab-button ${activeFeatureTab === 'songs' ? 'active' : ''}`}
              onClick={() => setActiveFeatureTab('songs')}
            >
              Songs
            </button>
            <button 
              className={`hero-tab-button ${activeFeatureTab === 'playlists' ? 'active' : ''}`}
              onClick={() => setActiveFeatureTab('playlists')}
            >
              Playlists
            </button>
            <button 
              className={`hero-tab-button ${activeFeatureTab === 'genres' ? 'active' : ''}`}
              onClick={() => setActiveFeatureTab('genres')}
            >
              Genres
            </button>
          </div>

        </main>

        {/* right side */}
        <aside className="hero-feature-section">
          {renderFeatureContent()}
        </aside>
      </div>
    </div>
); };

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  bgImage: PropTypes.string,
  highlight: PropTypes.shape({
    _id: PropTypes.string,
    type: PropTypes.oneOf(['song', 'album', 'info']).isRequired,
    title: PropTypes.string,
    coverImage: PropTypes.string,
    audioUrl: PropTypes.string,
    artist: PropTypes.string,
    plays: PropTypes.number,
    isTrending: PropTypes.bool,
    releaseDate: PropTypes.string,
    genre: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  talents: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string,
  }) ),
  allSongs: PropTypes.array,
  allArtists: PropTypes.array,
  allAlbums: PropTypes.array,
  allPlaylists: PropTypes.array,
};

export default Hero;