import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faPlay } from "@fortawesome/free-solid-svg-icons";

import { PlayerContext } from "../../context/PlayerContext";
import { fetchArtistById, fetchSongs } from "../../../api/api";

import fbBanner from "../../assets/images/fb/fb.png";

import SongList from "../../components/song/SongList";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const Artist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playTrack } = useContext(PlayerContext);

  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArtistData = async () => {
      try {
        const fetchedArtist = await fetchArtistById(id);
        const allSongs = await fetchSongs();
        const artistSongs = allSongs.filter(song => song.artist._id === fetchedArtist._id);

        setArtist(fetchedArtist);
        setSongs(artistSongs);
      } catch (error) {
        console.error("Error fetching artist data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadArtistData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!artist) return <div>Artist not found</div>;

  const {
    name = "Unknown Artist",
    banner = "",
    description = "",
    monthlyListeners = "0",
    followers = "0",
    albums = [],
    relatedArtists = [],
  } = artist;

  return (
    <>
      <Header />
      <div className="artist">
        <div
          className="artist__header"
          style={{ backgroundImage: `url(${banner || fbBanner})` }}
        >
          <div className="artist__header-content">
            <div className="artist__identity">
              <h1 className="artist__name">{name}</h1>
              <span className="artist__verified">
                <FontAwesomeIcon icon={faCheckCircle} /> Verified Artist
              </span>
            </div>

            <div className="artist__stats">
              <div className="stat-item">
                <span className="stat-value">{monthlyListeners}</span>
                <span className="stat-label">Monthly Listeners</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{followers}</span>
                <span className="stat-label">Followers</span>
              </div>
            </div>

            <p className="artist__description">{description}</p>

            <div className="artist__actions">
              <button className="btn btn--primary">
                <FontAwesomeIcon icon={faPlay} /> Play Random
              </button>
              <button className="btn btn--secondary">Follow</button>
            </div>
          </div>
        </div>

        <div className="artist__body">
          <div className="artist__content">
            <div className="artist__main">
              <section className="music-section">
                <div className="section-header">
                  <div className="section-header__title">
                    <h2>Popular</h2>
                    {songs.length > 0 && (
                      <span className="section-header__count">
                        {songs.length} {songs.length === 1 ? "song" : "songs"}
                      </span>
                    )}
                  </div>
                  {songs.length > 5 && (
                    <Link
                      to={`/artist/${id}/songs`}
                      className="btn-text btn-text--icon"
                    >
                      See all
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </Link>
                  )}
                </div>

                <div>
                  <SongList
                    songsArray={songs.slice(0, 5)}
                    onPlay={(songId) => {
                      const song = songs.find((s) => s._id === songId);
                      if (song) playTrack(song);
                    }}
                    showCount={false}
                  />
                </div>
              </section>
            </div>

            <div className="artist__sidebar">
              <section className="stats-section">
                <h3>Artist Stats</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <span className="stat-value">{monthlyListeners}</span>
                    <span className="stat-label">Monthly Listeners</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">{followers}</span>
                    <span className="stat-label">Followers</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Artist;
