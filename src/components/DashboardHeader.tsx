import React from "react";
import {
  Layout,
  Typography,
  Button,
  Dropdown,
  Avatar,
  Badge,
  Space,
  Breadcrumb,
  Divider,
  Modal,
} from "antd";
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  CarOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useAuthStore } from "../stores/auth_store";
import { weeklyReportStore } from "../stores/report_store";
import { notificationStore } from "../stores/notification_store";

const { Header } = Layout;
const { Title, Text } = Typography;

interface DashboardHeaderProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
  currentPage?: string;
  userName?: string;
  companyName?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onMenuToggle,
  showMenuButton = false,
  currentPage = "Dashboard",
  companyName,
}) => {
  const { report } = weeklyReportStore();

  const { logOut, user } = useAuthStore();

  const userMenuItems: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
      onClick: () => logOut(),
    },
  ];

  const { notifications } = notificationStore();

  const notificationMenuItems: MenuProps["items"] = [
    ...notifications
      .filter((item) => !item.viewed)
      .map((notification) => ({
        key: notification.id,
        label: (
          <>
            <div
              onClick={() => {
                const item = notification;
                item.viewed = true;
                notificationStore.getState().push(item);
              }}
            >
              <Text strong>{notification.message}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {notification.timestamp}
              </Text>
            </div>
            <Divider />,
          </>
        ),
      })),

    {
      key: "all",
      label: "View all notifications",
      style: { textAlign: "center" },
      onClick: () => {
        Modal.info({
          title: "All Notifications",
          content: (
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {notifications.length === 0 && <Text>No notifications</Text>}
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  style={{
                    marginBottom: "12px",
                    cursor: "pointer",
                    backgroundColor: notification.viewed
                      ? "#f5f5f5"
                      : "#e6f7ff",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                  onClick={() => {
                    const item = notification;
                    item.viewed = true;
                    notificationStore.getState().push(item);
                  }}
                >
                  <Text strong>{notification.message}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {notification.timestamp}
                  </Text>
                </div>
              ))}
            </div>
          ),
          onOk() {},
        });
      },
    },
  ];

  const breadcrumbItems = [
    {
      title: (
        <Space>
          <CarOutlined />
          {companyName}
        </Space>
      ),
    },
    {
      title: currentPage,
    },
  ];

  return (
    <Header
      style={{
        background: "#fff",
        borderBottom: "1px solid #f0f0f0",
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        height: 80,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* Left side */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {showMenuButton && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={onMenuToggle}
            style={{ fontSize: "18px" }}
          />
        )}

        <div>
          <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
            {companyName}
          </Title>
          <Breadcrumb
            items={breadcrumbItems}
            style={{ fontSize: "12px", margin: 0 }}
          />
        </div>
      </div>

      {/* Right side */}
      <Space size="middle">
        {/* Quick Stats */}
        <Space size="large" style={{ marginRight: "16px" }}>
          <div style={{ textAlign: "center" }}>
            <Text
              type="secondary"
              style={{ fontSize: "12px", display: "block" }}
            >
              Active Buses
            </Text>
            <Text strong style={{ fontSize: "16px", color: "#52c41a" }}>
              {report?.totalBuses}
            </Text>
          </div>
          <div style={{ textAlign: "center" }}>
            <Text
              type="secondary"
              style={{ fontSize: "12px", display: "block" }}
            >
              Total Trips
            </Text>
            <Text strong style={{ fontSize: "16px", color: "#1890ff" }}>
              {report?.totalTrips}
            </Text>
          </div>
          <div style={{ textAlign: "center" }}>
            <Text
              type="secondary"
              style={{ fontSize: "12px", display: "block" }}
            >
              Revenue
            </Text>
            <Text strong style={{ fontSize: "16px", color: "#fa8c16" }}>
              {report?.totalRevenue} VND
            </Text>
          </div>
        </Space>

        {/* Notifications */}
        <Dropdown
          menu={{ items: notificationMenuItems }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Button
            type="text"
            icon={
              <Badge
                count={notifications.filter((item) => !item.viewed).length}
                size="small"
              >
                <BellOutlined style={{ fontSize: "18px" }} />
              </Badge>
            }
          />
        </Dropdown>

        {/* User Menu */}
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Button type="text" style={{ padding: "4px 8px" }}>
            <Space>
              <Avatar size="small" icon={<UserOutlined />} />
              <Text strong>{user?.email}</Text>
            </Space>
          </Button>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default DashboardHeader;
