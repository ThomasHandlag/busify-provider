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
} from "antd";
import { operatorStore } from "../../stores/operator_store";

const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const operatorData = operatorStore();

  const handleUpdate = () => {
    editForm.setFieldsValue(operatorData.operator);
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      operatorData.setOperator({ ...operatorData.operator, ...values });
      setIsEditModalVisible(false);
      message.success("Cập nhật thông tin thành công!");
    } catch (error) {
      // validation error
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

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Hồ sơ nhà xe
      </Title>
      <Card>
        <Row gutter={16}>
          <Col span={12}>
            <Text strong>ID:</Text> {operatorData.operator?.id}
          </Col>
          <Col span={12}>
            <Text strong>Tên nhà xe:</Text> {operatorData.operator?.name}
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 12 }}>
          <Col span={12}>
            <Text strong>Email:</Text> {operatorData.operator?.email}
          </Col>
          <Col span={12}>
            <Text strong>Số điện thoại:</Text> {operatorData.operator?.hotline}
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 12 }}>
          <Col span={24}>
            <Text strong>Địa chỉ:</Text> {operatorData.operator?.address}
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 12 }}>
          <Col span={12}>
            <Text strong>Trạng thái hợp đồng:</Text>{" "}
            <span
              style={{
                color:
                  operatorData.operator?.status === "active"
                    ? "#52c41a"
                    : "#ff4d4f",
              }}
            >
              {operatorData.operator?.status === "active"
                ? "Đang hiệu lực"
                : "Đã hủy"}
            </span>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col>
            <Button type="primary" onClick={handleUpdate}>
              Cập nhật thông tin
            </Button>
          </Col>
          <Col>
            <Button
              danger
              onClick={handleCancelContract}
              disabled={operatorData.operator?.status !== "active"}
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

      <Modal
        title="Cập nhật thông tin nhà xe"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleEditSubmit}
        okText="Lưu"
        cancelText="Hủy"
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
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
