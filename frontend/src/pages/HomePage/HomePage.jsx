import React, { useEffect, useState } from "react";

import { fetchArtists, fetchSongs, fetchAlbums, fetchPlaylists } from "../../api/api.js";

import Carousel from "./components/Carousel.jsx";
import Collection from "./components/Collection.jsx";
import Hero from "../../components/heroes/Hero.jsx";

import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [singles, setSingles] = useState([]); 
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredAlbumId, setFeaturedAlbumId] = useState(null);
  const [heroHighlight, setHeroHighlight] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [songsData, artistsData, albumsData, playlistsData] = await Promise.all([
          fetchSongs(),
          fetchArtists(),
          fetchAlbums(),
          fetchPlaylists(),
        ]);


        const singleSongs = songsData.filter(song => song.album && song.album.type === 'single');
        setSingles(singleSongs);

        const properAlbums = albumsData.filter(album => album.type !== 'single');
        setAlbums(properAlbums);

        setSongs(songsData);
        setArtists(artistsData);
        setPlaylists(playlistsData);

        if (properAlbums.length > 0) {
          setFeaturedAlbumId(properAlbums.length > 1 ? properAlbums[1]._id : properAlbums[0]._id);
        }

        if (songsData.length > 0) {
          const mainHighlightSong = songsData[0];
          
          setHeroHighlight({
            ...mainHighlightSong,
            type: 'song',
            artist: mainHighlightSong.artist?.name || "Unknown Artist",
            isTrending: true,
            releaseDate: mainHighlightSong.releaseDate,
            genre: mainHighlightSong.genre,
          });
        } else {
           setHeroHighlight({
            type: 'info',
            title: 'Discover New Music',
            coverImage: '/images/fb.jpeg',
            artist: 'Various Artists',
            plays: 0,
            isTrending: false,
            trendingNow: [],
        }); }
      } catch (error) {
        console.error("Error loading data:", error);
        setHeroHighlight({
          type: 'info',
          title: 'Error Loading Music',
          coverImage: '/images/fb.jpeg',
          artist: 'N/A',
          plays: 0,
          isTrending: false,
          trendingNow: [],
        });
      } finally {
        setLoading(false);
        
  } }; loadData(); }, []);

  return (
    <div className="home-content">
      {loading || !heroHighlight ? ( <LoadingSpinner /> ) : (
        <>
          <Hero
            title="Join Us in your Echoes"
            subtitle="A model designed to inspire and support music enthusiasts. Get samples, tips, and organize your ideas effortlessly"
            highlight={heroHighlight}
            talents={artists.slice(0, 4)}
            bgImage="/images/bg.jpeg"
            allSongs={songs}
            allArtists={artists}
            allAlbums={albums}
            allPlaylists={playlists}
          />

          <Carousel
            title="Recommended Playlists"
            items={playlists}
            type="playlist"
          />

          {featuredAlbumId && (
            <Collection
              collectionId={featuredAlbumId}
              type="album"
            />
          )}

          <Carousel
            title="Your Favourite Artists"
            items={artists}
            type="artist"
          />
          <Carousel
            title="Popular Albums"
            items={albums}
            type="album"
          />

          {/* <Carousel
            title="Singles"
            items={singles}
            type="song"
          /> */}

        </>
      )}
    </div>
); };

export default Home;