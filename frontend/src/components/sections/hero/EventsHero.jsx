import React from 'react';
import PropTypes from 'prop-types';

const EventsHero = ({ 
  title, 
  subtitle, 
  featuredEvent,
  ctaText,
  bgImage 
}) => {
  return (
    <div 
      className="events-hero"
      style={{ 
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5)), url(${bgImage})`,
      }}
    >
      <div className="hero-content">
        <div className="text-content">
          <h1 className="title">{title}</h1>
          <p className="subtitle">{subtitle}</p>
          
          <div className="featured-event">
            <div className="event-date">
              <span className="day">{featuredEvent.day}</span>
              <span className="month">{featuredEvent.month}</span>
            </div>
            <div className="event-info">
              <h3>{featuredEvent.name}</h3>
              <p>
                <span className="location">{featuredEvent.location}</span>
                <span className="time">{featuredEvent.time}</span>
              </p>
              <div className="artists">
                {featuredEvent.artists.map((artist, index) => (
                  <span key={index} className="artist-tag">{artist}</span>
                ))}
              </div>
            </div>
          </div>
          
          <button className="cta-button">{ctaText}</button>
        </div>
        
        <div className="countdown">
          <h4>COMEÇA EM:</h4>
          <div className="timer">
            <div className="time-block">
              <span className="number">12</span>
              <span className="label">DIAS</span>
            </div>
            <div className="time-block">
              <span className="number">08</span>
              <span className="label">HORAS</span>
            </div>
            <div className="time-block">
              <span className="number">45</span>
              <span className="label">MIN</span>
            </div>
          </div>
        </div>
      </div>
    </div>
); };


EventsHero.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  ctaText: PropTypes.string.isRequired,
  bgImage: PropTypes.string.isRequired,
  featuredEvent: PropTypes.shape({
    day: PropTypes.string.isRequired,
    month: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    artists: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired
};

export default EventsHero;