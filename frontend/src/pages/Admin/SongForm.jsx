import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSongById, fetchArtists, fetchAlbums } from '../../api/api';
import { createSong, updateSong } from '../../api/adminApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const SongForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [song, setSong] = useState({
    title: '', artist: '', album: '', releaseDate: '', isExplicit: false, genre: '', lyrics: ''
  });
  const [coverFile, setCoverFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArtists().then(setArtists).catch(() => setError('Could not load artists.'));
    fetchAlbums().then(setAlbums).catch(() => setError('Could not load albums.'));

    if (isEditing) {
      setLoading(true);
      fetchSongById(id)
        .then(data => {
          setSong({
            ...data,
            artist: data.artist?._id || '',
            album: data.album?._id || '',
            genre: data.genre?.join(', ') || '',
            releaseDate: data.releaseDate ? data.releaseDate.split('T')[0] : ''
          });
          if (data.coverImage) setCoverPreview(`http://localhost:3000${data.coverImage}`);
        })
        .catch(err => setError('Failed to fetch song details.'))
        .finally(() => setLoading(false));
  } }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSong(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    if (name === 'coverImage') {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    } else if (name === 'audioUrl') {
      setAudioFile(file);
  } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing && !audioFile) {
        setError('An audio file is required to create a new song.');
        return;
    }
    setLoading(true);
    setError('');

    const formData = new FormData();
    // Append all text fields
    Object.keys(song).forEach(key => {
        if (key !== 'coverImage' && key !== 'audioUrl') {
             formData.append(key, song[key]);
    } });

    if (coverFile) formData.append('coverImage', coverFile);
    if (audioFile) formData.append('audioUrl', audioFile);

    try {
      if (isEditing) {
        await updateSong(id, formData);
      } else {
        await createSong(formData);
      }
      navigate('/admin/songs');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save the song.');
    } finally {
      setLoading(false);
  } };

  if (loading && isEditing) return <LoadingSpinner />;

  return (
    <div className="admin-page">
      <h1>{isEditing ? 'Edit Song' : 'Create New Song'}</h1>
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="admin-form">
          <div className="form-grid">
            <div className="form-group span-2">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" name="title" value={song.title} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="artist">Artist</label>
              <select id="artist" name="artist" value={song.artist} onChange={handleChange} required>
                <option value="" disabled>Select an artist</option>
                {artists.map(artist => <option key={artist._id} value={artist._id}>{artist.name}</option>)}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="album">Album (Optional)</label>
              <select id="album" name="album" value={song.album} onChange={handleChange}>
                <option value="">Select an album</option>
                {albums.map(album => <option key={album._id} value={album._id}>{album.title}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Cover Image</label>
              <input type="file" name="coverImage" onChange={handleFileChange} accept="image/*" />
              {coverPreview && <img src={coverPreview} alt="Preview" className="form-preview-image" />}
            </div>

            <div className="form-group">
              <label>Audio File {isEditing ? "(Optional: only to replace)" : "(Required)"}</label>
              <input type="file" name="audioUrl" onChange={handleFileChange} accept="audio/*" />
              {audioFile && <p>Selected: {audioFile.name}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="releaseDate">Release Date</label>
              <input type="date" id="releaseDate" name="releaseDate" value={song.releaseDate} onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <label htmlFor="genre">Genres (comma-separated)</label>
              <input type="text" id="genre" name="genre" value={song.genre} onChange={handleChange} />
            </div>

            <div className="form-group span-2">
              <label htmlFor="lyrics">Lyrics</label>
              <textarea id="lyrics" name="lyrics" value={song.lyrics} onChange={handleChange} rows="10"></textarea>
            </div>

            <div className="form-group span-2 form-group-checkbox">
              <input type="checkbox" id="isExplicit" name="isExplicit" checked={song.isExplicit} onChange={handleChange} />
              <label htmlFor="isExplicit">Explicit Content</label>
            </div>
          </div>
        </div>
        <button type="submit" className="admin-button-save" disabled={loading}>
          {loading ? 'Saving...' : (isEditing ? 'Update Song' : 'Create Song')}
        </button>
      </form>
    </div>
); };

export default SongForm;