// components/SongList.jsx (formerly SongList.jsx)
import React, { useState } from "react";
import PropTypes from "prop-types";
import SongItem from "./SongItem"; // renamed from SongItem

const SongList = ({
  title = "Tracks",
  tracks = [],
  showCount = true,
  onMenuClick,
  loading = false,
  initialItems = 6,
}) => {
  const [showAll, setShowAll] = useState(false);
  
  if (loading) return <div className="track-list">Loading tracks...</div>;
  if (!tracks || tracks.length === 0) return <div className="track-list">No tracks available</div>;

  const displayedTracks = showAll ? tracks : tracks.slice(0, initialItems);

  return (
    <section className="track-list">
      <div className="track-list-header">
        <h2 className="track-list-title">{title}</h2>
        {showCount && (
          <span className="track-list-count">
            {tracks.length} {tracks.length === 1 ? "track" : "tracks"}
          </span>
        )}
      </div>

      <div className="track-list-container">
        {displayedTracks.map((track) => (
          <SongItem key={track._id} track={track} onMenuClick={onMenuClick} />
        ))}
        
        {tracks.length > initialItems && (
          <button 
            className="track-list-toggle"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `See More (${tracks.length - initialItems})`}
          </button>
        )}
      </div>
    </section>
  );
};

SongList.propTypes = {
  title: PropTypes.string,
  tracks: PropTypes.array,
  showCount: PropTypes.bool,
  onMenuClick: PropTypes.func,
  loading: PropTypes.bool,
  initialItems: PropTypes.number,
};

export default SongList;