import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

// A importação de 'api' permanece para as outras abas
import * as api from '../../api/api'; 
// A importação de 'adminApi' agora inclui a função 'fetchUsers'
import * as adminApi from '../../api/adminApi';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AdminTable from './components/AdminTable';

// A configuração da aba de usuários agora aponta para a função correta
const TABS = {
  artists: { label: 'Artists', fetch: api.fetchArtists, delete: adminApi.deleteArtist },
  albums: { label: 'Albums', fetch: api.fetchAlbums, delete: adminApi.deleteAlbum },
  songs: { label: 'Songs', fetch: api.fetchSongs, delete: adminApi.deleteSong },
  users: { label: 'Users', fetch: adminApi.fetchUsers, delete: adminApi.deleteUser },
};

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('artists');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const fetchData = TABS[activeTab].fetch;
      if (fetchData) {
        // Agora, para a aba 'users', ele chamará adminApi.fetchUsers, que envia o token
        const result = await fetchData();
        // O adminApi retorna a resposta completa do axios, então pegamos result.data
        setData(result.data || result);
      } else {
        setData([]);
      }
    } catch (err) {
      setError(`Failed to fetch ${activeTab}.`);
      console.error(err);
    } finally {
      setLoading(false);
  } }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`);
    if (confirmDelete) {
      try {
        const deleteFn = TABS[activeTab].delete;
        if (deleteFn) {
          await deleteFn(id);
          loadData();
        } else {
          throw new Error(`Delete function not available for ${activeTab}`);
        }
      } catch (err) {
        setError(`Failed to delete ${activeTab.slice(0, -1)}.`);
        console.error(err);
  } } };

  const handleTabSelect = (tabKey) => {
    setActiveTab(tabKey);
    setIsMenuOpen(false);
  };

  // O resto do componente permanece o mesmo...
  return (
    <div className="admin-page-unified">
      <div className="admin-header">

         <div className="dashboard-menu-container">
          <button className="login-btn create-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {TABS[activeTab].label} Dashboard
            <FontAwesomeIcon icon={isMenuOpen ? faChevronUp : faChevronDown} className="btn-icon-graphic" />
          </button>
          {isMenuOpen && (
            <div className="dashboard-menu">
              {Object.keys(TABS).map(tabKey => (
                <button
                  key={tabKey}
                  className="dashboard-menu-item"
                  onClick={() => handleTabSelect(tabKey)}
                >
                  {TABS[tabKey].label}
                </button>
              ))}
            </div>
          )}
          </div>
        
        <Link to={`/admin/new/${activeTab.slice(0, -1)}`} className="login-btn create-btn">
          <FontAwesomeIcon icon={faPlus} className="btn-icon-graphic" />
          <span className="btn-label"> Add New {activeTab.slice(0, -1)}</span>
        </Link>
      </div>

      <div className="admin-content-area">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <AdminTable
            type={activeTab}
            data={data}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
); };

export default AdminPage;