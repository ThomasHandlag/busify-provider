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
import type { LocationDropdownItem } from "../../app/api/location";
import { getLocationDropdown } from "../../app/api/location";
const { Option } = Select;

export interface RouteFormData {
  startLocationId: number;
  endLocationId: number;
  defaultDurationMinutes: number;
  defaultPrice: number;
  stopLocationIds?: number[]; // Thay đổi để phù hợp với API
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
      console.log("API Request data:", data);
      const response = await createRoute(data);
      console.log("API Response:", response);
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
      console.error("Create route error:", error);
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
      
      // Transform data to match API requirements
      const data: RouteFormData = {
        startLocationId: values.startLocationId,
        endLocationId: values.endLocationId,
        defaultDurationMinutes: values.defaultDurationMinutes,
        defaultPrice: values.defaultPrice,
        ...(values.stopLocationIds && values.stopLocationIds.length > 0 
          ? { stopLocationIds: values.stopLocationIds }
          : {}
        )
      };

      console.log("Sending data to API:", data);

      if (form.getFieldValue("id")) {
        updateMutation.mutate({ id: values.id, data });
      } else {
        createMutation.mutate(data);
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  // fetch locations for start/end points
  const { data: locations = [], isLoading: loadingLocations } = useQuery<
    LocationDropdownItem[]
  >({
    queryKey: ["locations"],
    queryFn: getLocationDropdown,
  });

  // fetch locations for pickup/dropoff stops
  const { data: stopLocations = [], isLoading: loadingStopLocations } = useQuery<
    LocationDropdownItem[]
  >({
    queryKey: ["locations", "dropdown"],
    queryFn: getLocationDropdown,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
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
                    <Option key={loc.id} value={loc.id}>
                      {loc.name}
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
                    <Option key={loc.id} value={loc.id}>
                      {loc.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Thêm section cho điểm dừng trung gian */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="stopLocationIds"
                label="Điểm dừng trung gian"
                tooltip="Chọn các điểm dừng trung gian trên tuyến đường (tùy chọn)"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value || value.length === 0) return Promise.resolve();
                      
                      const startLocationId = form.getFieldValue('startLocationId');
                      const endLocationId = form.getFieldValue('endLocationId');
                      
                      const hasConflict = value.some((id: number) => 
                        id === startLocationId || id === endLocationId
                      );
                      
                      if (hasConflict) {
                        return Promise.reject(new Error('Điểm dừng không được trùng với điểm xuất phát hoặc kết thúc'));
                      }
                      
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Select
                  mode="multiple"
                  showSearch
                  placeholder="Chọn các điểm dừng trung gian"
                  optionFilterProp="children"
                  loading={loadingStopLocations}
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  maxTagCount="responsive"
                  allowClear
                >
                  {stopLocations.map((loc) => (
                    <Option key={`stop-${loc.id}`} value={loc.id}>
                      {loc.name}
                      {loc.address && (
                        <span style={{ color: '#999', fontSize: '12px' }}>
                          {` - ${loc.address}`}
                        </span>
                      )}
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
