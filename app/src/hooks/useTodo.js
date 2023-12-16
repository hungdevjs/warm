import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';

import { firestore } from '../configs/firebase.config';
import useCoupleStore from '../stores/couple.store';

const useTodo = (id) => {
  const couple = useCoupleStore((state) => state.couple);
  const [todo, setTodo] = useState(null);

  useEffect(() => {
    let unsubscribe;
    if (couple?.id && id) {
      const postDoc = doc(firestore, 'couples', couple.id, 'todos', id);
      unsubscribe = onSnapshot(postDoc, (snapshot) => {
        if (snapshot.exists()) {
          setTodo({
            id,
            ...snapshot.data(),
            creator: couple.users[snapshot.data().creatorId],
          });
        } else {
          setTodo(null);
        }
      });
    } else {
      setTodo(null);
    }

    return () => unsubscribe?.();
  }, [couple?.id, id]);

  return { todo };
};

export default useTodo;
