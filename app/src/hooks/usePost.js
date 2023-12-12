import { useState, useEffect } from 'react';
import {
  onSnapshot,
  doc,
  collection,
  getDoc,
  orderBy,
  query,
} from 'firebase/firestore';

import { firestore } from '../configs/firebase.config';
import useCoupleStore from '../stores/couple.store';

const usePost = (id) => {
  const couple = useCoupleStore((state) => state.couple);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    let unsubscribe;
    if (couple?.id && id) {
      const postDoc = doc(firestore, 'couples', couple.id, 'posts', id);
      getDoc(postDoc).then((snapshot) => {
        if (snapshot.exists()) {
          setPost({
            id,
            ...snapshot.data(),
            creator: couple.users[snapshot.data().creatorId],
          });
          const q = query(
            collection(
              firestore,
              'couples',
              couple.id,
              'posts',
              id,
              'comments'
            ),
            orderBy('createdAt', 'desc')
          );
          unsubscribe = onSnapshot(q, (commentSnapshot) => {
            setComments(
              commentSnapshot.docs.map((item) => ({
                id: item.id,
                ...item.data(),
                creator: couple.users[item.data().creatorId],
              }))
            );
          });
        }
      });
    } else {
      setPost(null);
      setComments([]);
    }

    return () => unsubscribe?.();
  }, [couple?.id, id]);

  return { post, setPost, comments };
};

export default usePost;
