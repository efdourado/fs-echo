// frontend/src/pages/Auth/RegisterPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faMusic } from '@fortawesome/free-solid-svg-icons';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Decorative music notes */}
      <div className="music-note">
        <FontAwesomeIcon icon={faMusic} />
      </div>
      <div className="music-note">
        <FontAwesomeIcon icon={faMusic} />
      </div>
      <div className="music-note">
        <FontAwesomeIcon icon={faMusic} />
      </div>
      <div className="music-note">
        <FontAwesomeIcon icon={faMusic} />
      </div>

      <div className="auth-container">
        <div className="auth-content-wrapper">
          {/* Social Section */}
          <div className="auth-social-section">
            <h2>Join Our Community</h2>
            <p className="auth-subtitle">
              Create your account and start exploring thousands of music tracks, 
              connect with artists, and build your perfect playlists.
            </p>
            <div className="social-login-container">
              <button type="button" className="social-login-btn">
                <FontAwesomeIcon icon={faGoogle} />
                <span className="social-btn-text">Continue with Google</span>
              </button>
              <button type="button" className="social-login-btn">
                <FontAwesomeIcon icon={faSpotify} />
                <span className="social-btn-text">Continue with Spotify</span>
              </button>
            </div>
            
            <div style={{ marginTop: '2rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
              By signing up, you agree to our <a href="#" style={{ color: 'rgba(255,255,255,0.7)' }}>Terms</a> and <a href="#" style={{ color: 'rgba(255,255,255,0.7)' }}>Privacy Policy</a>
            </div>
          </div>

          {/* Separator */}
          <div className="auth-separator">OR</div>

          {/* Form Section */}
          <div className="auth-form-section">
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder=" "
                />
                <label htmlFor="username">Username</label>
              </div>
              
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder=" "
                />
                <label htmlFor="email">Email</label>
              </div>
              
              <div className="form-group">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder=" "
                />
                <label htmlFor="password">Password</label>
              </div>
              
              <div className="form-group">
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder=" "
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
              </div>
              
              <div className="form-options">
                <div className="checkbox-group">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember me</label>
                </div>
              </div>
              
              <button type="submit" disabled={loading} className="auth-button">
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
            
            <p className="auth-link">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;