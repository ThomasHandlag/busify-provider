import apiClient from ".";
import type { OperatorData } from "../../stores/operator_store";

export async function getOperatorDataByUser(): Promise<OperatorData> {
  const response = await apiClient.get(`api/bus-operators/user`);
  return response.data.result;
}
