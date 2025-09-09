import apiClient from ".";

export interface Trip {
  trip_id: number;
  operator_name: string;
  route: {
    start_location: string;
    end_location: string;
  };
  amenities: {
    tv: boolean;
    wifi: boolean;
    toilet: boolean;
    charging: boolean;
    air_conditioner: boolean;
  };
  average_rating: number;
  departure_time: string;
  arrival_time: string;
  status: string;
  price_per_seat: number;
  available_seats: number;
  total_seats: number;
}

export interface Driver {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  employeeType: string;
  status: string;
  driverLicenseNumber: string;
  operatorId: number;
  operatorName: string;
}

export interface Passenger {
  passengerName: string;
  passengerPhone: string | null;
  email: string;
  seatNumber: string;
  status: string;
  ticketCode: string;
  ticketId: number;
}

export interface PassengerResponse {
  tripId: number;
  operatorName: string | null;
  routeName: string | null;
  departureTime: string | null;
  passengers: Passenger[];
}

export interface DriverTrip {
  tripId: number;
  startAddress: string;
  endAddress: string;
  departureTime: string;
  estimatedArrivalTime: string;
  status: string;
  averageRating: number;
}

export interface UpdateTicketData {
  passengerName: string;
  passengerPhone: string;
  email: string;
  seatNumber: string;
  status: string;
}

export interface UpdateTripStatusData {
  status: string;
}

// API Functions
export async function getAllTrips(): Promise<Trip[]> {
  const response = await apiClient.get("api/trips/driver/my-trips");
  console.log("Trips Data:", response);
  return response.data.result;
}

export async function getDrivers(): Promise<Driver[]> {
  const response = await apiClient.get("api/employees/drivers");
  return response.data.result;
}

export async function getDriverTrips(driverId: number): Promise<DriverTrip[]> {
  const response = await apiClient.get(`api/trips/driver/${driverId}`);
  return response.data.result;
}

export async function getTripPassengers(tripId: number): Promise<PassengerResponse> {
  const response = await apiClient.get(`api/tickets/trip/${tripId}/passengers`);
  return response.data.result;
}

export async function updateTicket(
  tripId: number,
  ticketId: number,
  data: UpdateTicketData
): Promise<void> {
  await apiClient.put(`api/tickets/trip/${tripId}/ticket/${ticketId}`, data);
}

export async function updateTripStatus(
  tripId: number,
  data: UpdateTripStatusData
): Promise<void> {
  await apiClient.put(`api/trips/${tripId}/status`, data);
}
