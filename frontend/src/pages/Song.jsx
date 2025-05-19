import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/shared/Header";
import { usePlayer } from "../hooks/usePlayer";
import SongHero from "./songs/SongHero";
import { fetchSongById } from "../../api/api";

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
    return (
      <div className="song-page">
        <Header />
        <div className="loading-message">Carregando música...</div>
      </div>
    );
  }

  if (error || !currentSong) {
    return (
      <div className="song-page">
        <Header />
        <div className="error-message">{error || "Erro ao carregar música."}</div>
      </div>
    );
  }

  return (
    <div className="song-page">
      <Header />
      <SongHero song={currentSong} artist={artistObj} onPlayClick={handlePlay} />
    </div>
  );
};

export default SongPage;