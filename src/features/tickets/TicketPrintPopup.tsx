import React, { useRef } from "react";
import {
  Modal,
  Button,
  Typography,
  Space,
  Row,
  Col,
  Card,
  message,
  QRCode,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  CarOutlined,
  NumberOutlined,
  DollarOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { TicketDetail } from "../../stores/ticket_store";
import { useReactToPrint } from "react-to-print";

const { Title, Text } = Typography;

interface TicketPrintPopupProps {
  visible: boolean;
  onClose: () => void;
  ticketDetail: TicketDetail | null;
}

const TicketPrintPopup: React.FC<TicketPrintPopupProps> = ({
  visible,
  onClose,
  ticketDetail,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Use the react-to-print hook properly
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Vé-${ticketDetail?.ticketCode || "Unknown"}`,
    onAfterPrint: () => {
      message.info("In vé hoàn tất");
    },
    onPrintError: (error) => {
      message.error("Lỗi khi in vé: " + error);
    },
  });

  if (!ticketDetail) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  };

  return (
    <Modal
      title={<Title level={4}>In vé xe khách</Title>}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
        <Button
          key="print"
          type="primary"
          icon={<PrinterOutlined />}
          onClick={handlePrint}
        >
          In vé
        </Button>,
      ]}
      width={800}
    >
      <div className="print-container">
        {/* This outer div will be hidden during printing */}
        <div ref={contentRef}>
          <Card
            className="ticket-card"
            style={{
              border: "1px dashed #ccc",
              background: "#fff",
              padding: 0,
            }}
          >
            {/* Ticket Header */}
            <div
              style={{
                borderBottom: "2px dashed #ccc",
                padding: "16px 24px",
                background: "#f0f5ff",
              }}
            >
              <Row justify="space-between" align="middle">
                <Col>
                  <Title level={3} style={{ margin: 0 }}>
                    {ticketDetail.trip.operator.operatorName}
                  </Title>
                </Col>
                <Col>
                  <Title level={2} style={{ margin: 0 }}>
                    VÉ XE KHÁCH
                  </Title>
                </Col>
              </Row>
            </div>

            {/* Ticket Body */}
            <div style={{ padding: "16px 24px" }}>
              {/* Route Information */}
              <Row style={{ marginBottom: 16 }}>
                <Col span={24}>
                  <Title level={4} style={{ textAlign: "center", margin: 0 }}>
                    {ticketDetail.trip.route.startLocation.name} -{" "}
                    {ticketDetail.trip.route.endLocation.name}
                  </Title>
                </Col>
              </Row>

              {/* Main Ticket Information */}
              <Row gutter={[24, 16]} justify={"space-between"}>
                {/* Left Column */}
                <Col>
                  <Space
                    direction="vertical"
                    size="small"
                    style={{ width: "100%" }}
                  >
                    <div>
                      <Text strong>Mã vé:</Text>{" "}
                      <Text style={{ fontSize: 16, fontWeight: 600 }}>
                        {ticketDetail.ticketCode}
                      </Text>
                    </div>
                    <div>
                      <UserOutlined /> <Text strong>Hành khách:</Text>{" "}
                      <Text>{ticketDetail.passengerName}</Text>
                    </div>
                    <div>
                      <PhoneOutlined /> <Text strong>Điện thoại:</Text>{" "}
                      <Text>{ticketDetail.passengerPhone}</Text>
                    </div>
                    <div>
                      <NumberOutlined /> <Text strong>Số ghế:</Text>{" "}
                      <Text style={{ fontWeight: 600 }}>
                        {ticketDetail.seatNumber}
                      </Text>
                    </div>
                    <div>
                      <DollarOutlined /> <Text strong>Giá vé:</Text>{" "}
                      <Text>
                        {ticketDetail.price.toLocaleString("vi-VN")} VND
                      </Text>
                    </div>
                  </Space>
                </Col>

                <Col>
                  <Space
                    direction="vertical"
                    size="small"
                    style={{ width: "100%" }}
                  >
                    <div>
                      <CalendarOutlined /> <Text strong>Khởi hành:</Text>{" "}
                      <Text>{formatDate(ticketDetail.trip.departureTime)}</Text>
                    </div>
                    <div>
                      <CalendarOutlined /> <Text strong>Đến nơi:</Text>{" "}
                      <Text>{formatDate(ticketDetail.trip.arrivalTime)}</Text>
                    </div>
                    <div>
                      <CarOutlined /> <Text strong>Xe:</Text>{" "}
                      <Text>
                        {ticketDetail.trip.bus.model} -{" "}
                        {ticketDetail.trip.bus.licensePlate}
                      </Text>
                    </div>
                    <div>
                      <EnvironmentOutlined /> <Text strong>Tuyến đường:</Text>{" "}
                      <Text>{ticketDetail.trip.route.routeName}</Text>
                    </div>
                  </Space>
                </Col>
                <Col>
                  <QRCode value={ticketDetail.ticketCode} />
                </Col>
              </Row>
            </div>

            {/* Ticket Footer */}
            <div
              style={{
                borderTop: "2px dashed #ccc",
                padding: "12px 24px",
                background: "#f0f5ff",
                textAlign: "center",
              }}
            >
              <Text type="secondary">
                Vui lòng có mặt trước giờ khởi hành 15 phút. Xin cảm ơn!
              </Text>
            </div>
          </Card>
        </div>

        {/* Print styles are handled by react-to-print */}
      </div>
    </Modal>
  );
};

export default TicketPrintPopup;
