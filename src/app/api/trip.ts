import apiClient from ".";
import type { TripData, TripResponse } from "../../stores/trip_store";
import type { BusLayout } from "./bus";

export const SStatus = {
  AVAILABLE: "available",
  BOOKED: "booked",
  LOCKED: "locked",
} as const;

export type SStatus = (typeof SStatus)[keyof typeof SStatus];

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

export async function addPointsByTrip(tripId: number) {
  const response = await apiClient.post(`api/scores/${tripId}`);
  return response.data;
}

export interface SeatStatus {
  seatNumber: string;
  status: SStatus;
}

export interface TripSeatsStatus {
  tripId: number;
  seatsStatus: SeatStatus[];
}

export async function getTripSeatById(
  tripId: number
): Promise<TripSeatsStatus | null> {
  try {
    const res = await apiClient.get(`api/trip-seats/${tripId}`);
    return res.data.result as TripSeatsStatus;
  } catch (error) {
    console.error("Error fetching trip seat layout:", error);
    return null;
  }
}

export type SeatStatusInfo = {
  seatNumber: string;
  status: "valid" | "cancelled" | "used";
};

export interface NextTripSeatStatus {
  tripId: number;
  busSeatsCount: number;
  checkedSeatsCount: number;
  bookedSeatsCount: number;
  busLayout: BusLayout;
  seatStatuses: SeatStatusInfo[];
}

export async function getNextTripSeatStatusById(
  tripId: number
): Promise<NextTripSeatStatus | null> {
  try {
    const res = await apiClient.get(
      `api/trips/${tripId}/next-trip-seats-status`
    );
    return res.data.result as NextTripSeatStatus;
  } catch (error) {
    console.error("Error fetching next trip seat status:", error);
    return null;
  }
}
