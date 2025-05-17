import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { usePlayer } from '../../hooks/usePlayer';
import SongHero from './SongHero';


import { songsArray } from '../../assets/db/songs';
import { artistArray } from '../../assets/db/artists';

const SongPage = () => {
  const { id } = useParams();
  const { playTrack, currentTrack } = usePlayer();
  const currentSong = songsArray.find((song) => song._id === id);
  const artistObj = artistArray.find((art) => art.name === currentSong?.artist) || {};

  useEffect(() => {
    if (currentSong && (!currentTrack || currentTrack._id !== currentSong._id)) {
      playTrack(currentSong);
    }
  }, [currentSong, currentTrack, playTrack]);

  if (!currentSong) {
    return (
      <div className="song-page">
        <Header />
        <div className="not-found">Song not found</div>
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