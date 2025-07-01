import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchArtistById } from '../../api/api';
import { createArtist, updateArtist } from '../../api/adminApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ArtistForm = ({ id: propId, isModal = false, onClose, onSaved }) => {
  const params = useParams();
  const id = propId || params.id;
  const navigate = isModal ? null : useNavigate();
  const isEditing = Boolean(id);

  const [artist, setArtist] = useState({
    name: '',
    description: '',
    image: '',
    banner: '',
    genre: '',
    verified: false,
    socials: { instagram: '', x: '', youtube: '', tiktok: '' }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      fetchArtistById(id)
        .then(data => {
          const socials = data.socials || { instagram: '', x: '', youtube: '', tiktok: '' };
          setArtist({ ...data, genre: data.genre.join(', '), socials });
        })
        .catch(err => setError('Failed to fetch artist details.'))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleTextChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('socials.')) {
      const socialPlatform = name.split('.')[1];
      setArtist(prev => ({ ...prev, socials: { ...prev.socials, [socialPlatform]: value } }));
    } else {
      setArtist(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const submissionData = {
      ...artist,
      genre: artist.genre.split(',').map(g => g.trim()).filter(g => g),
    };

    try {
      if (isEditing) {
        await updateArtist(id, submissionData);
      } else {
        await createArtist(submissionData);
      }
      if (isModal) {
        onSaved();
        onClose();
      } else {
        navigate('/admin/artists');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save artist.');
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit}>
      <div className="admin-form-container">
        <div className="admin-form__grid">
          <div className="admin-form__group span-2">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={artist.name} onChange={handleTextChange} required />
          </div>
          <div className="admin-form__group span-2">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={artist.description} onChange={handleTextChange} rows="4"></textarea>
          </div>
          <div className="admin-form__group">
            <label>Artist Image URL</label>
            <input type="url" name="image" value={artist.image} onChange={handleTextChange} placeholder="https://..." />
            {artist.image && <img src={artist.image} alt="Preview" className="admin-form__preview-image" />}
          </div>
          <div className="admin-form__group">
            <label>Banner Image URL</label>
            <input type="url" name="banner" value={artist.banner} onChange={handleTextChange} placeholder="https://..." />
            {artist.banner && <img src={artist.banner} alt="Preview" className="admin-form__preview-image" />}
          </div>
          <div className="admin-form__group span-2">
            <label htmlFor="genre">Genres (comma-separated)</label>
            <input type="text" id="genre" name="genre" value={artist.genre} onChange={handleTextChange} placeholder="Hip-Hop, Pop, R&B" />
          </div>
          <div className="admin-form__group span-2 admin-form__checkbox-group">
            <input type="checkbox" id="verified" name="verified" checked={artist.verified} onChange={handleTextChange} />
            <label htmlFor="verified">Verified Artist</label>
          </div>
          <h2 className="span-2">Social Links</h2>
          <div className="admin-form__group">
            <label htmlFor="socials.instagram">Instagram</label>
            <input type="text" id="socials.instagram" name="socials.instagram" value={artist.socials.instagram} onChange={handleTextChange} placeholder="https://instagram.com/..." />
          </div>
          <div className="admin-form__group">
            <label htmlFor="socials.x">X (Twitter)</label>
            <input type="text" id="socials.x" name="socials.x" value={artist.socials.x} onChange={handleTextChange} placeholder="https://x.com/..." />
          </div>
          <div className="admin-form__group">
            <label htmlFor="socials.youtube">YouTube</label>
            <input type="text" id="socials.youtube" name="socials.youtube" value={artist.socials.youtube} onChange={handleTextChange} placeholder="https://youtube.com/..." />
          </div>
          <div className="admin-form__group">
            <label htmlFor="socials.tiktok">TikTok</label>
            <input type="text" id="socials.tiktok" name="socials.tiktok" value={artist.socials.tiktok} onChange={handleTextChange} placeholder="https://tiktok.com/..." />
          </div>
        </div>
        <button type="submit" className="admin-button-save" disabled={loading}>
          {loading ? 'Saving...' : (isEditing ? 'Update Artist' : 'Create Artist')}
        </button>
      </div>
    </form>
  );

  if (isModal) {
    return formContent;
  }

  return (
    <div className="admin-page">
      <h1>{isEditing ? 'Edit Artist' : 'Create New Artist'}</h1>
      {error && <p className="error-message">{error}</p>}
      {loading && !artist.name ? <LoadingSpinner /> : formContent}
    </div>
  );
};

export default ArtistForm;