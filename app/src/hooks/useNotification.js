import { useEffect } from 'react';
import {
  onSnapshot,
  query,
  collection,
  orderBy,
  limit,
  where,
} from 'firebase/firestore';

import { firestore } from '../configs/firebase.config';
import useNotificationStore from '../stores/notification.store';
import useUserStore from '../stores/user.store';

const useNotification = () => {
  const user = useUserStore((state) => state.user);
  const notifications = useNotificationStore((state) => state.notifications);
  const setNotifications = useNotificationStore(
    (state) => state.setNotifications
  );

  useEffect(() => {
    let unsubscribe;

    if (user?.id) {
      const q = query(
        collection(firestore, 'notifications'),
        where('userId', '==', user?.id),
        orderBy('createdAt', 'desc'),
        limit(200)
      );
      unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        setNotifications(docs);
      });
    } else {
      setNotifications([]);
    }

    return () => unsubscribe?.();
  }, [user?.id]);

  return { notifications };
};

export default useNotification;
