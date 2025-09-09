import { create } from "zustand";

export interface BusImage {
  id: number;
  imageUrl: string;
  primary: boolean;
}

export interface BusData {
  id: number;
  licensePlate: string;
  modelId: number;
  modelName: string;
  totalSeats: number;
  operatorId: number;
  seatLayoutId: number;
  operatorName: string;
  seatLayoutName: string;
  status: "active" | "under_maintenance" | "out_of_service";
  amenities: {
    [key: string]: boolean | string | number; // Changed to support any amenity type
  };
  images?: BusImage[];
}

export interface BusResponse {
  code: number;
  message: string;
  result: {
    result: BusData[];
    totalRecords: number;
    pageNumber: number;
    totalPages: number;
    pageSize: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
}

export const busStore = create<{
  buses: BusData[];
  setBuses: (buses: BusData[]) => void;
}>((set) => ({
  buses: [],
  setBuses: (buses) => set({ buses }),
}));
