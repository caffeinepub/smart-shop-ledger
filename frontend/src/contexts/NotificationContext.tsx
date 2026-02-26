import React, { createContext, useContext } from 'react';
import { useNotification } from '../hooks/useNotification';

interface NotificationContextType {
  showNotification: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  showNotification: () => {},
});

export const useNotificationContext = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notification, showNotification, hideNotification } = useNotification();

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {/* Lazy import to avoid circular deps */}
      <NotificationToastWrapper
        visible={notification.visible}
        message={notification.message}
        onDismiss={hideNotification}
      />
    </NotificationContext.Provider>
  );
};

// Inline wrapper to avoid separate import cycle
import NotificationToast from '../components/NotificationToast';

const NotificationToastWrapper: React.FC<{ visible: boolean; message: string; onDismiss: () => void }> = (props) => {
  return <NotificationToast {...props} />;
};
