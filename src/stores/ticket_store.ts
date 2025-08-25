import { create } from "zustand";

export interface TicketData {
  id: number;
  tripId: number;
  routeName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  seatNumber: string;
  price: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  purchaseDate: string;
  departureTime: string;
}

export interface TicketResponse {
  code: number;
  message: string;
  result: TicketData[];
  totalRecords: number;
  pageNumber: number;
  totalPages: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export const ticketStore = create<{
  tickets: TicketData[];
  setTickets: (tickets: TicketData[]) => void;
}>((set) => ({
  tickets: [],
  setTickets: (tickets) => set({ tickets }),
}));
