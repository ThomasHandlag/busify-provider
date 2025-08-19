// src/components/Sidebar.tsx
import React, { useState } from "react";
import temp from "../assets/logo.png";
import {
  Layout,
  Menu,
  Grid,
  Typography,
  Badge,
  Avatar,
  Space,
  Image,
} from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  CarOutlined,
  BarChartOutlined,
  TeamOutlined,
  ScheduleOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../stores/auth_store";
import { operatorStore } from "../stores/operator_store";

const { Sider } = Layout;
const { useBreakpoint } = Grid;
const { Text } = Typography;

interface SidebarProps {
  onMenuSelect?: (key: string) => void;
  selectedKey?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onMenuSelect, selectedKey }) => {
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = (value: boolean) => {
    setCollapsed(value);
  };

  const operatorData = operatorStore();

  const { user } = useAuthStore();

  // Bus Enterprise Management Menu Items
  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard Overview",
    },
    {
      key: "fleet",
      icon: <CarOutlined />,
      label: "Fleet Management",
      children: [
        {
          key: "buses",
          icon: <CarOutlined />,
          label: "Bus Management",
        },
      ],
    },

    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "System Settings",
    },
  ];

  if (user?.role === "OPERATOR" || user?.role === "STAFF") {
    menuItems.push(
      {
        key: "customers",
        icon: <TeamOutlined />,
        label: "Customer Management",
      },
      {
        key: "analytics",
        icon: <BarChartOutlined />,
        label: "Analytics & Reports",
        children: [
          {
            key: "financial-reports",
            icon: <DollarOutlined />,
            label: "Financial Reports",
          },
          {
            key: "operational-reports",
            icon: <BarChartOutlined />,
            label: "Operational Reports",
          },
          {
            key: "performance",
            icon: <BarChartOutlined />,
            label: "Performance Metrics",
          },
        ],
      },
      {
        key: "finance",
        icon: <DollarOutlined />,
        label: "Financial Management",
        children: [
          {
            key: "revenue",
            icon: <DollarOutlined />,
            label: "Revenue Tracking",
          },
          {
            key: "expenses",
            icon: <FileTextOutlined />,
            label: "Expense Management",
          },
          {
            key: "payroll",
            icon: <UserOutlined />,
            label: "Payroll",
          },
        ],
      },
      {
        key: "drivers",
        icon: <UserOutlined />,
        label: "Driver Management",
      },
      {
        key: "bookings",
        icon: <FileTextOutlined />,
        label: "Booking System",
        children: [
          {
            key: "reservations",
            icon: <FileTextOutlined />,
            label: "Reservations",
          },
          {
            key: "tickets",
            icon: <SafetyCertificateOutlined />,
            label: "Ticket Management",
          },
        ],
      },
      {
        key: "operations",
        icon: <ScheduleOutlined />,
        label: "Operations",
        children: [
          {
            key: "routes",
            icon: <EnvironmentOutlined />,
            label: "Routes & Stops",
          },
          {
            key: "schedules",
            icon: <ClockCircleOutlined />,
            label: "Schedules",
          },
          {
            key: "trips",
            icon: <FileTextOutlined />,
            label: "Trip Management",
          },
        ],
      }
    );
  }

  return (
    <Sider
      collapsible={screens.lg}
      collapsed={collapsed}
      onCollapse={handleCollapse}
      breakpoint="lg"
      collapsedWidth={screens.xs ? 0 : 80}
      width={300}
      style={{
        height: "100vh",
        position: screens.lg ? "sticky" : "static",
        top: 0,
        left: 0,
        background: "#fff",
        borderRight: "1px solid #f0f0f0",
      }}
      trigger={
        screens.lg && (
          <div
            style={{
              position: "fixed",
              bottom: 0,
              width: collapsed ? "80px" : "300px",
              zIndex: 1000,
              // background: "#fff",
              // borderTop: "1px solid #f0f0f0",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {collapsed ? <RightOutlined /> : <LeftOutlined />}
          </div>
        )
      }
    >
      {/* Company Logo/Brand */}
      <div
        style={{
          height: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          borderBottom: "1px solid #f0f0f0",
          background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
        }}
      >
        {!collapsed ? (
          <div style={{ textAlign: "center", color: "#fff" }}>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "4px",
              }}
            >
              <Image src={temp} className="!w-10 !h-10" /> Busify
            </div>
            <Text style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)" }}>
              {operatorData.operator?.name}
            </Text>
          </div>
        ) : (
          <div style={{ fontSize: "24px" }}>
            <Avatar size={"small"} icon={temp} />
          </div>
        )}
      </div>

      {/* User Info Section */}
      {!collapsed && (
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid #f0f0f0",
            background: "#fafafa",
          }}
        >
          <Space>
            <Avatar size="small" icon={<UserOutlined />} />
            <div>
              <Text strong style={{ fontSize: "14px", display: "block" }}>
                {user?.email}
              </Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {user?.role}
              </Text>
            </div>
          </Space>
        </div>
      )}

      {/* Quick Stats */}
      {!collapsed && (
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #f0f0f0",
            background: "#f9f9f9",
          }}
        >
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text style={{ fontSize: "12px" }}>Active Buses</Text>
              <Badge count={24} style={{ backgroundColor: "#52c41a" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text style={{ fontSize: "12px" }}>Today's Revenue</Text>
              <Text strong style={{ fontSize: "12px", color: "#1890ff" }}>
                $2,340
              </Text>
            </div>
          </Space>
        </div>
      )}

      {/* Navigation Menu */}
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={selectedKey ? [selectedKey] : ["dashboard"]}
        onClick={(e) => onMenuSelect?.(e.key)}
        items={menuItems}
        style={{
          height: collapsed ? "calc(100vh - 120px)" : "calc(100vh - 240px)", // Điều chỉnh height
          border: "none",
          fontSize: "14px",
          paddingBottom: "48px", // Thêm padding bottom để tránh content bị che
          overflow: "auto",
        }}
      />
    </Sider>
  );
};

export default Sidebar;
