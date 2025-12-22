import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-[8px] flex items-center justify-center z-[1000] animate-[fadeIn_0.2s_ease]" onClick={handleBackdropClick}>
      <div className="bg-[var(--bg-card)] rounded-2xl p-0 max-w-[550px] w-[90%] max-h-[90vh] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-[var(--border-color)] animate-[fadeIn_0.3s_ease]">
        <div className="p-6 border-b border-[var(--border-color)] bg-gradient-to-r from-violet-500/10 to-purple-500/10 flex justify-between items-center">
          <h3 className="m-0 text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="bg-transparent border-none text-[var(--text-secondary)] text-2xl cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-white/10 hover:text-[var(--text-primary)]">
            <X size={20} />
          </button>
        </div>
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-100px)] bg-[var(--bg-card)]">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
