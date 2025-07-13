import React, { useState, useEffect, useCallback } from 'react';
// ... other imports
import AdminModal from '../../components/modals/AdminModal';
import AdminForm from './AdminForm'; // Import the new dynamic form

// Import all configs
import { artistFormConfig } from './formConfigs/artistFormConfig';
import { albumFormConfig } from './formConfigs/albumFormConfig';
import { songFormConfig } from './formConfigs/songFormConfig';
import { userFormConfig } from './formConfigs/userFormConfig';

// Update TABS to include the config
const TABS = {
  artists: { label: 'Artists', fetch: artistFormConfig.api.fetch, delete: adminService.deleteArtist, config: artistFormConfig },
  albums: { label: 'Albums', fetch: albumFormConfig.api.fetch, delete: adminService.deleteAlbum, config: albumFormConfig },
  songs: { label: 'Songs', fetch: songFormConfig.api.fetch, delete: adminService.deleteSong, config: songFormConfig },
  users: { label: 'Users', fetch: adminService.fetchUsers, delete: adminService.deleteUser, config: userFormConfig },
};

const AdminPage = () => {
  // ... state and handlers
  
  const currentTab = TABS[activeTab];
  const currentTypeName = activeTab.slice(0, -1);
  const modalTitle = `${editingItem ? 'Edit' : 'Create New'} ${currentTypeName.charAt(0).toUpperCase() + currentTypeName.slice(1)}`;

  return (
    <div className="admin-page-unified">
      {/* ... header and table */}

      <AdminModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
        FormComponent={AdminForm} // The FormComponent is always AdminForm
        formProps={{
          id: editingItem ? editingItem._id : null,
          config: currentTab.config, // Pass the correct config
          onSaved: handleSaveAndReload,
        }}
      />
    </div>
  );
};

export default AdminPage;