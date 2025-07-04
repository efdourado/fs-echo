import axios from 'axios';

const API_URL = "/api";

const authApi = axios.create({
  baseURL: API_URL,
});

authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
} );

export default authApi;