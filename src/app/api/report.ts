import apiClient from ".";

export async function getWeeklyOperatorReport(oId: number): Promise<{
  totalRevenue: number;
  totalTrips: number;
  totalBuses: number;
  totalPassengers: number;
}> {
  const response = await apiClient.get(`api/bus-operators/${oId}/report`);
  return response.data.result;
}
