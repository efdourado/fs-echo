import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCheckCircle, 
  faPlay,
  faEllipsis,
  faClock,
  faHeart,
  faShare,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";

import { PlayerContext } from "../context/PlayerContext";
import { fetchArtistById, fetchSongs, fetchAlbums } from "../../api/api";
import SongList from "../components/song/SongList";
// import AlbumCard from "../components/album/AlbumCard";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";

const Artist = () => {
  const { id } = useParams();
  const { playTrack, currentTrack, isPlaying } = useContext(PlayerContext);

  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showAllSongs, setShowAllSongs] = useState(false);

  useEffect(() => {
  const loadArtistData = async () => {
    try {
      const [fetchedArtist, allSongs, allAlbums] = await Promise.all([
        fetchArtistById(id),
        fetchSongs(),
        fetchAlbums()
      ]);

      if (!fetchedArtist) {
        throw new Error("Artist not found");
      }

      // Filter songs where artist exists and matches the fetched artist
      const artistSongs = allSongs.filter(song => 
        song?.artist && song.artist._id === fetchedArtist._id
      );

      // Filter albums where artist exists and matches the fetched artist
      const artistAlbums = allAlbums.filter(album => 
        album?.artist && album.artist._id === fetchedArtist._id
      );

      setArtist(fetchedArtist);
      setSongs(artistSongs);
      setAlbums(artistAlbums);
    } catch (error) {
      console.error("Error fetching artist data:", error);
      setArtist(null); // Explicitly set to null to show error state
    } finally {
      setLoading(false);
    }
  };

  loadArtistData();
}, [id]);

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playTrack(songs[0]);
    }
  };

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    // Here you would typically call an API to follow/unfollow the artist
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
    </div>
  );

  if (!artist) return <div className="error-message">Artist not found</div>;

  const {
    name = "Unknown Artist",
    banner = "",
    description = "",
    monthlyListeners = 0,
    followers = 0,
    genre = [],
    socials = {},
    verified = false
  } = artist;

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const displayedSongs = showAllSongs ? songs : songs.slice(0, 5);

  return (
    <div className="artist-page">
      <Header />
      
      <div className="artist-header" style={{ backgroundImage: `url(${banner || '/fb.png'})` }}>
        <div className="artist-header-overlay"></div>
        <div className="artist-header-content">
          <div className="artist-info">
            {verified && (
              <span className="verified-badge">
                <FontAwesomeIcon icon={faCheckCircle} />
              </span>
            )}
            <h1 className="artist-name">{name}</h1>
            <p className="artist-description">{description}</p>
            
            <div className="artist-stats">
              <span>{formatNumber(monthlyListeners)} monthly listeners</span>
              <span>{formatNumber(followers)} followers</span>
              <span>{genre.join(", ")}</span>
            </div>
          </div>
          
          <div className="artist-actions">
            <button 
              className="play-button"
              onClick={handlePlayAll}
            >
              <FontAwesomeIcon icon={faPlay} /> Play
            </button>
            <button 
              className={`follow-button ${isFollowing ? 'following' : ''}`}
              onClick={toggleFollow}
            >
              <FontAwesomeIcon icon={isFollowing ? faHeart : faRegularHeart} />
              {isFollowing ? 'Following' : 'Follow'}
            </button>
            <button className="more-button">
              <FontAwesomeIcon icon={faEllipsis} />
            </button>
          </div>
        </div>
      </div>

      <div className="artist-content">
        <main className="artist-main-content">
          <section className="popular-section">
            <div className="section-header">
              <h2>Popular</h2>
              {songs.length > 5 && (
                <button 
                  className="see-all"
                  onClick={() => setShowAllSongs(!showAllSongs)}
                >
                  {showAllSongs ? 'Show Less' : 'See All'}
                </button>
              )}
            </div>
            
            <div className="songs-table">
              <div className="table-header">
                <span className="index">#</span>
                <span className="title">Title</span>
                <span className="duration"><FontAwesomeIcon icon={faClock} /></span>
              </div>
              
              {displayedSongs.map((song, index) => (
                <div 
                  key={song._id} 
                  className={`song-row ${currentTrack?._id === song._id && isPlaying ? 'playing' : ''}`}
                  onClick={() => playTrack(song)}
                >
                  <span className="index">{index + 1}</span>
                  <span className="title">
                    <img 
                      src={song.coverImage || '/default-song.jpg'} 
                      alt={song.title} 
                      className="song-cover"
                    />
                    <div className="song-info">
                      <span className="song-name">{song.title}</span>
                      {song.isExplicit && <span className="explicit">E</span>}
                    </div>
                  </span>
                  <span className="duration">{formatDuration(song.duration)}</span>
                </div>
              ))}
            </div>
          </section>

          {albums.length > 0 && (
            <section className="albums-section">
              <div className="section-header">
                <h2>Albums</h2>
              </div>
              <div className="albums-grid">
                {/* {albums.map(album => (
                  <AlbumCard 
                    key={album._id} 
                    album={album}
                    onPlay={() => {
                      const albumSongs = songs.filter(s => s.album?._id === album._id);
                      if (albumSongs.length > 0) playTrack(albumSongs[0]);
                    }}
                  />
                ))} */}
              </div>
            </section>
          )}
        </main>

        <aside className="artist-sidebar">
          <div className="sidebar-section">
            <h3>About</h3>
            <p className="artist-bio">{description}</p>
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
                <span className="stat-value">{songs.length}</span>
                <span className="stat-label">Songs</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{albums.length}</span>
                <span className="stat-label">Albums</span>
              </div>
            </div>
          </div>

          {Object.values(socials).some(val => val) && (
            <div className="sidebar-section">
              <h3>Social</h3>
              <div className="social-links">
                {socials.instagram && (
                  <a href={socials.instagram} target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                )}
                {socials.x && (
                  <a href={socials.x} target="_blank" rel="noopener noreferrer">
                    X (Twitter)
                  </a>
                )}
                {socials.youtube && (
                  <a href={socials.youtube} target="_blank" rel="noopener noreferrer">
                    YouTube
                  </a>
                )}
                {socials.tiktok && (
                  <a href={socials.tiktok} target="_blank" rel="noopener noreferrer">
                    TikTok
                  </a>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>

      <Footer />
    </div>
  );
};

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default Artist;