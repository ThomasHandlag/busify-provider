import apiClient from ".";
import type { LocationForOperatorResponse } from "../../stores/location_store";

export async function getLocations(): Promise<LocationForOperatorResponse[]> {
  const response = await apiClient.get("api/locations");
  return response.data.result;
}
