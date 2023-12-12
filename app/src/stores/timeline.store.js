import { create } from 'zustand';

const useTimelineStore = create((set, get) => ({
  posts: [],
  setPosts: (newPosts) => set((state) => ({ posts: newPosts })),
}));

export default useTimelineStore;
