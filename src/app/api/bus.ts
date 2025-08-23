import apiClient from ".";
import type { BusData, BusResponse } from "../../stores/bus_store";

// Interface cho query params
export interface BusQuery {
  page?: number;
  size?: number;
  keyword?: string;
  status?: string;
}

export async function getBuses(query: BusQuery): Promise<BusResponse> {
  const response = await apiClient.get("api/bus-management", { params: query });
  return response.data.result;
}

export async function getBusesByOperator(operatorId: number): Promise<BusData[]> {
  const response = await apiClient.get(`api/bus/operator/${operatorId}`);
  return response.data.result;
}

export async function createBus(data: Partial<BusData>): Promise<BusResponse> {
  const response = await apiClient.post('api/bus-management', data);
  return response.data;
}

export async function updateBus(id: number, data: Partial<BusData>): Promise<BusResponse> {
  const response = await apiClient.put(`api/bus-management/${id}`, data);
  return response.data;
}

export async function deleteBus(id: number, isDelete: boolean = false): Promise<BusResponse> {
  const response = await apiClient.delete(`api/bus-management/${id}?isDelete=${isDelete}`);
  return response.data;
}
