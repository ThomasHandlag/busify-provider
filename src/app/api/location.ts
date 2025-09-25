import apiClient from ".";
import type { LocationForOperatorResponse } from "../../stores/location_store";

export async function getLocations(): Promise<LocationForOperatorResponse[]> {
  const response = await apiClient.get("api/locations");
  return response.data.result;
}

// Interface cho dropdown locations
export interface LocationDropdownItem {
  id: number;
  name: string;
  address?: string;
}

export async function getLocationDropdown(): Promise<LocationDropdownItem[]> {
  try {
    const response = await apiClient.get("api/locations/dropdown");
    return response.data?.result || [];
  } catch (error) {
    console.error("Error fetching location dropdown:", error);
    return [];
  }
}
