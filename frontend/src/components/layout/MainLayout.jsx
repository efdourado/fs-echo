import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import Footer from "./Footer";
import Showcase from "../common/Showcase";
import EventsHero from "../sections/hero/EventsHero";
import ItemList from "../common/ItemList";
import SongList from "../song/SongList";
import { fetchArtists, fetchSongs } from "../../../api/api.js";

const MainLayout = ({ type }) => {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [songsData, artistsData] = await Promise.all([
          fetchSongs(),
          fetchArtists(),
        ]);
        setSongs(songsData);
        setArtists(artistsData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
    } };

    loadData();
  }, []);

  return (
    <>
      <Header />
      <Showcase
        title="Music Closer"
        description="A model designed to inspire and support music enthusiasts. Get samples, tips, and organize your ideas effortlessly"
        ctaText="Join Us | Sign Up"
        bgImage="/sc.jpeg"
      />

      <div className="main-layout-content">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {(type === "songs" || type === undefined) && (
              <ItemList
                title="Popular"
                items={7}
                itemsArray={songs}
                path="/songs"
                idPath="/song"
                type="songs"
                showYear={true}
                showPlays={true}
                seeMorePlacement="top"
              />
            )}

            <div className="content-grid">
              <section className="recent-songs-section">
                <SongList
                  title="Recently Played"
                  songs={songs.slice(0, 5)}
                  showCount={false}
                  onMenuClick={(songId, target) => {
                    console.log(`menu clicked for song ${songId}`, target);
                  }}
                />
              </section>

              {(type === "songs" || type === undefined) && (
                <ItemList
                  title="Albums"
                  items={2}
                  itemsArray={songs}
                  path="/songs"
                  idPath="/song"
                  type="songs"
                  showYear={true}
                  showPlays={true}
                  seeMorePlacement="bottom"
                />
              )}
            </div>

            {(type === "artists" || type === undefined) && (
              <ItemList
                title="Artists"
                items={7}
                itemsArray={artists}
                path="/artists"
                idPath="/artist"
                type="artists"
                rounded={true}
                seeMorePlacement="top"
              />
            )}
          </>
        )}
      </div>

      <EventsHero
        title="Próximos Eventos"
        subtitle="Experiências musicais inesquecíveis que vão transformar sua conexão com a arte"
        ctaText="Comprar Ingressos"
        bgImage="/sc_pg.jpeg"
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
); };

MainLayout.propTypes = {
  type: PropTypes.oneOf(["songs", "artists"]),
};

export default MainLayout;