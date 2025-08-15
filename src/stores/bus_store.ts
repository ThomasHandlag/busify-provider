import { create } from "zustand";

export interface BusData {
  id: number;
  licensePlate: string;
  model: string;
  totalSeats: number;
  seatLayoutId: number;
  status: "active" | "inactive" | "maintenance";
  amenities: {
    wifi: boolean;
    usb_charging: boolean;
    air_conditioner: boolean;
  };
}

export const busStore = create<{
  buses: BusData[];
  setBuses: (buses: BusData[]) => void;
}>((set) => ({
  buses: [],
  setBuses: (buses) => set({ buses }),
}));
