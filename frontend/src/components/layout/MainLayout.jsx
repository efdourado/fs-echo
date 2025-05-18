import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import Footer from "./Footer";
import Showcase from "../common/Showcase";
import EventsHero from "../sections/hero/EventsHero";
import ItemList from "../common/ItemList";
import SongList from "../song/SongList";
import { fetchArtists, fetchSongs, fetchAlbums } from "../../../api/api.js"; // Assuming you have fetchAlbums

const MainLayout = ({ type }) => {
  const [popularSongs, setPopularSongs] = useState([]);
  const [recentAlbum, setRecentAlbum] = useState(null);
  const [albumSongs, setAlbumSongs] = useState([]);
  const [popularArtists, setPopularArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [albumLoading, setAlbumLoading] = useState(true); // Separate loading for album details

  useEffect(() => {
    const loadData = async () => {
      try {
        const [songsData, artistsData, albumsData] = await Promise.all([
          fetchSongs(),
          fetchArtists(),
          fetchAlbums(), // Fetch albums
        ]);
        setPopularSongs(songsData.slice(0, 15)); // Get the first 15 popular songs
        setPopularArtists(artistsData.slice(0, 15)); // Get the first 15 popular artists

        // Assuming you want to feature the first album fetched
        if (albumsData && albumsData.length > 0) {
          setRecentAlbum(albumsData[0]);
          // Fetch songs for this album (you might need a specific API endpoint for this)
          const albumSongsData = await fetchSongs({ albumId: albumsData[0]._id }); // Example filter
          setAlbumSongs(albumSongsData);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
        setAlbumLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <>
      <Header />
      <Showcase
        title="Music Closer"
        description="A model designed to inspire and support music enthusiasts. Get samples, tips, and organize your ideas effortlessly"
        ctaText="Join Us | Sign Up"
        bgImage="bg.jpeg"
      />

      <div className="main-layout-content">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {popularSongs.length > 0 && (
              <ItemList
                title="Popular Songs"
                itemsArray={popularSongs}
                path="/songs"
                idPath="/song"
                type="songs"
                layout="horizontal"
              />
            )}

            <div className="content-grid">
              <section className="album-section">
                <h2>Featured Album</h2>
                {albumLoading ? (
                  <p>Loading album...</p>
                ) : recentAlbum ? (
                  <div className="album-details">
                    <h3>{recentAlbum.title}</h3>
                    <p>Artist: {recentAlbum.artist}</p>
                    <button>See More Albums</button>
                  </div>
                ) : (
                  <p>No albums available.</p>
                )}
              </section>

              <section className="album-songs-section">
                <SongList
                  title={recentAlbum ? `Songs from ${recentAlbum.title}` : "Album Songs"}
                  songs={albumSongs}
                  showCount={false}
                  onMenuClick={(songId, target) => {
                    console.log(`menu clicked for song ${songId}`, target);
                  }}
                  loading={albumLoading}
                />
              </section>
            </div>

            {popularArtists.length > 0 && (
              <ItemList
                title="Popular Artists"
                itemsArray={popularArtists}
                path="/artists"
                idPath="/artist"
                type="artists"
                rounded={true}
                layout="horizontal"
              />
            )}
          </>
        )}
      </div>

      <EventsHero
        title="Próximos Eventos"
        subtitle="Experiências musicais inesquecíveis que vão transformar sua conexão com a arte"
        ctaText="Comprar Ingressos"
        bgImage="/bg-pg.jpeg"
        featuredEvent={{
          day: "24",
          month: "MAI",
          name: "Festival Beats Urbanos",
          location: "São Paulo - SP",
          time: "22:00h",
          artists: ["MC Zaac", "Luísa Sonza", "Djonga", "Tasha & Tracie"],
        }}
      />

      <Footer companyName="Echo" />
    </>
  );
};

MainLayout.propTypes = {
  type: PropTypes.oneOf(["songs", "artists"]),
};

export default MainLayout;