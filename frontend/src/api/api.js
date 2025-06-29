import axios from "axios";

const URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function fetchArtists() {
  const response = await axios.get(`${URL}/artists`);
  return response.data;
}
export async function fetchArtistById(id) {
  const response = await axios.get(`${URL}/artist/${id}`);
  return response.data;
}


export async function fetchSongs() {
  const response = await axios.get(`${URL}/songs`);
  return response.data;
}
export async function fetchSongById(id) {
  const response = await axios.get(`${URL}/song/${id}`);
  return response.data;
}


export async function fetchAlbums() {
  const response = await axios.get(`${URL}/albums`);
  return response.data;
}
export async function fetchAlbumById(id) {
  const response = await axios.get(`${URL}/album/${id}`);
  return response.data;
}


export async function fetchPlaylists() {
  const response = await axios.get(`${URL}/playlists`);
  return response.data;
}
export async function fetchPlaylistById(id) {
  const response = await axios.get(`${URL}/playlist/${id}`);
  return response.data;
}