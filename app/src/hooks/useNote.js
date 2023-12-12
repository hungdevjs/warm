import { useEffect } from 'react';
import {
  onSnapshot,
  query,
  collection,
  orderBy,
  limit,
} from 'firebase/firestore';

import { firestore } from '../configs/firebase.config';
import useNoteStore from '../stores/note.store';
import useCoupleStore from '../stores/couple.store';

const useNote = () => {
  const couple = useCoupleStore((state) => state.couple);
  const notes = useNoteStore((state) => state.notes);
  const setNotes = useNoteStore((state) => state.setNotes);

  useEffect(() => {
    let unsubscribe;

    if (couple?.id) {
      const q = query(
        collection(firestore, 'couples', couple.id, 'notes'),
        orderBy('createdAt', 'desc'),
        limit(100)
      );
      unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
          creator: couple.users[item.data().creatorId],
        }));
        setNotes(docs);
      });
    } else {
      setNotes([]);
    }

    return () => unsubscribe?.();
  }, [couple?.id]);

  return { notes };
};

export default useNote;
