import { create } from "zustand";

export interface RouteStopData {
  routeId: number;
  locationId: number;
  routeName: string;
  locationName: string;
  locationAddress: string;
  stopOrder: number;
  timeOffsetFromStart: number;
}

export interface RouteStopResponse {
  code: number;
  message: string;
  result: RouteStopData[];
}

export interface RouteStopFormData {
  routeId: number;
  locationId: number;
  stopOrder: number;
  timeOffsetFromStart: number;
}

export const routeStopStore = create<{
  stops: RouteStopData[];
  setStops: (stops: RouteStopData[]) => void;
}>((set) => ({
  stops: [],
  setStops: (stops) => set({ stops }),
}));
