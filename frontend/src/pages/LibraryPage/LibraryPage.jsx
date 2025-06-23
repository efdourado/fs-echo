import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { getMyPlaylists } from '../../api/adminApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Card from '../../components/ui/Card';

const LibraryPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const { data } = await getMyPlaylists();
        setPlaylists(data);
      } catch (err) {
        setError('Failed to fetch your playlists. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
    } };
    fetchPlaylists();
  }, []);

  return (
    <div className="library-page">
      <div className="library-header">
        <h1>My Library</h1>

        <button className="create-playlist-btn">
          <FontAwesomeIcon icon={faPlus} />
          Create Playlist
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="playlists-grid">
          {playlists.length > 0 ? (
            playlists.map(playlist => (
              <Card key={playlist._id} item={playlist} type="playlist" />
            ))
          ) : (
            <div className="empty-state">
              <p>You haven't created any playlists yet.</p>
              <p>Click "Create Playlist" to get started!</p>
            </div>
          )}
        </div>
      )}
    </div>
); };

export default LibraryPage;