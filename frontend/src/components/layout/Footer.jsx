import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faTiktok,
  faPinterest,
  faYoutube,
  faReddit,
} from '@fortawesome/free-brands-svg-icons';
import PropTypes from 'prop-types';

import logo from '/images/logo.png';

const socialIcons = [
  { icon: faInstagram, name: 'Instagram', url: '#' },
  { icon: faTiktok, name: 'TikTok', url: '#' },
  { icon: faPinterest, name: 'Pinterest', url: '#' },
  { icon: faYoutube, name: 'YouTube', url: '#' },
  { icon: faReddit, name: 'Reddit', url: '#' },
];

const navSections = [ {
    title: "Explore",
    links: ["About Us", "Site Map", "Help Center", "Report a Bug", "FAQs", "Contact Us"],
  },
  {
    title: "Content",
    links: ["Tips", "Interviews", "Behind-the-Scenes", "Diaries", "Events"],
  },
  {
    title: "Community",
    links: ["Guidelines", "Collaboration", "Meetups", "Forums", "Voting", "Challenges"],
}, ];

const legalLinks = ["Privacy", "Cookies", "Terms & Conditions"];

const Footer = ({ companyName, year = new Date().getFullYear() }) => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="brand-section">
            <div className="logo-wrapper">
              <img src={logo} alt={`${companyName} logo`} className="footer-logo" loading="lazy" />
            </div>
            <p className="brand-tagline">
Your art speaks for your voice — and sometimes, through it
            </p>
            <div className="social-links">
              {socialIcons.map(({ icon, name, url }) => (
                <a 
                  key={name} 
                  href={url} 
                  className="social-link"
                  aria-label={name}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={icon} className="social-icon" />
                </a>
              ))}
            </div>
          </div>

          <nav className="nav-sections" aria-label="Footer navigation">
            {navSections.map(({ title, links }) => (
              <div key={title} className="nav-group">
                <h5 className="nav-title">{title}</h5>
                <ul className="nav-links">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="nav-link">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="newsletter-section">
            <h5 className="newsletter-title">Stay Connected</h5>
            <form className="newsletter-form">
              <input 
                id="newsletter-email"
                type="email" 
                placeholder="Email address" 
                className="email-input" 
                required
              />
              <button type="submit" className="submit-button">
                <span className="button-text">Subscribe</span>
                <span className="button-arrow" aria-hidden="true">→</span>
              </button>
            </form>
            <div className="legal-links">
              {legalLinks.map((item) => (
                <a key={item} href="#" className="legal-item">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="copyright-bar">
          <span className="copyright-text">&copy; {year} {companyName}. All rights reserved.</span>
          <span className="copyright-text">Designed by @efdourado</span>
        </div>
      </div>
    </footer>
); };

Footer.propTypes = {
  companyName: PropTypes.string,
  year: PropTypes.number,
};

export default Footer;