import React, { useState } from "react";
import PropTypes from "prop-types";
import SongItem from "./SongItem";
// Make sure you have your LoadingSpinner component from the previous step!
// import LoadingSpinner from "../ui/LoadingSpinner";

const SongList = ({
  title,
  songs = [],
  showCount = true,
  onMenuClick,
  loading = false,
  initialItems = 10,
  showHeader = true,
}) => {
  const [showAll, setShowAll] = useState(false);

  // You can use your new LoadingSpinner here for consistency
  if (loading) return <div className="song-list-loading">Loading songs...</div>;
  if (!songs || songs.length === 0) return <div className="song-list-empty">No songs available</div>;

  const displayedSongs = showAll ? songs : songs.slice(0, initialItems);

  return (
    <section className="song-list">
      
      <div className="song-list__container">
        {displayedSongs.map((song, index) => (
          <SongItem key={song._id || index} song={song} onMenuClick={onMenuClick} />
        ))}
      </div>

      {songs.length > initialItems && (
        <div className="song-list__footer">
          <button
            className="song-list__toggle-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `Show All ${songs.length} Songs`}
          </button>
        </div>
      )}
    </section>
  );
};

SongList.propTypes = {
  title: PropTypes.string,
  songs: PropTypes.array,
  showCount: PropTypes.bool,
  onMenuClick: PropTypes.func,
  loading: PropTypes.bool,
  initialItems: PropTypes.number,
  showHeader: PropTypes.bool,
};

export default SongList;