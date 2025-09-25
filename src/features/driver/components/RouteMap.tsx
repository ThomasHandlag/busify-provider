import React from "react";
import { Card, Alert } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import type { TripDetail } from "../../../app/api/driver";

interface RouteMapProps {
  tripDetail: TripDetail;
}

const RouteMap: React.FC<RouteMapProps> = ({ tripDetail }) => {
  const { timeline } = tripDetail;

  // Check if we have coordinate data
  const hasCoordinates =
    timeline.startLocation.lat && timeline.startLocation.lng;

  if (!hasCoordinates) {
    return (
      <Card>
        <Alert
          message="Dữ liệu bản đồ không khả dụng"
          description="Không có thông tin tọa độ để hiển thị bản đồ cho tuyến đường này."
          type="info"
          showIcon
        />
      </Card>
    );
  }

  // For now, create a simple text-based route representation
  // In a real application, you would integrate with Google Maps, Mapbox, etc.
  const renderSimpleMap = () => {
    const allLocations = [
      { ...timeline.startLocation, type: "start", order: 0 },
      ...timeline.stopLocations.map((loc) => ({ ...loc, type: "stop" })),
      { ...timeline.endLocation, type: "end", order: 999 },
    ].sort((a, b) => a.order - b.order);

    return (
      <div className="bg-gray-50 p-6 rounded-lg min-h-[300px]">
        <div className="text-center mb-4">
          <EnvironmentOutlined className="text-2xl text-blue-500 mb-2" />
          <div className="text-lg font-semibold">Sơ đồ tuyến đường</div>
        </div>

        <div className="space-y-4">
          {allLocations.map((location, index) => (
            <div key={location.id} className="flex items-center">
              <div className="flex items-center min-w-[80px]">
                <div
                  className={`w-4 h-4 rounded-full ${
                    location.type === "start"
                      ? "bg-green-500"
                      : location.type === "end"
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
                />
                <div className="text-xs ml-2 text-gray-500">
                  {location.type === "start"
                    ? "Xuất phát"
                    : location.type === "end"
                    ? "Kết thúc"
                    : `Dừng ${index}`}
                </div>
              </div>

              <div className="ml-4 flex-1">
                <div className="font-medium">{location.name}</div>
                <div className="text-sm text-gray-600">{location.address}</div>
                {location.city && (
                  <div className="text-xs text-blue-600">
                    📍 {location.city}
                  </div>
                )}
                {"time_offset_from_start" in location &&
                  location.time_offset_from_start > 0 && (
                    <div className="text-xs text-orange-600">
                      ⏱️ +{location.time_offset_from_start} phút
                    </div>
                  )}
                {location.lat && location.lng && (
                  <div className="text-xs text-gray-400">
                    📍 {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </div>
                )}
              </div>

              {index < allLocations.length - 1 && (
                <div className="w-px h-8 bg-gray-300 ml-2"></div>
              )}
            </div>
          ))}
        </div>

        {/* Placeholder for future map integration */}
        <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
          <div className="text-sm">
            🗺️ Bản đồ tương tác sẽ được hiển thị tại đây
          </div>
          <div className="text-xs mt-1">
            (Tích hợp Google Maps hoặc Mapbox trong tương lai)
          </div>
        </div>
      </div>
    );
  };

  return <Card>{renderSimpleMap()}</Card>;
};

export default RouteMap;
