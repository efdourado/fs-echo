import React from 'react';

import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMusic, faLayerGroup, faCompass, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <nav className="sidebar-nav">

        <div className="nav-section">
          <p className="nav-section-title">Menu</p>
          <div className="nav-links">
            <NavLink to="/" exact onClick={toggleSidebar} className="nav-link" activeClassName="selected">
              <FontAwesomeIcon icon={faHome} className="nav-icon" />
              <span>Home</span>
              <FontAwesomeIcon icon={faChevronRight} className="nav-chevron" />
            </NavLink>
            <NavLink to="/discover" onClick={toggleSidebar} className="nav-link" activeClassName="selected">
              <FontAwesomeIcon icon={faCompass} className="nav-icon" />
              <span>Discover</span>
              <FontAwesomeIcon icon={faChevronRight} className="nav-chevron" />
            </NavLink>
            <NavLink to="/library" onClick={toggleSidebar} className="nav-link" activeClassName="selected">
              <FontAwesomeIcon icon={faLayerGroup} className="nav-icon" />
              <span>Library</span>
              <FontAwesomeIcon icon={faChevronRight} className="nav-chevron" />
            </NavLink>
          </div>
        </div>
      </nav>
    </aside>
); };

export default Sidebar;