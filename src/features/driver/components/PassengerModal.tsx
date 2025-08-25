import React from "react";
import { Modal, Table, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import type { Passenger } from "../../../app/api/driver";

interface PassengerModalProps {
  visible: boolean;
  onCancel: () => void;
  passengers: Passenger[];
  onEditTicket: (passenger: Passenger) => void;
}

const PassengerModal: React.FC<PassengerModalProps> = ({
  visible,
  onCancel,
  passengers,
  onEditTicket,
}) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "passengerName",
      key: "passengerName",
    },
    {
      title: "Phone",
      dataIndex: "passengerPhone",
      key: "passengerPhone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Seat",
      dataIndex: "seatNumber",
      key: "seatNumber",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Ticket Code",
      dataIndex: "ticketCode",
      key: "ticketCode",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Passenger) => (
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined />}
          onClick={() => onEditTicket(record)}
          className="flex items-center justify-center"
        >
          Sửa
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title="Passenger List"
      open={visible}
      onCancel={onCancel}
      width={1000}
      footer={null}
    >
      <Table
        dataSource={passengers}
        columns={columns}
        rowKey={(record) => record.ticketId}
      />
    </Modal>
  );
};

export default PassengerModal;
