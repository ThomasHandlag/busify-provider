import apiClient from ".";
import type { BusData } from "../../stores/bus_store";

export async function getBusesByOperator(operatorId: number): Promise<BusData[]> {
  const response = await apiClient.get(`api/bus/operator/${operatorId}`);
  return response.data.result;
}
