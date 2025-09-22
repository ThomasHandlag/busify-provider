import apiClient from ".";
import type {
  ChangePasswordPayload,
  OperatorData,
} from "../../stores/operator_store";

export async function getOperatorDataByUser(): Promise<OperatorData> {
  const response = await apiClient.get(`api/bus-operators/profile`);
  return response.data.result;
}

import type { OperatorUpdatePayload } from "../../stores/operator_store";

export async function updateOperatorProfile(
  data: OperatorUpdatePayload
): Promise<OperatorData> {
  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (data.email) formData.append("email", data.email);
  if (data.hotline) formData.append("hotline", data.hotline);
  if (data.address) formData.append("address", data.address);
  if (data.avatar) formData.append("avatar", data.avatar);

  const response = await apiClient.put(`api/bus-operators/profile`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.result;
}

export async function changePassword(
  data: ChangePasswordPayload
): Promise<OperatorData> {
  const response = await apiClient.put(
    `api/bus-operators/profile/change-password`,
    data
  );
  return response.data.result;
}
