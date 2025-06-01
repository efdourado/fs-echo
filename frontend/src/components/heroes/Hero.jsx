// frontend/src/components/heroes/Hero.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faFire, faMusic } from '@fortawesome/free-solid-svg-icons'; // Added faFire, faMusic
import { usePlayer } from '../../hooks/usePlayer'; //
import fallbackImage from '/images/fb.jpeg'; //

const Hero = ({
  title,
  subtitle,
  highlight,
  talents = [],
  bgImage,
  topHits = [], // New prop for top hits
  featuredPlaylist = null, // New prop for featured playlist
}) => {
  const player = usePlayer(); //
  const navigate = useNavigate(); //

  const highlightLink = highlight?._id ? `/${highlight.type}/${highlight._id}` : '#'; //

  const handlePlayHighlight = (e) => { //
    e.preventDefault(); //
    e.stopPropagation(); //
    if (highlight.type === 'song' && highlight.audioUrl) { //
      player.playTrack(highlight); //
    } else {
      navigate(highlightLink); //
    }
  };
  
  const handleCtaClick = () => { //
    navigate(highlightLink); //
  };

  const heroStyle = { //
    backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.4)), url(${bgImage || fallbackImage})`, //
  };

  return (
    <div className="music-hero" style={heroStyle}>
      <div className="hero-content">
        {/* Left side: Talents list */}
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
                {(highlight?.type || "Featured").toUpperCase()}
              </span>
              <h3>{highlight.title || 'Featured Item'}</h3>
              {highlight.artist && (
                <p className="artist">{highlight.artist}</p>
              )}
              <div className="highlight-meta">
                <span className="plays">
                  {highlight.plays ? `${highlight.plays.toLocaleString()} plays` : ""}
                </span>
                {highlight.isTrending && (
                  <span className="trending-badge">TRENDING</span>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Right side: Featured and Trending Now */}
        <aside className="hero-feature-section">
          {/* Top Hits - Main Feature */}
          <div className="feature-card top-hits-card">
            <h4 className="feature-title"><FontAwesomeIcon icon={faFire} /> Top Hits</h4>
            {topHits.length > 0 ? (
              <div className="top-hit-list">
                {topHits.map((song, index) => (
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
              <p>No top hits available.</p>
            )}
            <button type="button" className="cta-button" onClick={() => navigate('/songs')}>
              View All Songs
            </button>
          </div>

          {/* Featured Playlist/Collection - Secondary Feature */}
          {featuredPlaylist && (
            <div className="feature-card featured-playlist-card">
              <h4 className="feature-title"><FontAwesomeIcon icon={faMusic} /> Featured Playlist</h4>
              <Link to={featuredPlaylist.link} className="playlist-link">
                <img 
                  src={featuredPlaylist.coverImage || fallbackImage} 
                  alt={featuredPlaylist.title} 
                  onError={(e) => { e.target.src = fallbackImage; }}
                />
                <div className="playlist-info">
                  <span className="playlist-title">{featuredPlaylist.title}</span>
                  <p className="playlist-description">{featuredPlaylist.description}</p>
                </div>
              </Link>
              <button type="button" className="cta-button secondary-cta" onClick={() => navigate(featuredPlaylist.link)}>
                Explore Playlist
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

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
    trendingNow: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        artist: PropTypes.string,
      })
    ),
  }).isRequired,
  talents: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string,
    })
  ),
  topHits: PropTypes.arrayOf( // New propType
    PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string,
      artist: PropTypes.shape({
        name: PropTypes.string,
      }),
      coverImage: PropTypes.string,
      audioUrl: PropTypes.string,
    })
  ),
  featuredPlaylist: PropTypes.shape({ // New propType
    title: PropTypes.string,
    description: PropTypes.string,
    coverImage: PropTypes.string,
    link: PropTypes.string,
  }),
};

export default Hero;