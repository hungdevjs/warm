import { useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';

import { firestore } from '../configs/firebase.config';
import useUserStore from '../stores/user.store';

const useUser = (uid) => {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    let unsubscribe;
    if (uid) {
      unsubscribe = onSnapshot(doc(firestore, 'users', uid), (snapshot) => {
        if (snapshot.exists()) {
          setUser({ id: snapshot.id, ...snapshot.data() });
        } else {
          setUser(null);
        }
      });
    } else {
      setUser(null);
    }

    return () => unsubscribe?.();
  }, [uid]);
};

export default useUser;
