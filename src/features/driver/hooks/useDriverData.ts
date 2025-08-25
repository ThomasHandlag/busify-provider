import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import {
  getAllTrips,
  getDrivers,
  getDriverTrips,
  getTripPassengers,
  updateTicket,
  updateTripStatus,
  type UpdateTicketData,
  type UpdateTripStatusData,
} from "../../../app/api/driver";

// Query Keys
export const QUERY_KEYS = {
  trips: ["trips"],
  drivers: ["drivers"],
  driverTrips: (driverId: number) => ["driver-trips", driverId],
  tripPassengers: (tripId: number) => ["trip-passengers", tripId],
};

// Hooks for fetching data
export function useTrips() {
  return useQuery({
    queryKey: QUERY_KEYS.trips,
    queryFn: getAllTrips,
  });
}

export function useDrivers() {
  return useQuery({
    queryKey: QUERY_KEYS.drivers,
    queryFn: getDrivers,
    enabled: false, // Only fetch when explicitly called
  });
}

export function useDriverTrips(driverId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.driverTrips(driverId),
    queryFn: () => getDriverTrips(driverId),
    enabled: false, // Only fetch when explicitly called
  });
}

export function useTripPassengers(tripId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.tripPassengers(tripId),
    queryFn: () => getTripPassengers(tripId),
    enabled: false, // Only fetch when explicitly called
  });
}

// Mutation hooks
export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tripId,
      ticketId,
      data,
    }: {
      tripId: number;
      ticketId: number;
      data: UpdateTicketData;
    }) => updateTicket(tripId, ticketId, data),
    onSuccess: (_, variables) => {
      message.success("Ticket updated successfully");
      // Invalidate trip passengers to refetch
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tripPassengers(variables.tripId),
      });
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Failed to update ticket"
      );
    },
  });
}

export function useUpdateTripStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tripId,
      data,
    }: {
      tripId: number;
      data: UpdateTripStatusData;
    }) => updateTripStatus(tripId, data),
    onSuccess: () => {
      message.success("Trip status updated successfully");
      // Invalidate trips to refetch
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.trips,
      });
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Failed to update trip status"
      );
    },
  });
}
