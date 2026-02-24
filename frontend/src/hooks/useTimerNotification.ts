import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export function useTimerNotification() {
  const { t } = useLanguage();
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (permission === 'granted') {
      return true;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const showNotification = async (title?: string, body?: string) => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return;
    }

    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) {
        console.warn('Notification permission denied');
        return;
      }
    }

    try {
      new Notification(title || t('timer.notificationTitle'), {
        body: body || t('timer.notificationBody'),
        icon: '/assets/generated/shop-logo.dim_512x512.png',
        badge: '/assets/generated/shop-logo.dim_512x512.png',
        tag: 'timer-reminder',
        requireInteraction: true,
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  };

  return {
    permission,
    requestPermission,
    showNotification,
  };
}
