'use client';

import React, { useEffect, useState } from 'react';
import ShaderBackground from './shader-background';

interface ShaderColors {
  bgColor1: { r: number; g: number; b: number; a: number };
  bgColor2: { r: number; g: number; b: number; a: number };
  lineColor: { r: number; g: number; b: number; a: number };
}

interface Theme {
  _id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

// Convert hex to RGB (0-1 range for shader)
const hexToRgba = (hex: string): { r: number; g: number; b: number; a: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
        a: 1.0,
      }
    : { r: 0, g: 0, b: 0, a: 1 };
};

// Darken a color (for background gradients)
const darkenColor = (color: { r: number; g: number; b: number; a: number }, amount: number) => {
  return {
    r: Math.max(0, color.r * (1 - amount)),
    g: Math.max(0, color.g * (1 - amount)),
    b: Math.max(0, color.b * (1 - amount)),
    a: color.a,
  };
};

// Lighten a color
const lightenColor = (color: { r: number; g: number; b: number; a: number }, amount: number) => {
  return {
    r: Math.min(1, color.r + (1 - color.r) * amount),
    g: Math.min(1, color.g + (1 - color.g) * amount),
    b: Math.min(1, color.b + (1 - color.b) * amount),
    a: color.a,
  };
};

// Increase saturation
const saturateColor = (color: { r: number; g: number; b: number; a: number }, amount: number) => {
  const max = Math.max(color.r, color.g, color.b);
  const min = Math.min(color.r, color.g, color.b);
  const delta = max - min;
  
  if (delta === 0) return color; // Gray color, can't saturate
  
  return {
    r: color.r + (color.r - min) * amount,
    g: color.g + (color.g - min) * amount,
    b: color.b + (color.b - min) * amount,
    a: color.a,
  };
};

// Generate shader colors based on theme
const generateShaderColorsFromTheme = (theme: Theme): ShaderColors => {
  const primary = hexToRgba(theme.colors.primary);
  const secondary = hexToRgba(theme.colors.secondary);
  const accent = hexToRgba(theme.colors.accent);
  const background = hexToRgba(theme.colors.background);

  // Calculate if theme is dark or light
  const bgBrightness = (background.r + background.g + background.b) / 3;
  const isDark = bgBrightness < 0.5;

  let bgColor1, bgColor2, lineColor;

  if (isDark) {
    // Dark theme: Use darker versions of primary/secondary for background
    bgColor1 = darkenColor(primary, 0.3);
    bgColor2 = darkenColor(secondary, 0.2);
    // Bright accent for lines
    lineColor = saturateColor(lightenColor(accent, 0.2), 0.3);
  } else {
    // Light theme: Use very light versions for background
    bgColor1 = lightenColor(primary, 0.7);
    bgColor2 = lightenColor(secondary, 0.6);
    // Darker, saturated accent for lines
    lineColor = saturateColor(darkenColor(accent, 0.2), 0.4);
  }

  return { bgColor1, bgColor2, lineColor };
};

interface ShaderConfig extends ShaderColors {
  intensity?: number;
}

