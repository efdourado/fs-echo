import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faEllipsis } from "@fortawesome/free-solid-svg-icons";

import { fetchAlbumById, fetchPlaylistById } from "../../../api/api";

import SongList from "../../../components/songs/SongList";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import SoundWave from "../../../components/ui/SoundWave";

import { useSongMenu } from "../../../context/SongMenuContext";
import { usePlayer } from "../../../hooks/usePlayer";

import fallbackImage from "/fb.jpg";

const Collection = ({ collectionId, type = "album" }) => {
  const [collection, setCollection] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { startPlayback, playContext, isPlaying, togglePlayPause } =
    usePlayer();
  const [isHovered, setIsHovered] = useState(false);
  const { openMenu } = useSongMenu();

  useEffect(() => {
    const loadCollectionData = async () => {
      try {
        setLoading(true);
        const fetcher = type === "album" ? fetchAlbumById : fetchPlaylistById;
        const collectionData = await fetcher(collectionId);

        setCollection(collectionData);

        const tracks =
          type === "playlist"
            ? collectionData.songs.map((item) => item.song).filter(Boolean)
            : collectionData.songs || [];
        setSongs(tracks);
      } catch (error) {
        console.error(`Error loading ${type} data:`, error);
      } finally {
        setLoading(false);
    } };

    if (collectionId) {
      loadCollectionData();
  } }, [collectionId, type]);

  const isCollectionCurrentlyPlaying =
    playContext?.type === type && playContext?.id === collectionId && isPlaying;

  if (loading) return <LoadingSpinner />;
  if (!collection)
    return (
      <div className="collection-view error">Failed to load collection.</div>
    );

  const handlePlayCollection = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (playContext?.type === type && playContext?.id === collectionId) {
      togglePlayPause();
    } else if (songs && songs.length > 0) {
      startPlayback(songs, { type, id: collectionId });
  } };

  const handleMenuClick = (song) => {
    openMenu(song);
  };

  const collectionName =
    type === "playlist" ? collection.name : collection.title;
  const ownerName =
    type === "playlist"
      ? collection.owner?.username || collection.owner?.name
      : collection.artist?.name;
  const coverImageUrl = collection.coverImage || fallbackImage;
  const detailPath = `/${type}/${collection._id}`;

  return (
    <Link to={detailPath} style={{ textDecoration: "none", color: "inherit" }}>
      <div
        className={`collection-view__content ${
          isCollectionCurrentlyPlaying ? "is-playing" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="collection-view__info-panel">
          <div className="collection-view__cover-art">
            <img src={coverImageUrl} alt={collectionName} />
          </div>

          <div className="collection-view__details">
            <h1 className="collection-view__title">
              {collectionName}
              {isCollectionCurrentlyPlaying && <SoundWave />}
            </h1>
            <p className="collection-view__owner">By {ownerName}</p>
            <div className="collection-view__meta">
              {type === "album" && collection.releaseDate && (
                <span>{new Date(collection.releaseDate).getFullYear()}</span>
              )}
              {songs.length > 0 && <span className="meta-divider">•</span>}
              {songs.length > 0 && <span>{songs.length} songs</span>}
            </div>
            {collection.description && (
              <p className="collection-view__description">
                {collection.description}
              </p>
            )}

            <div
              className={`collection-view__actions ${
                isHovered || isCollectionCurrentlyPlaying ? "visible" : ""
              }`}
            >
              <button className="action-btn menu" aria-label="More options">
                <FontAwesomeIcon icon={faEllipsis} />
              </button>

              <button
                className="action-btn play"
                onClick={handlePlayCollection}
                aria-label={`Play ${collectionName}`}
              >
                <FontAwesomeIcon
                  icon={isCollectionCurrentlyPlaying ? faPause : faPlay}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="collection-view__tracks-panel">
          <SongList
            songs={songs}
            showHeader={false}
            displayAll={true}
            showNumber={true}
            onMenuClick={handleMenuClick}
          />
        </div>
      </div>
    </Link>
); };

Collection.propTypes = {
  collectionId: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["album", "playlist"]),
};

export default Collection;