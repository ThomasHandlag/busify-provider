import apiClient from ".";
import type { TripData, TripResponse } from "../../stores/trip_store";

export interface TripQuery {
  page?: number;
  size?: number;
  keyword?: string;
  status?: string;
}

export interface NextTrip {
  trip_id: number;
  arrival_estimate_time: string;
  route: {
    start_location: string;
    route_id: number;
    route_name: string;
    end_location: string;
  };
  duration_minutes: number;
  departure_time: string;
  available_seats: number;
  status: "active" | "under_maintenance" | "out_of_service";
}

export async function getNextTripsOfOperator(operatorId: number): Promise<NextTrip[]> {
  const response = await apiClient.get(`api/trips/${operatorId}/trips`);
  return response.data;
}

export async function getTrips(query: TripQuery): Promise<TripResponse> {
  const response = await apiClient.get("api/trip-management", { params: query });
  return response.data;
}

export async function createTrip(data: Partial<TripData>): Promise<TripResponse> {
  const response = await apiClient.post("api/trip-management", data);
  return response.data;
}

export async function updateTrip(id: number, data: Partial<TripData>): Promise<TripResponse> {
  const response = await apiClient.put(`api/trip-management/${id}`, data);
  return response.data;
}

export async function deleteTrip(id: number, isDelete: boolean = false): Promise<TripResponse> {
  const response = await apiClient.delete(`api/trip-management/${id}?isDelete=${isDelete}`);
  return response.data;
}
