import React from 'react';
import PropTypes from 'prop-types';

import FormModal from '../ui/FormModal';
import PlaylistForm from './PlaylistForm';

const PlaylistModal = ({ isOpen, onClose, playlist, onPlaylistUpdated, onDelete }) => {
  if (!isOpen) return null;

  const formProps = {
    playlist: playlist,
    onSaved: (updatedData) => {
      onPlaylistUpdated(updatedData);
      onClose();
  }, };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      FormComponent={PlaylistForm}
      formProps={formProps}
      title={`Edit "${playlist.name}"`}
      onDelete={onDelete}
    />
); };

PlaylistModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  playlist: PropTypes.object,
  onPlaylistUpdated: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default PlaylistModal;