import React from "react";
import { Modal, Table, Button, Space } from "antd";
import type { Driver } from "../../../app/api/driver";

interface DriverListModalProps {
  visible: boolean;
  onCancel: () => void;
  drivers: Driver[];
  onViewDriverTrips: (driver: Driver) => void;
}

const DriverListModal: React.FC<DriverListModalProps> = ({
  visible,
  onCancel,
  drivers,
  onViewDriverTrips,
}) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 180,
      ellipsis: true,
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 120,
    },
    {
      title: "License",
      dataIndex: "driverLicenseNumber",
      key: "driverLicenseNumber",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
    },
    {
      title: "Operator",
      dataIndex: "operatorName",
      key: "operatorName",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      fixed: "right" as const,
      render: (_: any, record: Driver) => (
        <Space direction="vertical" size={2}>
          <Button
            type="primary"
            size="small"
            style={{ width: "100%", fontSize: "10px", height: "22px" }}
            onClick={() => onViewDriverTrips(record)}
          >
            View Trips
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title="Driver List"
      open={visible}
      onCancel={onCancel}
      width={1200}
      footer={null}
    >
      <Table
        dataSource={drivers}
        columns={columns}
        rowKey="id"
        scroll={{ x: 1000, y: 400 }}
        pagination={{ pageSize: 10 }}
      />
    </Modal>
  );
};

export default DriverListModal;
