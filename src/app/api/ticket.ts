import apiClient from ".";
import type { TicketData, TicketResponse } from "../../stores/ticket_store";

export interface TicketQuery {
  page?: number;
  size?: number;
  keyword?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export async function getTickets(query: TicketQuery): Promise<TicketResponse> {
  const response = await apiClient.get("api/ticket-management", {
    params: query,
  });
  return response.data;
}

export async function updateTicketStatus(
  id: number,
  status: string
): Promise<TicketResponse> {
  const response = await apiClient.patch(`api/ticket-management/${id}/status`, {
    status,
  });
  return response.data;
}

export async function cancelTicket(id: number): Promise<TicketResponse> {
  const response = await apiClient.delete(`api/ticket-management/${id}`);
  return response.data;
}
