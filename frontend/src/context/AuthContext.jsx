import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    if (token) {
      axios.defaults.headers.common['authorization'] = `bearer ${token}`;
      const fetchUser = async () => {
        try {
          const response = await axios.get(`${API_URL}/auth/me`);
          setCurrentUser(response.data);
        } catch (error) {
          console.error("failed to fetch user with token:", error);
          localStorage.removeItem('authToken');
          setToken(null);
          setCurrentUser(null);
          delete axios.defaults.headers.common['authorization'];
        } finally {
          setLoading(false);
      } };
      fetchUser();
    } else {
      delete axios.defaults.headers.common['authorization'];
      setLoading(false);
    }
  }, [token]);

  const updateCurrentUser = (newUserData) => {
    setCurrentUser(prevUser => ({ ...prevUser, ...newUserData }));
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (response.data && response.data.token) {
        setToken(response.data.token);
        setCurrentUser(response.data);
        localStorage.setItem('authToken', response.data.token);
        axios.defaults.headers.common['authorization'] = `bearer ${response.data.token}`;
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
        setToken(response.data.token);
        setCurrentUser(response.data);
        localStorage.setItem('authToken', response.data.token);
        axios.defaults.headers.common['authorization'] = `bearer ${response.data.token}`;
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
    delete axios.defaults.headers.common['authorization'];
    navigate('/login');
  };

  const value = {
    currentUser,
    token,
    isAuthenticated: !!token,
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