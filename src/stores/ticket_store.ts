import { create } from "zustand";

export interface Ticket {
  ticketId: number;
  passengerName: string;
  passengerPhone: string;
  price: number;
  seatNumber: string;
  status: string;
  ticketCode: string;
  bookingId: number;
  sellerName: string;
  licensePlate: string;
}

export interface TicketDetail {
  ticketCode: string;
  passengerName: string;
  passengerPhone: string;
  seatNumber: string;
  price: number;
  status: string;
  booking: {
    bookingId: number;
    bookingCode: string;
    status: string;
    totalAmount: number;
    bookingDate: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    paymentMethod: string;
    paidAt: string;
  };
  trip: {
    tripId: number;
    departureTime: string;
    arrivalTime: string;
    pricePerSeat: number;
    route: {
      routeId: number;
      routeName: string;
      startLocation: { name: string };
      endLocation: { name: string };
    };
    bus: {
      busId: number;
      model: string;
      licensePlate: string;
    };
    operator: {
      operatorName: string;
    };
  };
}

export interface TicketResponse {
  code: number;
  message: string;
  result: { tickets: Ticket }[];
}

export interface TicketDetailResponse {
  code: number;
  message: string;
  result: TicketDetail;
}
export const ticketStore = create<{
  tickets: Ticket[];
  setTickets: (tickets: Ticket[]) => void;
}>((set) => ({
  tickets: [],
  setTickets: (tickets) => set({ tickets }),
}));
