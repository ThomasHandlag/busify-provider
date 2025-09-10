import apiClient from ".";
import type { BusData, BusResponse } from "../../stores/bus_store";

// Interface cho query params
export interface BusQuery {
  page?: number;
  size?: number;
  keyword?: string;
  status?: string;
}

export async function getBusesForOperator(): Promise<BusData[]> {
  const response = await apiClient.get("api/bus");
  return response.data.result;
}

export async function getBuses(query: BusQuery): Promise<BusResponse> {
  const response = await apiClient.get("api/bus-management", { params: query });
  return response.data;
}

export async function getBusesByOperator(
  operatorId: number
): Promise<BusData[]> {
  const response = await apiClient.get(`api/bus/operator/${operatorId}`);
  return response.data.result;
}

export async function createBus(data: Partial<BusData> & { images?: File[] }) {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "images" && Array.isArray(value)) {
      // chỉ xử lý File[]
      value.forEach((file) => {
        if (file instanceof File) {
          formData.append("images", file);
        }
      });
    } else if (typeof value === "object" && value !== null) {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, value as any);
    }
  });

  const response = await apiClient.post("api/bus-management", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000,
  });
  return response.data;
}

export async function updateBus(
  id: number,
  data: Partial<BusData> & {
    images?: File[];
    existingImageIds?: number[];
    deletedImageIds?: number[];
  }
) {
  const formData = new FormData();

  // Ảnh mới
  if (data.images) {
    data.images.forEach((file) => {
      if (file instanceof File) formData.append("images", file);
    });
  }

  // Ảnh còn giữ lại
  if (data.existingImageIds) {
    data.existingImageIds.forEach((imgId) =>
      formData.append("existingImageIds", imgId.toString())
    );
  }

  // Ảnh bị xoá
  if (data.deletedImageIds) {
    data.deletedImageIds.forEach((imgId) =>
      formData.append("deletedImageIds", imgId.toString())
    );
  }

  // Các field còn lại
  Object.entries(data).forEach(([key, value]) => {
    if (
      key !== "images" &&
      key !== "existingImageIds" &&
      key !== "deletedImageIds"
    ) {
      if (typeof value === "object" && value !== null) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    }
  });

  const response = await apiClient.put(`api/bus-management/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000,
  });
  return response.data;
}

export async function deleteBus(
  id: number,
  isDelete: boolean = false
): Promise<BusResponse> {
  const response = await apiClient.delete(
    `api/bus-management/${id}?isDelete=${isDelete}`
  );
  return response.data;
}

export interface BusLayout {
  rows: number;
  cols: number;
  floors: number;
}

export async function getBusSeatsLayout(
  busId: number
): Promise<BusLayout | null> {
  try {
    const res = await apiClient.get(`api/bus/layout/${busId}`);
    return res.data.result as BusLayout;
  } catch (error) {
    console.error("Error fetching seat layouts:", error);
    return null;
  }
}
