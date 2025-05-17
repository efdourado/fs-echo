import React from "react";
import PropTypes from "prop-types";
import SongItem from "./SongItem";

const SongList = ({
  title = "Songs",
  songs = [],
  showCount = true,
  onMenuClick,
  loading = false,
}) => {
  if (loading) {
    return <div className="song-list-section">Loading songs...</div>;
  }

  if (!songs || songs.length === 0) {
    return <div className="song-list-section">No songs available</div>;
  }

  return (
    <section className="song-list-section">
      <div className="song-list-header">
        <h2 className="song-list-title">{title}</h2>
        {showCount && (
          <span className="song-list-count">
            {songs.length} {songs.length === 1 ? "song" : "songs"}
          </span>
        )}
      </div>

      <div className="song-list-container">
        {songs.map((song) => (
          <SongItem key={song._id} song={song} onMenuClick={onMenuClick} />
        ))}
      </div>
    </section>
); };

SongList.propTypes = {
  title: PropTypes.string,
  songs: PropTypes.array,
  showCount: PropTypes.bool,
  onMenuClick: PropTypes.func,
  loading: PropTypes.bool,
};

export default SongList;