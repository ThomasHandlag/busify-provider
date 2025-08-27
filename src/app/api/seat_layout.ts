import apiClient from ".";
import type { SeatLayoutForOperatorResponse } from "../../stores/seat_layout_store";

export async function getSeatLayouts(): Promise<
  SeatLayoutForOperatorResponse[]
> {
  const response = await apiClient.get("api/seat-layout");
  return response.data.result;
}
