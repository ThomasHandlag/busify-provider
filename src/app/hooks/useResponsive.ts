import { useState, useEffect } from 'react';
import { Grid } from 'antd';

const { useBreakpoint } = Grid;

interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenSize: 'mobile' | 'tablet' | 'desktop';
}

export const useResponsive = (): ResponsiveState => {
  const screens = useBreakpoint();
  const [responsiveState, setResponsiveState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    screenSize: 'mobile',
  });

  useEffect(() => {
    const isMobile = !screens.lg;
    const isTablet = (screens.md ?? false) && !(screens.lg ?? false);
    const isDesktop = screens.lg ?? false;

    let screenSize: 'mobile' | 'tablet' | 'desktop' = 'mobile';
    if (isDesktop) {
      screenSize = 'desktop';
    } else if (isTablet) {
      screenSize = 'tablet';
    }

    setResponsiveState({
      isMobile,
      isTablet,
      isDesktop,
      screenSize,
    });
  }, [screens]);

  return responsiveState;
};

// Responsive layout configurations
export const getResponsiveConfig = (screenSize: 'mobile' | 'tablet' | 'desktop') => {
  const configs = {
    mobile: {
      siderWidth: 0,
      contentMargin: 12,
      contentPadding: 16,
      headerHeight: 64,
      showDrawer: true,
      collapsedWidth: 0,
    },
    tablet: {
      siderWidth: 240,
      contentMargin: 20,
      contentPadding: 24,
      headerHeight: 64,
      showDrawer: true,
      collapsedWidth: 80,
    },
    desktop: {
      siderWidth: 280,
      contentMargin: 24,
      contentPadding: 24,
      headerHeight: 0, // No header needed on desktop
      showDrawer: false,
      collapsedWidth: 80,
    },
  };

  return configs[screenSize];
};
