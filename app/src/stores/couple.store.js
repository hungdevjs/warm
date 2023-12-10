import { create } from 'zustand';

const useCoupleStore = create((set, get) => ({
  initialized: false,
  couple: null,
  setInitialized: (newInitialized) =>
    set((state) => ({ initialized: newInitialized })),
  setCouple: (newCouple) => set((state) => ({ couple: newCouple })),
}));

export default useCoupleStore;
