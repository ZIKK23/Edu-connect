import Modal from './Modal';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Confirm Action'}>
      <p style={{ marginBottom: '1.5rem', fontSize: '0.9375rem', lineHeight: '1.6' }}>
        {message}
      </p>
      <div className="modal-buttons flex gap-md">
        <button 
          type="button"
          className="btn btn-secondary flex-1" 
          onClick={onClose}
        >
          Cancel
        </button>
        <button 
          type="button"
          className="btn btn-danger flex-1" 
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
