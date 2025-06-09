import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonDigging } from '@fortawesome/free-solid-svg-icons';

const ComingSoonPage = () => {
  return (
    <div className="coming-soon-page">
      <div className="coming-soon-container">
        <FontAwesomeIcon icon={faPersonDigging} className="coming-soon-icon" />
        <h1 className="coming-soon-title">
          Work in Progress...
        </h1>
        <p className="coming-soon-text">
          This page is currently under construction.
          We're working hard to bring you this feature.
          Please check back later!
        </p>
      </div>
    </div>
); };

export default ComingSoonPage;