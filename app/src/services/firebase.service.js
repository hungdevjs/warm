import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { query, getDocs, collection, where } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import validator from 'validator';

import { auth, firestore, functions } from '../configs/firebase.config';

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = () => signInWithPopup(auth, provider);

export const searchUser = async (search) => {
  const isEmail = validator.isEmail(search);
  const q = isEmail
    ? query(collection(firestore, 'users'), where('email', '==', search))
    : query(collection(firestore, 'users'), where('username', '==', search));

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};

export const sendProposal = (data) =>
  httpsCallable(functions, 'sendProposal')(data);

export const removeProposal = (data) =>
  httpsCallable(functions, 'removeProposal')(data);

export const acceptProposal = (data) =>
  httpsCallable(functions, 'acceptProposal')(data);

export const declineProposal = (data) =>
  httpsCallable(functions, 'declineProposal')(data);

export const createNewPost = (data) =>
  httpsCallable(functions, 'createNewPost')(data);
