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
  if (!isOpen || !item || !type) return null;

  const FormComponent = formComponents[type];

  if (!FormComponent) {
    console.error(`No form component found for type: ${type}`);
    return null;
  }

  const title = `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <FormComponent
        id={item._id}
        isModal={true} // Passamos uma prop para indicar que está num modal
        onClose={onClose} // Para que o form possa se fechar
        onSaved={onSaved} // Para recarregar os dados após salvar
      />
    </Modal>
  );
};

export default AdminEditModal;