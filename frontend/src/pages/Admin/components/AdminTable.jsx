// efdourado/fs-echo/fs-echo-b27b6811cb30558251ffa6744b71422c489076a8/frontend/src/pages/Admin/components/AdminTable.jsx

import React from "react";
import { formatDuration } from "../../../utils/duration";
import fallbackImage from "/fb.jpeg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faCheckDouble,
} from "@fortawesome/free-solid-svg-icons";

const formatDateTime = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  const dateOptions = { day: "2-digit", month: "2-digit", year: "numeric" };
  const timeOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit" };

  const formattedDate = date.toLocaleDateString("pt-BR", dateOptions);
  const formattedTime = date.toLocaleTimeString("pt-BR", timeOptions);

  return (
    <>
      {formattedDate}
      <br />
      {formattedTime}
    </>
); };

const renderers = {
  verified: (item) => (
    <span
      className={`verified-badge ${
        item.verified ? "verified" : "not-verified"
      }`}
    >
      {item.verified ?  <FontAwesomeIcon icon={faCheckDouble} className="verified-icon" /> : "Not"}
    </span>
  ),
  duration: (item) => formatDuration(item.duration),

  timestamps: (item) => (
    <>
      <td data-label="Created At" className="date-cell-background">
        <div className="date-cell">{formatDateTime(item.createdAt)}</div>
      </td>
      <td data-label="Updated At" className="date-cell-background">
        <div className="date-cell">{formatDateTime(item.updatedAt)}</div>
      </td>
    </>
), };

const tableConfig = {
  artists: {
    columns: [
      "Artist",
      "Description",
      "Genres",
      "Verified?",
      "Created At",
      "Updated At",
      "Actions",
    ],
    renderRow: (item) => (
      <>
        <td
          className="item-cell-background"
          style={{
            backgroundImage: `url(${
              item.banner || item.image || fallbackImage
            })`,
          }}
        >
          <div className="item-cell">
            <img
              src={item.image || fallbackImage}
              alt={item.name}
              className="admin-table-image"
              onError={(e) => {
                e.target.src = fallbackImage;
              }}
            />
            <div style={{ fontWeight: 'var(--font-weight-bold)' }}>{item.name}</div>
          </div>
        </td>
        <td data-label="Description">
          <div className="artist-description">{item.description}</div>
        </td>
        <td data-label="Genre">
          <div className="genre-cell">{item.genre?.join(', ') || 'N/A'}</div>
        </td>
        <td data-label="Verified" style={{ textAlign: 'center' }}>{renderers.verified(item)}</td>
        {renderers.timestamps(item)}
      </>
  ), },

  albums: {
    columns: [
      "Album",
      "Songs",
      "Created At",
      "Updated At",
      "Actions",
    ],
    renderRow: (item) => (
      <>
        <td className="first-column-background">
           <div className="item-cell">
              <img
                src={item.coverImage || fallbackImage}
                alt={item.title}
                className="admin-table-image"
              />
              <div>
                <div style={{ fontWeight: 'var(--font-weight-bold)' }}>{item.title}</div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {item.artist?.name || "N/A"}
                  {item.artist?.verified && <FontAwesomeIcon icon={faCheckDouble} className="verified-icon" style={{ width: '10px' }}/>}
                </div>
              </div>
            </div>
        </td>
        <td data-label="Songs" style={{ textAlign: 'center' }}>{item.songs?.length || 0}</td>
        {renderers.timestamps(item)}
      </>
  ), },
  
  songs: {
    columns: [
      "Song",
      "Lyrics",
      "Duration",
      "Created At",
      "Updated At",
      "Actions",
    ],
    renderRow: (item) => (
      <>
        <td className="first-column-background">
          <div className="item-cell">
            <img
              src={item.coverImage || fallbackImage}
              alt={item.title}
              className="admin-table-image"
            />
            <div>
              <div style={{ fontWeight: 'var(--font-weight-bold)' }}>{item.title}</div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {item.artist?.name || "N/A"}
                {item.artist?.verified && <FontAwesomeIcon icon={faCheckDouble} className="verified-icon" />}
              </div>
            </div>
          </div>
        </td>
        <td data-label="Lyrics">
          <div className="artist-description">{item.lyrics}</div>
        </td>
        <td data-label="Duration" style={{ textAlign: 'center' }}>{renderers.duration(item)}</td>
        {renderers.timestamps(item)}
      </>
  ), },
  
  users: {
    columns: [
      "User",
      "Admin",
      "Created At",
      "Updated At",
      "Actions",
    ],
    renderRow: (item) => (
      <>
        <td className="first-column-background">
          <div className="item-cell">
            <img
              src={item.profilePic || fallbackImage}
              alt={item.username}
              className="admin-table-image"
            />
            <div>
              <div style={{ fontWeight: 'var(--font-weight-bold)' }}>{item.username}</div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                {item.email}
              </div>
            </div>
          </div>
        </td>
        <td data-label="Admin" style={{ textAlign: 'center' }}>
            <span
              className={`verified-badge ${
                item.isAdmin ? "verified" : "not-verified"
              }`}
            >
              {item.isAdmin ? <FontAwesomeIcon icon={faCheckDouble} className="verified-icon" /> : "Not"}
            </span>
        </td>
        {renderers.timestamps(item)}
      </>
), }, };

const AdminTable = ({ type, data, handleDelete, handleEdit }) => {
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
          {config.columns.map((col) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item._id}>
            {config.renderRow(item)}
            
            <td data-label="Actions">
              <div className="admin-table-actions">
                <button
                  onClick={() => handleEdit(item)}
                  className="admin-action-button edit"
                  aria-label="Edit"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>

                {handleDelete && (
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="admin-action-button delete"
                    aria-label="Delete"
                  >
                    <FontAwesomeIcon icon={faTrash} />
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