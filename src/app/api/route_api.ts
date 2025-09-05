import apiClient from ".";
import type { RouteData, RouteResponse } from "../../stores/route_store";

export interface RouteQuery {
  page?: number;
  size?: number;
  keyword?: string;
}

export async function getRoutesForOperator(): Promise<RouteData[]> {
  const response = await apiClient.get("api/routes");
  return response.data.result;
}

export async function getRoutes(query: RouteQuery): Promise<RouteResponse> {
  const response = await apiClient.get("api/route-management", {
    params: query,
  });
  return response.data.result;
}

export async function createRoute(
  data: Partial<RouteData>
): Promise<RouteResponse> {
  const response = await apiClient.post("api/route-management", data);
  return response.data;
}

export async function updateRoute(
  id: number,
  data: Partial<RouteData>
): Promise<RouteResponse> {
  const response = await apiClient.put(`api/route-management/${id}`, data);
  return response.data;
}

export async function deleteRoute(
  id: number,
  isDelete: boolean = false
): Promise<RouteResponse> {
  const response = await apiClient.delete(
    `api/route-management/${id}?isDelete=${isDelete}`
  );
  return response.data;
}
