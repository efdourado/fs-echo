import React, { useEffect, useState } from "react";
import { fetchArtists, fetchSongs, fetchAlbums } from "../../api/api.js";

import Carousel from "./components/Carousel.jsx";
import Collection from "./components/Collection.jsx";
import Hero from "./components/Hero.jsx";

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredAlbumId, setFeaturedAlbumId] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [songsData, artistsData, albumsData] = await Promise.all([
          fetchSongs(),
          fetchArtists(),
          fetchAlbums(),
        ]);

        setSongs(songsData.slice(0, 15));
        setArtists(artistsData.slice(0, 15));
        setAlbums(albumsData);
        
        if (albumsData.length > 0) {
          setFeaturedAlbumId(albumsData[1]._id);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
    } };
    loadData();
  }, []);

  // wil be replaced w API data
  const featuredHighlight = {
    type: 'song',
    title: 'Midnight City',
    coverImage: '/fb.png',
    artist: 'M83',
    plays: 125000000,
    isTrending: true,
    trendingNow: [
      { name: 'Blinding Lights', artist: 'The Weeknd', plays: 350000000 },
      { name: 'Save Your Tears', artist: 'The Weeknd', plays: 280000000 },
      { name: 'Stay', artist: 'The Kid LAROI, Justin Bieber', plays: 220000000 }
    ]
  };

  return (
    <div className="home-content">
      {loading ? (
        <p className="loading">Loading music...</p>
      ) : (
        <>
          <Hero
            title="Discover Your Sound"
            subtitle="The hottest tracks and artists curated just for you"
            highlight={featuredHighlight}
            ctaText="Explore More"
            bgImage="/bg-pg.jpeg"
          />

          <Carousel
            title="Latest Songs"
            items={songs}
            type="song"
          />

          {featuredAlbumId && (
            <Collection 
              collectionId={featuredAlbumId}
              type="album"
            />
          )}

          <Carousel
            title="Featured Artists"
            items={artists}
            type="artist"
          />
        </>
      )}
    </div>
); };

export default Home;