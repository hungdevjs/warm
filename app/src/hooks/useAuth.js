import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '../configs/firebase.config';

const useAuth = () => {
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setInitialized(true);
    });

    return unsubscribe;
    // eslint-disable-next-line
  }, []);

  return { initialized, user };
};

export default useAuth;
