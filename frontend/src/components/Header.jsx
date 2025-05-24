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
  faUser,
  faChevronDown,
  faRightFromBracket, // for logout icon
  faUserCircle, // for profile icon
  faIdCard // Placeholder for profile link in menu
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext"; // Import useAuth

const Header = ({ toggleSidebar }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Assuming default is dark
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const { isAuthenticated, currentUser, logout, loadingAuth } = useAuth(); // Get auth state and functions

  useEffect(() => {
    // Initialize dark mode from localStorage or default
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      const newDarkMode = JSON.parse(savedDarkMode);
      setDarkMode(newDarkMode);
      document.body.classList.toggle("light-mode", !newDarkMode);
    } else {
      // Default to dark mode if nothing is saved
      document.body.classList.toggle("light-mode", !darkMode);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Removed darkMode from dependency array to avoid loop if localStorage is used inside toggleDarkMode

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle("light-mode", !newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
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
    setShowUserMenu(false); // Close menu on logout
    navigate('/login'); // Redirect to login page
  };

  const getInitials = (username) => {
    if (!username) return 'U';
    const names = username.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + (names[names.length - 1][0] || '')).toUpperCase();
  }

  if (loadingAuth) {
    // Optional: Render a slimmed-down header or placeholder during auth loading
    return (
        <header className={`header ${isScrolled ? "scrolled" : ""}`}>
            <div className="header-container">
                <div className="header-left">
                    <Link to="/" className="header-logo">
                        <img src="/images/logo.png" alt="Brand" className="logo-img" />
                        <span className="logo-text">StreamHub</span>
                    </Link>
                </div>
                <div className="header-right">
                    {/* Placeholder for user actions */}
                </div>
            </div>
        </header>
    );
  }


  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <div className="header-left">
          {typeof toggleSidebar === 'function' && ( // Conditionally render if toggleSidebar is provided
            <button
              className="btn btn-icon mobile-menu-btn"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          )}
          <Link to="/" className="header-logo">
            {/* Ensure you have this logo image in your public/images folder or update path */}
            <img src="/images/logo.png" alt="Brand" className="logo-img" />
            <span className="logo-text">Echo</span>
          </Link>
        </div>

        <div className={`search-container ${searchOpen ? "is-open" : ""}`}>
          <form onSubmit={handleSearch} className="search-form">
            <button type="submit" className="btn btn-icon search-btn" aria-label="Submit search">
              <FontAwesomeIcon icon={faSearch} />
            </button>
            <input
              type="text"
              className="search-input"
              placeholder="Search artists, songs..." // Updated placeholder
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              // autoFocus // autoFocus can be annoying if search bar is persistent
            />
            {searchQuery && (
              <button
                type="button"
                className="btn btn-icon clear-search"
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
            className="btn btn-icon search-trigger"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label={searchOpen ? "Close search" : "Open search"}
          >
            <FontAwesomeIcon icon={searchOpen ? faTimes : faSearch} />
          </button>

          {/* "Create" button can be hidden or shown based on auth status if needed */}
          {/* For now, let's assume it's always visible or for admins/specific roles */}
          <button
            className="btn btn-primary create-btn"
            onClick={() => navigate('/create')} // Define what /create does
            aria-label="Create"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span className="btn-label">Create</span>
          </button>

          <div className="notification-container">
            <button
              className="btn btn-icon notification"
              aria-label="Notifications"
            >
              <FontAwesomeIcon icon={faBell} />
              {/* <span className="notification-badge">3</span> */} {/* Show badge if there are notifications */}
            </button>
          </div>

          <button
            className="btn btn-icon theme-toggle"
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} /> {/* Corrected icons based on typical usage */}
          </button>

          {isAuthenticated && currentUser ? (
            <div className="user-menu-container">
              <button
                className="user-avatar"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-expanded={showUserMenu}
                aria-label="User menu"
              >
                <div className="avatar-initials">{getInitials(currentUser.username)}</div>
                <FontAwesomeIcon icon={faChevronDown} className={`chevron ${showUserMenu ? 'open' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="user-menu-dropdown">
                  <div className="user-info">
                    <div className="avatar-initials large">{getInitials(currentUser.username)}</div>
                    <div className="user-details">
                      <span className="user-name">{currentUser.username}</span>
                      <span className="user-email">{currentUser.email}</span>
                    </div>
                  </div>
                  <div className="menu-divider"></div>
                  <button className="menu-item" onClick={() => { navigate('/profile'); setShowUserMenu(false); }}>
                    <FontAwesomeIcon icon={faUserCircle} />
                    Profile
                  </button>
                  {/* Add more menu items here if needed, e.g., Settings */}
                  {/* <button className="menu-item" onClick={() => { navigate('/settings'); setShowUserMenu(false); }}>
                    <FontAwesomeIcon icon={faCog} /> 
                    Settings
                  </button> */}
                  <div className="menu-divider"></div>
                  <button className="menu-item logout" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            // If not authenticated, show Login/Register buttons or links
            <>
              <Link to="/login" className="btn btn-icon" style={{ textDecoration: 'none', color: 'inherit' }}>
                 <span className="btn-label">Login</span>
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                <span className="btn-label">Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
); };

export default Header;