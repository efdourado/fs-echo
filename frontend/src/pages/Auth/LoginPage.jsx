// frontend/src/pages/Auth/LoginPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

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
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* This new wrapper will handle the two-section layout on desktop */}
        <div className="auth-content-wrapper">
          
          {/* Social Section (Left side on desktop) */}
          <div className="auth-social-section">
            <h2>Sign In</h2>
            <p className="auth-subtitle">Welcome back! Sign in using your social account or email.</p>
            <div className="social-login-container">
              <button type="button" className="social-login-btn">
                <FontAwesomeIcon icon={faGoogle} />
                <span className="social-btn-text">Sign in with Google</span>
              </button>
              
            </div>
          </div>

          {/* Separator (Only visible on desktop) */}
          <div className="auth-separator">OR</div>

          {/* Form Section (Right side on desktop) */}
          <div className="auth-form-section">
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
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
                <Link to="/forgot-password" className="form-link">Forgot password?</Link>
              </div>

              <button type="submit" disabled={loading} className="auth-button">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <p className="auth-link">
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;