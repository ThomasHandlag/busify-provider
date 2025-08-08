import React from 'react';
import { Layout, Typography, Button, Dropdown, Avatar, Badge, Space, Breadcrumb } from 'antd';
import {
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  CarOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

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
  currentPage = 'Dashboard',
  userName = 'Admin',
  companyName = 'Busify Transport'
}) => {
  
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile Settings',
    },
    {
      key: 'account',
      icon: <SettingOutlined />,
      label: 'Account Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  const notificationMenuItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div>
          <Text strong>New booking received</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>2 minutes ago</Text>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div>
          <Text strong>Bus maintenance reminder</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>1 hour ago</Text>
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div>
          <Text strong>Route schedule updated</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>3 hours ago</Text>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'all',
      label: 'View all notifications',
      style: { textAlign: 'center' },
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
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      {/* Left side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {showMenuButton && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={onMenuToggle}
            style={{ fontSize: '18px' }}
          />
        )}
        
        <div>
          <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
            {companyName}
          </Title>
          <Breadcrumb
            items={breadcrumbItems}
            style={{ fontSize: '12px', margin: 0 }}
          />
        </div>
      </div>

      {/* Right side */}
      <Space size="middle">
        {/* Quick Stats */}
        <Space size="large" style={{ marginRight: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
              Active Buses
            </Text>
            <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>
              24
            </Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
              Today's Trips
            </Text>
            <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
              156
            </Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
              Revenue
            </Text>
            <Text strong style={{ fontSize: '16px', color: '#fa8c16' }}>
              $2,340
            </Text>
          </div>
        </Space>

        {/* Notifications */}
        <Dropdown
          menu={{ items: notificationMenuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button
            type="text"
            icon={
              <Badge count={5} size="small">
                <BellOutlined style={{ fontSize: '18px' }} />
              </Badge>
            }
          />
        </Dropdown>

        {/* User Menu */}
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button type="text" style={{ padding: '4px 8px' }}>
            <Space>
              <Avatar size="small" icon={<UserOutlined />} />
              <Text strong>{userName}</Text>
            </Space>
          </Button>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default DashboardHeader;
