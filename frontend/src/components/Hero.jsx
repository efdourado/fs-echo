import React from 'react';
import PropTypes from 'prop-types';

const Hero = ({ 
  title,
  subtitle,
  highlight,
  ctaText,
  bgImage
}) => {
  return (
    <div 
      className="music-hero"
      style={{ 
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.3)), url(${bgImage})`,
      }}
    >
      <div className="hero-content">
        <div className="text-content">
          <h1 className="title">{title}</h1>
          <p className="subtitle">{subtitle}</p>
          
          <div className="music-highlight">
            <div className="cover-art">
              <img 
                src={highlight.coverImage} 
                alt={highlight.title}
                onError={(e) => {
                  e.target.src = '/fb.png';
                  e.target.onerror = null;
                }}
              />
            </div>
            <div className="highlight-info">
<span className="highlight-label">
  {(highlight?.type || "").toUpperCase()}
</span>
              <h3>{highlight.title}</h3>
              
              {highlight.type === 'song' && (
                <p className="artist">{highlight.artist}</p>
              )}
              
              {highlight.type === 'album' && (
                <div className="album-stats">
                  <span>{highlight.releaseYear}</span>
                  <span>•</span>
                  <span>{highlight.trackCount} tracks</span>
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
          
          <button className="cta-button">{ctaText}</button>
        </div>
        
        <div className="now-playing">
          <h4>NOW BLOWING UP</h4>
          <div className="trending-list">
           {Array.isArray(highlight?.trendingNow) &&
  highlight.trendingNow.map((item, index) => (
    <div key={index} className="trending-item">
      <span className="position">{index + 1}</span>
      <div className="track-info">
        <span className="track-name">{item.name}</span>
        <span className="artist-name">{item.artist}</span>
      </div>
      <span className="play-count">{item.plays?.toLocaleString() || 0}</span>
    </div>
))}

          </div>
        </div>
      </div>
    </div>
  );
};

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  ctaText: PropTypes.string.isRequired,
  bgImage: PropTypes.string.isRequired,
  highlight: PropTypes.shape({
    type: PropTypes.oneOf(['song', 'album']).isRequired,
    title: PropTypes.string.isRequired,
    coverImage: PropTypes.string.isRequired,
    artist: PropTypes.string,
    releaseYear: PropTypes.string,
    trackCount: PropTypes.number,
    plays: PropTypes.number.isRequired,
    isTrending: PropTypes.bool,
    trendingNow: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        artist: PropTypes.string.isRequired,
        plays: PropTypes.number.isRequired
      })
    ).isRequired
  }).isRequired
};

export default Hero;