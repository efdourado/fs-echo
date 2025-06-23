import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createPlaylist } from '../../../api/adminApi';

const CreatePlaylistForm = ({ onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Playlist name is required.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const playlistData = { name, description };
      const { data: newPlaylist } = await createPlaylist(playlistData);
      onSuccess(newPlaylist); // Pass the new playlist back to the parent
    } catch (err) {
      setError('Failed to create playlist. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
  } };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <p className="error-message" style={{textAlign: 'center'}}>{error}</p>}
      <div className="form-group">
        <label htmlFor="playlist-name">Name</label>
        <input
          id="playlist-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Awesome Playlist"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="playlist-description">Description (Optional)</label>
        <textarea
          id="playlist-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          placeholder="A short description for your playlist..."
        ></textarea>
      </div>
      <div className="form-actions" style={{display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)'}}>
        <button type="button" onClick={onCancel} className="auth-button" style={{backgroundColor: 'var(--color-surface-hover)', color: 'var(--color-text-secondary)'}}>
          Cancel
        </button>
        <button type="submit" disabled={loading} className="auth-button">
          {loading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
); };

CreatePlaylistForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CreatePlaylistForm;