import React, { useEffect, useState } from "react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBus, updateBus } from "../../app/api/bus";
import type { FormInstance } from "antd";
import type { BusModelForOperatorResponse } from "../../stores/bus_model_store";
import { getBusModels } from "../../app/api/bus_models";
import type { SeatLayoutForOperatorResponse } from "../../stores/seat_layout_store";
import { getSeatLayouts } from "../../app/api/seat_layout";
import { Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { BusImage } from "../../stores/bus_store";

const { Option } = Select;

export interface BusFormData {
  licensePlate: string;
  modelId: number;
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
  busData?: any;
  onSuccess?: () => void;
}

const BusModal: React.FC<BusModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  form,
  onSuccess,
  busData,
}) => {
  const queryClient = useQueryClient();
  const [initialImages, setInitialImages] = useState<any[]>([]);

  // Create mutation
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
        message.error(`Lỗi thêm xe: ${errorMsg}`);
      }
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: BusFormData & { deletedImages?: string[] };
    }) => {
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

  // Effect để load dữ liệu khi mở modal
  useEffect(() => {
    if (isModalVisible && busData) {
      const amenitiesArray = Object.entries(busData.amenities || {})
        .filter(([_, value]) => value === true)
        .map(([key, _]) => key);

      const imageFileList = busData.images
        ? busData.images.map((img: BusImage, index: any) => ({
            uid: `existing-${img.id || index}`,
            url: img.imageUrl,
            status: "done",
            isExisting: true,
            id: img.id,
          }))
        : [];
      setInitialImages(imageFileList); // Store initial images
      form.setFieldsValue({
        ...busData,
        amenities: amenitiesArray,
        images: imageFileList,
      });
    }
  }, [isModalVisible, busData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Convert amenities array to object format
      const amenities = {
        tv: false,
        wifi: false,
        toilet: false,
        charging: false,
        air_conditioner: false,
      };
      (values.amenities || []).forEach((item: string) => {
        amenities[item as keyof typeof amenities] = true;
      });

      // Filter new files to upload
      const newFiles = (values.images || [])
        .filter((file: any) => file.originFileObj)
        .map((file: any) => file.originFileObj as File);

      // Get ids of existing images that remain
      const existingImageIds = (values.images || [])
        .filter((file: any) => !file.originFileObj && file.id) // chỉ giữ ảnh cũ có id
        .map((file: any) => file.id);

      // Detect deleted images by comparing initial ids vs hiện tại
      const deletedImageIds = initialImages
        .filter((initialImg: any) => !existingImageIds.includes(initialImg.id))
        .map((initialImg: any) => initialImg.id);

      const data = {
        licensePlate: values.licensePlate,
        modelId: values.modelId,
        operatorId: values.operatorId,
        seatLayoutId: values.seatLayoutId,
        status: values.status,
        amenities,
        images: newFiles, // ảnh mới
        existingImageIds, // gửi id ảnh còn lại
        deletedImageIds:
          deletedImageIds.length > 0 ? deletedImageIds : undefined,
      };

      console.log("Submitting data:", data);

      if (values.id) {
        updateMutation.mutate({ id: values.id, data });
      } else {
        createMutation.mutate(data);
      }
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  // Fetch bus models
  const { data: busModels = [], isLoading: loadingModels } = useQuery<
    BusModelForOperatorResponse[]
  >({
    queryKey: ["busModels"],
    queryFn: getBusModels,
  });

  // Fetch seat layouts
  const { data: seatLayouts = [], isLoading: loadingLayouts } = useQuery<
    SeatLayoutForOperatorResponse[]
  >({
    queryKey: ["seatLayouts"],
    queryFn: getSeatLayouts,
  });

  // Custom upload handler
  const handleUploadChange = ({ fileList }: any) => {
    form.setFieldValue("images", fileList);
  };

  // Preview handler cho ảnh
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    // Tạo modal preview hoặc mở ảnh trong tab mới
    const image = new Image();
    image.src = file.url || file.preview;
    const imgWindow = window.open(file.url || file.preview);
    imgWindow?.document.write(image.outerHTML);
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
      onCancel={() => {
        form.resetFields();
        setIsModalVisible(false);
      }}
      width={800}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            form.resetFields();
            setIsModalVisible(false);
          }}
        >
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
                label="Mẫu xe"
                rules={[{ required: true, message: "Vui lòng chọn mẫu xe!" }]}
              >
                <Select
                  showSearch
                  placeholder="Chọn mẫu xe"
                  optionFilterProp="children"
                  loading={loadingModels}
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {busModels.map((model) => (
                    <Option key={model.modelId} value={model.modelId}>
                      {model.modelName}
                    </Option>
                  ))}
                </Select>
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
                <Select
                  showSearch
                  placeholder="Chọn bố trí ghế"
                  optionFilterProp="children"
                  loading={loadingLayouts}
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {seatLayouts.map((layout) => (
                    <Option key={layout.id} value={layout.id}>
                      {layout.name}
                    </Option>
                  ))}
                </Select>
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
            <Col span={12}>
              <Form.Item
                name="images"
                label="Ảnh xe khách"
                valuePropName="fileList"
              >
                <Upload
                  listType="picture-card"
                  fileList={form.getFieldValue("images") || []} // Use form value
                  multiple
                  beforeUpload={() => false}
                  onChange={handleUploadChange}
                  onPreview={handlePreview}
                  accept="image/*"
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
};

// Helper function để convert file thành base64 cho preview
const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default BusModal;
