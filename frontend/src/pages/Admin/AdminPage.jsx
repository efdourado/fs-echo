import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

import * as api from '../../api/api'; 

import * as adminApi from '../../api/adminApi';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AdminTable from './components/AdminTable';
import AdminEditModal from './components/AdminEditModal';


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


  const [editingItem, setEditingItem] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const fetchData = TABS[activeTab].fetch;
      if (fetchData) {

        const result = await fetchData();

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

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleCloseModal = () => {
    setEditingItem(null);
  };
  
  const handleSaveAndReload = () => {
      loadData(); // Recarrega os dados da tabela
  }

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

  const currentType = activeTab.slice(0, -1);

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
        
        <Link to={`/admin/new/${currentType}`} className="login-btn create-btn">
          <FontAwesomeIcon icon={faPlus} className="btn-icon-graphic" />
          <span className="btn-label"> Add New {currentType}</span>
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
            handleEdit={handleEdit}
          />
        )}
      </div>

       <AdminEditModal
        isOpen={!!editingItem}
        onClose={handleCloseModal}
        item={editingItem}
        type={currentType}
        onSaved={handleSaveAndReload}
      />
    </div>
); };

export default AdminPage;