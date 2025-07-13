import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { updatePlaylist } from '../../services/userService';
import ErrorMessage from '../ui/ErrorMessage';
import Modal from '../ui/Modal';

const EditPlaylistModal = ({ isOpen, onClose, playlist, onPlaylistUpdated, onDelete }) => {
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
  } }, [playlist]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Playlist name is required');
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
      setError(err.response?.data?.message || 'Failed to update this playlist');
    } finally {
      setLoading(false);
  } };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit '${playlist.name}'`}>
      <form onSubmit={handleSubmit} className="auth-form" style={{padding: '0', maxWidth: 'none'}}>
        <ErrorMessage message={error} />

        <div className="form-group">
          <label htmlFor="playlist-name"></label>
          <input
            id="playlist-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Name"
            spellCheck="false"
          />
        </div>
        <div className="form-group">
          <label htmlFor="playlist-description"></label>
          <input
            id="playlist-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            placeholder="Description"
            spellCheck="false"
          />
        </div>

        <div className="form-group">
          <label htmlFor="playlist-coverImage"></label>
          <input
            id="playlist-coverImage"
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="Cover image (URL)"
            spellCheck="false"
          />
        </div>
        <div className="edit-playlist-modal-footer">
            <button type="submit" disabled={loading} className="login-btn">
                {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
                type="button"
                onClick={onDelete}
                className="admin-action-button delete"
                aria-label="Delete Playlist"
            >
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </div>
      </form>
    </Modal>
); };

EditPlaylistModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  playlist: PropTypes.object,
  onPlaylistUpdated: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default EditPlaylistModal;