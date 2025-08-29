import apiClient from ".";
import type {
  DriverData,
  EmployeeData,
  EmployeeResponse,
} from "../../stores/employee_store";

export interface EmployeeQuery {
  page?: number;
  size?: number;
  keyword?: string;
  status?: string;
}

export async function getDrivers(): Promise<DriverData[]> {
  const response = await apiClient.get("api/employees");
  return response.data.result;
}

export async function getEmployees(
  query: EmployeeQuery
): Promise<EmployeeResponse> {
  const response = await apiClient.get("api/employee-management", {
    params: query,
  });
  return response.data.result;
}

export async function createEmployee(
  data: Partial<EmployeeData>
): Promise<EmployeeResponse> {
  const response = await apiClient.post("api/employee-management", data);
  return response.data;
}

export async function updateEmployee(
  id: number,
  data: Partial<EmployeeData>
): Promise<EmployeeResponse> {
  const response = await apiClient.put(`api/employee-management/${id}`, data);
  return response.data;
}

export async function deleteEmployee(
  id: number,
  isDelete: boolean = false
): Promise<EmployeeResponse> {
  const response = await apiClient.delete(
    `api/employee-management/${id}?isDelete=${isDelete}`
  );
  return response.data;
}
