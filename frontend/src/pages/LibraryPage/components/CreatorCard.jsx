import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const CreatorCard = ({ onClick, title = "Create Playlist" }) => {
  return (
    <div className="creator-card" onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onClick()}>
      <div className="creator-card__content">
        <FontAwesomeIcon icon={faPlus} className="creator-card__icon" />
        <span className="creator-card__title">{title}</span>
      </div>
    </div>
); };

CreatorCard.propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string,
};

export default CreatorCard;