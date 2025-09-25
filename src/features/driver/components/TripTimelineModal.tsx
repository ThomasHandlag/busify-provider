import React from "react";
import {
  Modal,
  Spin,
  Alert,
  Typography,
  Card,
  Row,
  Col,
  Tag,
  Divider,
} from "antd";
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useTripDetail } from "../hooks/useDriverData";
import type { TripDetail } from "../../../app/api/driver";
import RouteMap from "./RouteMap";

const { Title, Text } = Typography;

interface TripTimelineModalProps {
  visible: boolean;
  onCancel: () => void;
  tripId: number;
}

const TripTimelineModal: React.FC<TripTimelineModalProps> = ({
  visible,
  onCancel,
  tripId,
}) => {
  const { data: tripDetail, isLoading, error } = useTripDetail(tripId);

  const renderTimeline = (tripDetail: TripDetail) => {
    const { timeline } = tripDetail;
    const allLocations = [
      { ...timeline.startLocation, type: "start", order: 0 },
      ...timeline.stopLocations.map(loc => ({ ...loc, type: "stop" })),
      { ...timeline.endLocation, type: "end", order: 999 }
    ].sort((a, b) => a.order - b.order);

    return (
      <div className="mb-6">
        <Title level={4} className="mb-4 flex items-center gap-2">
          <EnvironmentOutlined />
          Trip Timeline
        </Title>
        
        <div className="relative">
          {/* Timeline container */}
          <div className="flex items-center justify-between mb-4">
            {allLocations.map((location, index) => (
              <React.Fragment key={location.id}>
                {/* Location point */}
                <div className="flex flex-col items-center text-center max-w-[200px]">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      location.type === "start"
                        ? "bg-green-500 bg-green-500"
                        : location.type === "end"
                        ? "bg-red-500 border-red-600"
                        : "bg-blue-500 border-blue-600"
                    }`}
                  />
                  <div className="mt-2">
                    <Text strong className="block text-sm">
                      {location.name}
                    </Text>
                    <Text type="secondary" className="text-xs">
                      {location.address}
                    </Text>
                    {location.type === "stop" && 'time_offset_from_start' in location && (
                      <Text type="secondary" className="text-xs block">
                        +{location.time_offset_from_start} phút
                      </Text>
                    )}
                  </div>
                </div>

                {/* Arrow between points */}
                {index < allLocations.length - 1 && (
                  <div className="flex-1 flex items-center justify-center">
                    <ArrowRightOutlined className="text-gray-400 mx-2" />
                    <div className="flex-1 h-0.5 bg-gray-300"></div>
                    <ArrowRightOutlined className="text-gray-400 mx-2" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Điểm xuất phát</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Điểm dừng</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>Điểm kết thúc</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTripInfo = (tripDetail: TripDetail) => (
    <Card size="small" className="mb-4">
      <Row gutter={16}>
        <Col span={6}>
          <Text type="secondary">Tuyến đường:</Text>
          <br />
          <Text strong>{tripDetail.routeName}</Text>
        </Col>
        <Col span={6}>
          <Text type="secondary">Thời gian dự kiến:</Text>
          <br />
          <div className="flex items-center gap-1">
            <ClockCircleOutlined />
            <Text strong>
              {tripDetail.route?.estimated_duration || "N/A"}
            </Text>
          </div>
        </Col>
        <Col span={6}>
          <Text type="secondary">Xe bus:</Text>
          <br />
          <Text strong>
            {tripDetail.bus?.name || "N/A"}
            <br />
            <Text type="secondary" className="text-xs">
              {tripDetail.bus?.license_plate || ""}
            </Text>
          </Text>
        </Col>
        <Col span={6}>
          <Text type="secondary">Trạng thái:</Text>
          <br />
          <Tag color={
            tripDetail.status === 'COMPLETED' ? 'green' :
            tripDetail.status === 'IN_PROGRESS' ? 'blue' :
            tripDetail.status === 'CANCELLED' ? 'red' : 'orange'
          }>
            {tripDetail.status || "N/A"}
          </Tag>
        </Col>
      </Row>
    </Card>
  );

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <EnvironmentOutlined />
          Chi tiết hành trình
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={900}
      footer={null}
      className="trip-timeline-modal"
    >
      {isLoading && (
        <div className="text-center py-8">
          <Spin size="large" />
          <div className="mt-2">Đang tải thông tin hành trình...</div>
        </div>
      )}

      {error && (
        <Alert
          message="Lỗi tải dữ liệu"
          description="Không thể tải thông tin hành trình. Vui lòng thử lại."
          type="error"
          showIcon
        />
      )}

      {tripDetail && !isLoading && (
        <div>
          {renderTripInfo(tripDetail)}
          {renderTimeline(tripDetail)}
          
          <Divider />
          
          {/* Route Map */}
          <div className="mb-4">
            <Title level={4} className="mb-4">
              Bản đồ tuyến đường
            </Title>
            <RouteMap tripDetail={tripDetail} />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default TripTimelineModal;