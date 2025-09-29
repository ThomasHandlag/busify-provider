import { useEffect, useState } from "react";
import {
  getNextTripSeatStatusById,
  type NextTripSeatStatus,
} from "../../app/api/trip";
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
  Spin,
  Progress,
  Button,
  Modal,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CheckCircleFilled,
  EyeOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router";
import SeatViewDialog from "./SeatViewDialog";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Define seat status for display
interface DisplaySeat {
  id: number;
  seat_number: string;
  status: "available" | "booked" | "checked";
  row: number;
  column: number;
  floor: number;
}

const TripSeatDialog = () => {
  const param = useParams();
  const id = Number(param.id);
  const [tripSeatStatus, setTripSeatStatus] =
    useState<NextTripSeatStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getNextTripSeatStatusById(id).then((data) => {
      setTripSeatStatus(data);
      setLoading(false);
    });
  }, [id]);

  // Generate seats based on layout and status
  const generateSeatsFromLayout = (): DisplaySeat[] => {
    if (!tripSeatStatus?.busLayout) return [];

    const { busLayout, bookedSeatsCount, checkedSeatsCount } = tripSeatStatus;
    const generatedSeats: DisplaySeat[] = [];

    let bookedCount = 0;
    let checkedCount = 0;

    for (let floor = 1; floor <= busLayout.floors; floor++) {
      for (let row = 1; row <= busLayout.rows; row++) {
        for (let col = 0; col < busLayout.cols; col++) {
          const seatId =
            (floor - 1) * busLayout.rows * busLayout.cols +
            (row - 1) * busLayout.cols +
            col +
            1;
          const seatName = `${String.fromCharCode(65 + col)}.${row}.${floor}`;

          // Distribute seats based on counts (simple distribution for demo)
          let status: "available" | "booked" | "checked" = "available";

          if (bookedCount < bookedSeatsCount) {
            status = "booked";
            bookedCount++;
          } else if (checkedCount < checkedSeatsCount) {
            status = "checked";
            checkedCount++;
          }

          generatedSeats.push({
            id: seatId,
            seat_number: seatName,
            status,
            row: row - 1,
            column: col,
            floor,
          });
        }
      }
    }

    return generatedSeats;
  };

  const getSeatsByFloor = (floor: number, seats: DisplaySeat[]) => {
    return seats.filter((seat) => seat.floor === floor);
  };

  const getFloorName = (floor: number) => {
    if (!tripSeatStatus?.busLayout) return "";
    if (tripSeatStatus.busLayout.floors === 1) return "Single Floor";
    return floor === 1 ? "Lower Floor" : "Upper Floor";
  };

  const renderSeatGrid = (floorSeats: DisplaySeat[]) => {
    if (!tripSeatStatus?.busLayout) return null;

    const { busLayout } = tripSeatStatus;
    const seatRows: DisplaySeat[][] = [];

    for (let row = 0; row < busLayout.rows; row++) {
      seatRows.push(floorSeats.filter((seat) => seat.row === row));
    }

    return (
      <div style={{ padding: "16px" }}>
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <Space size="large">
            <Badge
              count={floorSeats.filter((s) => s.status === "available").length}
            >
              <Tag color="success" icon={<TeamOutlined />}>
                Available
              </Tag>
            </Badge>
            <Badge
              count={floorSeats.filter((s) => s.status === "booked").length}
            >
              <Tag color="processing" icon={<CalendarOutlined />}>
                Booked
              </Tag>
            </Badge>
            <Badge
              count={floorSeats.filter((s) => s.status === "checked").length}
            >
              <Tag color="warning" icon={<CheckCircleFilled />}>
                Checked In
              </Tag>
            </Badge>
          </Space>
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
                const isAvailable = seat.status === "available";
                const isBooked = seat.status === "booked";
                const isChecked = seat.status === "checked";

                // Using Ant Design default token colors
                let seatColor = "";
                let seatBgColor = "";
                let seatBorderColor = "";

                if (isChecked) {
                  // Warning colors for checked-in seats
                  seatColor = "#fff";
                  seatBgColor = "#faad14"; // Ant Design gold-6
                  seatBorderColor = "#d48806"; // Ant Design gold-7
                } else if (isBooked) {
                  // Processing colors for booked seats
                  seatColor = "#fff";
                  seatBgColor = "#1677ff"; // Ant Design blue-6
                  seatBorderColor = "#0958d9"; // Ant Design blue-7
                } else if (isAvailable) {
                  // Success colors for available seats
                  seatColor = "#52c41a"; // Ant Design green-6
                  seatBgColor = "#fff";
                  seatBorderColor = "#95de64"; // Ant Design green-4
                }

                return (
                  <Tooltip
                    key={seat.id}
                    title={`Seat ${seat.seat_number} - ${
                      seat.status.charAt(0).toUpperCase() + seat.status.slice(1)
                    }`}
                  >
                    <Button
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
                        transition: "all 0.3s",
                        boxShadow:
                          isBooked || isChecked
                            ? "0 2px 8px rgba(0, 0, 0, 0.15)"
                            : "none",
                      }}
                      onClick={() => {
                        if (!isAvailable) {
                          Modal.info({
                            title: `Seat ${seat.seat_number} Details`,
                            content: (
                              <SeatViewDialog
                                seat={seat.seat_number}
                                tripId={id}
                              />
                            ),
                            width: 400,
                          });
                        }
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
                          color: isAvailable ? "#595959" : "#fff",
                        }}
                      >
                        {seat.seat_number}
                      </div>

                      {isChecked && (
                        <CheckCircleFilled
                          style={{
                            position: "absolute",
                            top: -6,
                            right: -6,
                            color: "#faad14",
                            fontSize: 12,
                            backgroundColor: "#fff",
                            borderRadius: "50%",
                          }}
                        />
                      )}
                    </Button>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card style={{ textAlign: "center", padding: "40px" }}>
        <Spin size="large" />
        <div style={{ marginTop: "16px" }}>
          <Text>Loading trip seat status...</Text>
        </div>
      </Card>
    );
  }

  if (!tripSeatStatus) {
    return (
      <Card style={{ textAlign: "center", padding: "40px" }}>
        <Text type="secondary">No seat status data available</Text>
      </Card>
    );
  }

  const allSeats = generateSeatsFromLayout();
  const occupancyRate =
    ((tripSeatStatus.bookedSeatsCount + tripSeatStatus.checkedSeatsCount) /
      tripSeatStatus.busSeatsCount) *
    100;

  return (
    <Card
      title={
        <Space>
          <EyeOutlined />
          <span>Trip Seat Status</span>
        </Space>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">Real-time seat occupancy overview</Text>
      </div>

      {/* Overall Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small" style={{ textAlign: "center" }}>
            <Title level={4} style={{ margin: 0, color: "#52c41a" }}>
              {tripSeatStatus.busSeatsCount -
                tripSeatStatus.bookedSeatsCount -
                tripSeatStatus.checkedSeatsCount}
            </Title>
            <Text type="secondary">Available</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ textAlign: "center" }}>
            <Title level={4} style={{ margin: 0, color: "#1677ff" }}>
              {tripSeatStatus.bookedSeatsCount}
            </Title>
            <Text type="secondary">Booked</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ textAlign: "center" }}>
            <Title level={4} style={{ margin: 0, color: "#faad14" }}>
              {tripSeatStatus.checkedSeatsCount}
            </Title>
            <Text type="secondary">Checked In</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ textAlign: "center" }}>
            <Progress
              type="circle"
              size={60}
              percent={Math.round(occupancyRate)}
              format={() => `${Math.round(occupancyRate)}%`}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Occupancy</Text>
            </div>
          </Card>
        </Col>
      </Row>

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
              border: "2px solid #95de64", // Ant Design green-4
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
          <Text type="secondary">Booked</Text>
        </Space>
        <Space>
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: "#faad14", // Ant Design gold-6
              border: "2px solid #d48806", // Ant Design gold-7
              borderRadius: 2,
            }}
          ></div>
          <Text type="secondary">Checked In</Text>
        </Space>
      </div>

      {/* Floor Tabs */}
      {tripSeatStatus.busLayout && tripSeatStatus.busLayout.floors > 1 ? (
        <Tabs defaultActiveKey="1">
          {Array.from(
            { length: tripSeatStatus.busLayout.floors },
            (_, i) => i + 1
          ).map((floor) => (
            <TabPane tab={getFloorName(floor)} key={floor.toString()}>
              <Card style={{ padding: 0 }}>
                {renderSeatGrid(getSeatsByFloor(floor, allSeats))}
              </Card>
            </TabPane>
          ))}
        </Tabs>
      ) : (
        <Card style={{ padding: 0 }}>{renderSeatGrid(allSeats)}</Card>
      )}

      <Divider />

      {/* Summary */}
      <Row justify="space-between" align="middle">
        <Col>
          <Text>
            Total Seats: <strong>{tripSeatStatus.busSeatsCount}</strong>
          </Text>
        </Col>
        <Col>
          <div style={{ textAlign: "right" }}>
            <Title level={4} style={{ color: "#1677ff", margin: 0 }}>
              {Math.round(occupancyRate)}% Occupied
            </Title>
            <Text type="secondary">
              {tripSeatStatus.bookedSeatsCount +
                tripSeatStatus.checkedSeatsCount}{" "}
              of {tripSeatStatus.busSeatsCount} seats
            </Text>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default TripSeatDialog;
