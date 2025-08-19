import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

export interface NotificationData {
  id: string;
  message: string;
  email?: string | undefined | null;
  phoneNumber?: string | undefined | null;
  timestamp: string; // ISO string format
}

export interface NotificationState {
  notifications: NotificationData[];
  push: (notification: NotificationData) => void;
  pop: (id: string) => void;
}

export const notificationStore = create<NotificationState>()(
  devtools(
    persist(
      (set) => ({
        notifications: [],
        push: (notification: NotificationData) =>
          set((state) => {
            const existingNotification = state.notifications.find(
              (n) => n.id === notification.id
            );
            if (existingNotification) {
              return {
                notifications: state.notifications.map((n) =>
                  n.id === notification.id ? notification : n
                ),
              };
            }
            return { notifications: [...state.notifications, notification] };
          }),
        pop: (id: string) =>
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          })),
      }),
      {
        name: "notification-storage",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
