import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, style = {} }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const modalContentStyle = {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
    animation: 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards',
    ...style
  };

  const headerStyle = {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666'
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2>{title}</h2>
          <button style={closeButtonStyle} onClick={onClose}>&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;

