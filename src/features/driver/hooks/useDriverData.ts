import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import {
  getAllTrips,
  getDrivers,
  getDriverTrips,
  getTripPassengers,
  getTripDetail,
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
  tripDetail: (tripId: number) => ["trip-detail", tripId],
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
    enabled: tripId > 0, // Auto fetch when tripId is valid
    staleTime: 0, // Always fetch fresh data
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: "always", // Always refetch when component mounts
  });
}

export function useTripDetail(tripId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.tripDetail(tripId),
    queryFn: () => getTripDetail(tripId),
    enabled: tripId > 0, // Auto fetch when tripId is valid
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
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
    onSuccess: async (_, variables) => {
      message.success("Cập nhật vé thành công");
      
      // Invalidate và refetch dữ liệu passengers ngay lập tức
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tripPassengers(variables.tripId),
        exact: true,
      });
      
      // Force refetch dữ liệu passengers
      await queryClient.refetchQueries({
        queryKey: QUERY_KEYS.tripPassengers(variables.tripId),
        exact: true,
      });
      
      // Also invalidate trips to update any aggregate data
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.trips,
      });
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Cập nhật vé thất bại"
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
    onSuccess: (_, variables) => {
      message.success("Cập nhật trạng thái chuyến đi thành công");
      // Invalidate trips to refetch
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.trips,
      });
      // Also invalidate passengers data for this trip
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tripPassengers(variables.tripId),
      });
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Cập nhật trạng thái thất bại"
      );
    },
  });
}
