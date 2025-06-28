import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle, faPauseCircle, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

import { fetchPlaylistById, fetchAlbumById } from "../../../api/api";
import { deletePlaylist } from "../../../api/adminApi";

import { useAuth } from "../../../context/AuthContext";
import { usePlayer } from "../../../hooks/usePlayer";

import EditPlaylistModal from '../../../components/playlists/EditPlaylistModal';
import SongList from "../../../components/songs/SongList";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

import fallbackImage from "/fb.jpeg";

const CollectionPage = ({ type }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { startPlayback, playContext, isPlaying, togglePlayPause } =
    usePlayer();
  const { currentUser } = useAuth();

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const loadCollection = async () => {
      setLoading(true);
      setError("");
      try {
        const fetcher =
          type === "playlist" ? fetchPlaylistById : fetchAlbumById;
        const data = await fetcher(id);
        setCollection(data);
      } catch (err) {
        setError(`Could not find or load this ${type}.`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCollection();
  }, [id, type]);

  const handlePlaylistUpdate = (updatedPlaylist) => {
    setCollection(updatedPlaylist);
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete the playlist "${collection.name}"?`
      )
    ) {
      try {
        await deletePlaylist(id);
        alert("Playlist deleted successfully!");
        navigate("/library");
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to delete the playlist."
  ); } } };

  const isThisCollectionPlaying =
    playContext?.type === type && playContext?.id === id;

  const isOwner =
    type === "playlist" &&
    currentUser &&
    collection &&
    collection.owner?._id === currentUser._id;

  const handlePlayCollection = () => {
    const tracks =
      type === "playlist"
        ? collection.songs.map((item) => item.song).filter(Boolean)
        : collection.songs.filter(Boolean);

    if (isThisCollectionPlaying) {
      togglePlayPause();
    } else if (tracks && tracks.length > 0) {
      startPlayback(tracks, { type, id });
  } };

  if (loading) {
    return <LoadingSpinner message={`Loading ${type}...`} />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!collection) {
    return <div className="error-message">Collection not found.</div>;
  }

  const displayData = {
    name: collection.name || collection.title,
    description:
      collection.description || `An album by ${collection.artist?.name}`,
    coverImage: collection.coverImage || fallbackImage,
    ownerName:
      type === "playlist"
        ? `Created by ${collection.owner?.username || "Unknown"}`
        : `Album by ${collection.artist?.name}`,
    tracks:
      type === "playlist"
        ? collection.songs.map((item) => item.song).filter(Boolean)
        : collection.songs.filter(Boolean),
    collectionType: type.charAt(0).toUpperCase() + type.slice(1),
  };

  return (
    <>
      <div className="collection-page">
        <div className="collection-header">
          <div className="collection-cover-art">
            <img
              src={displayData.coverImage}
              alt={`Cover for ${displayData.name}`}
              onError={(e) => {
                e.target.src = fallbackImage;
              }}
            />
          </div>
          <div className="collection-details">
            <p className="collection-type-label">
              {displayData.collectionType}
            </p>
            <h1 className="collection-name">{displayData.name}</h1>
            <p className="collection-description">{displayData.description}</p>
            <div className="collection-meta">
              <span className="collection-owner">{displayData.ownerName}</span>
              <span className="meta-divider">•</span>
              <span>{displayData.tracks.length} songs</span>
            </div>
          </div>
        </div>

        <div className="collection-actions">
          <button className="play-button-large" onClick={handlePlayCollection}>
            <FontAwesomeIcon
              icon={
                isThisCollectionPlaying && isPlaying
                  ? faPauseCircle
                  : faPlayCircle
              }
            />
            <span>
              {isThisCollectionPlaying && isPlaying ? "Pause" : "Play"}
            </span>
          </button>
          {isOwner && (
            <>
              <button
                className="play-button-large"
                onClick={() => setEditModalOpen(true)}
              >
                <FontAwesomeIcon icon={faEdit} />
                <span>Edit</span>
              </button>
              <button
                className="play-button-large"
                onClick={handleDelete}
                style={{ backgroundColor: "var(--color-error)" }}
              >
                <FontAwesomeIcon icon={faTrash} />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>

        <div className="collection-song-list">
          <SongList
            songs={displayData.tracks}
            showHeader={false}
            displayAll={true}
            showNumber={true}
          />
        </div>
      </div>

      {isOwner && (
        <EditPlaylistModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          playlist={collection}
          onPlaylistUpdated={handlePlaylistUpdate}
        />
      )}
    </>
); };

CollectionPage.propTypes = {
  type: PropTypes.oneOf(["playlist", "album"]).isRequired,
};

export default CollectionPage;