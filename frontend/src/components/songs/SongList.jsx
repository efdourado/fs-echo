import React, { useState } from "react";
import PropTypes from "prop-types";

import SongItem from "./SongItem";

const SongList = ({
  title = "Songs",
  songs = [],
  showCount = true,
  onMenuClick,
  loading = false,
  initialItems = 6,
}) => {
  const [showAll, setShowAll] = useState(false);
  
  if (loading) return <div className="song-list">Loading songs...</div>;
  if (!songs || songs.length === 0) return <div className="song-list">No songs available</div>;

  const displayedSongs = showAll ? songs : songs.slice(0, initialItems);

  return (
    <section className="song-list">
      <div className="song-list-header">
        <h2 className="song-list-title">{title}</h2>
        {showCount && (
          <span className="song-list-count">
            {songs.length} {songs.length === 1 ? "song" : "songs"}
          </span>
        )}
      </div>

      <div className="song-list-container">
        {displayedSongs.map((song) => (
          <SongItem key={song._id} song={song} onMenuClick={onMenuClick} />
        ))}
        
        {songs.length > initialItems && (
          <button 
            className="song-list-toggle"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `See More (${songs.length - initialItems})`}
          </button>
        )}
      </div>
    </section>
); };

SongList.propTypes = {
  title: PropTypes.string,
  songs: PropTypes.array,
  showCount: PropTypes.bool,
  onMenuClick: PropTypes.func,
  loading: PropTypes.bool,
  initialItems: PropTypes.number,
};

export default SongList;