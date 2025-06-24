import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faPlay,
  faPause,
  faEllipsis,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";

import { fetchArtistById, fetchSongs, fetchAlbums } from "../api/api";

import { usePlayer } from "../hooks/usePlayer";

import Modal from "../components/ui/Modal";
import AddToPlaylistModal from "../components/songs/AddToPlaylistModal";

import SongList from "../components/songs/SongList";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import fallbackImage from '/images/fb.jpeg';

const SoundWave = () => (
  <div className="sound-wave-overlay">
    <div className="sound-wave-bar"></div>
    <div className="sound-wave-bar"></div>
    <div className="sound-wave-bar"></div>
  </div>
);

const ArtistPage = () => {
  const { id } = useParams();

  const { startPlayback, playContext, isPlaying, togglePlayPause, playTrack } = usePlayer();

  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showAllSongs, setShowAllSongs] = useState(false);

  const [isAddToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    const loadArtistData = async () => {
      setLoading(true);
      try {
        const [fetchedArtist, allSongs, allAlbums] = await Promise.all([
          fetchArtistById(id),
          fetchSongs(),
          fetchAlbums()
        ]);

        if (!fetchedArtist) {
          throw new Error("Artist not found");
        }

        const artistSongs = allSongs.filter(song =>
          song?.artist?._id === fetchedArtist._id
        );
        artistSongs.sort((a, b) => (b.plays || 0) - (a.plays || 0));

        const artistAlbums = allAlbums.filter(album =>
          album?.artist?._id === fetchedArtist._id
        );
        artistAlbums.sort((a,b) => new Date(b.releaseDate) - new Date(a.releaseDate));

        setArtist(fetchedArtist);
        setSongs(artistSongs);
        setAlbums(artistAlbums);
      } catch (error) {
        console.error("Error fetching artist data:", error);
        setArtist(null);
      } finally {
        setLoading(false);
    } };
    loadArtistData();
  }, [id]);

  const topSongsContext = { type: 'artist-top-songs', id };
  const isTopSongsPlaying = playContext?.type === topSongsContext.type && playContext?.id === topSongsContext.id;

  const handlePlayAllArtistTopSongs = () => {
    const songsToPlay = showAllSongs ? songs : songs.slice(0, 5);
    if (isTopSongsPlaying) {
      togglePlayPause();
    } else if (songsToPlay.length > 0 && songsToPlay[0].audioUrl) {
      startPlayback(songsToPlay, topSongsContext);
    }
  };

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleMenuClick = (song) => {
    setSelectedSong(song);
    setAddToPlaylistModalOpen(true);
  };

  if (loading) return <LoadingSpinner />;
  if (!artist) return <div className="artist-page"><div className="error-message">Artist not found.</div></div>;

  const { name, image: artistImage, banner, description, monthlyListeners, followers, genre, socials, verified } = artist;
  const formatNumber = (num) => num >= 1000000 ? `${(num / 1000000).toFixed(1)}M` : num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num?.toString() || '0';
  const displayedSongs = showAllSongs ? songs : songs.slice(0, 5);

  return (
    <div className="artist-page">
      <div className="artist-header" style={{ backgroundImage: `url(${banner || fallbackImage})` }}>
        <div className="artist-header-overlay"></div>
        <div className="artist-header-content">
          <div className="artist-header__main-info">
            <div className="artist-header__image-container">
              <img src={artistImage || fallbackImage} alt={`${name}'s profile`} className="artist-header__image" onError={(e) => { e.target.src = fallbackImage; e.target.onerror = null; }} />
            </div>
            <div className="artist-info">
              {verified && <span className="verified-badge"><FontAwesomeIcon icon={faCheckCircle} /> Verified Artist</span>}
              <h1 className="artist-name">{name}</h1>
              <p className="artist-description">{description}</p>
              <div className="artist-stats">
                <span>{formatNumber(monthlyListeners)} monthly listeners</span>
                <span className="stat-divider">•</span>
                <span>{formatNumber(followers)} followers</span>
                {genre.length > 0 && (<><span className="stat-divider">•</span><span>{genre.join(", ")}</span></>)}
              </div>
            </div>
          </div>
          <div className="artist-actions">

            <button className="play-button" onClick={handlePlayAllArtistTopSongs} disabled={songs.length === 0}>
              <FontAwesomeIcon icon={isTopSongsPlaying && isPlaying ? faPause : faPlay} />
              {isTopSongsPlaying && isPlaying ? 'Pause' : 'Play'}
            </button>
            <button className={`follow-button ${isFollowing ? 'following' : ''}`} onClick={toggleFollow}>
              <FontAwesomeIcon icon={isFollowing ? faHeart : faRegularHeart} />
              {isFollowing ? 'Following' : 'Follow'}
            </button>
            <button className="more-button" aria-label="More options"><FontAwesomeIcon icon={faEllipsis} /></button>
          </div>
        </div>
      </div>

      <div className="artist-content-container">
        <div className="artist-content">
          <main className="artist-main-content">
            <section className="popular-section">
              <div className="section-header">
                <h2>Popular</h2>
                {songs.length > 5 && <button className="see-all" onClick={() => setShowAllSongs(!showAllSongs)}>{showAllSongs ? 'Show Less' : `See All (${songs.length})`}</button>}
              </div>
              {displayedSongs.length > 0 ? <SongList songs={displayedSongs} showCount={false} onMenuClick={handleMenuClick} showNumber={true} /> : <p className="empty-state">No popular songs found for this artist.</p>}
            </section>

            {albums.length > 0 && (
              <section className="albums-section">
                <div className="section-header">
                  <h2>Albums</h2>
                  <Link to={`/artist/${id}/albums`} className="see-all">See All</Link>
                </div>
                <div className="albums-grid">
                  {albums.slice(0, 6).map(album => {

                    const isThisAlbumPlaying = playContext?.type === 'album' && playContext?.id === album._id;
                    return (
                      <Link to={`/album/${album._id}`} key={album._id} className="album-card-link">
                        <div className={`album-card ${isThisAlbumPlaying && isPlaying ? 'is-playing' : ''}`}>
                          <div className="album-cover-container">
                            <img src={album.coverImage || fallbackImage} alt={album.title || 'Album cover'} className="album-cover" loading="lazy" onError={(e) => { e.target.src = fallbackImage; e.target.onerror = null; }} />
                            {/* NOVO: Adiciona a onda sonora quando o álbum está tocando */}
                            {isThisAlbumPlaying && isPlaying && <SoundWave />}
                            <button
                              type="button"
                              className="album-play-button"
                              aria-label={`Play album ${album.title}`}
                              onClick={(e) => {
                                e.preventDefault();

                                if (isThisAlbumPlaying) {
                                  togglePlayPause();
                                } else if (album.songs && album.songs.length > 0) {
                                  startPlayback(album.songs, { type: 'album', id: album._id });
                                }
                              }}
                            >
                              <FontAwesomeIcon icon={isThisAlbumPlaying && isPlaying ? faPause : faPlay} />
                            </button>
                          </div>
                          <div className="album-info">
                            <h3 className="album-title" title={album.title}>{album.title}</h3>
                            <p className="album-year">{new Date(album.releaseDate).getFullYear()} • {album.type || 'Album'}</p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}
          </main>

          <aside className="artist-sidebar">
            <div className="sidebar-section">
              <h3>About {name}</h3>
              <div className="artist-bio">
                <p>{description}</p>
              </div>
            </div>

            <div className="sidebar-section">
              <h3>Stats</h3>
              <div className="stats-cards">
                <div className="stat-card">
                  <span className="stat-value">{formatNumber(monthlyListeners)}</span>
                  <span className="stat-label">Monthly Listeners</span>
                </div>
                
                <div className="stat-card">
                  <span className="stat-value">{formatNumber(followers)}</span>
                  <span className="stat-label">Followers</span>
                </div>
                
                <div className="stat-card">
                  <span className="stat-value">{formatNumber(songs.length)}</span>
                  <span className="stat-label">Songs</span>
                </div>
                
                <div className="stat-card">
                  <span className="stat-value">{formatNumber(albums.length)}</span>
                  <span className="stat-label">Albums</span>
                </div>
              </div>
            </div>
            
            {Object.values(socials).some(val => val) && (
              <div className="sidebar-section">
                <h3>Social Links</h3>
                <div className="social-links-artist-page">
                  {socials.instagram && (
                    <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="social-link-item">
                      <span className="social-icon instagram">IG</span>
                      <span>Instagram</span>
                    </a>
                  )}
                  
                  {socials.x && (
                    <a href={socials.x} target="_blank" rel="noopener noreferrer" className="social-link-item">
                      <span className="social-icon twitter">X</span>
                      <span>X (Twitter)</span>
                    </a>
                  )}
                  
                  {socials.youtube && (
                    <a href={socials.youtube} target="_blank" rel="noopener noreferrer" className="social-link-item">
                      <span className="social-icon youtube">YT</span>
                      <span>YouTube</span>
                    </a>
                  )}
                  
                  {socials.tiktok && (
                    <a href={socials.tiktok} target="_blank" rel="noopener noreferrer" className="social-link-item">
                      <span className="social-icon tiktok">TT</span>
                      <span>TikTok</span>
                    </a>
                  )}
                </div>
              </div>)}
          </aside>
        </div>
      </div>
      
      {selectedSong && (<Modal isOpen={isAddToPlaylistModalOpen} onClose={() => setAddToPlaylistModalOpen(false)} title="Add to Playlist"><AddToPlaylistModal song={selectedSong} onClose={() => setAddToPlaylistModalOpen(false)} /></Modal>)}
    </div>
); };

export default ArtistPage;