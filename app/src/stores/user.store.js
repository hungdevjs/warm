import { create } from 'zustand';

const useUserStore = create((set, get) => ({
  user: null,
  setUser: (newUser) => set((state) => ({ user: newUser })),
}));

export default useUserStore;
