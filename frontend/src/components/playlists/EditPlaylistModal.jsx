import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from '../ui/Modal';
import { updatePlaylist } from '../../api/adminApi';

const EditPlaylistModal = ({ isOpen, onClose, playlist, onPlaylistUpdated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (playlist) {
      setName(playlist.name || '');
      setDescription(playlist.description || '');
      setCoverImage(playlist.coverImage || '');
    }
  }, [playlist]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Playlist name is required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await updatePlaylist(playlist._id, { name, description, coverImage });
      const updatedPlaylist = response.data;
      onPlaylistUpdated(updatedPlaylist);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update playlist.');
    } finally {
      setLoading(false);
  } };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit "${playlist.name}"`}>
      <form onSubmit={handleSubmit} className="auth-form" style={{padding: '0', maxWidth: 'none'}}>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="playlist-name">Name</label>
          <input
            id="playlist-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder=" "
          />
        </div>
        <div className="form-group">
          <label htmlFor="playlist-description">Description</label>
          <textarea
            id="playlist-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            placeholder=" "
          />
        </div>

        <div className="form-group">
          <label htmlFor="playlist-coverImage">Cover Image URL</label>
          <input
            id="playlist-coverImage"
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder=" "
          />
        </div>
        <button type="submit" disabled={loading} className="cta-button secondary-cta auth-button">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </Modal>
); };

EditPlaylistModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  playlist: PropTypes.object,
  onPlaylistUpdated: PropTypes.func.isRequired,
};

export default EditPlaylistModal;