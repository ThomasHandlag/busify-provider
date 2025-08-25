import React from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Row,
  Col,
  Card,
  message,
  Select,
  Checkbox,
} from "antd";
import { CarOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBus, updateBus } from "../../app/api/bus";
import type { FormInstance } from "antd";

const { Option } = Select;

export interface BusFormData {
  licensePlate: string;
  modelId: number; // Thay đổi modelId thành modelName
  operatorId: number;
  seatLayoutId: number;
  status: "active" | "under_maintenance" | "out_of_service";
  amenities: {
    tv: boolean;
    wifi: boolean;
    toilet: boolean;
    charging: boolean;
    air_conditioner: boolean;
  };
}

interface BusModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  form: FormInstance;
  onSuccess?: () => void;
}

const BusModal: React.FC<BusModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  form,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  // Create
  const createMutation = useMutation({
    mutationFn: async (data: BusFormData) => {
      const response = await createBus(data);
      return response;
    },
    onSuccess: (response) => {
      if (response.code === 200) {
        message.success(response.message || "Thêm xe thành công!");
        queryClient.invalidateQueries({ queryKey: ["buses"] });
        if (onSuccess) onSuccess();
        form.resetFields();
        setIsModalVisible(false);
      } else {
        message.error(response.message || "Thêm xe thất bại!");
      }
    },
    onError: (error: Error) => {
      message.error(`Lỗi thêm xe: ${error.message}`);
    },
  });

  // Update
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: BusFormData }) => {
      const response = await updateBus(id, data);
      return response;
    },
    onSuccess: (response, variables) => {
      if (response.code === 200) {
        message.success(response.message || "Cập nhật xe thành công!");
        queryClient.setQueryData(["buses", variables.id], variables.data);
        queryClient.invalidateQueries({ queryKey: ["buses"] });
        if (onSuccess) onSuccess();
        form.resetFields();
        setIsModalVisible(false);
      } else {
        message.error(response.message || "Cập nhật xe thất bại!");
      }
    },
    onError: (error: any) => {
      const errorMsg =
        error?.response?.data?.message ||
        error.message ||
        "Đã xảy ra lỗi không xác định";

      message.error(`Lỗi cập nhật xe: ${errorMsg}`);
    },
  });

  const handleSubmit = async () => {
    form.validateFields().then((values) => {
      const amenities = {
        tv: false,
        wifi: false,
        toilet: false,
        charging: false,
        air_conditioner: false,
      };

      // Convert array to object format
      (values.amenities || []).forEach((item: string) => {
        amenities[item as keyof typeof amenities] = true;
      });

      const data: BusFormData = {
        licensePlate: values.licensePlate,
        modelId: values.modelId,
        operatorId: values.operatorId,
        seatLayoutId: values.seatLayoutId,
        status: values.status,
        amenities,
      };

      if (form.getFieldValue("id")) {
        updateMutation.mutate({ id: values.id, data });
      } else {
        createMutation.mutate(data);
      }
    });
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <CarOutlined />
          {form.getFieldValue("id") ? "Chỉnh sửa xe khách" : "Thêm xe khách"}
        </div>
      }
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      width={800}
      footer={[
        <Button key="cancel" onClick={() => setIsModalVisible(false)}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={createMutation.isPending || updateMutation.isPending}
          onClick={handleSubmit}
        >
          {form.getFieldValue("id") ? "Cập nhật" : "Tạo mới"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Card title="Thông tin xe khách" className="mb-4">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="licensePlate"
                label="Biển số xe"
                rules={[
                  { required: true, message: "Vui lòng nhập biển số xe!" },
                  {
                    pattern: /^[0-9]{2}[A-Z]-[0-9]{3}\.[0-9]{2}$/,
                    message: "Biển số xe phải theo định dạng: 88A-888.88",
                  },
                ]}
              >
                <Input placeholder="VD: 43A-123.45" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                initialValue="active"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="active">Đang hoạt động</Option>
                  <Option value="under_maintenance">Bảo trì</Option>
                  <Option value="out_of_service">Ngưng hoạt động</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="modelId"
                label="Mã mẫu xe"
                rules={[{ required: true }]}
              >
                <Input placeholder="Nhập ID mẫu xe" type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="seatLayoutId"
                label="Bố trí ghế"
                rules={[
                  { required: true, message: "Vui lòng chọn bố trí ghế!" },
                ]}
              >
                <Input placeholder="Nhập ID bố trí ghế" type="number" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="amenities" label="Tiện ích">
                <Checkbox.Group>
                  <Row>
                    <Col span={12}>
                      <Checkbox value="wifi">WiFi</Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="tv">TV</Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="toilet">Toilet</Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="charging">Sạc</Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="air_conditioner">Điều hòa</Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
};

export default BusModal;
