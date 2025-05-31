import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { usePlayer } from '../../hooks/usePlayer';
import fallbackImage from '/images/fb.jpeg';

/**
 * A flexible Hero component that can showcase different types of content.
 * To create different hero "models" (e.g., for events), you could add a `variant` prop.
 * Example: <Hero variant="event" eventData={...} />
 * And then conditionally render the structure based on the variant.
 */
const Hero = ({
  title,
  subtitle,
  highlight,
  talents = [], // New prop for artist talents
  bgImage
}) => {
  const player = usePlayer();
  const navigate = useNavigate();

  // Determine the link for the highlighted item
  const highlightLink = highlight?._id ? `/${highlight.type}/${highlight._id}` : '#';

  const handlePlayHighlight = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // We only play if it's a song with a valid audio URL
    if (highlight.type === 'song' && highlight.audioUrl) {
      player.playTrack(highlight);
    } else {
      // If it's an album or something else, navigate to its page
      navigate(highlightLink);
    }
  };
  
  const handleCtaClick = () => {
    // The main CTA button will navigate to the highlight's page
    navigate(highlightLink);
  };

  const heroStyle = {
    backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.4)), url(${bgImage || fallbackImage})`,
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

        {/* Center: Main content and highlight */}
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

        {/* Right side: Trending list */}
        <aside className="now-playing">
          <h4>{highlight?.trendingNow?.length > 0 ? "Trending Now" : "Top Hits"}</h4>
          <div className="trending-list">
            {Array.isArray(highlight?.trendingNow) && highlight.trendingNow.length > 0 ? (
              highlight.trendingNow.map((item, index) => (
                <div key={index} className="trending-item">
                  <span className="position">{index + 1}</span>
                  <div className="track-info">
                    <span className="track-name" title={item.name}>{item.name || 'Unknown Track'}</span>
                    <span className="artist-name" title={item.artist}>{item.artist || 'Unknown Artist'}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>No trending items to show.</p>
            )}
            <button type="button" className="cta-button" onClick={handleCtaClick}>
                Explore More
            </button>
          </div>
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
};

export default Hero;