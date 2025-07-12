import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { fetchSongById, fetchArtists, fetchAlbums } from '../../services/collectionService';
import { createSong, updateSong } from '../../services/adminService';

import LoadingSpinner from '../../components/ui/LoadingSpinner';

const SongForm = ({ id: propId, isModal = false, onClose, onSaved }) => {
  const params = useParams();
  const id = propId || params.id;
  const navigate = isModal ? null : useNavigate();
  const isEditing = Boolean(id);

  const [song, setSong] = useState({
    title: '',
    artist: '',
    album: '',
    releaseDate: '',
    isExplicit: false,
    genre: '',
    lyrics: '',
    coverImage: '',
    audioUrl: '',
    duration: 0,
  });

  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchArtists(), fetchAlbums()])
      .then(([artistsData, albumsData]) => {
        setArtists(artistsData);
        setAlbums(albumsData);
        if (isEditing) {
          return fetchSongById(id);
      } })
      
      .then(songData => {
        if (songData) {
          setSong({
            ...songData,
            artist: songData.artist?._id || '',
            album: songData.album?._id || '',
            genre: songData.genre?.join(', ') || '',
            releaseDate: songData.releaseDate ? songData.releaseDate.split('T')[0] : ''
      }); } })

      .catch(err => setError('Failed to load form data.'))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSong(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const submissionData = {
      ...song,
      genre: song.genre.split(',').map(g => g.trim()).filter(g => g),
    };

    try {
      if (isEditing) {
        await updateSong(id, submissionData);
      } else {
        await createSong(submissionData);
      }
      if (isModal) {
        onSaved();
        onClose();
      } else {
        navigate('/admin/songs');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save the song.');
    } finally {
      setLoading(false);
  } };

  const formContent = (
    <form onSubmit={handleSubmit}>
      <div className="admin-form-container">
        <div className="admin-form__grid">
          <div className="admin-form__group span-2">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" value={song.title} onChange={handleChange} required />
          </div>
          <div className="admin-form__group">
            <label htmlFor="artist">Artist</label>
            <select id="artist" name="artist" value={song.artist} onChange={handleChange} required>
              <option value="" disabled>Select an artist</option>
              {artists.map(artist => <option key={artist._id} value={artist._id}>{artist.name}</option>)}
            </select>
          </div>
          <div className="admin-form__group">
            <label htmlFor="album">Album (Optional)</label>
            <select id="album" name="album" value={song.album} onChange={handleChange}>
              <option value="">No Album</option>
              {albums.map(album => <option key={album._id} value={album._id}>{album.title}</option>)}
            </select>
          </div>
          <div className="admin-form__group">
            <label>Cover Image URL</label>
            <input type="url" name="coverImage" value={song.coverImage} onChange={handleChange} accept="image/*" />
          </div>
          <div className="admin-form__group">
            <label>Audio File URL</label>
            <input type="url" name="audioUrl" value={song.audioUrl} onChange={handleChange} required />
          </div>
          <div className="admin-form__group">
            <label htmlFor="duration">Duration (in seconds)</label>
            <input type="number" id="duration" name="duration" value={song.duration} onChange={handleChange} required />
          </div>
          <div className="admin-form__group">
            <label htmlFor="releaseDate">Release Date</label>
            <input type="date" id="releaseDate" name="releaseDate" value={song.releaseDate} onChange={handleChange} />
          </div>
          <div className="admin-form__group">
            <label htmlFor="genre">Genres (comma-separated)</label>
            <input type="text" id="genre" name="genre" value={song.genre} onChange={handleChange} />
          </div>
          <div className="admin-form__group span-2">
            <label htmlFor="lyrics">Lyrics</label>
            <textarea id="lyrics" name="lyrics" value={song.lyrics} onChange={handleChange} rows="10"></textarea>
          </div>
          <div className="admin-form__group span-2 admin-form__checkbox-group">
            <input type="checkbox" id="isExplicit" name="isExplicit" checked={song.isExplicit} onChange={handleChange} />
            <label htmlFor="isExplicit">Explicit Content</label>
          </div>
        </div>
      </div>
      <button type="submit" className="admin-button-save" disabled={loading}>
        {loading ? 'Saving...' : (isEditing ? 'Update Song' : 'Create Song')}
      </button>
    </form>
  );

  if (isModal) {
    return formContent;
  }
  
  return (
    <div className="admin-page">
      <h1>{isEditing ? 'Edit Song' : 'Create New Song'}</h1>
      {error && <p className="error-message">{error}</p>}
      {loading && isEditing ? <LoadingSpinner /> : formContent}
    </div>
); };

export default SongForm;