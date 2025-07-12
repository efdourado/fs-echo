import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { fetchAlbumById, fetchArtists, fetchSongs } from '../../services/collectionService';
import { createAlbum, updateAlbum } from '../../services/adminService';

import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AlbumForm = ({ id: propId, isModal = false, onClose, onSaved }) => {
  const params = useParams();
  const id = propId || params.id;
  const navigate = isModal ? null : useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    songs: [],
    releaseDate: '',
    genre: '',
    type: 'album',
    coverImage: ''
  });

  const [artists, setArtists] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFormData = async () => {
      setLoading(true);
      setError('');
      try {
        const [artistsRes, songsRes] = await Promise.all([fetchArtists(), fetchSongs()]);
        setArtists(artistsRes.data);
        setAllSongs(songsRes.data);

        if (isEditing) {
          const { data: albumData } = await fetchAlbumById(id);
          setFormData({
            ...albumData,
            artist: albumData.artist?._id || '',
            songs: albumData.songs?.map(s => s._id) || [],
            genre: albumData.genre?.join(', ') || '',
            releaseDate: albumData.releaseDate ? albumData.releaseDate.split('T')[0] : ''
        }); }
      } catch (err) {
        setError('Failed to load required data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
    } };

    loadFormData();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSongSelection = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, songs: selectedIds }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setError('');

    const submissionData = {
      ...formData,
      genre: formData.genre.split(',').map(g => g.trim()).filter(g => g),
    };

    try {
      if (isEditing) {
        await updateAlbum(id, submissionData);
      } else {
        await createAlbum(submissionData);
      }
      if (isModal) {
        onSaved();
        onClose();
      } else {
        navigate('/admin/albums');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save the album.');
    } finally {
      setSaving(false);
  } };
  
  const formContent = (
    <form onSubmit={handleSubmit}>
      <div className="admin-form-container">
        <div className="admin-form__grid">
          <div className="admin-form__group span-2">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required disabled={saving} />
          </div>
          <div className="admin-form__group">
            <label htmlFor="artist">Artist</label>
            <select id="artist" name="artist" value={formData.artist} onChange={handleChange} required disabled={saving}>
              <option value="" disabled>Select an artist</option>
              {artists.map(artist => <option key={artist._id} value={artist._id}>{artist.name}</option>)}
            </select>
          </div>
          <div className="admin-form__group">
            <label htmlFor="type">Type</label>
            <select id="type" name="type" value={formData.type} onChange={handleChange} disabled={saving}>
              <option value="album">Album</option>
              <option value="single">Single</option>
              <option value="ep">EP</option>
              <option value="compilation">Compilation</option>
            </select>
          </div>
          <div className="admin-form__group">
            <label htmlFor="releaseDate">Release Date</label>
            <input type="date" id="releaseDate" name="releaseDate" value={formData.releaseDate} onChange={handleChange} required disabled={saving} />
          </div>
          <div className="admin-form__group">
            <label htmlFor="genre">Genres (comma-separated)</label>
            <input type="text" id="genre" name="genre" value={formData.genre} onChange={handleChange} disabled={saving} />
          </div>
          <div className="admin-form__group span-2">
            <label htmlFor="songs">Songs (Hold Ctrl/Cmd to select multiple)</label>
            <select id="songs" name="songs" value={formData.songs} onChange={handleSongSelection} multiple className="admin-form__multiselect" disabled={saving} style={{ height: '200px' }}>
              {allSongs.map(song => (
                <option key={song._id} value={song._id}>
                  {song.title} - {song.artist?.name || 'Unknown Artist'}
                </option>
              ))}
            </select>
          </div>
          <div className="admin-form__group span-2">
            <label>Cover Image URL</label>
            <input type="url" name="coverImage" value={formData.coverImage} onChange={handleChange} disabled={saving} placeholder="https://example.com/image.jpg" />
          </div>
        </div>
      </div>
      <button type="submit" className="admin-button-save" disabled={loading || saving}>
        {saving ? 'Saving...' : (isEditing ? 'Update Album' : 'Create Album')}
      </button>
    </form>
  );

  if (isModal) {
    return formContent;
  }

  return (
    <div className="admin-page">
      <h1>{isEditing ? 'Edit Album' : 'Create New Album'}</h1>
      {error && <p className="error-message">{error}</p>}
      {loading ? <LoadingSpinner message="Loading album data..." /> : formContent}
    </div>
); };

export default AlbumForm;