const admin = require('firebase-admin');
const functions = require('firebase-functions');

const createNewPost = functions.https.onCall(async (data, context) => {
  functions.logger.info('create new post', data, context);

  try {
    const { uid } = context?.auth || {};
    if (!uid) throw new Error('Bad request');

    const userSnapshot = await admin
      .firestore()
      .collection('users')
      .doc(uid)
      .get();
    const { coupleId } = userSnapshot.data();
    if (!coupleId) throw new Error('You have not had a partner');

    const { text, imageURLs, isPinned } = data;
    if (!text || !text.trim()) throw new Error('Invalid text');

    await admin
      .firestore()
      .collection('couples')
      .doc(coupleId)
      .collection('posts')
      .add({
        text,
        imageURLs,
        isPinned: !!isPinned,
        numberOfComments: 0,
        creatorId: uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return { status: 'OK' };
  } catch (err) {
    functions.logger.error('error in creating new post', data, context);
    throw new functions.https.HttpsError('invalid-argument', err.message, err);
  }
});

const createComment = functions.https.onCall(async (data, context) => {
  functions.logger.info('create comment', data, context);

  try {
    const { uid } = context?.auth || {};
    if (!uid) throw new Error('Bad request');

    const userSnapshot = await admin
      .firestore()
      .collection('users')
      .doc(uid)
      .get();
    const { coupleId } = userSnapshot.data();
    if (!coupleId) throw new Error('You have not had a partner');

    const { text, postId, imageURL } = data;
    if (!text || !text.trim()) throw new Error('Invalid text');

    const postSnapshot = await admin
      .firestore()
      .collection('couples')
      .doc(coupleId)
      .collection('posts')
      .doc(postId)
      .get();
    if (!postSnapshot.exists) throw new Error('Post not found');

    await admin
      .firestore()
      .collection('couples')
      .doc(coupleId)
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .add({
        text,
        imageURL,
        creatorId: uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    await postSnapshot.ref.update({
      numberOfComments: admin.firestore.FieldValue.increment(1),
    });

    return { status: 'OK' };
  } catch (err) {
    functions.logger.error('error in creating comment', data, context);
    throw new functions.https.HttpsError('invalid-argument', err.message, err);
  }
});

const togglePinnedStatus = functions.https.onCall(async (data, context) => {
  functions.logger.info('toggle pinned status', data, context);

  try {
    const { uid } = context?.auth || {};
    if (!uid) throw new Error('Bad request');

    const userSnapshot = await admin
      .firestore()
      .collection('users')
      .doc(uid)
      .get();
    const { coupleId } = userSnapshot.data();
    if (!coupleId) throw new Error('You have not had a partner');

    const { postId } = data;

    const postSnapshot = await admin
      .firestore()
      .collection('couples')
      .doc(coupleId)
      .collection('posts')
      .doc(postId)
      .get();
    if (!postSnapshot.exists) throw new Error('Post not found');

    await postSnapshot.ref.update({
      isPinned: !postSnapshot.data().isPinned,
    });

    return { status: 'OK' };
  } catch (err) {
    functions.logger.error('error in toggling pinned status', data, context);
    throw new functions.https.HttpsError('invalid-argument', err.message, err);
  }
});

module.exports = {
  createNewPost,
  createComment,
  togglePinnedStatus,
};
