import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import Modal from './Modal';

const FormModal = ({ isOpen, onClose, FormComponent, formProps, title, onDelete }) => {
  const handleSaved = (data) => {
    if (formProps.onSaved) {
      formProps.onSaved(data);
  } };

  const enhancedFormProps = {
    ...formProps,
    onSaved: handleSaved,
    onCancel: onClose,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="form-modal-body">
        <FormComponent {...enhancedFormProps} />
        {onDelete && (
          <div className="form-modal__delete-section">
            <button
              type="button"
              onClick={onDelete}
              className="form-modal__delete-btn"
              aria-label="Delete"
              disabled={formProps.isSaving}
            >
              <FontAwesomeIcon icon={faTrash} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </Modal>
); };

FormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  FormComponent: PropTypes.elementType.isRequired,
  formProps: PropTypes.object,
  title: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
};

export default FormModal;