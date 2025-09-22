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

export interface ReportResponse {
  id: string;
  title: string;
  reportDate: Date;
  operatorId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export async function getReportYearly(
  operatorId: number,
  year: number
): Promise<ReportResponse[]> {
  const response = await apiClient.get(
    `api/reports/yearly?operatorId=${operatorId}&year=${year}`
  );
  return response.data.result;
}

export async function getReportByYearRange({
  start,
  end,
  id,
} : {
  start: number;
  end: number;
  id: number;
}): Promise<ReportResponse[]> {
  const response = await apiClient.get(
    `api/reports/year-range?start=${start}&end=${end}&operatorId=${id}`
  );
  return response.data.result;
}
