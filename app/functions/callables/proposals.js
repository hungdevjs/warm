const admin = require('firebase-admin');
const functions = require('firebase-functions');
const { faker } = require('@faker-js/faker');

const sendProposal = functions.https.onCall(async (data, context) => {
  functions.logger.info('send proposal', data, context);

  try {
    const { uid } = context?.auth || {};
    if (!uid) throw new Error('Bad request');
    functions.logger.info('0');

    const userSnapshot = await admin
      .firestore()
      .collection('users')
      .doc(uid)
      .get();

    const { coupleId } = userSnapshot.data();
    if (!!coupleId) throw new Error('You have had a partner already');

    functions.logger.info('1');

    const sentProposalSnapshot = await admin
      .firestore()
      .collection('proposals')
      .where('senderId', '==', uid)
      .where('status', '==', 'sent')
      .get();
    if (!sentProposalSnapshot.empty)
      throw new Error('You have sent a proposal already');

    functions.logger.info('2');

    const { receiverId } = data;
    if (receiverId === uid) throw new Error('Bad request');
    const receiverSnapshot = await admin
      .firestore()
      .collection('users')
      .doc(receiverId)
      .get();
    if (receiverSnapshot.empty) throw new Error('This user doesnot exist');

    functions.logger.info('3');

    const { coupleId: receiverCoupleId } = receiverSnapshot.data();
    if (!!receiverCoupleId)
      throw new Error('This user have had a partner already');

    const receiverSentProposalSnapshot = await admin
      .firestore()
      .collection('proposals')
      .where('senderId', '==', receiverId)
      .get();
    const receiverSentProposals = receiverSentProposalSnapshot.docs.map(
      (item) => ({ id: item.id, ...item.data() })
    );

    functions.logger.info({ receiverSentProposals });
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
    functions.logger.error('error in sending proposal', data, err);
    throw new functions.https.HttpsError('invalid-argument', err.message, err);
  }
});

const removeProposal = functions.https.onCall(async (data, context) => {
  functions.logger.info('remove proposal', data, context);

  try {
    const { uid } = context?.auth || {};
    if (!uid) throw new Error('Bad request');

    const { proposalId } = data;
    const proposalSnapshot = await admin
      .firestore()
      .collection('proposals')
      .doc(proposalId)
      .get();
    if (!proposalSnapshot.exists) throw new Error('Proposal not found');

    const { senderId, status } = proposalSnapshot.data();
    if (senderId !== uid) throw new Error('Bad credential');
    if (status !== 'sent')
      throw new Error('Bad request: Cannot remove proposal');

    await proposalSnapshot.ref.delete();

    return { status: 'OK' };
  } catch (err) {
    functions.logger.error('error in removing proposal', data, context);
    throw new functions.https.HttpsError('invalid-argument', err.message, err);
  }
});

const acceptProposal = functions.https.onCall(async (data, context) => {
  functions.logger.info('accept proposal', data, context);

  try {
    const { uid } = context?.auth || {};
    if (!uid) throw new Error('Bad request');

    const { proposalId } = data;
    const proposalSnapshot = await admin
      .firestore()
      .collection('proposals')
      .doc(proposalId)
      .get();
    if (!proposalSnapshot.exists) throw new Error('Proposal not found');

    const { senderId, receiverId, status } = proposalSnapshot.data();
    if (receiverId !== uid) throw new Error('Bad credential');
    if (status !== 'sent')
      throw new Error('Bad request: Cannot accept proposal');

    await proposalSnapshot.ref.update({
      status: 'accepted',
    });

    // create couple
    const newCouple = await admin
      .firestore()
      .collection('couples')
      .add({
        name: `Couple ${Date.now().toString().slice(-5)}`,
        coverURL: faker.image.urlLoremFlickr({
          category: 'nature',
          width: 640,
          height: 360,
        }),
        startDate: admin.firestore.FieldValue.serverTimestamp(),
        balance: 0,
        pricingPlanId: 'free',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastTimeReceiveGold: admin.firestore.FieldValue.serverTimestamp(),
        users: [senderId, receiverId],
      });

    // update users coupleId
    await admin
      .firestore()
      .collection('users')
      .doc(senderId)
      .update({ coupleId: newCouple.id });
    await admin
      .firestore()
      .collection('users')
      .doc(receiverId)
      .update({ coupleId: newCouple.id });

    // decline all pending proposals && remove all sent proposals
    const senderPendingProposalSnapshot = await admin
      .firestore()
      .collection('proposals')
      .where('receiverId', '==', senderId)
      .where('status', '==', 'sent')
      .get();
    if (!senderPendingProposalSnapshot.empty) {
      const promises = senderPendingProposalSnapshot.docs.map((item) =>
        item.ref.update({ status: 'declined' })
      );
      await Promise.all(promises);
    }

    const receiverSentProposalSnapshot = await admin
      .firestore()
      .collection('proposals')
      .where('senderId', '==', uid)
      .get();
    if (!receiverSentProposalSnapshot.empty) {
      const promises = receiverSentProposalSnapshot.docs.map((item) =>
        item.ref.delete()
      );
      await Promise.all(promises);
    }

    return { status: 'OK' };
  } catch (err) {
    functions.logger.error('error in accepting proposal', data, context);
    throw new functions.https.HttpsError('invalid-argument', err.message, err);
  }
});

const declineProposal = functions.https.onCall(async (data, context) => {
  functions.logger.info('decline proposal', data, context);

  try {
    const { uid } = context?.auth || {};
    if (!uid) throw new Error('Bad request');

    const { proposalId } = data;
    const proposalSnapshot = await admin
      .firestore()
      .collection('proposals')
      .doc(proposalId)
      .get();
    if (!proposalSnapshot.exists) throw new Error('Proposal not found');

    const { receiverId, status } = proposalSnapshot.data();
    if (receiverId !== uid) throw new Error('Bad credential');
    if (status !== 'sent')
      throw new Error('Bad request: Cannot decline proposal');

    await proposalSnapshot.ref.update({ status: 'declined' });

    return { status: 'OK' };
  } catch (err) {
    functions.logger.error('error in declining proposal', data, context);
    throw new functions.https.HttpsError('invalid-argument', err.message, err);
  }
});

module.exports = {
  sendProposal,
  removeProposal,
  acceptProposal,
  declineProposal,
};
