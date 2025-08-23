import React from "react";
import { Modal, Form, Select } from "antd";

interface EditTripStatusModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  form: any;
}

const EditTripStatusModal: React.FC<EditTripStatusModalProps> = ({
  visible,
  onCancel,
  onOk,
  form,
}) => {
  return (
    <Modal
      title="Edit Trip Status"
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="cancelled">Cancelled</Select.Option>
            <Select.Option value="delayed">Delayed</Select.Option>
            <Select.Option value="ontime">On Time</Select.Option>
            <Select.Option value="arrived">Arrived</Select.Option>
            <Select.Option value="scheduled">Scheduled</Select.Option>
            <Select.Option value="departed">Departed</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTripStatusModal;
