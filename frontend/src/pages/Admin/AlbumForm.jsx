import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { fetchAlbumById, fetchArtists, fetchSongs } from '../../api/api';

import { createAlbum, updateAlbum } from '../../api/adminApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AlbumForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [album, setAlbum] = useState({
    title: '', 
    artist: '', 
    songs: [], 
    releaseDate: '', 
    genre: '', 
    type: 'album', 
    coverImage: ''
  });
  
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArtists().then(setArtists).catch(() => setError('Could not load artists.'));
    fetchSongs().then(setSongs).catch(() => setError('Could not load songs.'));

    if (isEditing) {
      setLoading(true);
      fetchAlbumById(id)
        .then(data => {
          setAlbum({
            ...data,
            artist: data.artist?._id || '',
            songs: data.songs?.map(s => s._id) || [],
            genre: data.genre?.join(', ') || '',
            releaseDate: data.releaseDate ? data.releaseDate.split('T')[0] : ''
          });
        })
        .catch(err => setError('Failed to fetch album details.'))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlbum(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setAlbum(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const submissionData = {
        ...album,
        genre: album.genre.split(',').map(g => g.trim()).filter(g => g),
    };

    try {
      if (isEditing) {
        await updateAlbum(id, submissionData);
      } else {
        await createAlbum(submissionData);
      }
      navigate('/admin/albums');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save the album.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <h1>{isEditing ? 'Edit Album' : 'Create New Album'}</h1>
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="admin-form">
          <div className="form-grid">
            <div className="form-group span-2">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" name="title" value={album.title} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="artist">Artist</label>
              <select id="artist" name="artist" value={album.artist} onChange={handleChange} required>
                <option value="" disabled>Select an artist</option>
                {artists.map(artist => <option key={artist._id} value={artist._id}>{artist.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select id="type" name="type" value={album.type} onChange={handleChange}>
                <option value="album">Album</option>
                <option value="single">Single</option>
                <option value="ep">EP</option>
                <option value="compilation">Compilation</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="releaseDate">Release Date</label>
              <input type="date" id="releaseDate" name="releaseDate" value={album.releaseDate} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label htmlFor="genre">Genres (comma-separated)</label>
              <input type="text" id="genre" name="genre" value={album.genre} onChange={handleChange} />
            </div>

            <div className="form-group span-2">
              <label htmlFor="songs">Songs (Hold Ctrl/Cmd to select multiple)</label>
              <select id="songs" name="songs" value={album.songs} onChange={handleMultiSelectChange} multiple className="form-multiselect">
                {/* This is the line that has been fixed */}
                {songs.map(song => (
                  <option key={song._id} value={song._id}>
                    {song.title} - {song.artist?.name || 'Unknown Artist'}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group span-2">
              <label>Cover Image URL</label>
              <input type="url" name="coverImage" value={album.coverImage} onChange={handleChange} accept="image/*" />
              {album.coverImage && <img src={album.coverImage} alt="Preview" className="form-preview-image" />}
            </div>
          </div>
        </div>
        <button type="submit" className="admin-button-save" disabled={loading}>
          {loading ? 'Saving...' : 'Save Album'}
        </button>
      </form>
    </div>
  );
};

export default AlbumForm;