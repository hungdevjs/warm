const admin = require('firebase-admin');

const { onAuthUserCreated } = require('./triggers/auth');

admin.initializeApp();

exports.onAuthUserCreated = onAuthUserCreated;
