import { create } from "zustand";
import type { NextTrip } from "../app/api/trip";

export interface TripData {
  id: number;
  routeId: number;
  routeName: string;
  busId: number | null;
  licensePlate: string | null;
  driverId: number;
  driverName: string;
  departureTime: string;
  estimatedArrivalTime: string;
  status:
    | "scheduled"
    | "on_sell"
    | "delayed"
    | "departed"
    | "arrived"
    | "cancelled";
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
    set(() => ({
      nextTrips: [...trips],
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

export const selectedTripStore = create<{
  selectedTrip: TripData | null;
  setSelectedTrip: (trip: TripData | null) => void;
}>((set) => ({
  selectedTrip: null,
  setSelectedTrip: (trip) => set(() => ({ selectedTrip: trip })),
}));
