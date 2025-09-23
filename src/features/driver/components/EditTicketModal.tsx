import React from "react";
import { Modal, Form, Input, Select } from "antd";
import type { Passenger } from "../../../app/api/driver";

interface EditTicketModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  form: any;
  passenger: Passenger | null;
}

const EditTicketModal: React.FC<EditTicketModalProps> = ({
  visible,
  onCancel,
  onOk,
  form,
}) => {
  return (
    <Modal title="Edit Ticket" open={visible} onCancel={onCancel} onOk={onOk}>
      <Form form={form} layout="vertical">
        <Form.Item
          name="passengerPhone"
          label="Phone Number"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="seatNumber"
          label="Seat Number"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="cancelled">Cancelled</Select.Option>
            <Select.Option value="valid">Valid</Select.Option>
            <Select.Option value="used">Used</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTicketModal;
