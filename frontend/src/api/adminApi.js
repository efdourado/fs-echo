import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const token = localStorage.getItem('authToken');

const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `bearer ${token}`
} });

export const createArtist = (formData) => adminApi.post('/artists', formData);
export const updateArtist = (id, formData) => adminApi.put(`/artist/${id}`, formData);
export const deleteArtist = (id) => adminApi.delete(`/artist/${id}`);