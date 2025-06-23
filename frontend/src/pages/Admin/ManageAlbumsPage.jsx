import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAlbums } from '../../api/api';
import { deleteAlbum } from '../../api/adminApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ManageAlbumsPage = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAlbums = async () => {
    try {
      setLoading(true);
      const data = await fetchAlbums();
      setAlbums(data);
    } catch (err) {
      setError('Failed to fetch albums.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlbums();
  }, []);

  const handleDelete = async (albumId) => {
    if (window.confirm('Are you sure you want to delete this album?')) {
      try {
        await deleteAlbum(albumId);
        loadAlbums();
      } catch (err) {
        setError('Failed to delete album.');
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Albums</h1>
        <Link to="/admin/albums/new" className="admin-button-new">
          + Add New Album
        </Link>
      </div>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>Cover</th>
            <th>Title</th>
            <th>Artist</th>
            <th>Songs</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {albums.map(album => (
            <tr key={album._id}>
              <td>
                <img src={album.coverImage ? `http://localhost:3000${album.coverImage}`: '/images/fb.jpeg'} alt={album.title} className="admin-table-image" />
              </td>
              <td data-label="Title">{album.title}</td>
              <td data-label="Artist">{album.artist?.name || 'N/A'}</td>
              <td data-label="Songs">{album.songs?.length || 0}</td>
              <td data-label="Actions">
                <div className="admin-table-actions">
                  <Link to={`/admin/albums/edit/${album._id}`} className="admin-button-edit">Edit</Link>
                  <button onClick={() => handleDelete(album._id)} className="admin-button-delete">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageAlbumsPage;