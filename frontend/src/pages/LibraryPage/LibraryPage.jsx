import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

import { getMyPlaylists, deletePlaylist } from '../../api/adminApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import CreatePlaylistForm from './components/CreatePlaylistForm';

const LibraryPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const { data } = await getMyPlaylists();
      setPlaylists(data);
    } catch (err) {
      setError('Failed to fetch your playlists. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
  } };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handlePlaylistCreated = (newPlaylist) => {
    setIsModalOpen(false); // Close modal
    setPlaylists(prevPlaylists => [newPlaylist, ...prevPlaylists]);
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      try {
        await deletePlaylist(playlistId);

        setPlaylists(prevPlaylists => prevPlaylists.filter(p => p._id !== playlistId));
      } catch (err) {
        setError('Failed to delete the playlist.');
        console.error(err);
  } } };

  return (
    <div className="library-page">
      <div className="library-header">
        <h1>My Library</h1>
        <button className="create-playlist-btn" onClick={() => setIsModalOpen(true)}>
          <FontAwesomeIcon icon={faPlus} />
          Create Playlist
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="playlists-grid">
          {playlists.length > 0 ? (
            playlists.map(playlist => (
              <div key={playlist._id} className="playlist-card-container">
                <Card item={playlist} type="playlist" />
                {/* Botão de Exclusão adicionado aqui */}
                <button 
                  onClick={() => handleDeletePlaylist(playlist._id)}
                  className="admin-button-delete" 
                  style={{position: 'absolute', top: '10px', right: '10px', zIndex: 2}}
                  aria-label="Delete Playlist"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>You haven't created any playlists yet.</p>
              <p>Click "Create Playlist" to get started!</p>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Playlist">
        <CreatePlaylistForm
          onSuccess={handlePlaylistCreated}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
); };

export default LibraryPage;