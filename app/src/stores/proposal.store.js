import { create } from 'zustand';

const useProposalStore = create((set, get) => ({
  initialized: false,
  sentProposals: [],
  pendingProposals: [],
  setInitialized: (newInitialized) =>
    set((state) => ({ initialized: newInitialized })),
  setSentProposals: (newSentProposals) =>
    set((state) => ({ sentProposals: newSentProposals })),
  setPendingProposals: (newPendingProposals) =>
    set((state) => ({ pendingProposals: newPendingProposals })),
}));

export default useProposalStore;
