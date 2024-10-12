import React, { createContext, useContext } from 'react';
import { NotificationManager } from 'react-notifications';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const notify = (type, message) => {
    switch (type) {
      case 'success':
        NotificationManager.success(message);
        break;
      case 'error':
        NotificationManager.error(message);
        break;
      case 'info':
        NotificationManager.info(message);
        break;
      case 'warning':
        NotificationManager.warning(message);
        break;
      default:
        break;
    }
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
