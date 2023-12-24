import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getToken, onMessage } from 'firebase/messaging';
import { useSnackbar } from 'notistack';

import { messaging } from '../configs/firebase.config';
import { addUserNotificationToken } from '../services/firebase.service';
import useUserStore from '../stores/user.store';
import useNotificationStore from '../stores/notification.store';
import environments from '../utils/environments';

const { FIREBASE_VAPID_KEY } = environments;

function showNotification() {
  const notificationOptions = {
    body: 'Notification body',
    data: 'Notification data',
    dir: 'rtl',
    icon: '/logo-icon.png',
  };
  const notif = new Notification(
    'New notification from Warm',
    notificationOptions
  );

  notif.onclick = () => {
    console.log('Notification clicked');
  };
}

const useNotificationRegister = () => {
  const { pathname } = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const setHasNewNotifications = useNotificationStore(
    (state) => state.setHasNewNotifications
  );
  const user = useUserStore((state) => state.user);
  const [token, setToken] = useState(null);

  const registerServiceWorker = () => {
    if (navigator.serviceWorker) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then(() => {
          getToken(messaging, {
            vapidKey: FIREBASE_VAPID_KEY,
          })
            .then((currentToken) => {
              if (currentToken) {
                addUserNotificationToken({ token: currentToken });
                setToken(currentToken);
              }
            })
            .catch((err) => {
              console.log('An error occurred while retrieving token. ', err);
            });
        })
        .catch(console.log);
    }
  };

  useEffect(() => {
    if (!!user) {
      if (window.Notification) {
        if (Notification.permission === 'granted') {
          registerServiceWorker();
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              registerServiceWorker();
            } else {
              enqueueSnackbar(
                'Need to enable notification to receive notifications',
                { variant: 'error' }
              );
            }
          });
        }
      }
    }
  }, [user]);

  useEffect(() => {
    let unsubscribe;
    if (token) {
      onMessage(messaging, (data) => {
        pathname !== '/notifications' && setHasNewNotifications(true);
      });
    }

    return () => unsubscribe?.();
  }, [token]);
};

export default useNotificationRegister;
