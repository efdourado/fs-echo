import React from 'react';

import Modal from '../../../components/ui/Modal';

import ArtistForm from '../ArtistForm';
import AlbumForm from '../AlbumForm';
import SongForm from '../SongForm';
import UserForm from '../UserForm';

const formComponents = {
  artist: ArtistForm,
  album: AlbumForm,
  song: SongForm,
  user: UserForm,
};

const AdminEditModal = ({ isOpen, onClose, item, type, onSaved }) => {
  if (!isOpen || !type) return null;

  const isEditing = !!item;
  const FormComponent = formComponents[type];

  if (!FormComponent) {
    console.error(`No form component found for type: ${type}`);
    return null;
  }

  const title = `${isEditing ? 'Edit' : 'Create New'} ${type.charAt(0).toUpperCase() + type.slice(1)}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <FormComponent
        id={isEditing ? item._id : null}
        isModal={true}
        onClose={onClose}
        onSaved={onSaved}
      />
    </Modal>
); };

export default AdminEditModal;