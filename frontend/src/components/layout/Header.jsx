import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faSun,
  faMoon,
  faBars,
  faPlus,
  faSearch,
  faTimes,
  faChevronDown,
  faRightFromBracket,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import fallbackImage from '/fb.png';

const Header = ({ toggleSidebar }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : true;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const { isAuthenticated, currentUser, logout, loadingAuth } = useAuth();

  useEffect(() => {
    document.body.classList.toggle("light-mode", !darkMode);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", JSON.stringify(newMode));
      return newMode;
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/login');
  };
  
  const handleImageError = (e) => {
    e.target.src = fallbackImage;
  };

  if (loadingAuth) {
    return (
        <header className={`header ${isScrolled ? "scrolled" : ""}`}>
            <div className="header-container">
                <div className="header-left">
                    <Link to="/" className="header-logo">
                        <img src="/images/logo.png" alt="Echo Logo" className="logo-img" />
                        <span className="logo-text">Echo</span>
                    </Link>
                </div>
            </div>
        </header>
    );
  }

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <div className="header-left">
          {typeof toggleSidebar === 'function' && (
            <button
              className="btn btn-icon-only mobile-menu-btn"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          )}
          <Link to="/" className="header-logo">
            <img src="/images/logo.png" alt="Echo Logo" className="logo-img" />
            <span className="logo-text">Echo</span>
          </Link>
        </div>

        <div className={`search-container ${searchOpen ? "is-open" : ""}`}>
          <form onSubmit={handleSearch} className="search-form">
            <button type="submit" className="search-btn" aria-label="Submit search">
              <FontAwesomeIcon icon={faSearch} />
            </button>
            <input
              type="text"
              className="search-input"
              placeholder="Search artists, songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </form>
        </div>

        <div className="header-right">
          <button
            className="btn btn-icon-only search-trigger"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label={searchOpen ? "Close search" : "Open search"}
          >
            <FontAwesomeIcon icon={searchOpen ? faTimes : faSearch} />
          </button>

          <button
            className="btn btn-primary create-btn"
            onClick={() => navigate('/create')}
            aria-label="Create"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span className="btn-label">Create</span>
          </button>

          <div className="notification-container">
            <button
              className="btn btn-icon-only notification"
              aria-label="Notifications"
            >
              <FontAwesomeIcon icon={faBell} />
            </button>
          </div>

          <button
            className="btn btn-icon-only theme-toggle"
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <FontAwesomeIcon icon={darkMode ? faMoon : faSun} />
          </button>

          {isAuthenticated && currentUser ? (
            <div className="user-menu-container">
              <button
                className="user-avatar-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-expanded={showUserMenu}
                aria-label="User menu"
              >
                <img 
                  src={currentUser.profilePic || fallbackImage} 
                  alt="User Avatar" 
                  className="avatar-image"
                  onError={handleImageError} 
                />
                <FontAwesomeIcon icon={faChevronDown} className={`chevron ${showUserMenu ? 'open' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="user-menu-dropdown">
                  <div className="user-info">
                     <img 
                        src={currentUser.profilePic || fallbackImage} 
                        alt="" 
                        className="avatar-image large" 
                        onError={handleImageError}
                     />
                    <div className="user-details">
                      <span className="user-name">{currentUser.username}</span>
                      <span className="user-email">{currentUser.email}</span>
                    </div>
                  </div>
                  <div className="menu-divider"></div>
                  <button className="menu-item" onClick={() => { navigate('/profile'); setShowUserMenu(false); }}>
                    <FontAwesomeIcon icon={faUserCircle} className="fa-icon" /> Profile
                  </button>
                  <div className="menu-divider"></div>
                  <button className="menu-item logout" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faRightFromBracket} className="fa-icon" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                 <span className="btn-label">Login</span>
              </Link>
              <Link to="/register" className="btn btn-primary">
                <span className="btn-label">Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
); };

export default Header;