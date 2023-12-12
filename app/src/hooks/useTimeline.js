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
        const pinnedPosts = docs.filter((post) => post.isPinned);
        const notPinnedPosts = docs.filter((post) => !post.isPinned);
        setPosts([...pinnedPosts, ...notPinnedPosts]);
      });
    } else {
      setPosts([]);
    }

    return () => unsubscribe?.();
  }, [couple?.id]);

  return { posts };
};

export default useTimeline;
