import { create } from 'zustand';

const useNoteStore = create((set, get) => ({
  notes: [],
  setNotes: (newNotes) => set((state) => ({ notes: newNotes })),
}));

export default useNoteStore;
