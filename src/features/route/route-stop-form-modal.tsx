import React, { useEffect } from "react";
import { Modal, Form, InputNumber, Button, message, Select } from "antd";
import { addRouteStop, updateRouteStop } from "../../app/api/route_stop_api";
import type {
  RouteStopData,
  RouteStopFormData,
} from "../../stores/route_stop_store";
import { getLocations } from "../../app/api/location";
import { useQuery } from "@tanstack/react-query";

interface Props {
  visible: boolean;
  stop: RouteStopData | null;
  routeId: number | null;
  onClose: () => void;
}

const RouteStopFormModal: React.FC<Props> = ({
  visible,
  stop,
  routeId,
  onClose,
}) => {
  const [form] = Form.useForm();

  const { data: locations = [] } = useQuery({
    queryKey: ["locations"],
    queryFn: getLocations,
  });

  useEffect(() => {
    if (stop) {
      form.setFieldsValue(stop);
    } else {
      form.resetFields();
    }
  }, [stop, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data: RouteStopFormData = {
        routeId: routeId!,
        ...values,
      };

      let response;
      if (stop) {
        response = await updateRouteStop(data);
        if (response.code === 200) {
          message.success("Cập nhật điểm dừng thành công");
          onClose();
        } else {
          message.error(
            `Lỗi cập nhật điểm dừng: ${response.message || "Cập nhật thất bại"}`
          );
        }
      } else {
        response = await addRouteStop(data);
        if (response.code === 200) {
          message.success("Thêm điểm dừng thành công");
          onClose();
        } else {
          message.error(
            `Lỗi thêm điểm dừng: ${response.message || "Thêm thất bại"}`
          );
        }
      }
    } catch (e: any) {
      // bắt lỗi từ BE (ví dụ 500 với message custom)
      const errorMsg =
        e?.response?.data?.message ||
        e.message ||
        "Đã xảy ra lỗi không xác định";
      message.error(`Lỗi điểm dừng: ${errorMsg}`);
      console.error(e);
    }
  };

  return (
    <Modal
      open={visible}
      title={stop ? "Sửa điểm dừng" : "Thêm điểm dừng"}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {stop ? "Cập nhật" : "Tạo mới"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="locationId"
          label="Chọn điểm dừng"
          rules={[{ required: true, message: "Chọn điểm dừng!" }]}
        >
          <Select placeholder="Chọn điểm dừng">
            {locations.map((loc: any) => (
              <Select.Option key={loc.locationId} value={loc.locationId}>
                {loc.locationName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="stopOrder"
          label="Thứ tự"
          rules={[{ required: true, message: "Nhập thứ tự!" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="timeOffsetFromStart"
          label="Thời gian lệch (phút)"
          rules={[{ required: true, message: "Nhập thời gian!" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RouteStopFormModal;
