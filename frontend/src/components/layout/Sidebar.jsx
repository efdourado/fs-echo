import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faFolder, faCompass, faChevronRight, faUsers, faCog, faSignOutAlt, faCircleQuestion, faTrash, faCommentDots
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import fallbackImage from '/images/fb.jpeg';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toggleSidebar();
  };

  const handleLogin = () => {
    navigate('/login');
    toggleSidebar();
  }

  const handleSignup = () => {
    navigate('/register');
    toggleSidebar();
  }

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <nav className="sidebar-nav">
        <div className="nav-section">
          <p className="nav-section-title">Menu</p>
          <div className="nav-links">
            <NavLink to="/" end onClick={toggleSidebar} className={({ isActive }) => (isActive ? "nav-link selected" : "nav-link")}>
              <FontAwesomeIcon icon={faHome} className="nav-icon" />
              <span>Home</span>
              <FontAwesomeIcon icon={faChevronRight} className="nav-chevron" />
            </NavLink>

            <NavLink to="/discover" onClick={toggleSidebar} className={({ isActive }) => (isActive ? "nav-link selected" : "nav-link")}>
              <FontAwesomeIcon icon={faCompass} className="nav-icon" />
              <span>Discover</span>
              <FontAwesomeIcon icon={faChevronRight} className="nav-chevron" />
            </NavLink>

            <NavLink to="/artists" onClick={toggleSidebar} className={({ isActive }) => (isActive ? "nav-link selected" : "nav-link")}>
              <FontAwesomeIcon icon={faUsers} className="nav-icon" />
              <span>Artists</span>
              <FontAwesomeIcon icon={faChevronRight} className="nav-chevron" />
            </NavLink>

            <NavLink to="/library" onClick={toggleSidebar} className={({ isActive }) => (isActive ? "nav-link selected" : "nav-link")}>
              <FontAwesomeIcon icon={faFolder} className="nav-icon" />
              <span>Library</span>
              <FontAwesomeIcon icon={faChevronRight} className="nav-chevron" />
            </NavLink>
          </div>
        </div>

        {isAuthenticated && (
          <div className="nav-section">
            <p className="nav-section-title">Library</p>
            <div className="nav-links">
              <NavLink to="/library/songs" onClick={toggleSidebar} className={({ isActive }) => (isActive ? "nav-link selected" : "nav-link")}>
                <span>Liked Songs</span>
                <FontAwesomeIcon icon={faChevronRight} className="nav-chevron" />
              </NavLink>
              <NavLink to="/library/playlists" onClick={toggleSidebar} className={({ isActive }) => (isActive ? "nav-link selected" : "nav-link")}>
                <span>Playlists</span>
                <FontAwesomeIcon icon={faChevronRight} className="nav-chevron" />
              </NavLink>
            </div>
          </div>
        )}

        <div className="nav-section">
          <p className="nav-section-title">Others</p>
          <div className="nav-links">
            <NavLink to="/archived" end onClick={toggleSidebar} className={({ isActive }) => (isActive ? "nav-link selected" : "nav-link")}>
              <FontAwesomeIcon icon={faTrash} className="nav-icon" />
              <span>Archived</span>
              <FontAwesomeIcon icon={faChevronRight} className="nav-chevron" />
            </NavLink>

            <NavLink to="/help" end onClick={toggleSidebar} className={({ isActive }) => (isActive ? "nav-link selected" : "nav-link")}>
              <FontAwesomeIcon icon={faCircleQuestion} className="nav-icon" />
              <span>Help</span>
              <FontAwesomeIcon icon={faChevronRight} className="nav-chevron" />
            </NavLink>

            <NavLink to="/settings" onClick={toggleSidebar} className={({ isActive }) => (isActive ? "nav-link selected" : "nav-link")}>
              <FontAwesomeIcon icon={faCog} className="nav-icon" />
              <span>Settings</span>
              <FontAwesomeIcon icon={faChevronRight} className="nav-chevron" />
            </NavLink>
          </div>
        </div>
      </nav>

      <div className="sidebar-footer">
        {isAuthenticated && currentUser ? (
          <button onClick={handleLogout} className="nav-link nav-link--logout" aria-label="Sign Out">
            <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
            <span>Log Out</span>
          </button>
        ) : (
          <a 
            href="mailto:ed320819@gmail.com?subject=Feedback%20for%20Echo%20App&body=Hi%20Team,%0A%0AI%20have%20some%20feedback%20about%20the%20app:%0A%0A" 
            className="nav-link nav-link--logout" 
            aria-label="Give us Feedback"
          >
            <FontAwesomeIcon icon={faCommentDots} className="nav-icon" />
            <span>Give us Feedback</span>
          </a>
          
        )}
      </div>
    </aside>
); };

export default Sidebar;