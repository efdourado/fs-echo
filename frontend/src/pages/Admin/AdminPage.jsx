import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faUsers, faCompactDisc, faUserAstronaut } from '@fortawesome/free-solid-svg-icons';

import * as api from '../../api/api';
import * as adminApi from '../../api/adminApi';

import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AdminTable from './components/AdminTable';

const TABS = {
  artists: { label: 'Artists', icon: faUserAstronaut, fetch: api.fetchArtists, delete: adminApi.deleteArtist },
  albums: { label: 'Albums', icon: faCompactDisc, fetch: api.fetchAlbums, delete: adminApi.deleteAlbum },
  songs: { label: 'Songs', icon: faMusic, fetch: api.fetchSongs, delete: adminApi.deleteSong },
  users: { label: 'Users', icon: faUsers, fetch: api.fetchUsers, delete: null }, // Assuming no user delete function yet
};

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('artists');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const fetchData = TABS[activeTab].fetch;
      if (fetchData) {
        const result = await fetchData();
        setData(result);
      } else {
        setData([]); // Clear data for tabs without a fetch function
      }
    } catch (err) {
      setError(`Failed to fetch ${activeTab}.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

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
          loadData(); // Refresh data after deletion
        } else {
          throw new Error(`Delete function not available for ${activeTab}`);
        }
      } catch (err) {
        setError(`Failed to delete ${activeTab.slice(0, -1)}.`);
        console.error(err);
      }
    }
  };

  return (
    <div className="admin-page-unified">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <Link to={`/admin/${activeTab}/new`} className="admin-button-new">
          + Add New {activeTab.slice(0, -1)}
        </Link>
      </div>

      <div className="admin-tabs">
        {Object.keys(TABS).map(tabKey => (
          <button
            key={tabKey}
            className={`admin-tab-item ${activeTab === tabKey ? 'active' : ''}`}
            onClick={() => setActiveTab(tabKey)}
          >
            <FontAwesomeIcon icon={TABS[tabKey].icon} className="tab-icon" />
            {TABS[tabKey].label}
          </button>
        ))}
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
  );
};

export default AdminPage;