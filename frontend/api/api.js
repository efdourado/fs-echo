import axios from "axios";

const URL = import.meta.env.VITE_API_URL || "http://localhost:9000/api";

export async function fetchArtists() {
  const response = await axios.get(`${URL}/artists`);
  return response.data;
}

export async function fetchSongs() {
  const response = await axios.get(`${URL}/songs`);
  return response.data;
}

export async function fetchArtistById(id) {
  const response = await axios.get(`${URL}/artist/${id}`);
  return response.data;
}


const responseArtists = await axios.get(`${URL}/artists`);
const responseSongs = await axios.get(`${URL}/songs`);

export const artistArray = responseArtists.data;
export const songsArray = responseSongs.data;