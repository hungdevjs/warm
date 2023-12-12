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
    throw new functions.https.HttpsError('bad-request', err.message, err);
  }
});

module.exports = {
  createNewPost,
};
