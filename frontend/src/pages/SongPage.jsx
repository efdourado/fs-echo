import React, { useEffect, useCallback, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { usePlayer } from "../hooks/usePlayer";
import { fetchSongById } from "../api/api";
import fallbackImage from "/fb.png";

const SongPage = () => {
  const { id } = useParams();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  const [currentSong, setCurrentSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [artistObj, setArtistObj] = useState(null);

  const handlePlay = useCallback(() => {
    if (currentSong && (!currentTrack || currentTrack._id !== currentSong._id)) {
      playTrack(currentSong);
    }
  }, [currentSong, currentTrack, playTrack]);

  useEffect(() => {
    const loadSong = async () => {
      try {
        const song = await fetchSongById(id);
        setCurrentSong(song);
        setArtistObj(song.artist || null);
      } catch (err) {
        console.error(err);
        setError("Música não encontrada.");
      } finally {
        setLoading(false);
      }
    };

    loadSong();
  }, [id]);

  useEffect(() => {
    if (currentSong && !isPlaying) {
      handlePlay();
    }
  }, [currentSong, isPlaying, handlePlay]);

  if (loading) {
    return <div className="song-page"><div className="loading-message">Carregando música...</div></div>;
  }

  if (error || !currentSong) {
    return <div className="song-page"><div className="error-message">{error || "Erro ao carregar música."}</div></div>;
  }

  return (
    <div className="song-page">
      <div className="song-hero">
        <div className="song-hero__gradient">
          <div className="song-hero__image-container">
            <img
              src={currentSong.coverImage || fallbackImage}
              alt={`${currentSong.title} cover`}
              onError={(e) => { e.target.src = fallbackImage; }}
            />
          </div>
        </div>

        <div className="song-info-bar">
          <Link to={`/artist/${artistObj._id}`} className="song-info-bar__artist">
            <img
              src={artistObj.image || fallbackImage}
              alt={`${artistObj.name}`}
              onError={(e) => { e.target.src = fallbackImage; }}
            />
          </Link>

          <div className="song-info-bar__details">
            <h1 className="song-title">{currentSong.title}</h1>
            <Link to={`/artist/${artistObj._id}`} className="artist-name">
              {artistObj.name}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongPage;