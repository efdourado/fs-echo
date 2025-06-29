import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          const response = await authApi.get('/auth/me');
          setCurrentUser(response.data);
        } catch (error) {
          console.error("failed to fetch user with token:", error);
          // If token is invalid, clear it out
          localStorage.removeItem('authToken');
          setToken(null);
          setCurrentUser(null);
      } }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const updateCurrentUser = (newUserData) => {
    setCurrentUser(prevUser => ({ ...prevUser, ...newUserData }));
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (response.data && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setToken(response.data.token);
        setCurrentUser(response.data);
        return response.data;
      }
    } catch (error) {
      console.error("login failed:", error.response ? error.response.data : error.message);
      throw error.response ? error.response.data : new Error('login failed');
  } };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { username, email, password });
      if (response.data && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setToken(response.data.token);
        setCurrentUser(response.data);
        return response.data;
      }
    } catch (error) {
      console.error("registration failed:", error.response ? error.response.data : error.message);
      throw error.response ? error.response.data : new Error('registration failed');
  } };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const value = {
    currentUser,
    token,
    isAuthenticated: !!currentUser,
    login,
    register,
    logout,
    loadingAuth: loading,
    updateCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
); };