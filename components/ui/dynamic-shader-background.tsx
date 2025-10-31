'use client';

import React, { useEffect, useState } from 'react';
import ShaderBackground from './shader-background';

interface ShaderColors {
  bgColor1: { r: number; g: number; b: number; a: number };
  bgColor2: { r: number; g: number; b: number; a: number };
  lineColor: { r: number; g: number; b: number; a: number };
}

const DynamicShaderBackground: React.FC = () => {
  const [colors, setColors] = useState<ShaderColors>({
    bgColor1: { r: 0.05, g: 0.05, b: 0.2, a: 1.0 },
    bgColor2: { r: 0.2, g: 0.05, b: 0.4, a: 1.0 },
    lineColor: { r: 0.5, g: 0.3, b: 0.9, a: 1.0 },
  });

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await fetch('/api/settings/shader-background');
        if (response.ok) {
          const data = await response.json();
          setColors(data);
        }
      } catch (error) {
        console.error('Failed to fetch shader background settings:', error);
      }
    };

    fetchColors();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchColors, 30000);
    return () => clearInterval(interval);
  }, []);

  return <ShaderBackground {...colors} />;
};

export default DynamicShaderBackground;
