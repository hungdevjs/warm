import { useEffect } from 'react';
import {
  onSnapshot,
  query,
  collection,
  orderBy,
  limit,
} from 'firebase/firestore';

import { firestore } from '../configs/firebase.config';
import useMessageStore from '../stores/message.store';
import useCoupleStore from '../stores/couple.store';

const useMessage = () => {
  const couple = useCoupleStore((state) => state.couple);
  const messages = useMessageStore((state) => state.messages);
  const setMessages = useMessageStore((state) => state.setMessages);

  useEffect(() => {
    let unsubscribe;

    if (couple?.id) {
      const q = query(
        collection(firestore, 'couples', couple.id, 'messages'),
        orderBy('createdAt', 'desc'),
        limit(200)
      );
      unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
          creator: couple.users[item.data().creatorId],
        }));
        setMessages(docs.reverse());
      });
    } else {
      setMessages([]);
    }

    return () => unsubscribe?.();
  }, [couple?.id]);

  return { messages };
};

export default useMessage;
