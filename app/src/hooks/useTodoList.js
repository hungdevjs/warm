import { useEffect } from 'react';
import {
  onSnapshot,
  query,
  collection,
  orderBy,
  limit,
} from 'firebase/firestore';

import { firestore } from '../configs/firebase.config';
import useTodoStore from '../stores/todo.store';
import useCoupleStore from '../stores/couple.store';

const useTodoList = () => {
  const couple = useCoupleStore((state) => state.couple);
  const todos = useTodoStore((state) => state.todos);
  const setTodos = useTodoStore((state) => state.setTodos);

  useEffect(() => {
    let unsubscribe;

    if (couple?.id) {
      const q = query(
        collection(firestore, 'couples', couple.id, 'todos'),
        orderBy('createdAt', 'desc')
      );
      unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
          creator: couple.users[item.data().creatorId],
        }));
        setTodos(docs);
      });
    } else {
      setTodos([]);
    }

    return () => unsubscribe?.();
  }, [couple?.id]);

  return { todos };
};

export default useTodoList;
