import React, { useEffect, useState } from "react";

import {
  fetchArtists,
  fetchSongs,
  fetchAlbums,
  fetchPlaylists,
} from "../../api/api.js";
import { fetchSpotifyFeaturedPlaylists } from "../../api/adminApi.js";

import Carousel from "./components/Carousel.jsx";
import Collection from "./components/Collection.jsx";

import Hero from "../../components/ui/Hero.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";

import { useAuth } from "../../context/AuthContext.jsx";

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [singles, setSingles] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredAlbumId, setFeaturedAlbumId] = useState(null);
  const [featuredPlaylistId, setFeaturedPlaylistId] = useState(null);
  const [heroHighlight, setHeroHighlight] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        let finalPlaylists = [];

        const [songsData, artistsData, albumsData] = await Promise.all([
          fetchSongs(),
          fetchArtists(),
          fetchAlbums(),
        ]);

        if (isAuthenticated) {
          const spotifyPlaylistsResponse = await fetchSpotifyFeaturedPlaylists();

          finalPlaylists = spotifyPlaylistsResponse.data.map((p) => ({
            _id: p.id,
            name: p.name,
            description: p.description,
            coverImage: p.images[0]?.url,
            type: "playlist",
            owner: { username: p.owner.display_name },
          }));
        } else {
          finalPlaylists = await fetchPlaylists();
        }

        setPlaylists(finalPlaylists);

        const singleSongs = songsData.filter(
          (song) => song.album && song.album.type === "single"
        );
        setSingles(singleSongs);

        setAlbums(albumsData);
        setSongs(songsData);
        setArtists(artistsData);

        if (finalPlaylists.length > 0) {
          setFeaturedPlaylistId(finalPlaylists[0]._id);
        }

        if (albumsData.length > 3) {
          setFeaturedAlbumId(albumsData[3]._id);
        } else if (albumsData.length > 0) {
          setFeaturedAlbumId(albumsData[0]._id);
        }

        if (songsData.length > 0) {
          const mainHighlightSong = songsData[0];
          setHeroHighlight({
            ...mainHighlightSong,
            type: "song",
            artist: mainHighlightSong.artist?.name || "Unknown Artist",
            isTrending: true,
            releaseDate: mainHighlightSong.releaseDate,
            genre: mainHighlightSong.genre,
          });
        } else {
          setHeroHighlight({
            type: "info",
            title: "Discover New Music",
            coverImage: "/fb.jpg",
            artist: "Various Artists",
            plays: 0,
            isTrending: false,
            trendingNow: [],
          });
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setHeroHighlight({
          type: "info",
          title: "Error Loading Music",
          coverImage: "/fb.jpg",
          artist: "N/A",
          plays: 0,
          isTrending: false,
          trendingNow: [],
        });
      } finally {
        setLoading(false);
    } };

    loadData();
  }, [isAuthenticated]);

  return (
    <div className="home-content">
      {loading || !heroHighlight ? (
        <LoadingSpinner />
      ) : (
        <>
          <Hero
            title={isAuthenticated ? "You're home" : "Join Us in your Echoes"}
            subtitle="A model designed to inspire and support music enthusiasts. Get samples, tips, and organize your ideas effortlessly"
            highlight={heroHighlight}
            talents={artists.slice(0, 4)}
            bgImage="/hero-bg.jpg"
            allSongs={songs}
            allArtists={artists}
            allAlbums={albums}
            allPlaylists={playlists}
          />

          <Carousel
            title={
              isAuthenticated ? "Featured on Spotify" : "Recommended Playlists"
            }
            items={playlists}
            type="playlist"
          />

          <div className="home-featured-collection">
            {featuredPlaylistId && (
              <Collection collectionId={featuredPlaylistId} type="playlist" />
            )}
          </div>

          <Carousel title="Selected Artists" items={artists} type="artist" />

          <Carousel
            title="Popular Albums & Singles"
            items={albums}
            type="album"
          />

          <div className="home-featured-collection">
            {featuredAlbumId && (
              <Collection collectionId={featuredAlbumId} type="album" />
            )}
          </div>
        </>
      )}
    </div>
); };

export default Home;