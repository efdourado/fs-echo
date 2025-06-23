import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchArtists } from '../../api/api';
import { deleteArtist } from '../../api/adminApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ManageArtistsPage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadArtists = async () => {
    try {
      setLoading(true);
      const data = await fetchArtists();
      setArtists(data);
    } catch (err) {
      setError('Failed to fetch artists.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArtists();
  }, []);

  const handleDelete = async (artistId) => {
    if (window.confirm('Are you sure you want to delete this artist? This action cannot be undone.')) {
      try {
        await deleteArtist(artistId);
        // Recarregar a lista de artistas após a exclusão
        loadArtists();
      } catch (err) {
        setError('Failed to delete artist.');
        console.error(err);
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Artists</h1>
        <Link to="/admin/artists/new" className="admin-button-new">
          + Add New Artist
        </Link>
      </div>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Genres</th>
            <th>Verified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {artists.map(artist => (
            <tr key={artist._id}>
              <td>
                <img src={artist.image || '/images/fb.jpeg'} alt={artist.name} className="admin-table-image" />
              </td>
              <td data-label="Name">{artist.name}</td>
              <td data-label="Genres">{artist.genre.join(', ')}</td>
              <td data-label="Verified">{artist.verified ? 'Yes' : 'No'}</td>
              <td data-label="Actions">
                <div className="admin-table-actions">
                  <Link to={`/admin/artists/edit/${artist._id}`} className="admin-button-edit">Edit</Link>
                  <button onClick={() => handleDelete(artist._id)} className="admin-button-delete">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageArtistsPage;