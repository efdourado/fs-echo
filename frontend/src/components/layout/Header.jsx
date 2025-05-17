import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import logo from "../../assets/images/logos/logo.png";

const Header = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  } };

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 10);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isSearchOpen &&
        !e.target.closest(".search-container") &&
        !e.target.closest(".search-trigger")
      ) {
        setIsSearchOpen(false);
    } };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          <img src={logo} alt="Brand" />
        </Link>

        <div className="header__actions">
          <div className={`search-container ${isSearchOpen ? "is-open" : ""}`}>
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Search..."
              className="search-input"
            />
          </div>

          <button
            className="search-trigger"
            onClick={toggleSearch}
            aria-label={isSearchOpen ? "Close search" : "Open search"}
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>

          <Link to="/login" className="btn-secondary">
            Log In
          </Link>
        </div>
      </div>
    </header>
); };

Header.propTypes = {
  onSearch: PropTypes.func,
};

export default Header;