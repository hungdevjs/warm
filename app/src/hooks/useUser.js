import { useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';

import { firestore } from '../configs/firebase.config';
import useUserStore from '../stores/user.store';

const useUser = (authInitialized, uid) => {
  const setInitialized = useUserStore((state) => state.setInitialized);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    let unsubscribe;
    if (authInitialized) {
      if (uid) {
        unsubscribe = onSnapshot(doc(firestore, 'users', uid), (snapshot) => {
          if (snapshot.exists()) {
            setUser({
              id: snapshot.id,
              ...snapshot.data(),
              avatarURL:
                snapshot.data().avatarURL || '/images/default-avatar.jpeg',
            });
          } else {
            setUser(null);
          }
          setInitialized(true);
        });
      } else {
        setUser(null);
        setInitialized(true);
      }
    }

    return () => unsubscribe?.();
  }, [uid, authInitialized]);
};

export default useUser;
