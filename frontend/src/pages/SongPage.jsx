import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { usePlayer } from "../hooks/usePlayer";
import { fetchSongById } from "../api/api";
import fallbackImage from "/fb.jpeg";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { formatDuration } from "../utils/duration";

const SongPage = () => {
  const { id } = useParams();
  const { playTrack, togglePlayPause, currentTrack, isPlaying } = usePlayer();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSong = async () => {
      setLoading(true);
      setError("");
      try {
        const songData = await fetchSongById(id);
        setSong(songData);
      } catch (err) {
        console.error("Error fetching song:", err);
        setError("Song not found or an error occurred.");
        setSong(null);
      } finally {
        setLoading(false);
      }
    };
    loadSong();
  }, [id]);

  const isCurrentSongPlaying = useMemo(() => {
    return currentTrack?._id === song?._id && isPlaying;
  }, [currentTrack, song, isPlaying]);

  const handlePlayPauseClick = () => {
    if (song) {
      if (currentTrack?._id === song._id) {
        togglePlayPause();
      } else {
        playTrack(song);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading song..." />;
  }

  if (error || !song) {
    return (
      <div className="song-page">
        <div className="error-message">{error || "Failed to load song details."}</div>
      </div>
    );
  }

  const { title, artist, coverImage, duration, releaseDate, genre } = song;
  const heroStyle = {
    backgroundImage: `url(${coverImage || fallbackImage})`,
  };

  return (
    <div className="song-page">
      <header className="song-hero" style={heroStyle}>
        <div className="song-hero__overlay"></div>
        <div className="song-hero__content">
          <div className="song-hero__cover-art">
            <img
              src={coverImage || fallbackImage}
              alt={`Cover for ${title}`}
              onError={(e) => {
                e.target.src = fallbackImage;
              }}
            />
          </div>
          <div className="song-hero__info">
            <span className="song-hero__type">Song</span>
            <h1 className="song-hero__title">{title}</h1>
            <div className="song-hero__meta">
              {artist && (
                <Link to={`/artist/${artist._id}`} className="song-hero__artist">
                  <img
                    src={artist.image || fallbackImage}
                    alt={artist.name}
                    className="song-hero__artist-avatar"
                  />
                  <span>{artist.name}</span>
                </Link>
              )}
              {releaseDate && (
                <>
                  <span className="song-hero__meta-dot">•</span>
                  <span>{new Date(releaseDate).getFullYear()}</span>
                </>
              )}
              {duration && (
                <>
                  <span className="song-hero__meta-dot">•</span>
                  <span>{formatDuration(duration)}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="song-page__main-content">
        <div className="song-page__actions">
          <button
            className="play-button-large"
            onClick={handlePlayPauseClick}
            aria-label={isCurrentSongPlaying ? "Pause" : "Play"}
          >
            <FontAwesomeIcon icon={isCurrentSongPlaying ? faPause : faPlay} />
          </button>
          {/* Outros botões como 'Like', 'Share', etc. podem ser adicionados aqui */}
        </div>
        
        <div className="song-page__details-section">
            <h2 className="section-title">Details</h2>
            <div className="details-grid">
                {artist && (
                    <div className="detail-item">
                        <span className="detail-label">Artist</span>
                        <span className="detail-value">{artist.name}</span>
                    </div>
                )}
                {song.album && (
                    <div className="detail-item">
                        <span className="detail-label">Album</span>
                        <span className="detail-value">{song.album.title}</span>
                    </div>
                )}
                 {releaseDate && (
                    <div className="detail-item">
                        <span className="detail-label">Released</span>
                        <span className="detail-value">{new Date(releaseDate).toLocaleDateString()}</span>
                    </div>
                )}
                {genre && genre.length > 0 && (
                     <div className="detail-item">
                        <span className="detail-label">Genre</span>
                        <span className="detail-value">{genre.join(', ')}</span>
                    </div>
                )}
            </div>
        </div>

        {song.lyrics && (
          <div className="song-page__lyrics-section">
            <h2 className="section-title">Lyrics</h2>
            <pre className="lyrics-text">{song.lyrics}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongPage;