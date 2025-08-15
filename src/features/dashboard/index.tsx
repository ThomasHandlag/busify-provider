import React, { useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Table,
  Badge,
  Space,
  Typography,
  List,
  Avatar,
} from "antd";
import {
  CarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { getBusesByOperator } from "../../app/api/bus";
import { busStore, type BusData } from "../../stores/bus_store";
import { operatorStore } from "../../stores/operator_store";
import { weeklyReportStore } from "../../stores/report_store";
import { getWeeklyOperatorReport } from "../../app/api/report";
import { tripStore } from "../../stores/trip_store";

const { Title, Text } = Typography;

export interface WeeklyReportData {
  totalRevenue: number;
  totalTrips: number;
  totalBuses: number;
  totalPassengers: number;
}

const DashboardIndex: React.FC = () => {
  const busesData = busStore();
  const operatorData = operatorStore();
  const nextTripsData = tripStore();

  const weeklyData = weeklyReportStore();

  useEffect(() => {
      // Simulate an API call to fetch weekly data
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

  const maintenanceAlerts = [
    {
      id: 1,
      bus: "BUS-003",
      issue: "Engine maintenance due",
      priority: "high",
      time: "2 hours ago",
    },
    {
      id: 2,
      bus: "BUS-007",
      issue: "Tire replacement needed",
      priority: "medium",
      time: "5 hours ago",
    },
    {
      id: 3,
      bus: "BUS-012",
      issue: "Regular inspection due",
      priority: "low",
      time: "1 day ago",
    },
  ];

  const recentBookings = [
    {
      id: 1,
      customer: "John Doe",
      route: "Downtown - Airport",
      time: "10:30 AM",
      status: "confirmed",
    },
    {
      id: 2,
      customer: "Jane Smith",
      route: "Mall - University",
      time: "11:15 AM",
      status: "pending",
    },
    {
      id: 3,
      customer: "Mike Johnson",
      route: "Station - Hospital",
      time: "12:00 PM",
      status: "confirmed",
    },
  ];

  const nextTripsColumns = [
    {
      title: "Trip ID",
      dataIndex: "trip_id",
      key: "trip_id",
    },
    {
      title: "Bus Number",
      dataIndex: "busNumber",
      key: "busNumber",
    },
    {
      title: "Departure Time",
      dataIndex: "departureTime",
      key: "departureTime",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  const busStatusColumns = [
    {
      title: "License Plate",
      dataIndex: "licensePlate",
      key: "licensePlate",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color =
          status === "Active"
            ? "success"
            : status === "under_maintenance"
            ? "warning"
            : "default";
        return <Badge status={color} text={status} />;
      },
    },
    {
      title: "Occupancy",
      key: "occupancy",
      render: (_: unknown, record: BusData) => (
        <Space direction="vertical" size="small">
          <Text>
            {12}/{record.totalSeats}
          </Text>
          <Progress
            percent={Math.round((12 / record.totalSeats) * 100)}
            size="small"
            status={12 / record.totalSeats > 0.8 ? "exception" : "normal"}
          />
        </Space>
      ),
    },
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
            title="Real-time Fleet Status"
            extra={<Badge status="processing" text="Live Updates" />}
          >
            <Table
              columns={busStatusColumns}
              dataSource={busesData.buses}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Maintenance Alerts */}
        <Col xs={24} lg={8}>
          <Card
            title="Maintenance Alerts"
            extra={<Badge count={maintenanceAlerts.length} />}
            style={{ marginBottom: "16px" }}
          >
            <List
              itemLayout="horizontal"
              dataSource={maintenanceAlerts}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={<WarningOutlined />}
                        style={{
                          backgroundColor:
                            item.priority === "high"
                              ? "#ff4d4f"
                              : item.priority === "medium"
                              ? "#fa8c16"
                              : "#52c41a",
                        }}
                      />
                    }
                    title={<Text strong>{item.bus}</Text>}
                    description={
                      <div>
                        <div>{item.issue}</div>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          {item.time}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* Recent Bookings */}
          <Card
            title="Recent Bookings"
            extra={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
          >
            <List
              itemLayout="horizontal"
              dataSource={recentBookings}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={<Text strong>{item.customer}</Text>}
                    description={
                      <div>
                        <Space direction="vertical" size="small">
                          <div>
                            <EnvironmentOutlined /> {item.route}
                          </div>
                          <div>
                            <ClockCircleOutlined /> {item.time}
                            <Badge
                              status={
                                item.status === "confirmed"
                                  ? "success"
                                  : "processing"
                              }
                              text={item.status}
                              style={{ marginLeft: "8px" }}
                            />
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
                <Card
                  hoverable
                  size="small"
                  style={{ textAlign: "center", cursor: "pointer" }}
                  bodyStyle={{ padding: "16px" }}
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
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  size="small"
                  style={{ textAlign: "center", cursor: "pointer" }}
                  bodyStyle={{ padding: "16px" }}
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
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  size="small"
                  style={{ textAlign: "center", cursor: "pointer" }}
                  bodyStyle={{ padding: "16px" }}
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
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  size="small"
                  style={{ textAlign: "center", cursor: "pointer" }}
                  bodyStyle={{ padding: "16px" }}
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
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardIndex;
