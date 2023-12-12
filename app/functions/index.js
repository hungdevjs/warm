const admin = require('firebase-admin');

const { onAuthUserCreated } = require('./triggers/auth');
const {
  sendProposal,
  removeProposal,
  acceptProposal,
  declineProposal,
} = require('./callables/proposals');
const {
  createNewPost,
  createComment,
  togglePinnedStatus,
} = require('./callables/posts');

admin.initializeApp();

exports.onAuthUserCreated = onAuthUserCreated;
exports.sendProposal = sendProposal;
exports.removeProposal = removeProposal;
exports.acceptProposal = acceptProposal;
exports.declineProposal = declineProposal;
exports.createNewPost = createNewPost;
exports.createComment = createComment;
exports.togglePinnedStatus = togglePinnedStatus;
