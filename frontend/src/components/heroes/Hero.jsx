import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faMagnet, faFlask, faFireFlameCurved } from '@fortawesome/free-solid-svg-icons';

import { usePlayer } from '../../hooks/usePlayer';
import Bias from '../ui/Bias';
import { useAuth } from '../../context/AuthContext';
import fallbackImage from '/images/fb.jpeg';

const Hero = ({
  title,
  subtitle,
  highlight,
  talents = [],

  bgImage,
  allSongs = [],
  allArtists = [],
  allAlbums = [],
  allPlaylists = [],
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeFeatureTab, setActiveFeatureTab] = useState('songs');
  
                // const player = usePlayer();
                // const highlightLink = highlight?._id ? `/${highlight.type}/${highlight._id}` : '#';

  const heroStyle = {
    backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.55)), url(${bgImage})`,
  };

                // const handlePlayHighlight = (e) => {
                //   e.preventDefault();
                //   e.stopPropagation();
                //   if (highlight.type === 'song' && highlight.audioUrl) {
                //     player.playTrack(highlight);
                //   } else {
                //     navigate(highlightLink);
                // } };

                // const getUniqueGenres = (data) => {
                //   const genres = new Set();
                //   data.forEach(item => {
                //     if (item.genre) {
                //       item.genre.forEach(g => genres.add(g));
                //   } });
                //   return Array.from(genres);
                // };

  const renderFeatureContent = () => {
    switch (activeFeatureTab) {
      case 'songs':
                // const curatedSong = allSongs[1];

        return (
          <div className="feature-card top-songs-card">
            <h4 className="feature-title"><FontAwesomeIcon icon={faFire} />
              Songs
            </h4>
            <p className="feature-description">
              Here, we share more than just songs.
              From raw demos to final versions, Echo reveals the creative process, the inspo, and the memories tied to each release.
              It's a growing archive. Whether you're here to vibe, learn, or connect — welcome to the echo of our work!
            </p>


                {/* {curatedSong && (
                  <Bias item={curatedSong} type="song" isEditorPick={true} />
                )} */}


            <button type="button" className="cta-button" onClick={() => navigate('/songs')}>
              View Popular Songs
            </button>
          </div>
        );
        
      case 'playlists':
                // const popularPlaylists = allPlaylists.slice(0, 3);
                // const featuredPlaylist = popularPlaylists[0];

        return (
          <div className="feature-card featured-playlist-card">
            <h4 className="feature-title"><FontAwesomeIcon icon={faMagnet} />
              Playlists
            </h4>
            <p className="feature-description">
              Or paths. We're weaving new flows — from unexpected blends to deeper groupings, guiding you through what you didn't know you needed.
              Welcome to a new way of organizing feeling.
            </p>

            
                {/* <Bias item={featuredPlaylist} type="playlist" /> */}
            

            <button type="button" className="cta-button secondary-cta" onClick={() => navigate('/playlists')}>
              Discover New Playlists
            </button>
          </div>
        );

      case 'genres':
                // const genres = getUniqueGenres(allSongs);
        
        return (
          <div className="feature-card explore-genres-card">
            <h4 className="feature-title"><FontAwesomeIcon icon={faFlask} />
              Lab
            </h4>
             <p className="feature-description">
              Where it all begins.
              This is our creative nucleus — a playground of raw sketches, evolving loops, and whispers.
              It's messy, real, dynamic.
              Explore and create with our tools!
            </p>


                {/* {genres.length > 0 ? (
                  <div className="genre-list">
                    {genres.slice(0, 6).map((genre, index) => (
                      <span key={index} className="genre-tag">
                        {genre}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p>No genres available.</p>
                )} */}


            <button type="button" className="cta-button secondary-cta">
              Open Lab
            </button>
          </div>
        );
      default:
        return null;
  } };

  return (
    <div className="music-hero" style={heroStyle}>
      <div className="hero-content">

        <aside className="hero-talents">
          <h4 className="talents-title">Talents</h4>
          <ul className="talents-list">
            {talents.map((talent) => (
              <li key={talent._id} className="talent-item">
                <Link to={`/artist/${talent._id}`}>
                  <img
                    src={talent.image || fallbackImage}
                    alt={talent.name}
                    title={talent.name}
                    onError={(e) => { e.target.src = fallbackImage; }}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className="hero-main">
          <div className="text-content">
            <h1 className="title">{title}</h1>
            <p className="subtitle">{subtitle}</p>
          </div>

          <div className="hero-quick-links">
            <button 
              className="cta-button secondary-cta" 
              onClick={() => navigate(isAuthenticated ? '/songs' : '/register')}
            >
              {isAuthenticated ? 'Explore' : 'Join Us'}
            </button>
            <button className="cta-button primary-cta" onClick={() => navigate('/artists')}>
              What's New?
              <FontAwesomeIcon icon={faFireFlameCurved} style={{ marginLeft: '10px' }}/>
            </button>
          </div>
            
          <div className="hero-tabs-nav">
            <button 
              className={`hero-tab-button ${activeFeatureTab === 'songs' ? 'active' : ''}`}
              onClick={() => setActiveFeatureTab('songs')}
            >
              Songs
            </button>
            <button 
              className={`hero-tab-button ${activeFeatureTab === 'playlists' ? 'active' : ''}`}
              onClick={() => setActiveFeatureTab('playlists')}
            >
              Playlists
            </button>
            <button 
              className={`hero-tab-button ${activeFeatureTab === 'genres' ? 'active' : ''}`}
              onClick={() => setActiveFeatureTab('genres')}
            >
              Lab
            </button>
          </div>
        </main>

        <aside className="hero-feature-section">
          {renderFeatureContent()}
        </aside>
      </div>
    </div>
); };

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  bgImage: PropTypes.string,
  highlight: PropTypes.shape({
    _id: PropTypes.string,
    type: PropTypes.oneOf(['song', 'album', 'info']).isRequired,
    title: PropTypes.string,
    coverImage: PropTypes.string,
    audioUrl: PropTypes.string,
    artist: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ name: PropTypes.string })
    ]),
    plays: PropTypes.number,
    isTrending: PropTypes.bool,
    releaseDate: PropTypes.string,
    genre: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  talents: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string,
  }) ),
  allSongs: PropTypes.array,
  allArtists: PropTypes.array,
  allAlbums: PropTypes.array,
  allPlaylists: PropTypes.array,
};

export default Hero;