import { useState, useCallback } from 'react';
import { useNotificationSound } from './useNotificationSound';

const NOTIFICATIONS_KEY = 'notificationsEnabled';

export interface NotificationState {
  visible: boolean;
  message: string;
}

export function useNotification() {
  const [notification, setNotification] = useState<NotificationState>({ visible: false, message: '' });
  const { playNotificationSound } = useNotificationSound();

  const showNotification = useCallback((message: string) => {
    const notifEnabled = localStorage.getItem(NOTIFICATIONS_KEY);
    if (notifEnabled === 'false') return;

    setNotification({ visible: true, message });
    playNotificationSound();

    setTimeout(() => {
      setNotification({ visible: false, message: '' });
    }, 3500);
  }, [playNotificationSound]);

  const hideNotification = useCallback(() => {
    setNotification({ visible: false, message: '' });
  }, []);

  return { notification, showNotification, hideNotification };
}
