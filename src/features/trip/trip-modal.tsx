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
  DatePicker,
} from "antd";
import { CarOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTrip, updateTrip } from "../../app/api/trip";
import type { FormInstance } from "antd";
import type { TripData } from "../../stores/trip_store";
import dayjs from "dayjs";

const { Option } = Select;

interface TripModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  form: FormInstance;
  onSuccess?: () => void;
}

const TripModal: React.FC<TripModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  form,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  // Create
  const createMutation = useMutation({
    mutationFn: async (data: Partial<TripData>) => {
      const response = await createTrip(data);
      return response;
    },
    onSuccess: (response) => {
      if (response.code === 200) {
        message.success("Thêm chuyến xe thành công!");
        queryClient.invalidateQueries({ queryKey: ["trips"] });
        if (onSuccess) onSuccess();
        form.resetFields();
        setIsModalVisible(false);
      } else {
        message.error("Thêm chuyến xe thất bại!");
      }
    },
    onError: (error: any) => {
      const fieldErrors = error.response?.data?.fieldErrors;

      if (fieldErrors) {
        const fields = Object.entries(fieldErrors).map(([field, messages]) => ({
          name: field,
          errors: messages as string[],
        }));

        form.setFields(fields);
      } else {
        const errorMsg =
          error?.response?.data?.message ||
          error.message ||
          "Đã xảy ra lỗi không xác định";
        message.error(`Lỗi thêm chuyến xe: ${errorMsg}`);
      }
    },
  });

  // Update
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<TripData>;
    }) => {
      const response = await updateTrip(id, data);
      return response;
    },
    onSuccess: (response) => {
      if (response.code === 200) {
        message.success("Cập nhật chuyến xe thành công!");
        queryClient.invalidateQueries({ queryKey: ["trips"] });
        if (onSuccess) onSuccess();
        form.resetFields();
        setIsModalVisible(false);
      } else {
        message.error("Cập nhật chuyến xe thất bại!");
      }
    },
    onError: (error: any) => {
      const fieldErrors = error.response?.data?.fieldErrors;

      if (fieldErrors) {
        const fields = Object.entries(fieldErrors).map(([field, messages]) => ({
          name: field,
          errors: messages as string[],
        }));

        form.setFields(fields);
      } else {
        const errorMsg =
          error?.response?.data?.message ||
          error.message ||
          "Đã xảy ra lỗi không xác định";

        message.error(`Lỗi cập nhật xe: ${errorMsg}`);
      }
    },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        departureTime: dayjs(values.departureTime).format(
          "YYYY-MM-DDTHH:mm:ssZ"
        ),
        estimatedArrivalTime: dayjs(values.estimatedArrivalTime).format(
          "YYYY-MM-DDTHH:mm:ssZ"
        ),
      };

      if (form.getFieldValue("id")) {
        updateMutation.mutate({ id: values.id, data });
      } else {
        createMutation.mutate(data);
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <CarOutlined />
          {form.getFieldValue("id") ? "Chỉnh sửa chuyến xe" : "Thêm chuyến xe"}
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

        <Card title="Thông tin chuyến xe" className="mb-4">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="routeId"
                label="Tuyến đường"
                rules={[
                  { required: true, message: "Vui lòng chọn tuyến đường!" },
                ]}
              >
                <Input type="number" placeholder="Nhập ID tuyến đường" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="busId"
                label="Xe"
                rules={[{ required: true, message: "Vui lòng chọn xe!" }]}
              >
                <Input type="number" placeholder="Nhập ID xe" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="driverId"
                label="Tài xế"
                rules={[{ required: true, message: "Vui lòng chọn tài xế!" }]}
              >
                <Input type="number" placeholder="Nhập ID tài xế" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                initialValue="scheduled"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="scheduled">Đã lên lịch</Option>
                  <Option value="cancelled">Đã hủy</Option>
                  <Option value="completed">Đã hoàn thành</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="departureTime"
                label="Thời gian khởi hành"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn thời gian khởi hành!",
                  },
                ]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="pricePerSeat"
                label="Giá vé"
                rules={[{ required: true, message: "Vui lòng nhập giá vé!" }]}
              >
                <Input
                  type="number"
                  placeholder="Nhập giá vé"
                  prefix="VND"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
};

export default TripModal;
