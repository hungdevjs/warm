import { useEffect } from 'react';
import {
  onSnapshot,
  query,
  collection,
  orderBy,
  limit,
} from 'firebase/firestore';

import { firestore } from '../configs/firebase.config';
import useTimelineStore from '../stores/timeline.store';
import useCoupleStore from '../stores/couple.store';

const useTimeline = () => {
  const couple = useCoupleStore((state) => state.couple);
  const posts = useTimelineStore((state) => state.posts);
  const setPosts = useTimelineStore((state) => state.setPosts);

  useEffect(() => {
    let unsubscribe;

    if (couple?.id) {
      const q = query(
        collection(firestore, 'couples', couple.id, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(100)
      );
      unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
          creator: couple.users[item.data().creatorId],
        }));
        setPosts(docs);
      });
    } else {
      setPosts([]);
    }

    return () => unsubscribe?.();
  }, [couple?.id]);

  return { posts };
};

export default useTimeline;
