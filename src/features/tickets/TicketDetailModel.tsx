import React, { useEffect, useState } from "react";
import {
  Modal,
  Descriptions,
  Tag,
  Space,
  Typography,
  Divider,
  Card,
  Button,
  message,
  Spin,
  Alert,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  DollarOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  PrinterOutlined,
  MailOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import TicketPrintPopup from "./TicketPrintPopup";

import dayjs from "dayjs";
import type { TicketDetail } from "../../stores/ticket_store";
import { deleteTicket, getTicketByCode } from "../../app/api/ticket";

const { Title, Text } = Typography;

interface Ticket {
  ticketId: number;
  passengerName: string;
  passengerPhone: string;
  price: number;
  seatNumber: string;
  status: string;
  ticketCode: string;
  bookingId: number;
}

interface TicketDetailModalProps {
  ticket: Ticket | null;
  visible: boolean;
  onClose: () => void;
  onDelete?: (ticketCode: string) => void;
}

const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  visible,
  onClose,
  onDelete,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketDetail, setTicketDetail] = useState<TicketDetail | null>(null);
  const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);

  useEffect(() => {
    if (visible && ticket) {
      const fetchTicketDetail = async () => {
        setLoading(true);
        setError(null);
        setTicketDetail(null);
        try {
          const response = await getTicketByCode(ticket.ticketCode);
          if (response.code === 200) {
            setTicketDetail(response.result);
          } else {
            setError(response.message || "Không thể tải chi tiết vé.");
          }
        } catch (err) {
          setError("Lỗi kết nối. Không thể tải chi tiết vé." + err);
        } finally {
          setLoading(false);
        }
      };
      fetchTicketDetail();
    }
  }, [visible, ticket]);

  if (!ticket) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "green";
      case "used":
        return "blue";
      case "cancelled":
        return "red";
      case "expired":
        return "orange";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "valid":
        return "Còn hiệu lực";
      case "used":
        return "Đã sử dụng";
      case "cancelled":
        return "Đã hủy";
      case "expired":
        return "Hết hạn";
      default:
        return status;
    }
  };

  const handlePrintTicket = () => {
    setIsPrintModalVisible(true);
    message.success("Đang chuẩn bị in vé...");
  };

  const handleSendEmail = () => {
    message.success("Đã gửi thông tin vé qua email");
  };

  const handleDeleteTicket = () => {
    if (!ticket) return;

    Modal.confirm({
      title: "Xác nhận hủy vé",
      content: `Bạn có chắc chắn muốn hủy vé với mã ${ticket.ticketCode}? Hành động này không thể hoàn tác.`,
      okText: "Xác nhận hủy",
      okType: "danger",
      cancelText: "Không",
      onOk: async () => {
        try {
          await deleteTicket(ticket.ticketCode);
          // Update local status so UI reflects cancellation immediately
          setTicketDetail((prev) =>
            prev ? { ...prev, status: "cancelled" } : prev
          );
          message.success("Hủy vé thành công");
          onDelete?.(ticket.ticketCode);
          onClose();
        } catch (error) {
          message.error("Không thể hủy vé. Vui lòng thử lại." + error);
        }
      },
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <Spin size="large" />
          <p>Đang tải dữ liệu chi tiết vé...</p>
        </div>
      );
    }

    if (error) {
      return <Alert message="Lỗi" description={error} type="error" showIcon />;
    }

    if (!ticketDetail) {
      return <Alert message="Không có dữ liệu chi tiết" type="warning" />;
    }

    const { booking, trip: tripInfo } = ticketDetail;

    return (
      <>
        {/* Ticket Status */}
        <Card
          size="small"
          style={{ marginBottom: "16px", textAlign: "center" }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Trạng thái vé:{" "}
            <Tag
              color={getStatusColor(ticketDetail.status)}
              style={{ fontSize: "14px" }}
            >
              {getStatusText(ticketDetail.status)}
            </Tag>
          </Title>
        </Card>

        {/* Passenger Information */}
        <Card
          title="Thông tin hành khách"
          size="small"
          style={{ marginBottom: "16px" }}
        >
          <Descriptions column={2} size="small">
            <Descriptions.Item label="Họ và tên" span={2}>
              <Space>
                <UserOutlined />
                <Text strong>{ticketDetail.passengerName}</Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              <Space>
                <PhoneOutlined />
                {ticketDetail.passengerPhone}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              <Space>
                <MailOutlined />
                {booking.customerEmail}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Trip Information */}
        <Card
          title="Thông tin chuyến đi"
          size="small"
          style={{ marginBottom: "16px" }}
        >
          <Descriptions column={2} size="small">
            <Descriptions.Item label="Tuyến đường" span={2}>
              <Space>
                <EnvironmentOutlined />
                <Text strong>
                  {tripInfo.route.startLocation.name} →{" "}
                  {tripInfo.route.endLocation.name}
                </Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian khởi hành">
              <Space>
                <CalendarOutlined />
                {dayjs(tripInfo.departureTime).format("HH:mm - DD/MM/YYYY")}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian đến">
              <Space>
                <CalendarOutlined />
                {dayjs(tripInfo.arrivalTime).format("HH:mm - DD/MM/YYYY")}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Nhà xe">
              {tripInfo.operator.operatorName}
            </Descriptions.Item>
            <Descriptions.Item label="Tuyến">
              {tripInfo.route.routeName}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Ticket Information */}
        <Card
          title="Thông tin vé"
          size="small"
          style={{ marginBottom: "16px" }}
        >
          <Descriptions column={2} size="small">
            <Descriptions.Item label="Mã vé">
              <Text code strong>
                {ticketDetail.ticketCode}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Mã đặt vé">
              <Text code>{booking.bookingCode}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Số ghế">
              <Tag color="cyan" style={{ fontSize: "14px" }}>
                {ticketDetail.seatNumber}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Giá vé">
              <Space>
                <DollarOutlined />
                <Text strong style={{ color: "#52c41a", fontSize: "16px" }}>
                  {ticketDetail.price.toLocaleString("vi-VN")} VNĐ
                </Text>
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Booking Information */}
        <Card title="Thông tin đặt vé" size="small">
          <Descriptions column={2} size="small">
            <Descriptions.Item label="Ngày đặt">
              <Space>
                <CalendarOutlined />
                {dayjs(booking.bookingDate).format("HH:mm - DD/MM/YYYY")}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Phương thức thanh toán">
              {booking.paymentMethod}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Divider />

        {/* Additional Actions or Notes */}
        <Card size="small" style={{ backgroundColor: "#f9f9f9" }}>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Thông tin chi tiết vé được tự động cập nhật từ hệ thống. Mọi thay
            đổi sẽ được thông báo đến khách hàng qua email và SMS.
          </Text>
        </Card>
      </>
    );
  };

  return (
    <>
      <Modal
        title={
          <Space>
            <UserOutlined />
            <span>Chi tiết vé - {ticket.ticketCode}</span>
          </Space>
        }
        open={visible}
        onCancel={onClose}
        width={800}
        footer={[
          <Button
            key="delete"
            danger
            type="primary"
            disabled={
              ticketDetail?.status === "cancelled" ||
              ticketDetail?.status === "used"
            }
            icon={<DeleteOutlined />}
            onClick={handleDeleteTicket}
          >
            Hủy vé
          </Button>,
          <Button key="email" icon={<MailOutlined />} onClick={handleSendEmail}>
            Gửi email
          </Button>,
          <Button
            key="print"
            icon={<PrinterOutlined />}
            onClick={handlePrintTicket}
          >
            In vé
          </Button>,
          <Button key="close" onClick={onClose}>
            Đóng
          </Button>,
        ]}
      >
        <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {renderContent()}
        </div>
      </Modal>

      {/* Ticket Print Popup */}
      <TicketPrintPopup
        visible={isPrintModalVisible}
        onClose={() => setIsPrintModalVisible(false)}
        ticketDetail={ticketDetail}
      />
    </>
  );
};

export default TicketDetailModal;
