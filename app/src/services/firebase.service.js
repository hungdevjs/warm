import { signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
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
  Timestamp,
  arrayUnion,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';
import validator from 'validator';

import {
  auth,
  firestore,
  storage,
  functions,
} from '../configs/firebase.config';
import useUserStore from '../stores/user.store';
import useCoupleStore from '../stores/couple.store';
import { NotificationTypes } from '../utils/notifications';

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

export const logOut = () => signOut(auth);

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

export const getPartner = async () => {
  const userId = auth.currentUser?.uid;
  const couple = useCoupleStore.getState().couple;
  const partnerId = Object.keys(couple.users).find((id) => id !== userId);
  const partner = couple.users[partnerId];
  return partner;
};

export const createNotification = async (data) => {
  const { userId, text, metadata } = data;
  const coupleId = useCoupleStore.getState().couple.id;

  const collectionRef = collection(firestore, 'notifications');

  await addDoc(collectionRef, {
    userId,
    coupleId,
    text,
    metadata,
    isRead: false,
    createdAt: serverTimestamp(),
  });
};

export const readNotification = async (data) => {
  const { id } = data;
  const notificationRef = doc(firestore, 'notifications', id);
  await updateDoc(notificationRef, { isRead: true });
};

export const createNewPost = async (data) => {
  const { uid, coupleId } = checkAuth();

  const { text, images, isPinned } = data;
  if (!text || !text.trim()) throw new Error('Invalid text');

  const collectionRef = collection(firestore, 'couples', coupleId, 'posts');
  const newPost = await addDoc(collectionRef, {
    text,
    images,
    isPinned: !!isPinned,
    numberOfComments: 0,
    creatorId: uid,
    createdAt: serverTimestamp(),
  });

  const partner = await getPartner();
  const user = useUserStore.getState().user;
  await createNotification({
    userId: partner.id,
    text: `${user.username} created a post`,
    metadata: {
      type: NotificationTypes.CreateNewPost,
      postId: newPost.id,
    },
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

  const partner = await getPartner();
  const user = useUserStore.getState().user;
  await createNotification({
    userId: partner.id,
    text: `${user.username} commented on a post`,
    metadata: {
      type: NotificationTypes.NewPostComment,
      postId,
    },
  });
};

export const togglePinnedStatus = async (data) => {
  const { coupleId } = checkAuth();

  const { postId, isPinned } = data;
  const postRef = doc(firestore, 'couples', coupleId, 'posts', postId);
  await updateDoc(postRef, { isPinned });
};

export const createNewNote = async (data) => {
  const { uid, coupleId } = checkAuth();

  const { title, content, color, textColor, images } = data;
  if (!title || !title.trim()) throw new Error('Invalid title');
  if (!content || !content.trim()) throw new Error('Invalid content');

  const collectionRef = collection(firestore, 'couples', coupleId, 'notes');
  const newNote = await addDoc(collectionRef, {
    title,
    content,
    images,
    color,
    textColor,
    creatorId: uid,
    createdAt: serverTimestamp(),
  });

  const partner = await getPartner();
  const user = useUserStore.getState().user;
  await createNotification({
    userId: partner.id,
    text: `${user.username} created a note`,
    metadata: {
      type: NotificationTypes.CreateNewPost,
      noteId: newNote.id,
    },
  });
};

export const updateNote = async (data) => {
  const { coupleId } = checkAuth();

  const { id, title, content, color, textColor, images } = data;
  if (!title || !title.trim()) throw new Error('Invalid title');
  if (!content || !content.trim()) throw new Error('Invalid content');

  const noteRef = doc(firestore, 'couples', coupleId, 'notes', id);
  await updateDoc(noteRef, {
    title,
    content,
    images,
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
  const newTodo = await addDoc(collectionRef, {
    title,
    items,
    creatorId: uid,
    createdAt: serverTimestamp(),
  });

  const partner = await getPartner();
  const user = useUserStore.getState().user;
  await createNotification({
    userId: partner.id,
    text: `${user.username} created a todo list`,
    metadata: {
      type: NotificationTypes.CreateNewTodo,
      todoId: newTodo.id,
    },
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

  const partner = await getPartner();
  const user = useUserStore.getState().user;
  await createNotification({
    userId: partner.id,
    text: `${user.username} sent you a message`,
    metadata: {
      type: NotificationTypes.NewMessage,
    },
  });
};

export const uploadFile = async (data) => {
  const { storagePath, file } = data;
  const fileRef = ref(storage, storagePath);
  await uploadBytes(fileRef, file, { contentType: file.type });
  const url = await getDownloadURL(fileRef);
  return { storagePath, url };
};

export const updateUser = async (data) => {
  const { uid } = checkAuth();
  const { username, gender, avatarURL } = data;
  if (!username || !username.trim()) throw new Error('Invalid username');

  const collectionRef = collection(firestore, 'users');
  const q = query(collectionRef, where('username', '==', username));
  const existedSnapshot = await getDocs(q);
  if (existedSnapshot.size > 1) throw new Error('Username existed');
  if (existedSnapshot.size === 1) {
    if (existedSnapshot.docs[0].id !== uid) throw new Error('Username existed');
  }

  const docRef = doc(firestore, 'users', uid);
  await updateDoc(docRef, {
    username,
    gender,
    avatarURL,
  });
};

export const updateCouple = async (data) => {
  const { coupleId } = checkAuth();
  const { name, coverURL, startDate } = data;
  if (!name || !name.trim()) throw new Error('Invalid name');

  const docRef = doc(firestore, 'couples', coupleId);
  await updateDoc(docRef, {
    name,
    coverURL,
    startDate: Timestamp.fromMillis(startDate),
  });

  const partner = await getPartner();
  const user = useUserStore.getState().user;
  await createNotification({
    userId: partner.id,
    text: `${user.username} updated couple profile`,
    metadata: {
      type: NotificationTypes.UpdateCouple,
    },
  });
};

export const addUserNotificationToken = async (data) => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Bad credential');
  const { token } = data;
  const userRef = doc(firestore, 'users', uid);
  await updateDoc(userRef, {
    notificationTokens: arrayUnion(token),
  });
};
