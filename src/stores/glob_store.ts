/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Define types for the global store
interface GlobalStoreState {
  data: { [key: string]: any };
  setData: (newData: { [key: string]: any }) => void;
  clearData: (key?: string) => void;
}

// Create a global store with Zustand
export const globStore = create<GlobalStoreState>()(
  persist(
    (set) => ({
      data: {},
      setData: (newData) =>
        set((state) => ({
          data: { ...state.data, ...newData },
        })),
      clearData: (key) =>
        set((state) => {
          if (key) {
            const newData = { ...state.data };
            delete newData[key];
            return { data: newData };
          }
          return { data: {} };
        }),
    }),
    {
      name: "global-query-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
