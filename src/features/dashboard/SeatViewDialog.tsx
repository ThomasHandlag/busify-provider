import { useEffect, useState } from "react";
import type { Ticket } from "../../stores/ticket_store";
import { Spin } from "antd";
import { getTicketInfoBySeatNumber } from "../../app/api/ticket";

const SeatViewDialog = ({ seat, tripId }: { seat: string; tripId: number }) => {
  const [loading, setLoading] = useState(false);
  const [ticketInfo, setTicketInfo] = useState<Ticket | null>(null);

  useEffect(() => {
    const fetchTicketInfo = async () => {
      setLoading(true);
      // Fetch ticket info by seat and tripId
      const info = await getTicketInfoBySeatNumber(tripId, seat);
      setTicketInfo(info);
      setLoading(false);
    };
    fetchTicketInfo();
  }, [seat, tripId]);

  if (loading || !ticketInfo) {
    return <Spin />;
  }

  return (
    <div>
      <h3>Seat: {seat}</h3>
      <p>Passenger: {ticketInfo.passengerName ?? "Offline"}</p>
      <p>Status: {ticketInfo.status}</p>
      <p>Phone: {ticketInfo.passengerPhone ?? "Unknown"}</p>
    </div>
  );
};

export default SeatViewDialog;
