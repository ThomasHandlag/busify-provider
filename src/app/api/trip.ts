import apiClient from ".";

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
