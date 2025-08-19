import { create } from "zustand";
import type { NextTrip } from "../app/api/trip";

interface TripStoreState {
  nextTrips: NextTrip[];
  setNextTrips: (trips: NextTrip[]) => void;
  delNextTrips: (id: number) => void;
  loading: boolean;
  error: string | null;
}

export const tripStore = create<TripStoreState>((set) => ({
  nextTrips: [],
  loading: false,
  error: null,
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
