import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import { usePlayer } from "../../hooks/usePlayer";
import SongHero from "./SongHero";
import { fetchSongById } from "../../../api/api"; // ajuste o caminho se necessário

const SongPage = () => {
  const { id } = useParams();
  const { playTrack, currentTrack } = usePlayer();

  const [currentSong, setCurrentSong] = useState(null);
  const [artistObj, setArtistObj] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handlePlay = useCallback(() => {
    if (currentSong && (!currentTrack || currentTrack._id !== currentSong._id)) {
      playTrack(currentSong);
    }
  }, [currentSong, currentTrack, playTrack]);

  useEffect(() => {
    const getSong = async () => {
      try {
        const song = await fetchSongById(id);
        setCurrentSong(song);
        setArtistObj(song.artist || null);
      } catch (err) {
        console.error("Erro ao buscar música:", err);
        setError("Música não encontrada.");
      } finally {
        setLoading(false);
      }
    };

    getSong();
  }, [id]);

  useEffect(() => {
    if (currentSong) {
      handlePlay();
    }
  }, [currentSong, handlePlay]);

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
        <div className="not-found">{error || "Song not found"}</div>
      </div>
    );
  }

  return (
    <div className="song-page">
      <Header />
      <SongHero song={currentSong} artist={artistObj} />
    </div>
  );
};

export default SongPage;
