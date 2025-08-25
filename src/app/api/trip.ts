import apiClient from ".";
import type { TripData, TripResponse } from "../../stores/trip_store";

export interface TripQuery {
  page?: number;
  size?: number;
  keyword?: string;
  status?: string;
}

export interface NextTrip {
  license_plate: string;
  bus_status: "active" | "under_maintenance" | "out_of_service";
  bus_id: number;
  total_seats: number;
  trip_id: number;
  arrival_time: string;
  start_longitude: number;
  start_latitude: number;
  route_id: number;
  route_name: string;
  end_longitude: number;
  end_latitude: number;
  duration_minutes: number;
  start_address: string;
  start_city: string;
  end_address: string;
  departure_time: string;
  end_city: string;
  available_seats: number;
  status: "active" | "under_maintenance" | "out_of_service";
}

export async function getNextTripsOfOperator(
  operatorId: number
): Promise<NextTrip[]> {
  const response = await apiClient.get(`api/trips/${operatorId}/trips`);
  return response.data.result;
}

export async function getTrips(query: TripQuery): Promise<TripResponse> {
  const response = await apiClient.get("api/trip-management", {
    params: query,
  });
  return response.data;
}

export async function createTrip(
  data: Partial<TripData>
): Promise<TripResponse> {
  const response = await apiClient.post("api/trip-management", data);
  return response.data;
}

export async function updateTrip(
  id: number,
  data: Partial<TripData>
): Promise<TripResponse> {
  const response = await apiClient.put(`api/trip-management/${id}`, data);
  return response.data;
}

export async function deleteTrip(
  id: number,
  isDelete: boolean = false
): Promise<TripResponse> {
  const response = await apiClient.delete(
    `api/trip-management/${id}?isDelete=${isDelete}`
  );
  return response.data;
}
