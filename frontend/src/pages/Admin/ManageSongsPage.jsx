import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchSongs } from '../../api/api';
import { deleteSong } from '../../api/adminApi';
import { formatDuration } from '../../utils/duration';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ManageSongsPage = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSongs = async () => {
    try {
      setLoading(true);
      const data = await fetchSongs();
      setSongs(data);
    } catch (err) {
      setError('Failed to fetch songs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  const handleDelete = async (songId) => {
    if (window.confirm('Are you sure you want to delete this song?')) {
      try {
        await deleteSong(songId);
        loadSongs();
      } catch (err) {
        setError('Failed to delete song.');
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Songs</h1>
        <Link to="/admin/songs/new" className="admin-button-new">
          + Add New Song
        </Link>
      </div>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>Cover</th>
            <th>Title</th>
            <th>Artist</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {songs.map(song => (
            <tr key={song._id}>
              <td>
                <img src={song.coverImage ? `http://localhost:3000${song.coverImage}`: '/images/fb.jpeg'} alt={song.title} className="admin-table-image" />
              </td>
              <td data-label="Title">{song.title}</td>
              <td data-label="Artist">{song.artist?.name || 'N/A'}</td>
              <td data-label="Duration">{formatDuration(song.duration)}</td>
              <td data-label="Actions">
                <div className="admin-table-actions">
                  <Link to={`/admin/songs/edit/${song._id}`} className="admin-button-edit">Edit</Link>
                  <button onClick={() => handleDelete(song._id)} className="admin-button-delete">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageSongsPage;