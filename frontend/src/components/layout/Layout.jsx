import React from 'react';
import PropTypes from 'prop-types';
import Player from '../features/player/Player';
 
const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <div className="app-layout">
        <main className="main-content" id="main-content">
          {children}
        </main>
      </div>
      <Player />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;