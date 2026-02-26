import React, { createContext, useContext } from 'react';
import { useNotification } from '../hooks/useNotification';
import NotificationToast from '../components/NotificationToast';

interface NotificationContextType {
  showNotification: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  showNotification: () => {},
});

export const useNotificationContext = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isVisible, message, showNotification, hideNotification } = useNotification();

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <NotificationToast
        isVisible={isVisible}
        message={message}
        onDismiss={hideNotification}
      />
    </NotificationContext.Provider>
  );
};
