import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Remove from Favorites?</h3>
        <p>Are you sure you want to remove <span className="highlight">{itemName}</span> from your favorites?</p>
        <div className="modal-buttons">
          <button className="modal-button cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-button confirm" onClick={onConfirm}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal; 