/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  message,
  Spin,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  getOperatorDataByUser,
  updateOperatorProfile,
} from "../../app/api/operator";
import { useAuthStore } from "../../stores/auth_store";

const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const queryClient = useQueryClient();
  const [passwordForm] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { logOut } = useAuthStore();

  // Fetch operator data
  const {
    data: operator,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["operator"],
    queryFn: getOperatorDataByUser,
  });

  // Mutation update profile
  const updateMutation = useMutation({
    mutationFn: updateOperatorProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["operator"], data); // cập nhật cache
      setIsEditModalVisible(false);
      message.success("Cập nhật thông tin thành công!");
    },
    onError: (error: any) => {
      // Nếu server trả về fieldErrors
      if (error.response?.data?.fieldErrors) {
        const fieldErrors = error.response.data.fieldErrors;

        // Convert sang format Antd form cần
        const errors = Object.keys(fieldErrors).map((field) => ({
          name: field,
          errors: fieldErrors[field],
        }));

        editForm.setFields(errors);
      } else {
        message.error(
          error.response?.data?.message || "Không thể cập nhật thông tin!"
        );
      }
    },
  });

  // Mutation change password
  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      message.success("Đổi mật khẩu thành công, vui lòng đăng nhập lại.");
      setIsPasswordModalVisible(false);
      passwordForm.resetFields();
      logOut();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Đổi mật khẩu thất bại!");
    },
  });

  const handleUpdate = () => {
    editForm.setFieldsValue(operator || {});
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      updateMutation.mutate({
        ...values,
        avatar: avatarFile || undefined, // thêm avatar file
      });
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      const values = await passwordForm.validateFields();
      changePasswordMutation.mutate(values);
    } catch {
      console.log("Validation Failed");
    }
  };

  const handleCancelContract = () => {
    Modal.confirm({
      title: "Cancel contract confirmation",
      content:
        "Are you sure you want to cancel this contract? This action cannot be undone.",
      okText: "Cancel contract",
      okType: "danger",
      cancelText: "Close",
      onOk: () => {
        message.success(
          "The contract has been deactivated! After 1 month, it will be removed."
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !operator) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p>Không thể tải dữ liệu nhà xe!</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Hồ sơ nhà xe
      </Title>
      <Card>
        {/* Avatar + Info */}
        <Row gutter={16} align="middle" style={{ marginBottom: 24 }}>
          <Col span={6}>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid #ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f9f9f9",
              }}
            >
              {operator.avatarUrl ? (
                <img
                  src={operator.avatarUrl}
                  alt="Avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ color: "#aaa" }}>No Avatar</span>
              )}
            </div>
          </Col>
          <Col span={18}>
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>ID:</Text> {operator.id}
              </Col>
              <Col span={12}>
                <Text strong>Tên nhà xe:</Text> {operator.name}
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 12 }}>
              <Col span={12}>
                <Text strong>Email:</Text> {operator.email}
              </Col>
              <Col span={12}>
                <Text strong>Số điện thoại:</Text> {operator.hotline}
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 12 }}>
              <Col span={24}>
                <Text strong>Địa chỉ:</Text> {operator.address}
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 12 }}>
              <Col span={12}>
                <Text strong>Trạng thái hợp đồng:</Text>{" "}
                <span
                  style={{
                    color: operator.status === "active" ? "#52c41a" : "#ff4d4f",
                  }}
                >
                  {operator.status === "active" ? "Đang hiệu lực" : "Đã hủy"}
                </span>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Actions */}
        <Row gutter={16} style={{ marginTop: 24, marginBottom: 16 }}>
          <Col>
            <Button type="primary" onClick={handleUpdate}>
              Cập nhật thông tin
            </Button>
          </Col>
          <Col>
            <Button onClick={() => setIsPasswordModalVisible(true)}>
              Đổi mật khẩu
            </Button>
          </Col>
          <Col>
            <Button
              danger
              onClick={handleCancelContract}
              disabled={operator.status !== "active"}
            >
              Hủy hợp đồng
            </Button>
          </Col>
        </Row>
        <Row>
          <p className="text-slate-400">
            Any information you provide will be kept confidential. Any changes
            made will be reflected in your account. And any customer can see
            your public information.
          </p>
        </Row>
        <Row>
          <p className="text-slate-400">
            After requesting to cancel the contract, it will be deactivated
            immediately. After 1 month, it will be removed. All data belong to
            your business will be lost.
          </p>
        </Row>
      </Card>

      {/* Modal Edit Profile */}
      <Modal
        title="Cập nhật thông tin nhà xe"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleEditSubmit}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={updateMutation.isPending}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="name"
            label="Tên nhà xe"
            rules={[{ required: true, message: "Vui lòng nhập tên nhà xe" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="hotline"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Avatar">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setAvatarFile(e.target.files[0]);
                }
              }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Đổi mật khẩu */}
      <Modal
        title="Đổi mật khẩu"
        open={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        onOk={handlePasswordSubmit}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={changePasswordMutation.isPending}
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            name="oldPassword"
            label="Mật khẩu cũ"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={["newPassword"]}
            rules={[{ required: true, message: "Vui lòng nhập lại mật khẩu" }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
