import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faSpotify } from '@fortawesome/free-brands-svg-icons';

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
  } };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content-wrapper">
          <div className="auth-social-section">
            <h2>
              Sign up to a new music experience
            </h2>
            <p className="auth-subtitle">
              Music, reimagined — Echo is a web application designed to provide a seamless, modern music listening experience. Users can build and manage personal playlists,
              and align new perspectives through sound.
            </p>

            <div className="social-login-container">
              <button type="button" className="cta-button primary-cta create-btn">
                <FontAwesomeIcon icon={faGoogle} style={{marginRight:"16px"}} />
                Continue with Google
              </button>
              <a href="http://localhost:3000/api/auth/spotify" className="cta-button primary-cta create-btn">
                <FontAwesomeIcon icon={faSpotify} style={{marginRight:"16px"}} />
                Continue with Spotify
              </a>
            </div>
            
            <div className="auth-subtitle">
              By signing up, you agree to our<a href="#"> Terms</a> and<a href="#"> Privacy Policy</a>
            </div>
          </div>

          <div className="auth-separator">OR</div>

          <div className="auth-form-section">
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <h2>
                Create<br />
                new account
              </h2>

              <div className="form-group">
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder=" "
                  spellCheck="false"
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
                  spellCheck="false"
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
              
              <button type="submit" disabled={loading} className="cta-button secondary-cta auth-button">
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
              
              <p className="auth-subtitle">
                Already a member? <a href="/login">Sign In</a>
              </p>
            
            </form>
          </div>
        </div>
      </div>
    </div>
); };

export default RegisterPage;