import { useState } from "react";
import {
  Card,
  Badge,
  Tabs,
  Typography,
  Space,
  Divider,
  Row,
  Col,
  Tag,
  Tooltip,
} from "antd";
import {
  CheckCircleFilled,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Define types
export interface Seat {
  id: number;
  seat_number: string;
  status: "available" | "booked" | "locked";
  price: number;
  row: number;
  column: number;
  floor: number;
}

export interface BusLayout {
  floors: number;
  rows: number;
  cols: number;
}

interface SeatSelectCardProps {
  tripId: string;
  seats: Seat[];
  layout: BusLayout | null;
  pricePerSeat: number;
  onSeatSelection?: (selectedSeats: string[], totalPrice: number) => void;
}

const SeatSelectCard: React.FC<SeatSelectCardProps> = ({
  seats,
  layout,
  pricePerSeat,
  onSeatSelection,
}) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Generate seats based on layout
  const generateSeatsFromLayout = () => {
    const generatedSeats: Seat[] = [];

    // Return the provided seats if layout is null
    if (!layout) {
      return seats;
    }

    for (let floor = 1; floor <= layout.floors; floor++) {
      for (let row = 1; row <= layout.rows; row++) {
        for (let col = 0; col < layout.cols; col++) {
          const seatId =
            (floor - 1) * layout.rows * layout.cols +
            (row - 1) * layout.cols +
            col +
            1;
          const seatName = `${String.fromCharCode(65 + col)}.${row}.${floor}`;

          // Find status from trip seats data if available
          const seatStatus =
            seats?.find((s) => s.seat_number === seatName)?.status ||
            "available";

          generatedSeats.push({
            id: seatId,
            seat_number: seatName,
            status: seatStatus,
            price: pricePerSeat,
            row: row - 1,
            column: col,
            floor,
          });
        }
      }
    }

    return generatedSeats;
  };

  const allSeats = generateSeatsFromLayout();

  const handleSeatClick = (seatNumber: string, seatStatus: string) => {
    if (seatStatus === "booked" || seatStatus === "locked") return;

    setSelectedSeats((prev) => {
      const newSelection = prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber];

      const totalPrice = newSelection.length * pricePerSeat;
      onSeatSelection?.(newSelection, totalPrice);
      return newSelection;
    });
  };

  const getSeatsByFloor = (floor: number) => {
    return allSeats.filter((seat) => seat.floor === floor);
  };

  const getFloorName = (floor: number) => {
    if (layout?.floors === 1) return "Single Floor";
    return floor === 1 ? "Lower Floor" : "Upper Floor";
  };

  const renderSeatGrid = (floorSeats: Seat[]) => {
    if (!layout) return null;

    const seatRows: Seat[][] = [];
    for (let row = 0; row < layout.rows; row++) {
      seatRows.push(floorSeats.filter((seat) => seat.row === row));
    }

    return (
      <div style={{ padding: "16px" }}>
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <Badge
            count={floorSeats.filter((s) => s.status === "available").length}
          >
            <Tag color="success" icon={<TeamOutlined />}>
              Available Seats
            </Tag>
          </Badge>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {seatRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              style={{ display: "flex", justifyContent: "center", gap: "8px" }}
            >
              {row.map((seat) => {
                const isSelected = selectedSeats.includes(seat.seat_number);
                const isBooked = seat.status === "booked";
                const isAvailable = seat.status === "available";
                const isLocked = seat.status === "locked";

                // Using Ant Design default token colors
                let seatColor = "";
                let seatBgColor = "";
                let seatBorderColor = "";

                if (isSelected) {
                  // Primary color for selected seats
                  seatColor = "#fff";
                  seatBgColor = "#1677ff"; // Ant Design blue-6
                  seatBorderColor = "#0958d9"; // Ant Design blue-7
                } else if (isBooked) {
                  // Gray colors for booked seats
                  seatColor = "#8c8c8c"; // Ant Design gray-6
                  seatBgColor = "#f5f5f5"; // Ant Design gray-3
                  seatBorderColor = "#d9d9d9"; // Ant Design gray-4
                } else if (isLocked) {
                  // Warning colors for locked seats
                  seatColor = "#faad14"; // Ant Design gold-6
                  seatBgColor = "#fff1b8"; // Ant Design gold-1
                  seatBorderColor = "#ffd666"; // Ant Design gold-4
                } else if (isAvailable) {
                  // Success colors for available seats
                  seatColor = "#1677ff"; // Ant Design blue-6
                  seatBgColor = "#fff";
                  seatBorderColor = "#91caff"; // Ant Design blue-3
                }

                return (
                  <Tooltip key={seat.id} title={`Seat ${seat.seat_number}`}>
                    <div
                      onClick={() =>
                        handleSeatClick(seat.seat_number, seat.status)
                      }
                      style={{
                        position: "relative",
                        width: "40px",
                        height: "40px",
                        backgroundColor: seatBgColor,
                        border: `2px solid ${seatBorderColor}`,
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor:
                          isBooked || isLocked ? "not-allowed" : "pointer",
                        transition: "all 0.3s",
                        transform: isSelected ? "scale(1.05)" : "scale(1)",
                        boxShadow: isSelected
                          ? "0 2px 8px rgba(0, 0, 0, 0.15)"
                          : "none",
                      }}
                    >
                      <UserOutlined
                        style={{ color: seatColor, fontSize: 16 }}
                      />

                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          fontSize: "10px",
                          fontWeight: "bold",
                          color: "#595959",
                        }}
                      >
                        {seat.seat_number}
                      </div>

                      {isSelected && (
                        <CheckCircleFilled
                          style={{
                            position: "absolute",
                            top: -6,
                            right: -6,
                            color: "#1677ff", // Ant Design blue-6
                            fontSize: 12,
                            backgroundColor: "#fff",
                            borderRadius: "50%",
                          }}
                        />
                      )}
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const totalPrice = selectedSeats.length * pricePerSeat;

  return (
    <Card
      title={
        <Space>
          <UserOutlined />
          <span>Select Seats</span>
        </Space>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">Choose appropriate seats for your trip</Text>
      </div>

      {/* Seat Legend */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 24,
          marginBottom: 24,
        }}
      >
        <Space>
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: "#fff",
              border: "2px solid #91caff", // Ant Design blue-3
              borderRadius: 2,
            }}
          ></div>
          <Text type="secondary">Available</Text>
        </Space>
        <Space>
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: "#1677ff", // Ant Design blue-6
              border: "2px solid #0958d9", // Ant Design blue-7
              borderRadius: 2,
            }}
          ></div>
          <Text type="secondary">Selected</Text>
        </Space>
        <Space>
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: "#fff1b8", // Ant Design gold-1
              border: "2px solid #ffd666", // Ant Design gold-4
              borderRadius: 2,
            }}
          ></div>
          <Text type="secondary">Locked</Text>
        </Space>
        <Space>
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: "#f5f5f5", // Ant Design gray-3
              border: "2px solid #d9d9d9", // Ant Design gray-4
              borderRadius: 2,
            }}
          ></div>
          <Text type="secondary">Booked</Text>
        </Space>
      </div>

      {/* Floor Tabs */}
      {layout && layout.floors > 1 ? (
        <Tabs defaultActiveKey="1">
          {Array.from({ length: layout.floors }, (_, i) => i + 1).map(
            (floor) => (
              <TabPane tab={getFloorName(floor)} key={floor.toString()}>
                <Card style={{ padding: 0 }}>
                  {renderSeatGrid(getSeatsByFloor(floor))}
                </Card>
              </TabPane>
            )
          )}
        </Tabs>
      ) : (
        <Card style={{ padding: 0 }}>{renderSeatGrid(allSeats)}</Card>
      )}

      <Divider />

      {/* Selection Summary */}
      <Row justify="space-between" align="middle">
        <Col>
          {selectedSeats.length > 0 ? (
            <Text>Selected: {selectedSeats.join(", ")}</Text>
          ) : (
            <Text type="secondary">No seats selected</Text>
          )}
        </Col>
        <Col>
          <div style={{ textAlign: "right" }}>
            <Title level={4} style={{ color: "#1677ff", margin: 0 }}>
              {totalPrice?.toLocaleString("vi-VN") ?? "0"} đ
            </Title>
            <Text type="secondary">
              {selectedSeats.length} seats ×{" "}
              {pricePerSeat?.toLocaleString("vi-VN") ?? "0"} đ
            </Text>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default SeatSelectCard;
