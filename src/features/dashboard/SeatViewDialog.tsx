import { useEffect, useState } from "react";
import type { Ticket } from "../../stores/ticket_store";
import { Spin } from "antd";
import { getTicketInfoBySeatNumber } from "../../app/api/ticket";
import { useGNotify } from "../../app/hooks";

const SeatViewDialog = ({ seat, tripId }: { seat: string; tripId: number }) => {
  const [loading, setLoading] = useState(false);
  const [ticketInfo, setTicketInfo] = useState<Ticket | null>(null);
  const gnotify = useGNotify();

  console.log("SeatViewDialog rendered with seat:", seat, "tripId:", tripId);

  useEffect(() => {
    const fetchTicketInfo = async () => {
      setLoading(true);
      // Fetch ticket info by seat and tripId
      const info = await getTicketInfoBySeatNumber(tripId, seat, (message) => {
        gnotify?.notify?.error(
          {
            message
          }
        );
      });
      setTicketInfo(info);
      setLoading(false);
    };
    fetchTicketInfo();
  }, [seat, tripId]);

  if (loading) {
    return <Spin />;
  }

  if (!ticketInfo) {
    return <div>No ticket information available for seat {seat}.</div>;
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
