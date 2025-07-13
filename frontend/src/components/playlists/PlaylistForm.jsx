import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { updatePlaylist } from '../../services/userService';

const PlaylistForm = ({ playlist, onSaved, onCancel, isSaving }) => {
  const [formData, setFormData] = useState({ name: '', description: '', coverImage: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (playlist) {
      setFormData({
        name: playlist.name || '',
        description: playlist.description || '',
        coverImage: playlist.coverImage || '',
      });
    }
  }, [playlist]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Playlist name is required.');
      return;
    }
    setError('');

    try {
      const response = await updatePlaylist(playlist._id, formData);
      onSaved(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update playlist.');
  } };

  return (
    <form onSubmit={handleSubmit} className="auth-form" style={{ padding: '0', maxWidth: 'none' }}>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label htmlFor="playlist-name">Name</label>
        <input id="playlist-name" type="text" name="name" value={formData.name} onChange={handleChange} required placeholder=" " />
      </div>
      <div className="form-group">
        <label htmlFor="playlist-description">Description</label>
        <textarea id="playlist-description" name="description" value={formData.description} onChange={handleChange} rows="3" placeholder=" " />
      </div>
      <div className="form-group">
        <label htmlFor="playlist-coverImage">Cover Image URL</label>
        <input id="playlist-coverImage" type="url" name="coverImage" value={formData.coverImage} onChange={handleChange} placeholder=" " />
      </div>
      <div className="admin-form__actions">
        <button type="button" onClick={onCancel} className="cta-button cancel" disabled={isSaving}>
          Cancel
        </button>
        <button type="submit" disabled={isSaving} className="cta-button secondary-cta">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
); };

PlaylistForm.propTypes = {
  playlist: PropTypes.object.isRequired,
  onSaved: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
};

export default PlaylistForm;