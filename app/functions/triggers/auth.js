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
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
});

module.exports = { onAuthUserCreated };
