import { create } from "zustand";

export interface BusModelForOperatorResponse {
  modelId: number;
  modelName: string;
}

export const busModelStore = create<{
  models: BusModelForOperatorResponse[];
  setModels: (models: BusModelForOperatorResponse[]) => void;
}>((set) => ({
  models: [],
  setModels: (models) => set({ models }),
}));
