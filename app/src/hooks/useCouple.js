import { useEffect } from 'react';
import {
  onSnapshot,
  doc,
  query,
  collection,
  where,
  documentId,
  getDocs,
} from 'firebase/firestore';

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
          async (snapshot) => {
            if (snapshot.exists()) {
              const q = query(
                collection(firestore, 'users'),
                where(documentId(), 'in', snapshot.data().users)
              );
              const userSnapshot = await getDocs(q);
              const users = userSnapshot.docs.reduce((result, item) => {
                result[item.id] = { id: item.id, ...item.data() };
                return result;
              }, {});
              setCouple({
                id: snapshot.id,
                ...snapshot.data(),
                users,
                coverURL:
                  snapshot.data().coverURL || '/images/default-cover.jpeg',
              });
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
