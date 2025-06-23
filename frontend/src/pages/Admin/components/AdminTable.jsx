import React from 'react';
import { Link } from 'react-router-dom';
import { formatDuration } from '../../../utils/duration';
import fallbackImage from '/images/fb.jpeg';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const renderers = {
  image: (item) => (
    <img
      src={item.image || item.coverImage || fallbackImage}
      alt={item.name || item.title}
      className="admin-table-image"
      onError={(e) => { e.target.src = fallbackImage; }}
    />
  ),
  genres: (item) => item.genre?.join(', ') || 'N/A',
  verified: (item) => (item.verified ? 'Yes' : 'No'),
  artistName: (item) => item.artist?.name || 'N/A',
  albumSongs: (item) => item.songs?.length || 0,
  duration: (item) => formatDuration(item.duration),
};

const tableConfig = {
  artists: {
    columns: ['Image', 'Name', 'Genres', 'Verified', 'Actions'],
    renderRow: (item, handleDelete) => (
      <>
        <td>{renderers.image(item)}</td>
        <td data-label="Name">{item.name}</td>
        <td data-label="Genres">{renderers.genres(item)}</td>
        <td data-label="Verified">{renderers.verified(item)}</td>
      </>
  ), },
  
  albums: {
    columns: ['Cover', 'Title', 'Artist', 'Songs', 'Actions'],
    renderRow: (item, handleDelete) => (
      <>
        <td>{renderers.image(item)}</td>
        <td data-label="Title">{item.title}</td>
        <td data-label="Artist">{renderers.artistName(item)}</td>
        <td data-label="Songs">{renderers.albumSongs(item)}</td>
      </>
  ), },

  songs: {
    columns: ['Cover', 'Title', 'Artist', 'Duration', 'Actions'],
    renderRow: (item, handleDelete) => (
      <>
        <td>{renderers.image(item)}</td>
        <td data-label="Title">{item.title}</td>
        <td data-label="Artist">{renderers.artistName(item)}</td>
        <td data-label="Duration">{renderers.duration(item)}</td>
      </>
  ), },

  users: {
    columns: ['Avatar', 'Username', 'Email', 'Admin', 'Actions'],
    renderRow: (item, handleDelete) => (
      <>
        <td><img src={item.profilePic || fallbackImage} alt={item.username} className="admin-table-image" /></td>
        <td data-label="Username">{item.username}</td>
        <td data-label="Email">{item.email}</td>
        <td data-label="Admin">{item.isAdmin ? 'Yes' : 'No'}</td>
      </>
), }, };

const AdminTable = ({ type, data, handleDelete }) => {
  const config = tableConfig[type];

  if (!config) {
    return <p>Configuration for '{type}' not found.</p>;
  }
  
  if (data.length === 0) {
    return <p className="empty-state">No {type} found.</p>;
  }

  return (
    <table className="admin-table">
      <thead>
        <tr>
          {config.columns.map(col => <th key={col}>{col}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item._id}>
            {config.renderRow(item, handleDelete)}
            <td data-label="Actions">
              <div className="admin-table-actions">
                <Link to={`/admin/${type}/edit/${item._id}`} className="admin-button-edit">Edit</Link>
                {handleDelete && (
                  <button onClick={() => handleDelete(item._id)} className="admin-button-delete"><FontAwesomeIcon icon={faTrash} className="btn-icon-graphic" />
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
); };

export default AdminTable;