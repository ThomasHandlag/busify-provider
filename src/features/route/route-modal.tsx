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
  InputNumber,
} from "antd";
import { currencyInputFormatter, currencyInputParser } from "../../utils/currency";
import { SwapOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRoute, updateRoute } from "../../app/api/route_api";
import type { FormInstance } from "antd";
import type { LocationForOperatorResponse } from "../../stores/location_store";
import { getLocations } from "../../app/api/location";
const { Option } = Select;

export interface RouteFormData {
  startLocationId: number;
  startLocationName: string;
  endLocationId: number;
  endLocationName: string;
  defaultDurationMinutes: number;
  defaultPrice: number;
}

interface RouteModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  form: FormInstance;
  onSuccess?: () => void;
}

const RouteModal: React.FC<RouteModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  form,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  // Create
  const createMutation = useMutation({
    mutationFn: async (data: RouteFormData) => {
      const response = await createRoute(data);
      return response;
    },
    onSuccess: (response) => {
      if (response.code === 200) {
        message.success(response.message || "Thêm tuyến thành công!");
        queryClient.invalidateQueries({ queryKey: ["routes"] });
        if (onSuccess) onSuccess();
        form.resetFields();
        setIsModalVisible(false);
      } else {
        message.error(response.message || "Thêm tuyến thất bại!");
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        message.error(`Lỗi thêm tuyến đường: ${errorMsg}`);
      }
    },
  });

  // Update
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: RouteFormData }) => {
      const response = await updateRoute(id, data);
      return response;
    },
    onSuccess: (response, variables) => {
      if (response.code === 200) {
        message.success(response.message || "Cập nhật tuyến thành công!");
        queryClient.setQueryData(["routes", variables.id], variables.data);
        queryClient.invalidateQueries({ queryKey: ["routes"] });
        if (onSuccess) onSuccess();
        form.resetFields();
        setIsModalVisible(false);
      } else {
        message.error(response.message || "Cập nhật tuyến thất bại!");
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorMsg =
        error?.response?.data?.message ||
        error.message ||
        "Đã xảy ra lỗi không xác định";
      message.error(`Lỗi cập nhật tuyến: ${errorMsg}`);
    },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
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

  // fetch locations
  const { data: locations = [], isLoading: loadingLocations } = useQuery<
    LocationForOperatorResponse[]
  >({
    queryKey: ["locations"],
    queryFn: getLocations,
  });

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <SwapOutlined />
          {form.getFieldValue("id") ? "Chỉnh sửa tuyến xe" : "Thêm tuyến xe"}
        </div>
      }
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      width={700}
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
        <Card title="Thông tin tuyến đường" className="mb-4">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="defaultPrice"
                label="Giá mặc định"
                rules={[{ required: true, message: "Nhập giá!" }]}
              >
                <InputNumber
                  placeholder="VD: 200,000"
                  addonAfter="VND"
                  formatter={currencyInputFormatter}
                  parser={currencyInputParser}
                  min={0}
                  stringMode
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="defaultDurationMinutes"
                label="Thời gian dự kiến (phút)"
                rules={[
                  {
                    required: true,
                    message: "Nhập thời gian!",
                  },
                ]}
              >
                <Input type="number" placeholder="VD: 600" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startLocationId"
                label="Điểm xuất phát"
                rules={[
                  { required: true, message: "Vui lòng chọn điểm xuất phát!" },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Chọn điểm xuất phát"
                  optionFilterProp="children"
                  loading={loadingLocations}
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {locations.map((loc) => (
                    <Option key={loc.locationId} value={loc.locationId}>
                      {loc.locationName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="endLocationId"
                label="Điểm kết thúc"
                rules={[
                  { required: true, message: "Vui lòng chọn điểm kết thúc!" },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Chọn điểm kết thúc"
                  optionFilterProp="children"
                  loading={loadingLocations}
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {locations.map((loc) => (
                    <Option key={loc.locationId} value={loc.locationId}>
                      {loc.locationName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
};

export default RouteModal;
