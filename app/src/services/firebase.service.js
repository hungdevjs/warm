import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import {
  query,
  getDocs,
  collection,
  where,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import validator from 'validator';

import { auth, firestore, functions } from '../configs/firebase.config';
import useCoupleStore from '../stores/couple.store';

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

const checkAuth = () => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Bad credential');

  const coupleId = useCoupleStore.getState().couple?.id;
  if (!coupleId) throw new Error('Bad request');

  return { uid, coupleId };
};

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

export const createNewPost = async (data) => {
  const { uid, coupleId } = checkAuth();

  const { text, imageURLs, isPinned } = data;
  if (!text || !text.trim()) throw new Error('Invalid text');

  const collectionRef = collection(firestore, 'couples', coupleId, 'posts');
  await addDoc(collectionRef, {
    text,
    imageURLs,
    isPinned: !!isPinned,
    numberOfComments: 0,
    creatorId: uid,
    createdAt: serverTimestamp(),
  });
};

export const removePost = async (data) => {
  const { coupleId } = checkAuth();

  const { id } = data;

  const postRef = doc(firestore, 'couples', coupleId, 'posts', id);
  await deleteDoc(postRef);
};

export const createComment = async (data) => {
  const { uid, coupleId } = checkAuth();

  const { text, postId, imageURL } = data;
  if (!text || !text.trim()) throw new Error('Invalid text');

  const collectionRef = collection(
    firestore,
    'couples',
    coupleId,
    'posts',
    postId,
    'comments'
  );
  await addDoc(collectionRef, {
    text,
    imageURL,
    creatorId: uid,
    createdAt: serverTimestamp(),
  });

  const postRef = doc(firestore, 'couples', coupleId, 'posts', postId);
  await updateDoc(postRef, { numberOfComments: increment(1) });
};

export const togglePinnedStatus = async (data) => {
  const { coupleId } = checkAuth();

  const { postId, isPinned } = data;
  const postRef = doc(firestore, 'couples', coupleId, 'posts', postId);
  await updateDoc(postRef, { isPinned });
};

export const createNewNote = async (data) => {
  const { uid, coupleId } = checkAuth();

  const { title, content, color, textColor, imageURLs } = data;
  if (!title || !title.trim()) throw new Error('Invalid title');
  if (!content || !content.trim()) throw new Error('Invalid content');

  const collectionRef = collection(firestore, 'couples', coupleId, 'notes');
  await addDoc(collectionRef, {
    title,
    content,
    imageURLs,
    color,
    textColor,
    creatorId: uid,
    createdAt: serverTimestamp(),
  });
};

export const updateNote = async (data) => {
  const { coupleId } = checkAuth();

  const { id, title, content, color, textColor, imageURLs } = data;
  if (!title || !title.trim()) throw new Error('Invalid title');
  if (!content || !content.trim()) throw new Error('Invalid content');

  const noteRef = doc(firestore, 'couples', coupleId, 'notes', id);
  await updateDoc(noteRef, {
    title,
    content,
    imageURLs,
    color,
    textColor,
  });
};

export const removeNote = async (data) => {
  const { coupleId } = checkAuth();

  const { id } = data;
  const noteRef = doc(firestore, 'couples', coupleId, 'notes', id);

  await deleteDoc(noteRef);
};

export const createTodo = async (data) => {
  const { uid, coupleId } = checkAuth();

  const { title, items } = data;
  if (!title || !title.trim()) throw new Error('Invalid title');
  if (!items || !items.length) throw new Error('Invalid items');

  const collectionRef = collection(firestore, 'couples', coupleId, 'todos');
  await addDoc(collectionRef, {
    title,
    items,
    creatorId: uid,
    createdAt: serverTimestamp(),
  });
};

export const updateTodo = async (data) => {
  const { coupleId } = checkAuth();

  const { id, title, items } = data;
  if (!title || !title.trim()) throw new Error('Invalid title');
  if (!items || !items.length) throw new Error('Invalid items');

  const todoRef = doc(firestore, 'couples', coupleId, 'todos', id);
  await updateDoc(todoRef, { title, items });
};

export const removeTodo = async (data) => {
  const { coupleId } = checkAuth();

  const { id } = data;

  const todoRef = doc(firestore, 'couples', coupleId, 'todos', id);
  await deleteDoc(todoRef);
};

export const createMessage = async (data) => {
  const { uid, coupleId } = checkAuth();

  const { text } = data;
  if (!text || !text.trim()) throw new Error('Invalid text');

  const collectionRef = collection(firestore, 'couples', coupleId, 'messages');
  await addDoc(collectionRef, {
    text,
    file: null,
    creatorId: uid,
    createdAt: serverTimestamp(),
  });
};
