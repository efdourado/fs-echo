import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Modal = ({ isOpen, onClose, title, children, onDelete }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="carousel__header">
          <h2 className="carousel__title">{title}</h2>
        </div>
        <div className="modal-body">{children}</div>
        {onDelete && (
          <div className="modal-footer">
            <button
              type="button"
              onClick={onDelete}
              className="cta-button primary-cta"
              aria-label="Delete"
            >
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>,
    document.getElementById('root')
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onDelete: PropTypes.func,
};

export default Modal;