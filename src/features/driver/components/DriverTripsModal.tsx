import React from "react";
import { Modal, Table } from "antd";
import type { Driver, DriverTrip } from "../../../app/api/driver";

interface DriverTripsModalProps {
  visible: boolean;
  onCancel: () => void;
  selectedDriver: Driver | null;
  driverTrips: DriverTrip[];
}

const DriverTripsModal: React.FC<DriverTripsModalProps> = ({
  visible,
  onCancel,
  selectedDriver,
  driverTrips,
}) => {
  const columns = [
    {
      title: "Trip ID",
      dataIndex: "tripId",
      key: "tripId",
    },
    {
      title: "From",
      dataIndex: "startAddress",
      key: "startAddress",
    },
    {
      title: "To",
      dataIndex: "endAddress",
      key: "endAddress",
    },
    {
      title: "Departure",
      dataIndex: "departureTime",
      key: "departureTime",
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: "Arrival Time",
      dataIndex: "estimatedArrivalTime",
      key: "estimatedArrivalTime",
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Rating",
      dataIndex: "averageRating",
      key: "averageRating",
      render: (rating: number) => rating?.toFixed(1) || "N/A",
    },
  ];

  return (
    <Modal
      title={`Trips for ${selectedDriver?.fullName}`}
      open={visible}
      onCancel={onCancel}
      width={1000}
      footer={null}
    >
      <Table
        dataSource={driverTrips}
        columns={columns}
        rowKey="tripId"
      />
    </Modal>
  );
};

export default DriverTripsModal;
