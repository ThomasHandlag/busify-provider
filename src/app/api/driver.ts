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

export interface RouteStop {
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  time_offset_from_start: number;
}

export interface Location {
  address: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface RouteInfo {
  start_location: Location;
  route_id: number;
  end_location: Location;
  estimated_duration: string;
}

export interface BusInfo {
  license_plate: string;
  name: string;
}

export interface TripDetailResponse {
  route_stops: RouteStop[];
  bus: BusInfo;
  route: RouteInfo;
  // Thêm các field khác nếu có trong response
  tripId?: number;
  operatorName?: string;
  routeName?: string;
  departureTime?: string;
  arrivalTime?: string;
  status?: string;
  price?: number;
}

export interface TripDetail {
  tripId: number;
  operatorName: string;
  routeName: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
  price: number;
  bus: BusInfo;
  route: RouteInfo;
  route_stops: RouteStop[];
  timeline: {
    startLocation: {
      id: number;
      name: string;
      address: string;
      city: string;
      lat: number;
      lng: number;
    };
    stopLocations: Array<{
      id: number;
      name: string;
      address: string;
      city: string;
      lat: number;
      lng: number;
      order: number;
      time_offset_from_start: number;
    }>;
    endLocation: {
      id: number;
      name: string;
      address: string;
      city: string;
      lat: number;
      lng: number;
    };
  };
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

export async function getTripDetail(tripId: number): Promise<TripDetail> {
  try {
    const response = await apiClient.get(`api/trips/${tripId}`);
    const rawData: TripDetailResponse = response.data?.result;
    
    if (!rawData) {
      throw new Error("Invalid trip detail response");
    }

    // Sort route_stops by time_offset_from_start if exists
    const route_stops = rawData.route_stops ? 
      rawData.route_stops.sort((a, b) => a.time_offset_from_start - b.time_offset_from_start) : [];

    const transformedData: TripDetail = {
      tripId: rawData.tripId || tripId,
      operatorName: rawData.operatorName || "",
      routeName: rawData.routeName || `${rawData.route?.start_location?.city} - ${rawData.route?.end_location?.city}`,
      departureTime: rawData.departureTime || "",
      arrivalTime: rawData.arrivalTime || "",
      status: rawData.status || "",
      price: rawData.price || 0,
      bus: rawData.bus || { license_plate: "", name: "" },
      route: rawData.route,
      route_stops: rawData.route_stops || [],
      timeline: {
        startLocation: {
          id: 1,
          name: rawData.route?.start_location?.city || "",
          address: rawData.route?.start_location?.address || "",
          city: rawData.route?.start_location?.city || "",
          lat: rawData.route?.start_location?.latitude || 0,
          lng: rawData.route?.start_location?.longitude || 0,
        },
        stopLocations: route_stops.map((stop, index) => ({
          id: index + 2,
          name: stop.city,
          address: stop.address,
          city: stop.city,
          lat: stop.latitude,
          lng: stop.longitude,
          order: index + 1,
          time_offset_from_start: stop.time_offset_from_start,
        })),
        endLocation: {
          id: route_stops.length + 2,
          name: rawData.route?.end_location?.city || "",
          address: rawData.route?.end_location?.address || "",
          city: rawData.route?.end_location?.city || "",
          lat: rawData.route?.end_location?.latitude || 0,
          lng: rawData.route?.end_location?.longitude || 0,
        },
      },
    };

    console.log("Transformed trip detail:", transformedData);
    return transformedData;
  } catch (error) {
    console.error("Error fetching trip detail:", error);
    // Return fallback data
    return {
      tripId,
      operatorName: "",
      routeName: "",
      departureTime: "",
      arrivalTime: "",
      status: "",
      price: 0,
      bus: { license_plate: "", name: "" },
      route: {
        start_location: { address: "", city: "", latitude: 0, longitude: 0 },
        route_id: 0,
        end_location: { address: "", city: "", latitude: 0, longitude: 0 },
        estimated_duration: ""
      },
      route_stops: [],
      timeline: {
        startLocation: { id: 0, name: "", address: "", city: "", lat: 0, lng: 0 },
        stopLocations: [],
        endLocation: { id: 0, name: "", address: "", city: "", lat: 0, lng: 0 }
      }
    };
  }
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
