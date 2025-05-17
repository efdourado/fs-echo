import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import fallbackImage from '../../../assets/images/fb/fb.png';

const SingleItem = ({ 
  _id,
  name,
  image,
  idPath,
  artistName,
  type,
  releaseYear,
  plays,
  showYear,
  showPlays
}) => {
  const isArtist = type === 'artists';
  
  return (
    <Link 
      to={`${idPath}/${_id}`} 
      className={`single-item ${isArtist ? 'single-item--artist' : ''}`} 
      aria-label={name}
    >
      <div className="single-item__image-container">
        <img
          className="single-item__image"
          src={image || fallbackImage}
          alt={name}
          loading="lazy"
          onError={(e) => {
            e.target.src = fallbackImage;
            e.target.onerror = null;
          }}
        />
        {!isArtist && (
          <div className="single-item__play-overlay" aria-hidden="true">
            <FontAwesomeIcon icon={faCirclePlay} />
          </div>
        )}
      </div>
      <div className="single-item__info">
        <h3 className="single-item__title" title={name}>
          {name}
        </h3>
        {!isArtist && artistName && (
          <p className="single-item__artist">{artistName}</p>
        )}
        
        {!isArtist && (
          <div className="single-item__metadata">
            {showYear && releaseYear && (
              <span className="single-item__year">{releaseYear}</span>
            )}
            {showPlays && plays !== undefined && (
              <span className="single-item__plays">
                {plays.toLocaleString()} plays
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

SingleItem.propTypes = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string,
  idPath: PropTypes.string.isRequired,
  artistName: PropTypes.string,
  type: PropTypes.oneOf(['songs', 'artists', 'albums', 'playlists']),
  releaseYear: PropTypes.number,
  plays: PropTypes.number,
  showYear: PropTypes.bool,
  showPlays: PropTypes.bool
};

SingleItem.defaultProps = {
  image: '',
  artistName: '',
  type: 'songs',
  releaseYear: null,
  plays: null,
  showYear: false,
  showPlays: false
};

export default SingleItem;