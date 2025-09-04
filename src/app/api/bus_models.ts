import apiClient from ".";
import type { BusModelForOperatorResponse } from "../../stores/bus_model_store";

export async function getBusModels(): Promise<BusModelForOperatorResponse[]> {
  const response = await apiClient.get("api/bus-models");
  return response.data.result;
}
