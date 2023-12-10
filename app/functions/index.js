const admin = require('firebase-admin');

const { onAuthUserCreated } = require('./triggers/auth');
const { sendProposal } = require('./callables/proposals');

admin.initializeApp();

exports.onAuthUserCreated = onAuthUserCreated;
exports.sendProposal = sendProposal;
