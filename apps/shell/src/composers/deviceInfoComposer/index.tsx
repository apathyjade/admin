// useDeviceInfo.ts
import { useState, useEffect, useMemo } from 'react';

const DEFAULT_BREAKPOINTS = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

type Breakpoints = typeof DEFAULT_BREAKPOINTS;
type ScreenSize = keyof Breakpoints;

interface DeviceInfo {
  width: number;
  height: number;
  size: ScreenSize;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  isHighDPI: boolean;
  orientation: 'portrait' | 'landscape';
}

export function useDeviceInfo(customBreakpoints?: Partial<Breakpoints>): DeviceInfo {
  const breakpoints = useMemo(() => ({ ...DEFAULT_BREAKPOINTS, ...customBreakpoints }), [customBreakpoints]);

  const getDeviceInfo = (): DeviceInfo => {
    if (typeof window === 'undefined') {
      return {
        width: 0,
        height: 0,
        size: 'xs',
        screenWidth: 0,
        screenHeight: 0,
        pixelRatio: 1,
        isHighDPI: false,
        orientation: 'portrait',
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 尺寸分类（从大到小匹配）
    let currentSize: ScreenSize = 'xs';
    const sortedSizes = Object.entries(breakpoints)
      .sort((a, b) => b[1] - a[1]) as [ScreenSize, number][];
    for (const [size, minWidth] of sortedSizes) {
      if (width >= minWidth) {
        currentSize = size;
        break;
      }
    }

    const pixelRatio = window.devicePixelRatio || 1;
    const isHighDPI = pixelRatio >= 2;

    const screenWidth = screen.width;
    const screenHeight = screen.height;

    const orientation =
      width < height ? 'portrait' : 'landscape';

    return {
      width,
      height,
      size: currentSize,
      screenWidth,
      screenHeight,
      pixelRatio,
      isHighDPI,
      orientation,
    };
  };

  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(getDeviceInfo());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setDeviceInfo(getDeviceInfo());
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [breakpoints]);

  return deviceInfo;
}