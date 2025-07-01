

import React from 'react';
import { formatDuration } from '../../../utils/duration';
import fallbackImage from '/fb.jpeg';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons"; // Adicionado ícone de edição


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
    columns: ['Item', 'Genres', 'Verified', 'Actions'], // Coluna 'Item' substitui 'Image' e 'Name'
    renderRow: (item) => (
      <>
        {/* Nova célula com imagem de fundo */}
        <td
          className="item-cell-background"
          style={{ backgroundImage: `url(${item.banner || item.image || fallbackImage})` }}
        >
          <div className="item-cell">
            <img
              src={item.image || fallbackImage}
              alt={item.name}
              className="admin-table-image"
              onError={(e) => { e.target.src = fallbackImage; }}
            />
            <span>{item.name}</span>
          </div>
        </td>
        <td data-label="Genres">{item.genre?.join(', ') || 'N/A'}</td>
        <td data-label="Verified">{item.verified ? 'Yes' : 'No'}</td>
      </>
    ),
  },
   albums: {
    columns: ['Cover', 'Title', 'Artist', 'Songs', 'Actions'],
    renderRow: (item) => (
      <>
        <td><img src={item.coverImage || fallbackImage} alt={item.title} className="admin-table-image" /></td>
        <td data-label="Title">{item.title}</td>
        <td data-label="Artist">{item.artist?.name || 'N/A'}</td>
        <td data-label="Songs">{item.songs?.length || 0}</td>
      </>
  ), },
  songs: {
    columns: ['Cover', 'Title', 'Artist', 'Duration', 'Actions'],
    renderRow: (item) => (
      <>
        <td><img src={item.coverImage || fallbackImage} alt={item.title} className="admin-table-image" /></td>
        <td data-label="Title">{item.title}</td>
        <td data-label="Artist">{item.artist?.name || 'N/A'}</td>
        <td data-label="Duration">{formatDuration(item.duration)}</td>
      </>
  ), },
  users: {
    columns: ['Avatar', 'Username', 'Email', 'Admin', 'Actions'],
    renderRow: (item) => (
      <>
        <td><img src={item.profilePic || fallbackImage} alt={item.username} className="admin-table-image" /></td>
        <td data-label="Username">{item.username}</td>
        <td data-label="Email">{item.email}</td>
        <td data-label="Admin">{item.isAdmin ? 'Yes' : 'No'}</td>
      </>
), },
};

const AdminTable = ({ type, data, handleDelete, handleEdit }) => { // Adicionado handleEdit
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
            {config.renderRow(item)}
            <td data-label="Actions">
              <div className="admin-table-actions">
                {/* Botão de Edição com Ícone */}
                <button onClick={() => handleEdit(item)} className="admin-action-button edit" aria-label="Edit">
                  <FontAwesomeIcon icon={faPencilAlt} />
                </button>
                
                {/* Botão de Deletar com Ícone */}
                {handleDelete && (
                  <button onClick={() => handleDelete(item._id)} className="admin-action-button delete" aria-label="Delete">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminTable;