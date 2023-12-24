import { create } from 'zustand';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  hasNewNotifications: false,
  setNotifications: (newNotifications) =>
    set((state) => ({ notifications: newNotifications })),
  setHasNewNotifications: (newStatus) =>
    set((state) => ({ hasNewNotifications: newStatus })),
}));

export default useNotificationStore;
