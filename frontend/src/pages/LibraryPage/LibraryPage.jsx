import React, { useState, useEffect } from "react";

import { getMyPlaylists } from "../../api/adminApi";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import CreatePlaylistForm from "./components/CreatePlaylistForm";

import CreatorCard from "./components/CreatorCard";

const LibraryPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const { data } = await getMyPlaylists();
      setPlaylists(data);
    } catch (err) {
      setError("Failed to fetch your playlists. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
  } };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handlePlaylistCreated = (newPlaylist) => {
    setIsModalOpen(false); // Close modal
    setPlaylists((prevPlaylists) => [newPlaylist, ...prevPlaylists]);
  };

  return (
    <div className="library-page">
      <div className="carousel__header">
        <h1 className="carousel__title">Your Library</h1>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="playlists-grid">
          {playlists.map((playlist) => (
            <div key={playlist._id} className="playlist-card-container">
              <Card item={playlist} type="playlist" />
            </div>
          ))}

          <CreatorCard onClick={() => setIsModalOpen(true)} />
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Playlist">
        <CreatePlaylistForm
          onSuccess={handlePlaylistCreated}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
); };

export default LibraryPage;