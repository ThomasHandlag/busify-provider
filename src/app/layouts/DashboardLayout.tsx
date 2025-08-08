import { useState } from "react";
import { Layout, Grid, Drawer } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router";
import { useResponsive, getResponsiveConfig } from "../hooks";
import Sidebar from "../../components/sidebar";
import DashboardHeader from "../../components/dashboard-header";

const { Content } = Layout;
const { useBreakpoint } = Grid;

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const { screenSize, isMobile, isDesktop } = useResponsive();
  const config = getResponsiveConfig(screenSize);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);

  // Get current selected key from location pathname
  const getSelectedKey = () => {
    const path = location.pathname;
    // Remove leading slash and use the first segment as the key
    const pathSegments = path.split('/').filter(Boolean);
    if (pathSegments.length === 0 || pathSegments[0] === 'dashboard') {
      return 'dashboard';
    }
    return pathSegments[0];
  };

  const selectedKey = getSelectedKey();

  // Get current page name for breadcrumb
  const getCurrentPageName = () => {
    const path = location.pathname;
    const pathSegments = path.split('/').filter(Boolean);
    if (pathSegments.length === 0 || pathSegments[0] === 'dashboard') {
      return 'Dashboard Overview';
    }
    // Convert route to readable name
    const routeMap: { [key: string]: string } = {
      'fleet': 'Fleet Management',
      'buses': 'Bus Inventory',
      'maintenance': 'Maintenance',
      'fuel': 'Fuel Management',
      'operations': 'Operations',
      'routes': 'Routes & Stops',
      'schedules': 'Schedules',
      'trips': 'Trip Management',
      'bookings': 'Booking System',
      'reservations': 'Reservations',
      'tickets': 'Ticket Management',
      'customers': 'Customer Management',
      'drivers': 'Driver Management',
      'analytics': 'Analytics & Reports',
      'finance': 'Financial Management',
      'settings': 'System Settings',
    };
    return routeMap[pathSegments[0]] || pathSegments[0];
  };

  const onSelectItem = (key: string) => {
    navigate(key);
    // Close mobile drawer after navigation
    if (!screens.lg) {
      setMobileDrawerVisible(false);
    }
  };

  const showMobileDrawer = () => {
    setMobileDrawerVisible(true);
  };

  const closeMobileDrawer = () => {
    setMobileDrawerVisible(false);
  };

  // For mobile and tablet screens (below lg breakpoint)
  if (!isDesktop) {
    return (
      <Layout className="responsive-layout">
        <DashboardHeader
          onMenuToggle={showMobileDrawer}
          showMenuButton={true}
          currentPage={getCurrentPageName()}
          userName="Admin"
          companyName="Busify Transport"
        />
        
        <Drawer
          title="Navigation"
          placement="left"
          onClose={closeMobileDrawer}
          open={mobileDrawerVisible}
          style={{ padding: 0 }}
          width={config.siderWidth || 300}
          styles={{
            header: {
              borderBottom: "1px solid #f0f0f0",
            }
          }}
        >
          <Sidebar onMenuSelect={onSelectItem} selectedKey={selectedKey} />
        </Drawer>
        
        <Content
          style={{
            margin: config.contentMargin,
            padding: config.contentPadding,
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            minHeight: `calc(100vh - ${config.headerHeight}px - ${config.contentMargin * 2}px)`,
          }}
          className={isMobile ? "mobile-content" : "tablet-content"}
        >
          <div className="page-transition">
            <Outlet />
          </div>
        </Content>
      </Layout>
    );
  }

  // For desktop screens (lg breakpoint and above)
  return (
    <Layout className="responsive-layout">
      <Sidebar onMenuSelect={onSelectItem} selectedKey={selectedKey} />
      <Layout>
        <DashboardHeader
          showMenuButton={false}
          currentPage={getCurrentPageName()}
          userName="Admin"
          companyName="Busify Transport"
        />
        <Content
          style={{
            margin: config.contentMargin,
            padding: config.contentPadding,
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            overflow: "auto",
            minHeight: `calc(100vh - ${config.contentMargin * 2}px - 80px)`, // Account for header height
          }}
        >
          <div className="page-transition">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
