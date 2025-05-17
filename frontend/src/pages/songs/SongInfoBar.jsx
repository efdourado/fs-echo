import React from "react";
import { Link } from "react-router-dom";
import fallbackImage from "../../assets/images/fb/fb.png";

const SongInfoBar = ({ song, artist }) => {
  return (
    <div className="song-info-bar">
      <Link to={`/artist/${artist._id}`} className="song-info-bar__artist">
        <img
          src={artist.image || fallbackImage}
          alt={`${artist.name}`}
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
        />
      </Link>

      <div className="song-info-bar__details">
        <h1 className="song-title">{song.title}</h1>
        <Link to={`/artist/${artist._id}`} className="artist-name">
          {song.artist.name}
        </Link>
      </div>
    </div>
  );
};

export default SongInfoBar;