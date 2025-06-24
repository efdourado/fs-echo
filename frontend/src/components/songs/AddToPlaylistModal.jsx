import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getMyPlaylists, addSongToPlaylist } from '../../api/adminApi';
import LoadingSpinner from '../ui/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const AddToPlaylistModal = ({ song, onClose }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserPlaylists = async () => {
      try {
        const { data } = await getMyPlaylists();
        setPlaylists(data);
      } catch (err) {
        setError('Could not load your playlists.');
      } finally {
        setLoading(false);
    } };
    fetchUserPlaylists();
  }, []);

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await addSongToPlaylist(playlistId, song._id);
      const playlist = playlists.find(p => p._id === playlistId);
      setSuccess(`Added to "${playlist.name}"!`);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add song. Please try again.';
      setError(errorMessage);
  } };

  if (success) {
    return (
      <div className="add-to-playlist-feedback success">
        <FontAwesomeIcon icon={faCheckCircle} />
        <p>{success}</p>
      </div>
  ); }

  return (
    <div className="add-to-playlist-modal">
      <h3 className="add-to-playlist-title">Add "{song.title}" to...</h3>
      {loading ? (
        <LoadingSpinner fullScreen={false} />
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <ul className="playlist-selection-list">
          {playlists.length > 0 ? playlists.map((playlist) => (
            <li key={playlist._id}>
              <button onClick={() => handleAddToPlaylist(playlist._id)}>
                <FontAwesomeIcon icon={faMusic} className="playlist-icon" />
                <span>{playlist.name}</span>
              </button>
            </li>
          )) : (
            <p>You have no playlists. Create one from your Library!</p>
          )}
        </ul>
      )}
    </div>
); };

AddToPlaylistModal.propTypes = {
  song: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddToPlaylistModal;