import { useState, useCallback } from 'react';
import { useNotificationSound } from './useNotificationSound';

export function useNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const { playNotificationSound } = useNotificationSound();

  const showNotification = useCallback((msg: string) => {
    const notificationsEnabled = localStorage.getItem('notificationsEnabled');
    if (notificationsEnabled === 'false') return;

    setMessage(msg);
    setIsVisible(true);
    playNotificationSound();
  }, [playNotificationSound]);

  const hideNotification = useCallback(() => {
    setIsVisible(false);
  }, []);

  return { isVisible, message, showNotification, hideNotification };
}
