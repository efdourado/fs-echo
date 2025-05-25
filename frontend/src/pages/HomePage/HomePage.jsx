import React, { useEffect, useState }
from "react";

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
  const [heroHighlight, setHeroHighlight] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [songsData, artistsData, albumsData] = await Promise.all([
          fetchSongs(),
          fetchArtists(),
          fetchAlbums(),
        ]);

        const SlicedSongs = songsData.slice(0, 15);
        setSongs(SlicedSongs);
        setArtists(artistsData.slice(0, 15));
        setAlbums(albumsData);

        if (albumsData.length > 0) {
          setFeaturedAlbumId(albumsData.length > 1 ? albumsData[1]._id : albumsData[0]._id);
        }

        if (songsData.length > 0) {
          const mainHighlightSong = songsData[0];
          const trendingNowSongs = songsData.slice(1, 4).map(song => ({
            name: song.title,
            artist: song.artist?.name || "Unknown Artist",
            plays: song.plays || 0,
          }));

          setHeroHighlight({
            type: 'song',
            title: mainHighlightSong.title,
            coverImage: mainHighlightSong.coverImage || '/fb.png',
            artist: mainHighlightSong.artist?.name || "Unknown Artist",
            plays: mainHighlightSong.plays || 0,
            isTrending: true,
            trendingNow: trendingNowSongs,
          });
        } else {
           setHeroHighlight({
            type: 'song',
            title: 'Discover New Music',
            coverImage: '/fb.png',
            artist: 'Various Artists',
            plays: 0,
            isTrending: false,
            trendingNow: [],
        }); }
      } catch (error) {
        console.error("Error loading data:", error);
         // Fallback on error
         setHeroHighlight({
          type: 'song',
          title: 'Error Loading Music',
          coverImage: '/fb.png',
          artist: 'N/A',
          plays: 0,
          isTrending: false,
          trendingNow: [],
        });
      } finally {
        setLoading(false);
    } };
    loadData();
  }, []);

  return (
    <div className="home-content">
      {loading || !heroHighlight ? (
        <p className="loading">Loading music...</p>
      ) : (
        <>
          <Hero
            title="Discover Your Sound"
            subtitle="The hottest tracks and artists curated just for you"
            highlight={heroHighlight}
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