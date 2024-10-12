import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Notification = ({ message, onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!show) return null;

  return (
    <div
      className={`alert alert-success alert-dismissible fade show position-fixed w-100`}
      style={{ top: '56px', zIndex: 999 }}
      role="alert"
    >
      <div className="container d-flex justify-content-between align-items-center">
        {message}
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={() => {
            setShow(false);
            onClose();
          }}
        ></button>
      </div>
    </div>
  );
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Notification;
