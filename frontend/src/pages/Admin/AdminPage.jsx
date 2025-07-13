import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSyncAlt } from "@fortawesome/free-solid-svg-icons";

import * as collectionService from '../../services/collectionService';
import * as adminService from '../../services/adminService';

import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AdminTable from './components/AdminTable';
import FormModal from '../../components/ui/FormModal';

import ArtistForm from './ArtistForm';
import AlbumForm from './AlbumForm';
import SongForm from './SongForm';
import UserForm from './UserForm';

const TABS = {
  artists: { label: 'Artists', fetch: collectionService.fetchArtists, delete: adminService.deleteArtist, form: ArtistForm },
  albums: { label: 'Albums', fetch: collectionService.fetchAlbums, delete: adminService.deleteAlbum, form: AlbumForm },
  songs: { label: 'Songs', fetch: collectionService.fetchSongs, delete: adminService.deleteSong, form: SongForm },
  users: { label: 'Users', fetch: adminService.fetchUsers, delete: adminService.deleteUser, form: UserForm },
};

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('artists');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false, item: null });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await TABS[activeTab].fetch();
      setData(data || []);
    } catch (err) {
      setError(`Failed to fetch ${activeTab}.`);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenModal = (item = null) => {
    setModalState({ isOpen: true, item: item });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, item: null });
  };

  const handleSaveAndReload = () => {
    loadData();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`);
    if (confirmDelete) {
      try {
        await TABS[activeTab].delete(id);
        loadData();
      } catch (err) {
        setError(`Failed to delete ${activeTab.slice(0, -1)}.`);
      }
    }
  };
  
  const handleDashboardCycle = () => {
    const tabKeys = Object.keys(TABS);
    const currentIndex = tabKeys.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % tabKeys.length;
    setActiveTab(tabKeys[nextIndex]);
  };

  const currentType = activeTab.slice(0, -1);
  const FormComponent = TABS[activeTab].form;
  const isEditing = !!modalState.item;
  const modalTitle = `${isEditing ? 'Edit' : 'Create New'} ${currentType.charAt(0).toUpperCase() + currentType.slice(1)}`;

  return (
    <div className="admin-page-unified">
      <div className="admin-header">
        <button className="login-btn create-btn" onClick={handleDashboardCycle}>
          {TABS[activeTab].label} Dashboard
          <FontAwesomeIcon icon={faSyncAlt} className="btn-icon-graphic" style={{ marginLeft: '8px' }}/>
        </button>
        <button onClick={() => handleOpenModal()} className="login-btn create-btn">
          <FontAwesomeIcon icon={faPlus} className="btn-icon-graphic" />
          <span className="btn-label"> Add New {currentType}</span>
        </button>
      </div>

      <div className="admin-content-area">
        {loading ? <LoadingSpinner /> : <AdminTable type={activeTab} data={data} handleDelete={handleDelete} handleEdit={handleOpenModal} />}
      </div>

      {modalState.isOpen && FormComponent && (
        <FormModal
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
          FormComponent={FormComponent}
          formProps={{
            id: isEditing ? modalState.item._id : null,
            onSaved: handleSaveAndReload,
            // Pass the item to the form with a dynamic prop name, e.g., 'artist', 'album'
            ...(isEditing && { [currentType]: modalState.item }),
          }}
          title={modalTitle}
        />
      )}
    </div>
  );
};

export default AdminPage;