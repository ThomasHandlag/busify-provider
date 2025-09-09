import React from "react";
import { Modal, Descriptions, Tag, Image } from "antd";
import type { BusData } from "../../stores/bus_store";
import {
  DesktopOutlined,
  RestOutlined,
  ThunderboltOutlined,
  VideoCameraOutlined,
  WifiOutlined,
} from "@ant-design/icons";

interface BusDetailModalProps {
  bus?: BusData | null;
  isVisible: boolean;
  onClose: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "green";
    case "under_maintenance":
      return "orange";
    case "out_of_service":
      return "red";
    default:
      return "default";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "active":
      return "Đang hoạt động";
    case "under_maintenance":
      return "Bảo trì";
    case "out_of_service":
      return "Ngưng hoạt động";
    default:
      return status;
  }
};

const BusDetailModal: React.FC<BusDetailModalProps> = ({
  bus,
  isVisible,
  onClose,
}) => {
  if (!bus) return null;

  return (
    <Modal
      title="Chi tiết xe khách"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="ID">{bus.id}</Descriptions.Item>
        <Descriptions.Item label="Biển số">
          {bus.licensePlate}
        </Descriptions.Item>
        <Descriptions.Item label="Mẫu xe">{bus.modelName}</Descriptions.Item>
        <Descriptions.Item label="Số ghế">{bus.totalSeats}</Descriptions.Item>
        <Descriptions.Item label="Nhà xe">{bus.operatorName}</Descriptions.Item>
        <Descriptions.Item label="Bố trí ghế">
          {bus.seatLayoutName}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={getStatusColor(bus.status)}>
            {getStatusText(bus.status)}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Tiện ích">
          {bus.amenities.wifi && (
            <Tag color="blue" style={{ border: "none", background: "none" }}>
              <WifiOutlined style={{ marginRight: 4 }} />
              WiFi
            </Tag>
          )}
          {bus.amenities.tv && (
            <Tag
              color="geekblue"
              style={{ border: "none", background: "none" }}
            >
              <VideoCameraOutlined style={{ marginRight: 4 }} />
              TV
            </Tag>
          )}
          {bus.amenities.toilet && (
            <Tag color="volcano" style={{ border: "none", background: "none" }}>
              <RestOutlined style={{ marginRight: 4 }} />
              Toilet
            </Tag>
          )}
          {bus.amenities.charging && (
            <Tag color="purple" style={{ border: "none", background: "none" }}>
              <ThunderboltOutlined style={{ marginRight: 4 }} />
              Sạc
            </Tag>
          )}
          {bus.amenities.air_conditioner && (
            <Tag color="cyan" style={{ border: "none", background: "none" }}>
              <DesktopOutlined style={{ marginRight: 4 }} />
              Điều hòa
            </Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Hình ảnh">
          {bus.images && bus.images.length > 0 ? (
            <Image.PreviewGroup>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "8px",
                }}
              >
                {bus.images.map((img) => (
                  <Image
                    key={img.id}
                    src={img.imageUrl}
                    width="100%"
                    height={100}
                    style={{ objectFit: "cover", borderRadius: 4 }}
                  />
                ))}
              </div>
            </Image.PreviewGroup>
          ) : (
            <span>Không có hình ảnh</span>
          )}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default BusDetailModal;
