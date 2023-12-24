const functions = require('firebase-functions');
const admin = require('firebase-admin');

const onNotificationCreated = functions.firestore
  .document('notifications/{id}')
  .onCreate(async (doc) => {
    try {
      const { userId, text, metadata } = doc.data();
      const userSnapshot = await admin
        .firestore()
        .collection('users')
        .doc(userId)
        .get();

      if (userSnapshot.exists) {
        const { notificationTokens } = userSnapshot.data();

        const promises = notificationTokens.map((token) => {
          const message = {
            data: { text, ...metadata },
            token,
          };

          admin.messaging().send(message);
        });

        await Promise.all(promises);
      }
    } catch (exception) {
      functions.logger.error('onNotificationCreated', exception);
    }
  });

module.exports = { onNotificationCreated };
