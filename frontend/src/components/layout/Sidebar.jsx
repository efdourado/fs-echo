import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, faHome, faUser, faMusic, faGuitar, 
  faSignInAlt, faUserPlus, faChevronRight 
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import fallbackImage from '/images/fb.jpeg';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toggleSidebar();
    navigate('/login');
  };

  const handleImageError = (e) => {
    e.target.src = fallbackImage;
  };

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={toggleSidebar}
      />
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <h3>Harmony</h3>
            <p className="sidebar-subtitle">Music Dashboard</p>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="close-btn" 
            aria-label="Close menu"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <p className="nav-section-title">Discover</p>
            <div className="nav-links">
              <Link to="/" onClick={toggleSidebar} className="nav-link">
                <FontAwesomeIcon icon={faHome} className="nav-icon" />
                <span>Home</span>
                <FontAwesomeIcon icon={faChevronRight} className="nav-chevron" />
              </Link>
              <Link to="/artists" onClick={toggleSidebar} className="nav-link">
                <FontAwesomeIcon icon={faGuitar} className="nav-icon" />
                <span>Artists</span>
                <FontAwesomeIcon icon={faChevronRight} className="nav-chevron" />
              </Link>
              <Link to="/songs" onClick={toggleSidebar} className="nav-link">
                <FontAwesomeIcon icon={faMusic} className="nav-icon" />
                <span>Songs</span>
                <FontAwesomeIcon icon={faChevronRight} className="nav-chevron" />
              </Link>
            </div>
          </div>
        </nav>

        <div className="sidebar-footer">
          {isAuthenticated && currentUser ? (
            <div className="user-profile">
              <div className="user-avatar-container">
                <img 
                  src={currentUser.profilePic || fallbackImage} 
                  alt="User Avatar" 
                  className="user-avatar"
                  onError={handleImageError} 
                />
              </div>
              <div className="user-info">
                <span className="user-name">{currentUser.username}</span>
                <span className="user-email">{currentUser.email}</span>
              </div>
              <div className="user-actions">
                <Link 
                  to="/profile" 
                  onClick={toggleSidebar} 
                  className="profile-link"
                >
                  View Profile
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="logout-button"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-actions">
              <Link 
                to="/login" 
                onClick={toggleSidebar} 
                className="auth-button login-button"
              >
                <FontAwesomeIcon icon={faSignInAlt} />
                <span>Login</span>
              </Link>
              <Link 
                to="/register" 
                onClick={toggleSidebar} 
                className="auth-button signup-button"
              >
                <FontAwesomeIcon icon={faUserPlus} />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;