const admin = require('firebase-admin');
const functions = require('firebase-functions');

const createNewNote = functions.https.onCall(async (data, context) => {
  functions.logger.info('create new note', data, context);

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

    const { title, content, color, textColor, imageURLs } = data;
    if (!title || !title.trim()) throw new Error('Invalid title');
    if (!content || !content.trim()) throw new Error('Invalid content');

    await admin
      .firestore()
      .collection('couples')
      .doc(coupleId)
      .collection('notes')
      .add({
        title,
        content,
        imageURLs,
        color,
        textColor,
        creatorId: uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return { status: 'OK' };
  } catch (err) {
    functions.logger.error('error in creating new note', data, context);
    throw new functions.https.HttpsError('invalid-argument', err.message, err);
  }
});

const updateNote = functions.https.onCall(async (data, context) => {
  functions.logger.info('update note', data, context);

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

    const { id, title, content, color, textColor, imageURLs } = data;
    if (!title || !title.trim()) throw new Error('Invalid title');
    if (!content || !content.trim()) throw new Error('Invalid content');

    const noteSnapshot = await admin
      .firestore()
      .collection('couples')
      .doc(coupleId)
      .collection('notes')
      .doc(id)
      .get();
    if (!noteSnapshot.exists) throw new Error('Note not found');

    await noteSnapshot.ref.update({
      title,
      content,
      imageURLs,
      color,
      textColor,
    });

    return { status: 'OK' };
  } catch (err) {
    functions.logger.error('error in updating note', data, context);
    throw new functions.https.HttpsError('invalid-argument', err.message, err);
  }
});

const removeNote = functions.https.onCall(async (data, context) => {
  functions.logger.info('remove note', data, context);

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

    const { id } = data;

    const noteSnapshot = await admin
      .firestore()
      .collection('couples')
      .doc(coupleId)
      .collection('notes')
      .doc(id)
      .get();
    if (!noteSnapshot.exists) throw new Error('Note not found');

    await noteSnapshot.ref.delete();

    return { status: 'OK' };
  } catch (err) {
    functions.logger.error('error in removing note', data, context);
    throw new functions.https.HttpsError('invalid-argument', err.message, err);
  }
});

module.exports = {
  createNewNote,
  updateNote,
  removeNote,
};
