import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';

import { fetchPlaylistById } from '../../api/api';
import { usePlayer } from '../../hooks/usePlayer';

import LoadingSpinner from '../../components/ui/LoadingSpinner';
import SongList from '../../components/songs/SongList';
import fallbackImage from '/images/fb.jpeg';

const PlaylistPage = () => {
  const { id } = useParams();
  const { setSongs, playTrack } = usePlayer();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPlaylist = async () => {
      setLoading(true);
      setError('');
      try {
        const playlistData = await fetchPlaylistById(id);
        setPlaylist(playlistData);
      } catch (err) {
        setError('Could not find or load this playlist.');
        console.error(err);
      } finally {
        setLoading(false);
    } };
    loadPlaylist();
  }, [id]);

  const handlePlayPlaylist = () => {
    const tracks = playlist.songs.map(item => item.song).filter(Boolean);
    if (tracks && tracks.length > 0) {
      setSongs(tracks);
      playTrack(tracks[0]);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading playlist..." />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!playlist) {
    return <div className="error-message">Playlist not found.</div>;
  }

  const playlistTracks = playlist.songs.map(item => item.song).filter(Boolean);

  return (
    <div className="playlist-page">
      <div className="playlist-header">
        <div className="playlist-cover-art">
          <img 
            src={playlist.coverImage || fallbackImage} 
            alt={`Cover for ${playlist.name}`}
            onError={(e) => { e.target.src = fallbackImage; }}
          />
        </div>
        <div className="playlist-details">
          <p className="playlist-type">Playlist</p>
          <h1 className="playlist-name">{playlist.name}</h1>
          <p className="playlist-description">{playlist.description}</p>
          <div className="playlist-meta">
            <span className="playlist-owner">Created by {playlist.owner?.username || 'Unknown'}</span>
            <span className="meta-divider">•</span>
            <span>{playlistTracks.length} songs</span>
          </div>
        </div>
      </div>

      <div className="playlist-actions">
        <button className="play-button-large" onClick={handlePlayPlaylist}>
          <FontAwesomeIcon icon={faPlayCircle} />
          <span>Play</span>
        </button>
      </div>

      <div className="playlist-song-list">
        <SongList songs={playlistTracks} showHeader={false} displayAll={true} />
      </div>
    </div>
); };

export default PlaylistPage;