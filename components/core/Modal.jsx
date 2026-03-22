'use client'

import { useEffect, useRef } from 'react';

export default function Modal({ isOpen, onClose, title, children, footer, align = 'start' }) {

  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay d-flex align-items-center justify-content-center" 
         onClick={(e) => e.target === e.currentTarget && onClose()}
         style={{
           position: 'fixed',
           top: 0, left: 0, right: 0, bottom: 0,
           backgroundColor: 'rgba(0, 0, 0, 0.7)',
           backdropFilter: 'blur(8px)',
           zIndex: 2000,
           animation: 'fadeIn 0.2s ease-out'
         }}>
      <div className="glass-panel p-0 shadow-2xl animate-scale-in" 
           style={{ 
             width: '100%', 
             maxWidth: '500px', 
             backgroundColor: 'var(--bg-sidebar)',
             border: '1px solid rgba(189, 147, 249, 0.2)',
             overflow: 'hidden'
           }}>
        
        {/* Header */}
        <div className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-white border-opacity-5">
          <h5 className="m-0 fw-bold text-white fs-5 text-start">{title}</h5>
          <button 
            onClick={onClose}
            className="btn btn-sm btn-outline-light border-0 opacity-50 hover-opacity-100 fs-4 py-0 btn-sm-cancel"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className={`p-4 text-${align}`}>
          {children}
        </div>



        {/* Footer */}
        {footer && (
          <div className="px-4 py-3 border-top border-white border-opacity-5 d-flex justify-content-end gap-2">
            {footer}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}
