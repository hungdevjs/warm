const admin = require('firebase-admin');
const functions = require('firebase-functions');

const sendProposal = functions.https.onCall(async (data, context) => {
  functions.logger.info('send proposal', data, context);

  try {
    const { uid } = context?.auth || {};
    if (!uid) throw new Error('Bad request');

    const userSnapshot = await admin
      .firestore()
      .collection('users')
      .doc(uid)
      .get();
    const { coupleId } = userSnapshot.data();

    if (!!coupleId) throw new Error('You have had a partner already');

    const sentProposalSnapshot = await admin
      .firestore()
      .collection('proposals')
      .where('senderId', '==', uid)
      .where('status', '==', 'sent')
      .get();
    if (!sentProposalSnapshot.empty)
      throw new Error('You have sent a proposal already');

    const { receiverId } = data;
    if (receiverId === uid) throw new Error('Bad request');
    const receiverSnapshot = await admin
      .firestore()
      .collection('users')
      .doc(receiverId)
      .get();
    if (receiverSnapshot.empty) throw new Error('This user doesnot exist');

    const { coupleId: receiverCoupleId } = receiverSnapshot.data();
    if (!!receiverCoupleId)
      throw new Error('This user have had a partner already');

    const receiverSentProposalSnapshot = await firestore
      .collection('proposals')
      .where('senderId', '==', receiverId)
      .get();
    const receiverSentProposals = receiverSentProposalSnapshot.docs.map(
      (item) => ({ id: item.id, ...item.data() })
    );
    if (receiverSentProposals.some((item) => item.receiverId === uid))
      throw new Error(
        'This user has sent a proposal to you already. Please check your pending proposal'
      );

    await admin.firestore().collection('proposals').add({
      senderId: uid,
      receiverId,
      status: 'sent',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { status: 'OK' };
  } catch (err) {
    functions.logger.error('error in sending proposal', data, context);
    throw new functions.https.HttpsError('bad-request', err.message, err);
  }
});

module.exports = {
  sendProposal,
};
