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
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";

const Header = ({ toggleSidebar }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle("light-mode", !newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setSearchOpen(false);
  } };

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <div className="header-left">
          <button 
            className="btn btn-icon mobile-menu-btn" 
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <Link to="/" className="header-logo">
            <img src="/images/logo.png" alt="Brand" className="logo-img" />
            <span className="logo-text">StreamHub</span>
          </Link>
        </div>

        <div className={`search-container ${searchOpen ? "is-open" : ""}`}>
          <form onSubmit={handleSearch} className="search-form">
            <button type="submit" className="btn btn-icon search-btn">
              <FontAwesomeIcon icon={faSearch} />
            </button>
            <input
              type="text"
              className="search-input"
              placeholder="Search movies, shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button 
                type="button" 
                className="btn btn-icon clear-search"
                onClick={() => setSearchQuery("")}
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
            aria-label="Search"
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
              className="btn btn-icon notification" 
              aria-label="Notifications"
            >
              <FontAwesomeIcon icon={faBell} />
              <span className="notification-badge">3</span>
            </button>
          </div>

          <button 
            className="btn btn-icon theme-toggle"
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <FontAwesomeIcon icon={darkMode ? faMoon : faSun} />
          </button>

          <div className="user-menu-container">
            <button 
              className="user-avatar"
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="User menu"
            >
              <div className="avatar-initials">JD</div>
              <FontAwesomeIcon icon={faChevronDown} className={`chevron ${showUserMenu ? 'open' : ''}`} />
            </button>
            
            {showUserMenu && (
              <div className="user-menu-dropdown">
                <div className="user-info">
                  <div className="avatar-initials large">JD</div>
                  <div className="user-details">
                    <span className="user-name">John Doe</span>
                    <span className="user-email">john@example.com</span>
                  </div>
                </div>
                <div className="menu-divider"></div>
                <button className="menu-item">
                  <FontAwesomeIcon icon={faUser} />
                  Profile
                </button>
                <button className="menu-item">
                  <FontAwesomeIcon icon={faSun} />
                  Appearance
                </button>
                <div className="menu-divider"></div>
                <button className="menu-item logout">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
); };

export default Header;