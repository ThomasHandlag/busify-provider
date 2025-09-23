import apiClient from ".";
import type {
  RouteStopFormData,
  RouteStopResponse,
} from "../../stores/route_stop_store";

export async function getRouteStops(
  routeId: number
): Promise<RouteStopResponse> {
  const response = await apiClient.get(`api/route-stop-management/${routeId}`);
  return response.data;
}

export async function addRouteStop(data: RouteStopFormData) {
  const response = await apiClient.post("api/route-stop-management", data);
  return response.data;
}

export async function updateRouteStop(data: RouteStopFormData) {
  const response = await apiClient.put("api/route-stop-management", data);
  return response.data;
}

export async function deleteRouteStop(
  routeId: number,
  locationId: number,
  isDelete: boolean = false
) {
  const response = await apiClient.delete(
    `api/route-stop-management/${routeId}/${locationId}?isDelete=${isDelete}`
  );
  return response.data;
}
