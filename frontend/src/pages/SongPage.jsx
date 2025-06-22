import React, { useEffect, useCallback, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { usePlayer } from "../hooks/usePlayer";
import { fetchSongById } from "../api/api";
import fallbackImage from "/images/fb.jpeg";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const SongPage = () => {
  const { id } = useParams();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  const [currentSong, setCurrentSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handlePlay = useCallback(() => {
    if (currentSong && (!currentTrack || currentTrack._id !== currentSong._id)) {
      playTrack(currentSong);
    }
  }, [currentSong, currentTrack, playTrack]);

  useEffect(() => {
    const loadSong = async () => {
      setLoading(true);
      setError("");
      try {
        const song = await fetchSongById(id);
        setCurrentSong(song);
      } catch (err) {
        console.error("Error fetching song:", err);
        setError("Song not found or an error occurred.");
        setCurrentSong(null);
      } finally {
        setLoading(false);
} }; loadSong(); }, [id]);

  useEffect(() => {
    if (currentSong && currentSong.audioUrl && !isPlaying && (!currentTrack || currentTrack._id !== currentSong._id)) {
      handlePlay();
  } }, [currentSong, isPlaying, handlePlay, currentTrack]);


  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !currentSong) {
    return <div className="song-page"><div className="error-message">{error || "Failed to load song details."}</div></div>;
  }

  const artistObj = currentSong.artist;

  return (
    <div className="song-page">
      <div className="song-hero">
        <div className="song-hero__image-container">
          <img
            src={currentSong.coverImage || fallbackImage}
            alt={`Cover art for ${currentSong.title}`}
            onError={(e) => { e.target.src = fallbackImage; e.target.onerror = null; }}
          />
        </div>

        <div className="song-hero__info">
          <h1 className="song-title">{currentSong.title}</h1>
          {artistObj && ( // Check if artistObj exists
            <div className="song-artist-info">
              <Link to={`/artist/${artistObj._id}`} className="song-artist-info__image-link">
                <img
                  className="song-artist-info__image"
                  src={artistObj.image || fallbackImage}
                  alt={`View artist page for ${artistObj.name}`}
                  onError={(e) => { e.target.src = fallbackImage; e.target.onerror = null; }}
                />
              </Link>
              <Link to={`/artist/${artistObj._id}`} className="artist-name">
                {artistObj.name}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* placeholder for other content like lyrics, related songs, etc. */}
      {/* <div className="song-content container">
        {currentSong.lyrics && (
          <section className="song-lyrics">
            <h2>Lyrics</h2>
            <pre>{currentSong.lyrics}</pre>
          </section>
        )}
      </div> */}
    </div>
); };

export default SongPage;