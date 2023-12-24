const admin = require('firebase-admin');

const { onAuthUserCreated } = require('./triggers/auth');
const { onNotificationCreated } = require('./triggers/notifications');
const {
  sendProposal,
  removeProposal,
  acceptProposal,
  declineProposal,
} = require('./callables/proposals');

admin.initializeApp();

exports.onAuthUserCreated = onAuthUserCreated;
exports.onNotificationCreated = onNotificationCreated;
exports.sendProposal = sendProposal;
exports.removeProposal = removeProposal;
exports.acceptProposal = acceptProposal;
exports.declineProposal = declineProposal;
