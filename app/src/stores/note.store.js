import { create } from 'zustand';

const useNoteStore = create((set, get) => ({
  notes: [],
  setNotes: (newNotes) => set((state) => ({ notes: newNotes })),
  layoutColumn: 1,
  setLayoutColumn: (newLayoutColumn) =>
    set((state) => ({ layoutColumn: newLayoutColumn })),
}));

export default useNoteStore;
