import { create } from "zustand";
import type { NextTrip } from "../app/api/trip";

export interface TripData {
  id: number;
  routeId: number;
  routeName: string;
  busId: number | null;
  driverId: number;
  departureTime: string;
  estimatedArrivalTime: string;
  status: "scheduled" | "on_time" | "delayed" | "departed" | "arrived" | "cancelled";
  pricePerSeat: number;
}

export interface TripResponse {
  code: number;
  message: string;
  result: {
    result: TripData[];
    totalRecords: number;
    pageNumber: number;
    totalPages: number;
    pageSize: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
}


interface TripStoreState {
  nextTrips: NextTrip[];
  setNextTrips: (trips: NextTrip[]) => void;
  delNextTrips: (id: number) => void;
  loading: boolean;
  error: string | null;
}

export const tripStore = create<TripStoreState>((set) => ({
  nextTrips: [],
  trips: [],
  loading: false,
  error: null,
  setTrips: (trips: TripData[]) =>
    set(() => ({
      trips,
      loading: false,
      error: null,
    })),
  setNextTrips: (trips: NextTrip[]) =>
    set((state) => ({
      nextTrips: [...state.nextTrips, ...trips],
      loading: false,
      error: null,
    })),
  delNextTrips: (id: number) =>
    set((state) => ({
      nextTrips: state.nextTrips.filter((trip) => trip.trip_id !== id),
      loading: false,
      error: null,
    })),
}));
