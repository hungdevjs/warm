const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { faker } = require('@faker-js/faker');

const onAuthUserCreated = functions.auth.user().onCreate(async (user) => {
  await admin
    .firestore()
    .collection('users')
    .doc(user.uid)
    .set({
      email: user.email,
      username: user.email.split('@')[0],
      gender: null,
      avatarURL: faker.image.avatar(),
      coupleId: null,
      notificationTokens: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

  await admin.firestore().collection('notifications').add({
    userId: user.uid,
    text: "Welcome to Warm! Let's do fun things together!",
    metadata: {},
    isRead: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});

module.exports = { onAuthUserCreated };
