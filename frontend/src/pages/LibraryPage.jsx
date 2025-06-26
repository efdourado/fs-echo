import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { getMyPlaylists, deletePlaylist } from "../api/adminApi";

import Card from "../components/ui/Card";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const LibraryPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const { data } = await getMyPlaylists();
      setPlaylists(data);
    } catch (err) {
      setError("Failed to fetch your playlists. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
  } };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleDelete = async (playlistId, playlistName) => {
    if (window.confirm(`Are you sure you want to delete the playlist "${playlistName}"?`)) {
      try {
        await deletePlaylist(playlistId);
        // Atualize o estado para remover a playlist da UI sem recarregar a página
        setPlaylists(prevPlaylists => prevPlaylists.filter(p => p._id !== playlistId));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete playlist.');
  } } };

  return (
    <div className="library-page">
      <div className="carousel__header">
        <h1 className="carousel__title">Your Library</h1>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="playlists-grid">
          {playlists.map((playlist) => (
            <div key={playlist._id} className="playlist-card-container" style={{ position: 'relative' }}>
              <Card item={playlist} type="playlist" />
              <button
                onClick={() => handleDelete(playlist._id, playlist.name)}
                className="admin-button-delete"
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  zIndex: 2,
                  width: '32px',
                  height: '32px',
                  padding: 0,
                  fontSize: '14px'
                }}
                aria-label={`Delete playlist ${playlist.name}`}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
); };

export default LibraryPage;