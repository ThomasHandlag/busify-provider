import { create } from "zustand";

export interface SeatLayoutForOperatorResponse {
  id: number;
  name: string;
}

export const seatLayoutStore = create<{
  seatLayouts: SeatLayoutForOperatorResponse[];
  setSeatLayouts: (seatLayouts: SeatLayoutForOperatorResponse[]) => void;
}>((set) => ({
  seatLayouts: [],
  setSeatLayouts: (seatLayouts) => set({ seatLayouts }),
}));
