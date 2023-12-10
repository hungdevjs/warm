import { useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';

import { firestore } from '../configs/firebase.config';
import useUserStore from '../stores/user.store';
import useCoupleStore from '../stores/couple.store';

const useCouple = () => {
  const user = useUserStore((state) => state.user);
  const setCouple = useCoupleStore((state) => state.setCouple);
  const setInitialized = useCoupleStore((state) => state.setInitialized);

  useEffect(() => {
    let unsubscribe;
    if (user) {
      if (user.coupleId) {
        unsubscribe = onSnapshot(
          doc(firestore, 'couples', user?.coupleId),
          (snapshot) => {
            if (snapshot.exists()) {
              setCouple({ id: snapshot.id, ...snapshot.data() });
            } else {
              setCouple(null);
            }
            setInitialized(true);
          }
        );
      } else {
        setCouple(null);
        setInitialized(true);
      }
    }

    return () => unsubscribe?.();
  }, [user]);
};

export default useCouple;
