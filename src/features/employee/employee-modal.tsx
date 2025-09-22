import React, { useEffect } from "react";
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
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEmployee, updateEmployee } from "../../app/api/employee";
import type { FormInstance } from "antd";
import type { EmployeeData } from "../../stores/employee_store";

interface EmployeeModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  form: FormInstance;
  onSuccess?: () => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  form,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isModalVisible) {
      form.resetFields();
      form.setFields([{ name: "driverLicenseNumber", errors: [] }]);
    }
  }, [isModalVisible, form]);

  // Create
  const createMutation = useMutation({
    mutationFn: async (data: Partial<EmployeeData>) => {
      const response = await createEmployee(data);
      return response;
    },
    onSuccess: (response) => {
      if (response.code === 200) {
        message.success("Thêm nhân viên thành công!");
        queryClient.invalidateQueries({ queryKey: ["employees"] });
        if (onSuccess) onSuccess();
        form.resetFields();
        setIsModalVisible(false);
      } else {
        message.error("Thêm nhân viên thất bại!");
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
        message.error(`Lỗi thêm nhân viên: ${errorMsg}`);
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
      data: Partial<EmployeeData>;
    }) => {
      const response = await updateEmployee(id, data);
      return response;
    },
    onSuccess: (response) => {
      if (response.code === 200) {
        message.success("Cập nhật nhân viên thành công!");
        queryClient.invalidateQueries({ queryKey: ["employees"] });
        if (onSuccess) onSuccess();
        form.resetFields();
        setIsModalVisible(false);
      } else {
        message.error("Cập nhật nhân viên thất bại!");
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
        message.error(`Lỗi cập nhật nhân viên: ${errorMsg}`);
      }
    },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (form.getFieldValue("id")) {
        updateMutation.mutate({ id: values.id, data: values });
      } else {
        createMutation.mutate(values);
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <UserOutlined />
          {form.getFieldValue("id") ? "Chỉnh sửa nhân viên" : "Thêm nhân viên"}
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

        <Card title="Thông tin nhân viên" className="mb-4">
          {form.getFieldValue("id") ? (
            // Update mode: các trường theo EmployeeMGMTRequestDTO
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                    {({ getFieldValue, setFieldsValue }) => {
                      const employeeType = getFieldValue("employeeType");

                      // Nếu đổi từ DRIVER sang STAFF thì clear Số GPLX
                      if (
                        employeeType === "STAFF" &&
                        getFieldValue("driverLicenseNumber")
                      ) {
                        setFieldsValue({ driverLicenseNumber: "" });
                      }

                      return (
                        <Form.Item
                          name="driverLicenseNumber"
                          label="Số GPLX"
                          dependencies={["employeeType"]}
                          rules={
                            employeeType === "DRIVER"
                              ? [
                                  {
                                    required: true,
                                    message: "Số GPLX bắt buộc với Tài xế",
                                  },
                                ]
                              : []
                          }
                        >
                          <Input
                            placeholder="Nhập số GPLX"
                            disabled={employeeType === "STAFF"}
                          />
                        </Form.Item>
                      );
                    }}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="phoneNumber"
                    label="Số điện thoại"
                    rules={[
                      {
                        required: true,
                        message: "Số điện thoại không được để trống",
                      },
                      //   {
                      //     pattern: /^(0|\+84)[0-9]{9,10}$/,
                      //     message: "Số điện thoại không hợp lệ",
                      //   },
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="address"
                    label="Địa chỉ"
                    rules={[
                      {
                        required: true,
                        message: "Địa chỉ không được để trống",
                      },
                      {
                        max: 255,
                        message: "Địa chỉ không được vượt quá 255 ký tự",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập địa chỉ" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="fullName"
                    label="Họ và tên"
                    rules={[
                      {
                        required: true,
                        message: "Họ và tên không được để trống",
                      },
                      {
                        max: 100,
                        message: "Họ và tên không được vượt quá 100 ký tự",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập họ và tên" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="employeeType"
                    label="Loại nhân viên"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn loại nhân viên",
                      },
                    ]}
                  >
                    <Select placeholder="Chọn loại nhân viên">
                      <Select.Option value="DRIVER">Tài xế</Select.Option>
                      <Select.Option value="STAFF">
                        Nhân viên bán vé
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="password" label="Đặt lại mật khẩu (nếu có)">
                    <Input.Password placeholder="Nhập mật khẩu mới" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="status"
                    label="Trạng thái"
                    rules={[
                      {
                        required: true,
                        message: "Trạng thái không được để trống",
                      },
                    ]}
                  >
                    <Select>
                      <Select.Option value="active">Hoạt động</Select.Option>
                      <Select.Option value="inactive">
                        Ngừng hoạt động
                      </Select.Option>
                      <Select.Option value="suspended">Bị cấm</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="employeeType"
                    label="Loại nhân viên"
                    rules={[
                      {
                        required: true,
                        message: "Loại nhân viên không được để trống",
                      },
                    ]}
                  >
                    <Select>
                      <Select.Option value="DRIVER">Tài xế</Select.Option>
                      <Select.Option value="STAFF">Nhân viên</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </>
          ) : (
            // Create mode: chỉ các trường cơ bản
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="fullName"
                    label="Họ tên"
                    rules={[
                      { required: true, message: "Họ tên không được để trống" },
                    ]}
                  >
                    <Input placeholder="Nhập họ tên" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: "Email không được để trống" },
                      { type: "email", message: "Email không hợp lệ" },
                    ]}
                  >
                    <Input placeholder="Nhập email" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[
                      {
                        required: true,
                        message: "Mật khẩu không được để trống",
                      },
                    ]}
                  >
                    <Input.Password placeholder="Nhập mật khẩu" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="employeeType"
                    label="Loại nhân viên"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn loại nhân viên",
                      },
                    ]}
                  >
                    <Select placeholder="Chọn loại nhân viên">
                      <Select.Option value="DRIVER">Tài xế</Select.Option>
                      <Select.Option value="STAFF">
                        Nhân viên bán vé
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
        </Card>
      </Form>
    </Modal>
  );
};

export default EmployeeModal;
