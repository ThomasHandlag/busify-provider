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
  InputNumber,
} from "antd";
import { CarOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addPointsByTrip, createTrip, updateTrip } from "../../app/api/trip";
import type { FormInstance } from "antd";
import type { TripData } from "../../stores/trip_store";
import dayjs from "dayjs";
import type { RouteForTripData } from "../../stores/route_store";
import { getRoutesForOperator } from "../../app/api/route_api";
import { getBusesForOperator } from "../../app/api/bus";
import type { BusData } from "../../stores/bus_store";
import { getDrivers } from "../../app/api/employee";
import type { DriverData } from "../../stores/employee_store";

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
    onSuccess: async (response) => {
      if (response.code === 200) {
        message.success("Cập nhật chuyến xe thành công!");
        queryClient.invalidateQueries({ queryKey: ["trips"] });

        // nếu trạng thái chuyến đi vừa cập nhật là "arrived" thì gọi API cộng điểm
        if (form.getFieldValue("status") === "arrived") {
          try {
            const tripId = form.getFieldValue("id");
            await addPointsByTrip(tripId);
            message.success("Điểm đã được cộng cho khách hàng!");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (err: any) {
            message.error(
              "Không thể cộng điểm: " +
                (err.response?.data?.message || err.message)
            );
          }
        }

        if (onSuccess) onSuccess();
        form.resetFields();
        setIsModalVisible(false);
      } else {
        message.error("Cập nhật chuyến xe thất bại!");
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

  // fetch routes
  const { data: routes = [], isLoading: loadingRoutes } = useQuery<
    RouteForTripData[]
  >({
    queryKey: ["routes"],
    queryFn: getRoutesForOperator,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

  // fetch buses
  const { data: buses = [], isLoading: loadingBuses } = useQuery<BusData[]>({
    queryKey: ["buses"],
    queryFn: getBusesForOperator,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

  // fetch drivers
  const { data: drivers = [], isLoading: loadingDrivers } = useQuery<
    DriverData[]
  >({
    queryKey: ["drivers"],
    queryFn: getDrivers,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

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
                  { required: true, message: "Vui lòng chọn điểm xuất phát!" },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Chọn tuyến đường"
                  optionFilterProp="children"
                  loading={loadingRoutes}
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  onChange={(value) => {
                    const selectedRoute = routes.find(
                      (route) => route.id === value
                    );
                    if (selectedRoute) {
                      form.setFieldsValue({
                        pricePerSeat: selectedRoute.default_price,
                      });
                    }
                  }}
                >
                  {routes.map((route) => (
                    <Option key={route.id} value={route.id}>
                      {route.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="busId"
                label="Xe"
                rules={[{ required: true, message: "Vui lòng chọn xe!" }]}
              >
                <Select
                  showSearch
                  placeholder="Chọn biển số xe"
                  optionFilterProp="children"
                  loading={loadingBuses}
                  disabled={
                    form.getFieldValue("id") &&
                    form.getFieldValue("status") !== "scheduled"
                  }
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {buses.map((bus) => (
                    <Option key={bus.id} value={bus.id}>
                      {bus.licensePlate}
                    </Option>
                  ))}
                </Select>
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
                <Select
                  showSearch
                  placeholder="Chọn tài xế"
                  optionFilterProp="children"
                  loading={loadingDrivers}
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {drivers.map((driver) => (
                    <Option key={driver.driverId} value={driver.driverId}>
                      {driver.driverName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                initialValue="scheduled"
                rules={[{ required: true }]}
              >
                <Select disabled={!form.getFieldValue("id")}>
                  <Option disabled={form.getFieldValue("id")} value="scheduled">
                    Đã lên lịch
                  </Option>
                  <Option value="on_sell">Đang mở bán</Option>
                  <Option value="delayed">Bị hoãn</Option>
                  <Option value="departed">Đã khởi hành</Option>
                  <Option value="arrived">Đã đến nơi</Option>
                  <Option value="cancelled">Đã hủy</Option>
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
                  disabledDate={(current) => current && current < dayjs()}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="pricePerSeat"
                label="Giá vé"
                rules={[{ required: true, message: "Vui lòng nhập giá vé!" }]}
              >
                <InputNumber
                  placeholder="Nhập giá vé"
                  addonAfter="VND"
                  formatter={(value) => {
                    if (!value) return "";
                    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  }}
                  min={0}
                  stringMode
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
