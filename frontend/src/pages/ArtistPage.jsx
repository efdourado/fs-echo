import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faPlay,
  faEllipsis,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";

import { fetchArtistById, fetchSongs, fetchAlbums } from "../api/api";
import { PlayerContext } from "../context/PlayerContext";

import SongList from "../components/songs/SongList";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import fallbackImage from '/images/fb.jpeg';

const ArtistPage = () => {
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
  } }; loadArtistData(); }, [id]);

  const handlePlayAllArtistTopSongs = () => {
    const songsToPlay = showAllSongs ? songs : songs.slice(0, 5);
    if (songsToPlay.length > 0 && songsToPlay[0].audioUrl) {
      playTrack(songsToPlay[0]);
  } };

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  if (loading) return <LoadingSpinner />;

  if (!artist) return (
    <div className="artist-page">
      <div className="error-message">Artist not found.</div>
    </div>
  );

  const {
    name = "Unknown Artist",
    image: artistImage,
    banner,
    description = "No biography available for this artist.",
    monthlyListeners = 0,
    followers = 0,
    genre = [],
    socials = {},
    verified = false
  } = artist;

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num?.toString() || '0';
  };

  const displayedSongs = showAllSongs ? songs : songs.slice(0, 5);
  const initialItemsForSongList = showAllSongs ? songs.length : 5;


  return (
    <div className="artist-page">
      <div className="artist-header" style={{ backgroundImage: `url(${banner || fallbackImage})` }}>
        <div className="artist-header-overlay"></div>
        <div className="artist-header-content">
          <div className="artist-header__main-info">
            <div className="artist-header__image-container">
                <img
                    src={artistImage || fallbackImage}
                    alt={`${name}'s profile`}
                    className="artist-header__image"
                    onError={(e) => { e.target.src = fallbackImage; e.target.onerror = null; }}
                />
            </div>
            <div className="artist-info">
                {verified && (
                  <span className="verified-badge">
                    <FontAwesomeIcon icon={faCheckCircle} /> Verified Artist
                  </span>
                )}
                <h1 className="artist-name">{name}</h1>
                <p className="artist-description">{description}</p>
                <div className="artist-stats">
                <span>{formatNumber(monthlyListeners)} monthly listeners</span>
                <span className="stat-divider">•</span>
                <span>{formatNumber(followers)} followers</span>
                {genre.length > 0 && (
                    <>
                    <span className="stat-divider">•</span>
                    <span>{genre.join(", ")}</span>
                    </>
                )}
                </div>
            </div>
          </div>
          <div className="artist-actions">
            <button
              className="play-button"
              onClick={handlePlayAllArtistTopSongs}
              disabled={songs.length === 0}
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
            <button className="more-button" aria-label="More options">
              <FontAwesomeIcon icon={faEllipsis} />
            </button>
          </div>
        </div>
      </div>

      <div className="artist-content-container">
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
                    {showAllSongs ? 'Show Less' : `See All (${songs.length})`}
                  </button>
                )}
              </div>
              {displayedSongs.length > 0 ? (
                <SongList
                  songs={displayedSongs}
                  showCount={false}
                />
              ) : (
                <p className="empty-state">No popular songs found for this artist.</p>
              )}
            </section>

            {albums.length > 0 && (
              <section className="albums-section">
                <div className="section-header">
                  <h2>Albums</h2>
                   <Link to={`/artist/${id}/albums`} className="see-all">See All</Link>
                </div>
                <div className="albums-grid">
                  {albums.slice(0, 6).map(album => (
                    <Link to={`/album/${album._id}`} key={album._id} className="album-card-link">
                        <div className="album-card">
                        <div className="album-cover-container">
                            <img
                            src={album.coverImage || fallbackImage}
                            alt={album.title || 'Album cover'}
                            className="album-cover"
                            loading="lazy"
                            onError={(e) => { e.target.src = fallbackImage; e.target.onerror = null; }}
                            />
                            <button
                                type="button"
                                className="album-play-button"
                                aria-label={`Play album ${album.title}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    const firstSongOfAlbum = songs.find(s => s.album?._id === album._id && s.audioUrl);
                                    if (firstSongOfAlbum) playTrack(firstSongOfAlbum);
                                }}
                                >
                            <FontAwesomeIcon icon={faPlay} />
                            </button>
                        </div>
                        <div className="album-info">
                            <h3 className="album-title" title={album.title}>{album.title}</h3>
                            <p className="album-year">
                                {new Date(album.releaseDate).getFullYear()} • {album.type || 'Album'}
                            </p>
                        </div>
                        </div>
                    </Link>
                  ))}
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
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
); };

export default ArtistPage;