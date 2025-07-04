import React from 'react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';

import fallbackImage from '/fb.jpg';

const Card = ({ item, type }) => {
  const {
    _id,
    title,
    name,
    coverImage,
    image,
    artist,
    owner,
    album,
  } = item;
  
  const isArtist = type === 'artist';
  const displayTitle = title || name;
  const imageUrl = coverImage || image || fallbackImage;
  const detailPath = type === 'song' && album?._id ? `/album/${album._id}` : `/${type}/${_id}`;

  let subtitle = '';
  switch (type) {
    case 'artist':
      subtitle = 'Artist';
      break;
    case 'album':
      const albumType = item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : 'Album';
      subtitle = artist?.name ? `${albumType} • ${artist.name}` : albumType;
      break;
    case 'playlist':
      subtitle = owner?.username ? `Playlist • ${owner.username}` : 'Playlist';
      break;
    case 'song':
      subtitle = artist?.name ? `Single • ${artist.name}` : 'Single';
      break;
    default:
      subtitle = '';
  }

  return (
    <div className={`card ${isArtist ? 'card--artist' : ''}`}>
      <Link to={detailPath} className="card__link">
        <div className="card__image-container">
          <img
            className="card__image"
            src={imageUrl}
            alt={displayTitle}
            onError={(e) => {
              e.target.src = fallbackImage;
              e.target.onerror = null;
            }}
          />
          
            
        </div>
        <div className="card__info">
          <h3 className="card__title" title={displayTitle}>
            {displayTitle}
          </h3>
          <p className="card__subtitle" title={subtitle}>
            {subtitle}
          </p>
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
    releaseDate: PropTypes.string,
    type: PropTypes.string,
    artist: PropTypes.shape({
      name: PropTypes.string,
    }),
    owner: PropTypes.shape({
      username: PropTypes.string,
    }),
  }).isRequired,
  type: PropTypes.oneOf(['artist', 'album', 'playlist', 'song']).isRequired,
};

export default Card;