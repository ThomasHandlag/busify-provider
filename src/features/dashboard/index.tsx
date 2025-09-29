import { useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Badge,
  Space,
  Typography,
  List,
  Avatar,
  Button,
  type TableProps,
} from "antd";
import {
  CarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  EnvironmentOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { getBusesByOperator } from "../../app/api/bus";
import { busStore } from "../../stores/bus_store";
import { operatorStore } from "../../stores/operator_store";
import { weeklyReportStore } from "../../stores/report_store";
import { getWeeklyOperatorReport } from "../../app/api/report";
import { tripStore } from "../../stores/trip_store";
import { getNextTripsOfOperator, type NextTrip } from "../../app/api/trip";
import { notificationStore } from "../../stores/notification_store";
import { Link, useNavigate } from "react-router";

const { Title, Text } = Typography;

const toLocalTime = (date: string) => {
  return new Date(date).toLocaleString();
};

export interface WeeklyReportData {
  totalRevenue: number;
  totalTrips: number;
  totalBuses: number;
  totalPassengers: number;
}

const DashboardIndex = () => {
  const busesData = busStore();
  const operatorData = operatorStore();
  const nextTripsData = tripStore();

  const weeklyData = weeklyReportStore();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWeeklyData = async () => {
      if (!operatorData.operator) {
        return;
      }
      const response = await getWeeklyOperatorReport(operatorData.operator?.id);
      weeklyData?.setReport(response);
    };

    fetchWeeklyData();
  }, [operatorData]);

  useEffect(() => {
    // Fetch bus data from API or other sources
    const fetchBusData = async () => {
      if (!operatorData.operator) {
        return;
      } // Replace with actual operator ID
      const data = await getBusesByOperator(operatorData?.operator?.id);
      busesData.setBuses(data);
    };

    fetchBusData();
  }, [operatorData]);

  useEffect(() => {
    // Fetch next trips data from API or other sources
    const fetchNextTripsData = async () => {
      if (!operatorData.operator) {
        return;
      }
      const data = await getNextTripsOfOperator(operatorData?.operator?.id);
      nextTripsData.setNextTrips(data);
    };

    fetchNextTripsData();
  }, [operatorData]);

  const notifications = notificationStore();

  const nextTripsColumns: TableProps<NextTrip>["columns"] = [
    {
      title: "License Plate",
      dataIndex: "license_plate",
      key: "license_plate",
    },
    {
      title: "Departure Time",
      dataIndex: "departure_time",
      key: "departure_time",
      render: (text: string) => toLocalTime(text),
    },
    {
      title: " Arrival Time",
      dataIndex: "arrival_time",
      key: "arrival_time",
      render: (text: string) => toLocalTime(text),
    },
    {
      title: "Trip Duration/Minutes",
      dataIndex: "duration_minutes",
      key: "duration_minutes",
    },
    {
      title: "Available Seats",
      dataIndex: "available_seats",
      key: "available_seats",
      render: (value: number) => <Text strong>{value}</Text>,
    },
    {
      "title" : "Action",
      key: "action",
      render: (_, record) => {
        const { trip_id } = record;
        return <Button type="link" onClick={() => {
          navigate(`/dashboard/trips-seat-status/${trip_id}`);
        }}>View Details</Button>;
      }
    }
  ];

  return (
    <div style={{ padding: "0" }}>
      <div style={{ marginBottom: "24px" }}>
        <Title level={2}>Bus Enterprise Dashboard</Title>
        <Text type="secondary">
          Welcome back! Here's what's happening with your bus fleet today.
        </Text>
      </div>

      {/* Key Performance Indicators */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="This Week Revenue"
              value={weeklyData?.report?.totalRevenue}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
              suffix="VND"
            />
            <div style={{ marginTop: "8px" }}>
              <Text type="secondary">+12.5% from last week</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Trips"
              value={weeklyData?.report?.totalTrips}
              valueStyle={{ color: "#1890ff" }}
              prefix={<ClockCircleOutlined />}
            />
            <div style={{ marginTop: "8px" }}>
              <Text type="secondary">+8.3% from last week</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Buses"
              value={weeklyData?.report?.totalBuses}
              valueStyle={{ color: "#52c41a" }}
              prefix={<CarOutlined />}
            />
            <div style={{ marginTop: "8px" }}>
              <Text type="secondary">2 in maintenance</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Passengers"
              value={weeklyData?.report?.totalPassengers}
              valueStyle={{ color: "#722ed1" }}
              prefix={<UserOutlined />}
            />
            <div style={{ marginTop: "8px" }}>
              <Text type="secondary">+15.2% from last week</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Fleet Status */}
        <Col xs={24} lg={16}>
          <Card
            title="Up coming Trips"
            extra={<Badge status="processing" text="Live Updates" />}
          >
            <Table
              columns={nextTripsColumns}
              dataSource={nextTripsData.nextTrips}
              pagination={false}
              loading={nextTripsData.loading}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title="Recent Notifications"
            extra={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
          >
            <List
              itemLayout="horizontal"
              dataSource={notifications.notifications.slice(-5).reverse()}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={<Text strong>{item.title}</Text>}
                    description={
                      <div>
                        <Space direction="vertical" size="small">
                          <div>
                            <NotificationOutlined /> {item.message}
                          </div>
                        </Space>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col span={24}>
          <Card title="Quick Actions">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Link to="/dashboard/buses">
                  <Card
                    hoverable
                    size="small"
                    style={{
                      textAlign: "center",
                      cursor: "pointer",
                      padding: "16px",
                    }}
                  >
                    <CarOutlined
                      style={{
                        fontSize: "24px",
                        color: "#1890ff",
                        marginBottom: "8px",
                      }}
                    />
                    <div>Add New Bus</div>
                  </Card>
                </Link>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Link to="/dashboard/routes">
                  <Card
                    hoverable
                    size="small"
                    style={{
                      textAlign: "center",
                      cursor: "pointer",
                      padding: "16px",
                    }}
                  >
                    <EnvironmentOutlined
                      style={{
                        fontSize: "24px",
                        color: "#52c41a",
                        marginBottom: "8px",
                      }}
                    />
                    <div>Create Route</div>
                  </Card>
                </Link>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Link to="/dashboard/trips">
                  <Card
                    hoverable
                    size="small"
                    style={{
                      textAlign: "center",
                      cursor: "pointer",
                      padding: "16px",
                    }}
                  >
                    <ClockCircleOutlined
                      style={{
                        fontSize: "24px",
                        color: "#fa8c16",
                        marginBottom: "8px",
                      }}
                    />
                    <div>Schedule Trip</div>
                  </Card>
                </Link>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Link to="/dashboard/reports">
                  <Card
                    hoverable
                    size="small"
                    style={{
                      textAlign: "center",
                      cursor: "pointer",
                      padding: "16px",
                    }}
                  >
                    <TrophyOutlined
                      style={{
                        fontSize: "24px",
                        color: "#722ed1",
                        marginBottom: "8px",
                      }}
                    />
                    <div>View Reports</div>
                  </Card>
                </Link>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardIndex;
