import { create } from 'zustand';

const useMessageStore = create((set, get) => ({
  messages: [],
  setMessages: (newMessages) => set((state) => ({ messages: newMessages })),
}));

export default useMessageStore;
