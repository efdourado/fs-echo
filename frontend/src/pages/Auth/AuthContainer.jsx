import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faSpotify } from '@fortawesome/free-brands-svg-icons';

// --- Componente do Formulário de Login ---
const LoginForm = ({ onLoadingChange, onErrorChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    onErrorChange('');
    onLoadingChange(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      onErrorChange(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Sign in<br />to your account</h2>
      <div className="form-group">
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder=" " />
        <label htmlFor="email">Email</label>
      </div>
      <div className="form-group">
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" placeholder=" " />
        <label htmlFor="password">Password</label>
      </div>
      <div className="form-options">
        <div className="checkbox-group">
          <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
          <label htmlFor="rememberMe">Remember me</label>
        </div>
        <a href="#">Forgot password?</a>
      </div>
      <button type="submit" className="cta-button secondary-cta auth-button">Sign In</button>
    </form>
  );
};

// --- Componente do Formulário de Registro ---
const RegisterForm = ({ onLoadingChange, onErrorChange }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      onErrorChange("Passwords do not match");
      return;
    }
    onErrorChange('');
    onLoadingChange(true);
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      onErrorChange(err.message || 'Failed to register. Please try again.');
    } finally {
      onLoadingChange(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Create<br />new account</h2>
      <div className="form-group">
        <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" placeholder=" " />
        <label htmlFor="username">Username</label>
      </div>
      <div className="form-group">
        <input id="email-register" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder=" " />
        <label htmlFor="email-register">Email</label>
      </div>
      <div className="form-group">
        <input id="password-register" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" placeholder=" " />
        <label htmlFor="password-register">Password</label>
      </div>
      <div className="form-group">
        <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" placeholder=" " />
        <label htmlFor="confirmPassword">Confirm Password</label>
      </div>
      <button type="submit" className="cta-button secondary-cta auth-button">Sign Up</button>
    </form>
  );
};


// --- Componente Principal da Página de Autenticação ---
const AuthContainer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoginView, setIsLoginView] = useState(location.pathname === '/login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Sincroniza o estado com a URL
    setIsLoginView(location.pathname === '/login');
    setError(''); // Limpa erros ao trocar de rota
  }, [location.pathname]);

  const handleToggleView = (e, path) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <div className="auth-page">
      <div className={`auth-container ${isLoginView ? 'view-login' : 'view-register'}`}>
        <div className="auth-content-wrapper">

          <div className="auth-social-section">
            <div className="auth-social-content">
              <h2>{isLoginView ? "Welcome back!" : "Join the new wave"}</h2>
              <p className="auth-subtitle">
                Music, reimagined — Echo is a web application designed to provide a seamless, modern music listening experience.
              </p>
              <div className="social-login-container">
                <button type="button" className="cta-button primary-cta create-btn">
                  <FontAwesomeIcon icon={faGoogle} style={{marginRight:"16px"}} /> Continue with Google
                </button>
                <button type="button" className="cta-button primary-cta create-btn">
                  <FontAwesomeIcon icon={faSpotify} style={{marginRight:"16px"}} /> Continue with Spotify
                </button>
              </div>
            </div>
          </div>

          <div className="auth-separator-wrapper">
            <div className="auth-separator">OR</div>
          </div>

          <div className="auth-form-section">
            <div className="auth-form-content">
              {error && <div className="error-message">{error}</div>}
              
              {isLoginView 
                ? <LoginForm onLoadingChange={setLoading} onErrorChange={setError} /> 
                : <RegisterForm onLoadingChange={setLoading} onErrorChange={setError} />
              }
              
              <p className="auth-subtitle switcher">
                {isLoginView ? "Not a member yet? " : "Already a member? "}
                <a href={isLoginView ? "/register" : "/login"} onClick={(e) => handleToggleView(e, isLoginView ? "/register" : "/login")}>
                  {isLoginView ? "Sign Up" : "Sign In"}
                </a>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthContainer;