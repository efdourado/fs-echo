import React, { useEffect, useState } from "react";
import {
  fetchArtists,
  fetchSongs,
  fetchAlbums,
  fetchPlaylists,
} from "../../services/collectionService.js";
import Carousel from "./components/Carousel.jsx";
import Collection from "./components/Collection.jsx";
import Hero from "../../components/ui/Hero.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const HomePage = () => {
  const [songs, setSongs] = useState([]);
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
        const [
          { data: songsData },
          { data: artistsData },
          { data: albumsData },
          { data: playlistsData },
        ] = await Promise.all([
          fetchSongs(),
          fetchArtists(),
          fetchAlbums(),
          fetchPlaylists(),
        ]);

        setPlaylists(playlistsData);
        setAlbums(albumsData);
        setSongs(songsData);
        setArtists(artistsData);

        if (playlistsData.length > 0) {
          setFeaturedPlaylistId(playlistsData[0]._id);
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
          });
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setHeroHighlight({
          type: "info",
          title: "Error Loading Music",
          coverImage: "/fb.jpg",
          artist: "N/A",
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
            title={isAuthenticated ? "You're home" : "Join Us"}
            subtitle="Music, reimagined — Memphis is a web application designed to provide a seamless, modern music listening experience. Users can build and manage personal playlists, and align new perspectives through sound."
            highlight={heroHighlight}
            talents={artists.slice(0, 4)}
            bgImage="/hero-bg.jpg"
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

export default HomePage;