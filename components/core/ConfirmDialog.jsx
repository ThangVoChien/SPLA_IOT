'use client'

import Modal from './Modal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', variant = 'danger' }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} align="center">
      <div className="text-center py-2">
        <div className={`display-4 mb-4 text-${variant}`}>
          <i className={`bi ${variant === 'danger' ? 'bi-exclamation-triangle-fill' : 'bi-question-circle-fill'}`}></i>
        </div>
        <p className="fs-5 text-white mb-4 lh-base" style={{ whiteSpace: 'pre-line' }}>{message}</p>
        <div className="d-flex gap-2 justify-content-center">


          <button
            onClick={onClose}
            className="btn btn-outline-light border-0 opacity-50 px-4 btn-cancel-hover"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`btn btn-${variant} px-5 py-2 fw-bold shadow-lg`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