// Predefined color schemes for each theme with perfect color engineering
const themeShaderColors: Record<string, ShaderConfig> = {
  // Modern Minimal - Subtle blue-grays with soft accents
  theme_modern_minimal: {
    bgColor1: { r: 0.96, g: 0.96, b: 0.96, a: 1.0 }, // Very light gray
    bgColor2: { r: 0.92, g: 0.93, b: 0.95, a: 1.0 }, // Light blue-gray
    lineColor: { r: 0.44, g: 0.47, b: 0.63, a: 1.0 }, // Muted blue (#7077A1)
    intensity: 0.6, // Subtle for minimalist aesthetic
  },

  // Tech Noir - Dark cyberpunk with neon cyan
  theme_tech_noir: {
    bgColor1: { r: 0.04, g: 0.10, b: 0.18, a: 1.0 }, // Deep navy (#0A192F)
    bgColor2: { r: 0.07, g: 0.13, b: 0.25, a: 1.0 }, // Slightly lighter navy
    lineColor: { r: 0.39, g: 1.0, b: 0.85, a: 1.0 }, // Bright cyan (#64FFDA)
    intensity: 1.2, // Extra bright for cyberpunk glow
  },

  // Gradient Pop - Vibrant purples and pinks
  theme_gradient_pop: {
    bgColor1: { r: 0.98, g: 0.97, b: 0.99, a: 1.0 }, // Almost white
    bgColor2: { r: 0.94, g: 0.92, b: 0.97, a: 1.0 }, // Light purple tint
    lineColor: { r: 0.66, g: 0.40, b: 0.93, a: 1.0 }, // Vivid purple (#A855F7)
    intensity: 1.0, // Full brightness for vibrant look
  },

  // Retro Wave - 80s neon with hot pink and cyan
  theme_retro_wave: {
    bgColor1: { r: 0.17, g: 0.18, b: 0.26, a: 1.0 }, // Dark blue-gray (#2B2D42)
    bgColor2: { r: 0.15, g: 0.16, b: 0.20, a: 1.0 }, // Darker gray
    lineColor: { r: 1.0, g: 0.18, b: 0.39, a: 1.0 }, // Hot pink (#FF2E63)
    intensity: 1.3, // Super bright for retro neon effect
  },
};

const ThemeAwareShaderBackground: React.FC = () => {
  const [config, setConfig] = useState<ShaderConfig>({
    bgColor1: { r: 0.05, g: 0.05, b: 0.2, a: 1.0 },
    bgColor2: { r: 0.2, g: 0.05, b: 0.4, a: 1.0 },
    lineColor: { r: 0.5, g: 0.3, b: 0.9, a: 1.0 },
    intensity: 1.0,
  });
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const [useAdminColors, setUseAdminColors] = useState(false);

  // Fetch active theme
  useEffect(() => {
    const fetchActiveTheme = async () => {
      try {
        const response = await fetch('/api/themes');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.themes) {
            const active = data.themes.find((t: any) => t.isActive);
            if (active) {
              setActiveTheme(active);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch active theme:', error);
      }
    };

    fetchActiveTheme();
    
    // Refresh theme every 30 seconds
    const themeInterval = setInterval(fetchActiveTheme, 30000);
    return () => clearInterval(themeInterval);
  }, []);

  // Fetch admin-customized shader colors
  useEffect(() => {
    const fetchAdminColors = async () => {
      try {
        const response = await fetch('/api/settings/shader-background');
        if (response.ok) {
          const data = await response.json();
          // Check if admin has customized colors
          if (data && data.bgColor1 && data.bgColor2 && data.lineColor) {
            // Check if colors are different from defaults
            const isCustomized = 
              JSON.stringify(data) !== JSON.stringify(themeShaderColors.theme_tech_noir);
            
            if (isCustomized) {
              setUseAdminColors(true);
              setConfig({ ...data, intensity: 1.0 });
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch shader background settings:', error);
      }
    };

    fetchAdminColors();
    
    // Refresh admin colors every 30 seconds
    const colorInterval = setInterval(fetchAdminColors, 30000);
    return () => clearInterval(colorInterval);
  }, []);

  // Update colors when theme changes (only if admin hasn't customized)
  useEffect(() => {
    if (!useAdminColors && activeTheme) {
      // Try to get predefined colors for this theme
      const predefinedConfig = themeShaderColors[activeTheme._id];
      
      if (predefinedConfig) {
        setConfig(predefinedConfig);
      } else {
        // Generate colors dynamically from theme
        const generatedColors = generateShaderColorsFromTheme(activeTheme);
        setConfig({ ...generatedColors, intensity: 1.0 });
      }
    }
  }, [activeTheme, useAdminColors]);

  return <ShaderBackground {...config} />;
};

export default ThemeAwareShaderBackground;
