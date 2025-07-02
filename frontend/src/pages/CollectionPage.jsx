import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckDouble,
  faPlay,
  faPause,
  faHeart as faSolidHeart,
  faPen,
  faTrash,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";

import fallbackImage from "/fb.jpg";

import * as api from "../api/api";
import { deletePlaylist, removeSongFromPlaylist } from "../api/adminApi";

import { useAuth } from "../context/AuthContext";
import { useSongMenu } from "../context/SongMenuContext";
import { usePlayer } from "../hooks/usePlayer";

import SongList from "../components/songs/SongList";
import EditPlaylistModal from "../components/playlists/EditPlaylistModal";
import Card from "../components/ui/Card";
import LoadingSpinner from "../components/ui/LoadingSpinner";

import { normalizeDataForPage } from "../utils/syncer";

const fetchers = {
  artist: api.fetchArtistById,
  album: api.fetchAlbumById,
  playlist: api.fetchPlaylistById,
  song: api.fetchSongById,
};

const CollectionPage = ({ type }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { openMenu } = useSongMenu();

  const [rawData, setRawData] = useState(null);
  const [normalizedData, setNormalizedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const { startPlayback, playContext, isPlaying, togglePlayPause, playTrack } =
    usePlayer();

  const isOwner =
    currentUser &&
    rawData &&
    type === "playlist" &&
    currentUser._id === rawData.owner?._id;

  const loadPageData = async () => {
    setLoading(true);
    setError("");
    try {
      const fetcher = fetchers[type];
      if (!fetcher) throw new Error(`Invalid page type: ${type}`);

      const data = await fetcher(id);
      if (!data) throw new Error("Could not load data for this page.");

      setRawData(data);
      setNormalizedData(normalizeDataForPage(type, data));
    } catch (err) {
      setError(err.message);
      console.error(`Failed to load ${type} data:`, err);
    } finally {
      setLoading(false);
  } };

  useEffect(() => {
    if (id && type) {
      loadPageData();
    }
  }, [id, type]);

  const handleDelete = async () => {
    if (!isOwner) return;

    if (
      window.confirm(
        "Are you sure you want to delete this playlist? This action cannot be undone."
      )
    ) {
      try {
        await deletePlaylist(id);
        navigate("/library");
      } catch (err) {
        setError("Failed to delete playlist.");
        console.error("Failed to delete playlist:", err);
  } } };

  const handlePlaylistUpdated = (updatedPlaylistData) => {
    const updatedRawData = { ...rawData, ...updatedPlaylistData };
    setRawData(updatedRawData);
    setNormalizedData(normalizeDataForPage(type, updatedRawData));
  };

  const handleRemoveSong = async (songIdToRemove) => {
    try {
      await removeSongFromPlaylist(id, songIdToRemove);
      loadPageData();
    } catch (error) {
      console.error("Failed to remove song:", error);
      setError("Failed to remove song from playlist.");
  } };

  const handleOpenMenuForSong = (song) => {
    const menuContext = isOwner
      ? {
          source: "playlist",
          playlistId: id,
          onRemove: () => handleRemoveSong(song._id),
        }
      : null;
    openMenu(song, menuContext);
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <div className="error-message">{error}</div>;
  if (!normalizedData) return null;

  const {
    pageType,
    title,
    description,
    primaryImage,
    backgroundImage,
    mainContent,
    subContent,
    stats,
    isVerified,
  } = normalizedData;

  const isMainContentPlaying =
    playContext?.type === `${type}-main` && playContext?.id === id;

  const handlePlayMainContent = () => {
    if (type === "song") {
      if (isPlaying && playContext?.id === id) {
        togglePlayPause();
      } else {
        api.fetchSongById(id).then((songData) => playTrack(songData));
      }
    } else {
      if (isMainContentPlaying) {
        togglePlayPause();
      } else if (mainContent?.items?.length > 0) {
        startPlayback(mainContent.items, { type: `${type}-main`, id });
  } } };

  return (
    <>
      <div className="collection-page">
        <aside
          className="collection-page__left-column"
          style={{
            backgroundImage: `url(${backgroundImage || fallbackImage})`,
          }}
        >
          {mainContent && mainContent.type === "lyrics" && (
            <section className="entity-content-section">
              <h2 className="entity-content-section__title">
                {mainContent.title}
              </h2>
              <pre className="lyrics-text">{mainContent.items}</pre>
            </section>
          )}
        </aside>

        <main className="collection-page__right-column">
          <div className="collection-page__metadata">
        
            <h1 className="collection-page__title">{title}</h1>
            <p className="collection-page__description">{description}</p>

            {stats && (
              <div className="collection-page__stats">
                {stats.map((stat, index) => (
                  <React.Fragment key={index}>
                    {`${stat.value} ${stat.label}`}
                    {index < stats.length - 1 && <span className="stat-separator" style={{margin: '0 8px'}}> • </span>}
                  </React.Fragment>
                ))}  
              </div>
            )}

            <div className="collection-page__actions">
              <button
                className="action-button primary"
                onClick={handlePlayMainContent}
              >
                <FontAwesomeIcon
                  icon={isMainContentPlaying && isPlaying ? faPause : faPlay}
                />
                <span>
                  {isMainContentPlaying && isPlaying ? 'Pause' : 'Play'}
                </span>
              </button>
             
              {isOwner && (
                <>
                  <button
                    className="action-btn menu"
                    style={{backgroundColor: 'transparent'}}
                    onClick={() => setEditModalOpen(true)}
                  >
                    <FontAwesomeIcon icon={faEllipsis} />
                  </button>
                </>
              )}
            </div>
          </div>
          {mainContent && mainContent.type === "songs" && (
            <section className="entity-content-section">
              <h2 className="entity-content-section__title">
                {mainContent.title}
              </h2>

              <SongList
                songs={mainContent.items}
                showHeader={false}
                displayAll={true}
                showNumber={true}
                onMenuClick={handleOpenMenuForSong}
              />
            </section>
          )}

          {subContent && subContent.type === "albums" && (
            <section className="entity-content-section">
              <h2 className="entity-content-section__title">
                {subContent.title}
              </h2>
              <div className="albums-grid">
                {subContent.items.map((album) => (
                  <Card key={album._id} item={album} type="album" />
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      {isOwner && rawData && (
        <EditPlaylistModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          playlist={rawData}
          onPlaylistUpdated={handlePlaylistUpdated}
          onDelete={handleDelete} 
        />
      )}
    </>
); };

CollectionPage.propTypes = {
  type: PropTypes.oneOf(["artist", "album", "playlist", "song"]).isRequired,
};

export default CollectionPage;