import React from "react";
import { Card, Button, Tag, Divider } from "antd";
import {
  EditOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  StarOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import type { Trip } from "../../../app/api/driver";

interface TripCardProps {
  trip: Trip;
  onViewPassengers: (trip: Trip) => void;
  onEditStatus: (trip: Trip) => void;
}

const TripCard: React.FC<TripCardProps> = ({
  trip,
  onViewPassengers,
  onEditStatus,
}) => {
  return (
    <Card
      key={trip.trip_id}
      className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 overflow-hidden"
      bodyStyle={{ padding: 0 }}
    >
      {/* Header với gradient background */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold truncate">{trip.operator_name}</h3>
          <Tag
            color={trip.status === "active" ? "green" : "orange"}
            className="border-0"
          >
            {trip.status || "N/A"}
          </Tag>
        </div>
        <p className="text-sm opacity-90 mt-1">ID: {trip.trip_id}</p>
      </div>

      {/* Content chính */}
      <div className="p-4">
        {/* Route */}
        <div className="flex items-center mb-3">
          <EnvironmentOutlined className="text-blue-500 mr-2" />
          <span className="text-sm">
            <strong>{trip.route.start_location}</strong> →{" "}
            <strong>{trip.route.end_location}</strong>
          </span>
        </div>

        {/* Thời gian */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center">
            <ClockCircleOutlined className="text-green-500 mr-2" />
            <span className="text-xs">
              Khởi hành: {new Date(trip.departure_time).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center">
            <ClockCircleOutlined className="text-red-500 mr-2" />
            <span className="text-xs">
              Đến: {new Date(trip.arrival_time).toLocaleString()}
            </span>
          </div>
        </div>

        <Divider className="my-3" />

        {/* Thông tin chi tiết */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          <div className="flex items-center">
            <DollarOutlined className="text-yellow-500 mr-1" />
            <span>{trip.price_per_seat.toLocaleString()}đ</span>
          </div>
          <div className="flex items-center">
            <TeamOutlined className="text-purple-500 mr-1" />
            <span>
              {trip.available_seats}/{trip.total_seats}
            </span>
          </div>
          <div className="flex items-center">
            <StarOutlined className="text-orange-500 mr-1" />
            <span>{trip.average_rating?.toFixed(1) || "N/A"}</span>
          </div>
          <div className="flex items-center">
            <WifiOutlined className="text-blue-500 mr-1" />
            <span>{trip.amenities.wifi ? "Có" : "Không"}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            type="primary"
            size="small"
            icon={<TeamOutlined />}
            onClick={() => onViewPassengers(trip)}
            className="flex-1"
          >
            Xem khách
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEditStatus(trip)}
            className="flex-1"
          >
            Sửa TT
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TripCard;
