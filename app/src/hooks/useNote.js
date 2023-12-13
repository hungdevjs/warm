import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';

import { firestore } from '../configs/firebase.config';
import useCoupleStore from '../stores/couple.store';

const useNote = (id) => {
  const couple = useCoupleStore((state) => state.couple);
  const [note, setNote] = useState(null);

  useEffect(() => {
    if (couple?.id && id) {
      const postDoc = doc(firestore, 'couples', couple.id, 'notes', id);
      getDoc(postDoc).then((snapshot) => {
        if (snapshot.exists()) {
          setNote({
            id,
            ...snapshot.data(),
            creator: couple.users[snapshot.data().creatorId],
          });
        }
      });
    } else {
      setNote(null);
    }
  }, [couple?.id, id]);

  return { note };
};

export default useNote;
