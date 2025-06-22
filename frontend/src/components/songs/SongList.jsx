import React, { useState } from "react";
import PropTypes from "prop-types";
import SongItem from "./SongItem";

const SongList = ({
  title,
  songs = [],
  showCount = true,
  onMenuClick,
  loading = false,
  initialItems = 10,
  showHeader = true,
  displayAll = false,
}) => {
  const [showAll, setShowAll] = useState(false);

  if (loading) return <div className="song-list-loading">Loading songs...</div>;
  if (!songs || songs.length === 0) return <div className="song-list-empty">No songs available</div>;

  const displayedSongs = displayAll || showAll ? songs : songs.slice(0, initialItems);
  const showToggleButton = !displayAll && songs.length > initialItems;

  return (
    <section className="song-list">
      {showHeader && title && (
        <div className="song-list__header">
          <div className="song-list__header-main">
            <h2 className="song-list__title">{title}</h2>
          </div>
        </div>
      )}

      <div className="song-list__container">
        {displayedSongs.map((song, index) => (
          <SongItem key={song._id || index} song={song} onMenuClick={onMenuClick} />
        ))}
      </div>

      {showToggleButton && (
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
); };

SongList.propTypes = {
  title: PropTypes.string,
  songs: PropTypes.array,
  showCount: PropTypes.bool,
  onMenuClick: PropTypes.func,
  loading: PropTypes.bool,
  initialItems: PropTypes.number,
  showHeader: PropTypes.bool,
  displayAll: PropTypes.bool,
};

export default SongList;