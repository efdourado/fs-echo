import React from 'react';
import PropTypes from 'prop-types';
import fallbackImage from '/fb.png';

const Hero = ({
  title,
  subtitle,
  highlight,
  ctaText,
  bgImage
}) => {
  const heroStyle = {
    backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.3)), url(${bgImage || fallbackImage})`,
  };

  return (
    <div
      className="music-hero"
      style={heroStyle}
    >
      <div className="hero-content">
        <div className="text-content">
          <h1 className="title">{title}</h1>
          <p className="subtitle">{subtitle}</p>

          <div className="music-highlight">
            <div className="cover-art">
              <img
                src={highlight.coverImage || fallbackImage}
                alt={highlight.title || 'Highlight cover'}
                onError={(e) => {
                  e.target.src = fallbackImage;
                  e.target.onerror = null;
                }}
              />
            </div>
            <div className="highlight-info">
              <span className="highlight-label">
                {(highlight?.type || "Info").toUpperCase()}
              </span>
              <h3>{highlight.title || 'Featured Item'}</h3>

              {highlight.type === 'song' && highlight.artist && (
                <p className="artist">{highlight.artist}</p>
              )}

              {highlight.type === 'album' && (
                <div className="album-stats">
                  {highlight.releaseYear && <span>{highlight.releaseYear}</span>}
                  {highlight.releaseYear && highlight.trackCount > 0 && <span>•</span>}
                  {highlight.trackCount > 0 && <span>{highlight.trackCount} tracks</span>}
                </div>
              )}

              <div className="highlight-meta">
                <span className="plays">
                  {highlight?.plays ? `${highlight.plays.toLocaleString()} plays` : "0 plays"}
                </span>
                {highlight.isTrending && (
                  <span className="trending-badge">TRENDING</span>
                )}
              </div>
            </div>
          </div>

          <button type="button" className="cta-button">{ctaText}</button>
        </div>

        <div className="now-playing">
          <h4>{highlight?.trendingNow?.length > 0 ? "Now Blowing Up" : "Trending"}</h4>
          <div className="trending-list">
            {Array.isArray(highlight?.trendingNow) && highlight.trendingNow.length > 0 ? (
              highlight.trendingNow.map((item, index) => (
                <div key={index} className="trending-item">
                  <span className="position">{index + 1}</span>
                  <div className="track-info">
                    <span className="track-name" title={item.name}>{item.name || 'Unknown Track'}</span>
                    <span className="artist-name" title={item.artist}>{item.artist || 'Unknown Artist'}</span>
                  </div>
                  <span className="play-count">{item.plays?.toLocaleString() || 0}</span>
                </div>
              ))
            ) : (
              <p>No trending items at the moment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
); };

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  ctaText: PropTypes.string.isRequired,
  bgImage: PropTypes.string,
  highlight: PropTypes.shape({
    type: PropTypes.oneOf(['song', 'album', 'info']),
    title: PropTypes.string,
    coverImage: PropTypes.string,
    artist: PropTypes.string,
    releaseYear: PropTypes.string,
    trackCount: PropTypes.number,
    plays: PropTypes.number,
    isTrending: PropTypes.bool,
    trendingNow: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        artist: PropTypes.string,
        plays: PropTypes.number
}) ) }).isRequired };

Hero.defaultProps = {
  bgImage: '/fb.png',
  highlight: {
    type: 'info',
    title: 'Featured Content',
    coverImage: '/fb.png',
    plays: 0,
    isTrending: false,
    trendingNow: []
} };

export default Hero;