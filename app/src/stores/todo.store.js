import { create } from 'zustand';

const useTodoStore = create((set, get) => ({
  todos: [],
  setTodos: (newTodos) => set((state) => ({ todos: newTodos })),
}));

export default useTodoStore;
