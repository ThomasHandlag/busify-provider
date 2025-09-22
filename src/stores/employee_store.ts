import { create } from "zustand";

export interface EmployeeData {
  id: number;
  fullName: string;
  email: string;
  password: string;
  operatorId: number;
  operatorName: string;
  driverLicenseNumber: string;
  status: "active" | "inactive" | "suspended";
  address: string;
  phoneNumber: string;
  employeeType: "DRIVER" | "STAFF";
}

export interface DriverData {
  driverId: number;
  driverName: string;
}

export interface EmployeeResponse {
  code: number;
  message: string;
  result: EmployeeData[];
  totalRecords: number;
  pageNumber: number;
  totalPages: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export const employeeStore = create<{
  employees: EmployeeData[];
  setEmployees: (employees: EmployeeData[]) => void;
}>((set) => ({
  employees: [],
  setEmployees: (employees) => set({ employees }),
}));
