import apiClient from ".";
import type {
  Ticket,
  TicketDetailResponse,
  TicketResponse,
} from "../../stores/ticket_store";

export interface TicketQuery {
  page?: number;
  size?: number;
}

export interface TicketSearchParams {
  keyword?: string;
  code?: string;
  sellerName?: string;
  status?: string;
}

export async function getTicketsByOperatorId(
  operatorId: number
): Promise<TicketResponse> {
  const response = await apiClient.get(`api/tickets/operator/${operatorId}`);
  return response.data;
}

export const getTicketByCode = async (
  ticketCode: string
): Promise<TicketDetailResponse> => {
  try {
    const response = await apiClient.get(`/api/tickets/${ticketCode}`);
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy thông tin chi tiết vé" + error);
  }
};

// delete ticket
export const deleteTicket = async (ticketCode: string): Promise<boolean> => {
  try {
    const response = await apiClient.delete(`/api/tickets/${ticketCode}`);
    return response.status === 200;
  } catch (error) {
    throw new Error("Không thể xóa vé" + error);
  }
};

export interface CreateBookingData {
  tripId: number;
  customerId?: number | null;
  guestFullName: string;
  guestEmail: string;
  guestPhone: string;
  guestAddress?: string | null;
  discountCode?: string | null;
  seatNumber: string;
  totalAmount: number;
}

export const createBooking = async (
  data: CreateBookingData
): Promise<number | null> => {
  try {
    const response = await apiClient.post("api/bookings/manual-booking", data);
    console.log(response);
    return response.data.result.bookingId;
  } catch (error) {
    throw new Error("Không thể tạo đặt chỗ" + error);
  }
};

export const createTicket = async (data: {
  bookingId: number;
  sellMethod: "MANUAL" | "AUTO";
}): Promise<TicketResponse> => {
  try {
    const response = await apiClient.post("api/tickets", data);
    return response.data as TicketResponse;
  } catch (error) {
    throw new Error("Không thể tạo vé" + error);
  }
};

export interface GuestInfo {
  guestFullName: string;
  guestEmail: string;
  guestPhone: string;
  guestAddress?: string | null;
}

export const getGuestsByOperator = async (): Promise<GuestInfo[]> => {
  try {
    const response = await apiClient.get("/api/bookings/guests");
    return response.data.result;
  } catch (error) {
    throw new Error("Không thể lấy thông tin khách hàng: " + error);
  }
};

export async function getTicketInfoBySeatNumber(
  tripId: number,
  seatNumber: string,
  callBack: (message: string) => void
): Promise<Ticket | null> {
  try {
    const res = await apiClient.get(
      `api/tickets/trip/${tripId}/seat/${seatNumber}`
    );
    if (res.data.code !== 200) {
      const message = res.data.message || "Không tìm thấy vé";
      console.error("Error fetching ticket info by seat number:", message);
      callBack(message);
      return null;
    }
    return res.data.result;
  } catch (error) {
    console.error("Error fetching ticket info by seat number:", error);
    return null;
  }
}
