import { create } from 'zustand';

const useMessage = create((set, get) => ({
  messages: [],
  setMessages: (newMessages) => set((state) => ({ messages: newMessages })),
}));

export default useMessage;
