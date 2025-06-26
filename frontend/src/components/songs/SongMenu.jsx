import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useSongMenu } from "../../context/SongMenuContext";
import {
  getMyPlaylists,
  addSongToPlaylist,
  createPlaylist,
} from "../../api/adminApi";

import Modal from "../ui/Modal";
import LoadingSpinner from "../ui/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMusic,
  faCheckCircle,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

// Um sub-componente para o formulário de criação
const CreatePlaylistView = ({ song, onPlaylistCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Playlist name is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const newPlaylist = await createPlaylist({ name, description });
      await addSongToPlaylist(newPlaylist._id, song._id);
      onPlaylistCreated(newPlaylist);
    } catch (err) {
      setError("Failed to create playlist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label htmlFor="playlist-name">Name</label>
        <input
          id="playlist-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My New Playlist"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="playlist-description">Description (Optional)</label>
        <textarea
          id="playlist-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
        ></textarea>
      </div>
      <button type="submit" disabled={loading} className="auth-button">
        {loading ? "Creating..." : `Create and Add Song`}
      </button>
    </form>
  );
};

// O componente principal do menu
const SongMenu = () => {
  const { isMenuOpen, song, closeMenu } = useSongMenu();
  const [view, setView] = useState("list"); // 'list' ou 'create'
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(""); // Para mensagens de erro ou sucesso

  useEffect(() => {
    if (isMenuOpen) {
      setLoading(true);
      setFeedback("");
      setView("list"); // Sempre reseta para a visão inicial ao abrir
      getMyPlaylists()
        .then((response) => setPlaylists(response.data))
        .catch(() => setFeedback("Could not load your playlists."))
        .finally(() => setLoading(false));
    }
  }, [isMenuOpen]);

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await addSongToPlaylist(playlistId, song._id);
      const playlist = playlists.find((p) => p._id === playlistId);
      setFeedback(`Added to "${playlist.name}"!`);
      setTimeout(closeMenu, 1500);
    } catch (err) {
      setFeedback(err.response?.data?.message || "Failed to add song.");
    }
  };

  const handlePlaylistCreated = (newPlaylist) => {
    setFeedback(`Added to "${newPlaylist.name}"!`);
    setTimeout(closeMenu, 1500);
  };

  if (!isMenuOpen || !song) {
    return null;
  }

  return (
    <Modal
      isOpen={isMenuOpen}
      onClose={closeMenu}
      title={feedback ? "" : `Song Options`}
    >
      {feedback ? (
        <div
          className="add-to-playlist-feedback success"
          style={{
            color: feedback.includes("Failed")
              ? "var(--color-error)"
              : "var(--color-success)",
          }}
        >
          {feedback.includes("Failed") ? null : (
            <FontAwesomeIcon icon={faCheckCircle} />
          )}
          <p>{feedback}</p>
        </div>
      ) : loading ? (
        <LoadingSpinner fullScreen={false} />
      ) : view === "list" ? (
        <>
          <ul className="playlist-selection-list">
            <li>
              <button onClick={() => setView("create")}>
                <FontAwesomeIcon icon={faPlus} className="playlist-icon" />
                <span>Create New Playlist</span>
              </button>
            </li>
            {playlists.map((playlist) => (
              <li key={playlist._id}>
                <button onClick={() => handleAddToPlaylist(playlist._id)}>
                  <FontAwesomeIcon icon={faMusic} className="playlist-icon" />
                  <span>{playlist.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <CreatePlaylistView
          song={song}
          onPlaylistCreated={handlePlaylistCreated}
        />
      )}
    </Modal>
); };

export default SongMenu;