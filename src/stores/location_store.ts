import { create } from "zustand";

export interface LocationForOperatorResponse {
  locationId: number;
  locationName: string;
}

export const locationStore = create<{
  locations: LocationForOperatorResponse[];
  setLocations: (locations: LocationForOperatorResponse[]) => void;
}>((set) => ({
  locations: [],
  setLocations: (locations) => set({ locations }),
}));
