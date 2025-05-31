import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import fallbackImage from '/images/fb.jpeg';

const Card = ({ item, type }) => {
  const { 
    _id, 
    title, 
    name, 
    coverImage, 
    image, 
    artist, 
    releaseDate,
    monthlyListeners 
  } = item;
  
  const displayTitle = title || name;
  const imageUrl = coverImage || image || fallbackImage;
  const detailPath = `/${type}/${_id}`;
  const isArtist = type === 'artist';
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null;

  return (
    <div className={`card ${isArtist ? 'card--artist' : 'card--song'}`}>
      <Link to={detailPath} className="card__link">
        <div className="card__image-container">
          <img
            className={`card__image ${isArtist ? 'card__image--rounded' : ''}`}
            src={imageUrl}
            alt={displayTitle}
            onError={(e) => {
              e.target.src = fallbackImage;
              e.target.onerror = null;
            }}
          />
          
          {!isArtist && (
            <>
              <div className="card__play-overlay">
                <FontAwesomeIcon icon={faCirclePlay} size="3x" />
              </div>
              {releaseYear && (
                <div className="card__year">{releaseYear}</div>
              )}
            </>
          )}
        </div>
        <div className="card__info">
          <h3 className="card__title" title={displayTitle}>
            {displayTitle}
          </h3>
          {!isArtist && artist?.name && (
            <p className="card__subtitle" title={artist.name}>
              {artist.name}
            </p>
          )}
          {isArtist && monthlyListeners && (
            <p className="card__listeners">
              {monthlyListeners.toLocaleString()} monthly listeners
            </p>
          )}
        </div>
      </Link>
    </div>
); };

Card.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    name: PropTypes.string,
    coverImage: PropTypes.string,
    image: PropTypes.string,
    artist: PropTypes.shape({
      name: PropTypes.string
    }),
    releaseDate: PropTypes.string,
    monthlyListeners: PropTypes.number
  }).isRequired,
  type: PropTypes.oneOf(['song', 'artist']).isRequired,
};

export default Card;