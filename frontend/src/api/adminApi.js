import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const token = localStorage.getItem('authToken');

const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `bearer ${token}`
} });

export const getMyPlaylists = () => adminApi.get('/me/playlists');
export const createPlaylist = (playlistData) => adminApi.post('/playlists', playlistData);
export const addSongToPlaylist = (playlistId, songId) => adminApi.post(`/playlist/${playlistId}/song/${songId}`);
export const deletePlaylist = (id) => adminApi.delete(`/playlist/${id}`);

export const createArtist = (formData) => adminApi.post('/artists', formData);
export const updateArtist = (id, formData) => adminApi.put(`/artist/${id}`, formData);
export const deleteArtist = (id) => adminApi.delete(`/artist/${id}`);

export const createSong = (formData) => adminApi.post('/songs', formData);
export const updateSong = (id, formData) => adminApi.put(`/song/${id}`, formData);
export const deleteSong = (id) => adminApi.delete(`/song/${id}`);

export const createAlbum = (formData) => adminApi.post('/albums', formData);
export const updateAlbum = (id, formData) => adminApi.put(`/album/${id}`, formData);
export const deleteAlbum = (id) => adminApi.delete(`/album/${id}`);

export const fetchUserById = (id) => adminApi.get(`/user/${id}`);
export const updateUser = (id, userData) => adminApi.put(`/user/${id}`, userData);