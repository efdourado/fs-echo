import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';

import ErrorMessage from '../../components/ui/ErrorMessage';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials');
    } finally {
      setLoading(false);
  } };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content-wrapper">
          <div className="auth-social-section">
            <h2>
              Hi again! Welcome back to your space
            </h2>
            <p className="auth-subtitle">
              Music, reimagined — Memphis is a web application designed to provide a seamless, modern music listening experience. Users can build and manage personal playlists,
              and align new perspectives through sound.
            </p>

            <div className="social-login-container">
              <a href="/api/auth/spotify" className="cta-button primary-cta create-btn">
                <FontAwesomeIcon icon={faSpotify} style={{marginRight:"16px"}} />
                Continue with Spotify
              </a>
            </div>
          </div>

          <div className="auth-separator">OR</div>

          <div className="auth-form-section">
            <form onSubmit={handleSubmit} className="auth-form">
              <h2>
                Sign in<br />
                to your account
              </h2>

              <ErrorMessage message={error} />

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
                  autoComplete="current-password"
                  placeholder=" "
                />
                <label htmlFor="password">Password</label>
              </div>
              
              <div className="form-options">
                <div className="checkbox-group">
                  <input 
                    type="checkbox" 
                    id="rememberMe" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="rememberMe">Remember me</label>
                </div>
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
              
              <button type="submit" disabled={loading} className="cta-button secondary-cta auth-button">
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
              
              <p className="auth-subtitle">
                Not a member yet? <a href="/register">Sign Up</a>
              </p>
            
            </form>
          </div>
        </div>
      </div>
    </div>
); };

export default LoginPage;