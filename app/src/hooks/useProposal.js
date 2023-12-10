import { useState, useEffect } from 'react';
import {
  onSnapshot,
  query,
  collection,
  where,
  documentId,
  getDocs,
} from 'firebase/firestore';

import { firestore } from '../configs/firebase.config';
import useUserStore from '../stores/user.store';
import useProposalStore from '../stores/proposal.store';

const useProposal = () => {
  const [loaded, setLoaded] = useState([false, false]);
  const user = useUserStore((state) => state.user);
  const setInitialized = useProposalStore((state) => state.setInitialized);
  const sentProposals = useProposalStore((state) => state.sentProposals);
  const setSentProposals = useProposalStore((state) => state.setSentProposals);
  const pendingProposals = useProposalStore((state) => state.pendingProposals);
  const setPendingProposals = useProposalStore(
    (state) => state.setPendingProposals
  );

  useEffect(() => {
    let unsubscribe1, unsubscribe2;
    console.log({ user });
    if (user) {
      const query1 = query(
        collection(firestore, 'proposals'),
        where('senderId', '==', user.id),
        where('status', '==', 'sent')
      );
      unsubscribe1 = onSnapshot(query1, async (snapshot) => {
        if (!snapshot.empty) {
          const receiverIds = snapshot.docs.map(
            (item) => item.data().receiverId
          );
          if (!!receiverIds.length) {
            const q = query(
              collection(firestore, 'users'),
              where(documentId(), 'in', receiverIds)
            );
            const userSnapshot = await getDocs(q);
            const users = {};
            userSnapshot.docs.map((item) => {
              users[item.id] = item.data();
            });

            setSentProposals(
              snapshot.docs.map((item) => ({
                id: item.id,
                ...item.data(),
                receiver: {
                  id: item.data().receiverId,
                  ...users[item.data().receiverId],
                },
              }))
            );
          }
        } else {
          setSentProposals([]);
        }
        setLoaded((prevLoaded) => [true, prevLoaded[1]]);
      });

      const query2 = query(
        collection(firestore, 'proposals'),
        where('receiverId', '==', user.id),
        where('status', '==', 'sent')
      );
      unsubscribe2 = onSnapshot(query2, async (snapshot) => {
        if (!snapshot.empty) {
          const senderIds = snapshot.docs.map((item) => item.data().senderId);
          if (!!senderIds.length) {
            const q = query(
              collection(firestore, 'users'),
              where(documentId(), 'in', senderIds)
            );
            const userSnapshot = await getDocs(q);
            const users = {};
            userSnapshot.docs.map((item) => {
              users[item.id] = item.data();
            });

            setPendingProposals(
              snapshot.docs.map((item) => ({
                id: item.id,
                ...item.data(),
                sender: {
                  id: item.data().senderId,
                  ...users[item.data().senderId],
                },
              }))
            );
          }
        } else {
          setPendingProposals([]);
        }
        setLoaded((prevLoaded) => [prevLoaded[0], true]);
      });
    } else {
      // setSentProposals([]);
      // setPendingProposals([]);
    }

    return () => {
      unsubscribe1?.();
      unsubscribe2?.();
    };
  }, [user]);

  useEffect(() => {
    if (loaded[0] && loaded[1]) {
      setInitialized(true);
    }
  }, [loaded]);

  console.log(loaded);
};

export default useProposal;
