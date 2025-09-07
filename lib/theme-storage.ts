// Theme management system for the portfolio website
// Provides comprehensive theme customization capabilities

export interface ThemeSettings {
  _id: string
  name: string
  isActive: boolean
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    muted: string
    border: string
    card: string
    popover: string
    destructive: string
    warning: string
    success: string
    // Text colors
    textPrimary: string
    textSecondary: string
    textMuted: string
    textAccent: string
    textInverse: string
  }
  typography: {
    fontFamily: string
    fontSize: {
      xs: string
      sm: string
      base: string
      lg: string
      xl: string
      '2xl': string
      '3xl': string
      '4xl': string
      '5xl': string
      '6xl': string
    }
    fontWeight: {
      light: string
      normal: string
      medium: string
      semibold: string
      bold: string
      extrabold: string
    }
  }
  layout: {
    borderRadius: string
    spacing: {
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
      '2xl': string
    }
    shadows: {
      sm: string
      md: string
      lg: string
      xl: string
    }
  }
  components: {
    button: {
      style: 'default' | 'outline' | 'ghost' | 'link'
      size: 'sm' | 'md' | 'lg'
      rounded: boolean
    }
    card: {
      style: 'default' | 'glassmorphism' | 'minimal'
      border: boolean
      shadow: boolean
    }
    input: {
      style: 'default' | 'glassmorphism' | 'minimal'
      border: boolean
    }
  }
  animations: {
    enabled: boolean
    duration: 'fast' | 'normal' | 'slow'
    easing: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'
  }
  effects: {
    backgroundParticles: boolean
    glowEffects: boolean
    glassmorphism: boolean
    neonBorders: boolean
    gradientBackgrounds: boolean
    animatedElements: boolean
    hoverEffects: boolean
    scrollAnimations: boolean
  }
  customCSS: string
  version: number
  createdAt: Date
  updatedAt: Date
}

export interface ThemeHistory {
  _id: string
  themeId: string
  version: number
  name: string
  settings: ThemeSettings
  changeDescription: string
  changedBy: string
  createdAt: Date
}

// Default theme configurations
export const defaultThemes: ThemeSettings[] = [
  {
    _id: 'theme_cyberpunk',
    name: 'Cyberpunk Neon',
    isActive: true,
    colors: {
      primary: '#00ff88',
      secondary: '#ff0080',
      accent: '#00d4ff',
      background: '#0a0a0a',
      foreground: '#ffffff',
      muted: '#1a1a1a',
      border: '#333333',
      card: '#111111',
      popover: '#1a1a1a',
      destructive: '#ff4444',
      warning: '#ffaa00',
      success: '#00ff88',
      // Text colors
      textPrimary: '#ffffff',
      textSecondary: '#cccccc',
      textMuted: '#888888',
      textAccent: '#00ff88',
      textInverse: '#0a0a0a',
    },
    typography: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
    },
    layout: {
      borderRadius: '0.5rem',
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 255, 136, 0.05)',
        md: '0 4px 6px -1px rgba(0, 255, 136, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 255, 136, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 255, 136, 0.1)',
      },
    },
    components: {
      button: {
        style: 'default',
        size: 'md',
        rounded: true,
      },
      card: {
        style: 'glassmorphism',
        border: true,
        shadow: true,
      },
      input: {
        style: 'glassmorphism',
        border: true,
      },
    },
    animations: {
      enabled: true,
      duration: 'normal',
      easing: 'ease-in-out',
    },
    effects: {
      backgroundParticles: true,
      glowEffects: true,
      glassmorphism: false,
      neonBorders: true,
      gradientBackgrounds: true,
      animatedElements: true,
      hoverEffects: true,
      scrollAnimations: true
    },
    customCSS: '',
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'theme_minimal',
    name: 'Minimal Clean',
    isActive: false,
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      foreground: '#0f172a',
      muted: '#f8fafc',
      border: '#e2e8f0',
      card: '#ffffff',
      popover: '#ffffff',
      destructive: '#ef4444',
      warning: '#f59e0b',
      success: '#10b981',
      // Text colors
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      textMuted: '#64748b',
      textAccent: '#f59e0b',
      textInverse: '#ffffff',
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
    },
    layout: {
      borderRadius: '0.375rem',
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
    },
    components: {
      button: {
        style: 'default',
        size: 'md',
        rounded: true,
      },
      card: {
        style: 'minimal',
        border: true,
        shadow: false,
      },
      input: {
        style: 'minimal',
        border: true,
      },
    },
    animations: {
      enabled: true,
      duration: 'fast',
      easing: 'ease-out',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'theme_dark',
    name: 'Dark Professional',
    isActive: false,
    colors: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      accent: '#f59e0b',
      background: '#111827',
      foreground: '#f9fafb',
      muted: '#1f2937',
      border: '#374151',
      card: '#1f2937',
      popover: '#1f2937',
      destructive: '#ef4444',
      warning: '#f59e0b',
      success: '#10b981',
      // Text colors
      textPrimary: '#f9fafb',
      textSecondary: '#d1d5db',
      textMuted: '#9ca3af',
      textAccent: '#f59e0b',
      textInverse: '#111827',
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
    },
    layout: {
      borderRadius: '0.5rem',
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
    },
    components: {
      button: {
        style: 'default',
        size: 'md',
        rounded: true,
      },
      card: {
        style: 'default',
        border: true,
        shadow: true,
      },
      input: {
        style: 'default',
        border: true,
      },
    },
    animations: {
      enabled: true,
      duration: 'normal',
      easing: 'ease-in-out',
    },
    effects: {
      backgroundParticles: true,
      glowEffects: true,
      glassmorphism: false,
      neonBorders: true,
      gradientBackgrounds: true,
      animatedElements: true,
      hoverEffects: true,
      scrollAnimations: true
    },
    customCSS: '',
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'theme_futuristic',
    name: 'Futuristic Matrix',
    isActive: false,
    colors: {
      primary: '#00ff41',
      secondary: '#ff0080',
      accent: '#00ffff',
      background: '#000000',
      foreground: '#00ff41',
      muted: '#0a0a0a',
      border: '#00ff41',
      card: '#111111',
      popover: '#1a1a1a',
      destructive: '#ff0040',
      warning: '#ffff00',
      success: '#00ff41',
      // Text colors
      textPrimary: '#00ff41',
      textSecondary: '#00ffff',
      textMuted: '#0088ff',
      textAccent: '#ff0080',
      textInverse: '#000000',
    },
    typography: {
      fontFamily: 'Orbitron, "JetBrains Mono", "Fira Code", monospace',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
    },
    layout: {
      borderRadius: '0.5rem',
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 255, 65, 0.1)',
        md: '0 4px 6px -1px rgba(0, 255, 65, 0.2)',
        lg: '0 10px 15px -3px rgba(0, 255, 65, 0.3)',
        xl: '0 20px 25px -5px rgba(0, 255, 65, 0.4)',
      },
    },
    components: {
      button: {
        style: 'default',
        size: 'md',
        rounded: true,
      },
      card: {
        style: 'glassmorphism',
        border: true,
        shadow: true,
      },
      input: {
        style: 'glassmorphism',
        border: true,
      },
    },
    animations: {
      enabled: true,
      duration: 'normal',
      easing: 'ease-in-out',
    },
    effects: {
      backgroundParticles: true,
      glowEffects: true,
      glassmorphism: false,
      neonBorders: true,
      gradientBackgrounds: true,
      animatedElements: true,
      hoverEffects: true,
      scrollAnimations: true
    },
    customCSS: '',
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'theme_cyberpunk',
    name: 'Cyberpunk Neon',
    isActive: false,
    colors: {
      primary: '#ff0080',
      secondary: '#00ffff',
      accent: '#ffff00',
      background: '#0a0a0a',
      foreground: '#ffffff',
      muted: '#1a1a1a',
      border: '#ff0080',
      card: '#111111',
      popover: '#1a1a1a',
      destructive: '#ff0040',
      warning: '#ffff00',
      success: '#00ff41',
      // Text colors
      textPrimary: '#ffffff',
      textSecondary: '#00ffff',
      textMuted: '#ff0080',
      textAccent: '#ffff00',
      textInverse: '#0a0a0a',
    },
    typography: {
      fontFamily: 'Orbitron, "JetBrains Mono", "Fira Code", monospace',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
    },
    layout: {
      borderRadius: '0.5rem',
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(255, 0, 128, 0.1)',
        md: '0 4px 6px -1px rgba(255, 0, 128, 0.2)',
        lg: '0 10px 15px -3px rgba(255, 0, 128, 0.3)',
        xl: '0 20px 25px -5px rgba(255, 0, 128, 0.4)',
      },
    },
    components: {
      button: {
        style: 'default',
        size: 'md',
        rounded: true,
      },
      card: {
        style: 'glassmorphism',
        border: true,
        shadow: true,
      },
      input: {
        style: 'glassmorphism',
        border: true,
      },
    },
    animations: {
      enabled: true,
      duration: 'normal',
      easing: 'ease-in-out',
    },
    effects: {
      backgroundParticles: true,
      glowEffects: true,
      glassmorphism: false,
      neonBorders: true,
      gradientBackgrounds: true,
      animatedElements: true,
      hoverEffects: true,
      scrollAnimations: true
    },
    customCSS: '',
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'theme_holographic',
    name: 'Holographic Future',
    isActive: false,
    colors: {
      primary: '#00ffff',
      secondary: '#ff00ff',
      accent: '#ffff00',
      background: '#000011',
      foreground: '#ffffff',
      muted: '#001122',
      border: '#00ffff',
      card: '#001133',
      popover: '#001144',
      destructive: '#ff0040',
      warning: '#ffff00',
      success: '#00ff41',
      // Text colors
      textPrimary: '#ffffff',
      textSecondary: '#00ffff',
      textMuted: '#0088ff',
      textAccent: '#ffff00',
      textInverse: '#000011',
    },
    typography: {
      fontFamily: 'Orbitron, "JetBrains Mono", "Fira Code", monospace',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
    },
    layout: {
      borderRadius: '0.5rem',
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 255, 255, 0.1)',
        md: '0 4px 6px -1px rgba(0, 255, 255, 0.2)',
        lg: '0 10px 15px -3px rgba(0, 255, 255, 0.3)',
        xl: '0 20px 25px -5px rgba(0, 255, 255, 0.4)',
      },
    },
    components: {
      button: {
        style: 'default',
        size: 'md',
        rounded: true,
      },
      card: {
        style: 'glassmorphism',
        border: true,
        shadow: true,
      },
      input: {
        style: 'glassmorphism',
        border: true,
      },
    },
    animations: {
      enabled: true,
      duration: 'normal',
      easing: 'ease-in-out',
    },
    effects: {
      backgroundParticles: true,
      glowEffects: true,
      glassmorphism: false,
      neonBorders: true,
      gradientBackgrounds: true,
      animatedElements: true,
      hoverEffects: true,
      scrollAnimations: true
    },
    customCSS: '',
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'theme_neon_purple',
    name: 'Neon Purple Matrix',
    isActive: false,
    colors: {
      primary: '#8b5cf6',
      secondary: '#ec4899',
      accent: '#06b6d4',
      background: '#0f0f23',
      foreground: '#ffffff',
      muted: '#1e1e3f',
      border: '#8b5cf6',
      card: '#1a1a3a',
      popover: '#1e1e3f',
      destructive: '#ef4444',
      warning: '#f59e0b',
      success: '#10b981',
      // Text colors
      textPrimary: '#ffffff',
      textSecondary: '#a78bfa',
      textMuted: '#6366f1',
      textAccent: '#ec4899',
      textInverse: '#0f0f23',
    },
    typography: {
      fontFamily: 'Orbitron, "JetBrains Mono", "Fira Code", monospace',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
    },
    layout: {
      borderRadius: '0.75rem',
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(139, 92, 246, 0.05)',
        md: '0 4px 6px -1px rgba(139, 92, 246, 0.1)',
        lg: '0 10px 15px -3px rgba(139, 92, 246, 0.1)',
        xl: '0 20px 25px -5px rgba(139, 92, 246, 0.1)',
      },
    },
    components: {
      button: {
        style: 'default',
        size: 'md',
        rounded: true,
      },
      card: {
        style: 'glassmorphism',
        border: true,
        shadow: true,
      },
      input: {
        style: 'glassmorphism',
        border: true,
      },
    },
    animations: {
      enabled: true,
      duration: 'normal',
      easing: 'ease-in-out',
    },
    effects: {
      backgroundParticles: true,
      glowEffects: true,
      glassmorphism: true,
      neonBorders: true,
      gradientBackgrounds: true,
      animatedElements: true,
      hoverEffects: true,
      scrollAnimations: true,
    },
    customCSS: '',
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'theme_cyber_green',
    name: 'Cyber Green Terminal',
    isActive: false,
    colors: {
      primary: '#00ff41',
      secondary: '#00d4ff',
      accent: '#ff6b35',
      background: '#001100',
      foreground: '#00ff41',
      muted: '#002200',
      border: '#00ff41',
      card: '#001a00',
      popover: '#002200',
      destructive: '#ff0040',
      warning: '#ffff00',
      success: '#00ff41',
      // Text colors
      textPrimary: '#00ff41',
      textSecondary: '#00d4ff',
      textMuted: '#0088ff',
      textAccent: '#ff6b35',
      textInverse: '#001100',
    },
    typography: {
      fontFamily: 'JetBrains Mono, "Fira Code", monospace',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
    },
    layout: {
      borderRadius: '0.25rem',
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 255, 65, 0.05)',
        md: '0 4px 6px -1px rgba(0, 255, 65, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 255, 65, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 255, 65, 0.1)',
      },
    },
    components: {
      button: {
        style: 'default',
        size: 'md',
        rounded: false,
      },
      card: {
        style: 'glassmorphism',
        border: true,
        shadow: true,
      },
      input: {
        style: 'glassmorphism',
        border: true,
      },
    },
    animations: {
      enabled: true,
      duration: 'fast',
      easing: 'linear',
    },
    effects: {
      backgroundParticles: true,
      glowEffects: true,
      glassmorphism: false,
      neonBorders: true,
      gradientBackgrounds: false,
      animatedElements: true,
      hoverEffects: true,
      scrollAnimations: true,
    },
    customCSS: '',
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'theme_sunset_orange',
    name: 'Sunset Orange Glow',
    isActive: false,
    colors: {
      primary: '#ff6b35',
      secondary: '#f7931e',
      accent: '#ff1744',
      background: '#1a0f0a',
      foreground: '#ffffff',
      muted: '#2d1b0f',
      border: '#ff6b35',
      card: '#2d1b0f',
      popover: '#3d2b1f',
      destructive: '#ff1744',
      warning: '#f7931e',
      success: '#4caf50',
      // Text colors
      textPrimary: '#ffffff',
      textSecondary: '#ffb74d',
      textMuted: '#ff8a65',
      textAccent: '#ff1744',
      textInverse: '#1a0f0a',
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
    },
    layout: {
      borderRadius: '1rem',
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(255, 107, 53, 0.05)',
        md: '0 4px 6px -1px rgba(255, 107, 53, 0.1)',
        lg: '0 10px 15px -3px rgba(255, 107, 53, 0.1)',
        xl: '0 20px 25px -5px rgba(255, 107, 53, 0.1)',
      },
    },
    components: {
      button: {
        style: 'default',
        size: 'md',
        rounded: true,
      },
      card: {
        style: 'glassmorphism',
        border: true,
        shadow: true,
      },
      input: {
        style: 'glassmorphism',
        border: true,
      },
    },
    animations: {
      enabled: true,
      duration: 'normal',
      easing: 'ease-out',
    },
    effects: {
      backgroundParticles: true,
      glowEffects: true,
      glassmorphism: true,
      neonBorders: false,
      gradientBackgrounds: true,
      animatedElements: true,
      hoverEffects: true,
      scrollAnimations: true,
    },
    customCSS: '',
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'theme_arctic_blue',
    name: 'Arctic Blue Frost',
    isActive: false,
    colors: {
      primary: '#00bcd4',
      secondary: '#4fc3f7',
      accent: '#ff4081',
      background: '#0a1929',
      foreground: '#ffffff',
      muted: '#1e3a5f',
      border: '#00bcd4',
      card: '#1e3a5f',
      popover: '#2a4a6b',
      destructive: '#f44336',
      warning: '#ff9800',
      success: '#4caf50',
      // Text colors
      textPrimary: '#ffffff',
      textSecondary: '#81d4fa',
      textMuted: '#4fc3f7',
      textAccent: '#ff4081',
      textInverse: '#0a1929',
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
    },
    layout: {
      borderRadius: '0.5rem',
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 188, 212, 0.05)',
        md: '0 4px 6px -1px rgba(0, 188, 212, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 188, 212, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 188, 212, 0.1)',
      },
    },
    components: {
      button: {
        style: 'default',
        size: 'md',
        rounded: true,
      },
      card: {
        style: 'glassmorphism',
        border: true,
        shadow: true,
      },
      input: {
        style: 'glassmorphism',
        border: true,
      },
    },
    animations: {
      enabled: true,
      duration: 'slow',
      easing: 'ease-in-out',
    },
    effects: {
      backgroundParticles: true,
      glowEffects: false,
      glassmorphism: true,
      neonBorders: false,
      gradientBackgrounds: true,
      animatedElements: true,
      hoverEffects: true,
      scrollAnimations: true,
    },
    customCSS: '',
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'theme_rose_gold',
    name: 'Rose Gold Luxury',
    isActive: false,
    colors: {
      primary: '#e91e63',
      secondary: '#ffc107',
      accent: '#9c27b0',
      background: '#1a0e0e',
      foreground: '#ffffff',
      muted: '#2d1a1a',
      border: '#e91e63',
      card: '#2d1a1a',
      popover: '#3d2a2a',
      destructive: '#f44336',
      warning: '#ff9800',
      success: '#4caf50',
      // Text colors
      textPrimary: '#ffffff',
      textSecondary: '#f8bbd9',
      textMuted: '#f48fb1',
      textAccent: '#ffc107',
      textInverse: '#1a0e0e',
    },
    typography: {
      fontFamily: 'Playfair Display, serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
    },
    layout: {
      borderRadius: '1.5rem',
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(233, 30, 99, 0.05)',
        md: '0 4px 6px -1px rgba(233, 30, 99, 0.1)',
        lg: '0 10px 15px -3px rgba(233, 30, 99, 0.1)',
        xl: '0 20px 25px -5px rgba(233, 30, 99, 0.1)',
      },
    },
    components: {
      button: {
        style: 'default',
        size: 'lg',
        rounded: true,
      },
      card: {
        style: 'glassmorphism',
        border: true,
        shadow: true,
      },
      input: {
        style: 'glassmorphism',
        border: true,
      },
    },
    animations: {
      enabled: true,
      duration: 'normal',
      easing: 'ease',
    },
    effects: {
      backgroundParticles: false,
      glowEffects: true,
      glassmorphism: true,
      neonBorders: false,
      gradientBackgrounds: true,
      animatedElements: true,
      hoverEffects: true,
      scrollAnimations: true,
    },
    customCSS: '',
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'theme_cyberpunk_red',
    name: 'Cyberpunk Red Alert',
    isActive: false,
    colors: {
      primary: '#ff0040',
      secondary: '#00ffff',
      accent: '#ffff00',
      background: '#0a0000',
      foreground: '#ff0040',
      muted: '#1a0000',
      border: '#ff0040',
      card: '#1a0000',
      popover: '#2a0000',
      destructive: '#ff0040',
      warning: '#ffff00',
      success: '#00ff41',
      // Text colors
      textPrimary: '#ff0040',
      textSecondary: '#00ffff',
      textMuted: '#ff6666',
      textAccent: '#ffff00',
      textInverse: '#0a0000',
    },
    typography: {
      fontFamily: 'Orbitron, "JetBrains Mono", monospace',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
    },
    layout: {
      borderRadius: '0.25rem',
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(255, 0, 64, 0.05)',
        md: '0 4px 6px -1px rgba(255, 0, 64, 0.1)',
        lg: '0 10px 15px -3px rgba(255, 0, 64, 0.1)',
        xl: '0 20px 25px -5px rgba(255, 0, 64, 0.1)',
      },
    },
    components: {
      button: {
        style: 'default',
        size: 'md',
        rounded: false,
      },
      card: {
        style: 'glassmorphism',
        border: true,
        shadow: true,
      },
      input: {
        style: 'glassmorphism',
        border: true,
      },
    },
    animations: {
      enabled: true,
      duration: 'fast',
      easing: 'linear',
    },
    effects: {
      backgroundParticles: true,
      glowEffects: true,
      glassmorphism: true,
      neonBorders: true,
      gradientBackgrounds: true,
      animatedElements: true,
      hoverEffects: true,
      scrollAnimations: true,
    },
    customCSS: '',
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]

// Theme management service
export class ThemeService {
  private static themes: ThemeSettings[] = [...defaultThemes]
  private static themeHistory: ThemeHistory[] = []
  private static initialized = false

  // Initialize themes from MongoDB
  private static async initializeThemes() {
    if (this.initialized) return

    try {
      const { dbService } = await import('./mongodb')
      
      // Load themes from MongoDB
      const themes = await dbService.getThemes()
      if (themes && themes.length > 0) {
        this.themes = themes
        console.log(`✅ Loaded ${themes.length} themes from MongoDB`)
      } else {
        // If no themes in DB, create default themes
        console.log('No themes found in MongoDB, creating default themes...')
        const createdThemes = []
        for (const theme of defaultThemes) {
          try {
            const themeId = await dbService.createTheme(theme)
            createdThemes.push({ ...theme, _id: themeId })
            console.log(`✅ Created theme: ${theme.name}`)
          } catch (error) {
            console.error(`❌ Failed to create theme ${theme.name}:`, error)
          }
        }
        this.themes = createdThemes.length > 0 ? createdThemes : [...defaultThemes]
        console.log(`✅ Created ${createdThemes.length} default themes in MongoDB`)
      }

      // Load theme history from MongoDB
      const history = await dbService.getThemeHistory()
      if (history && history.length > 0) {
        this.themeHistory = history
        console.log('✅ Loaded theme history from MongoDB')
      }

      this.initialized = true
    } catch (error) {
      console.error('Error initializing themes from MongoDB:', error)
      this.themes = [...defaultThemes]
      this.initialized = true
    }
  }

  static async getThemes(): Promise<ThemeSettings[]> {
    await this.initializeThemes()
    return this.themes
  }

  static async getActiveTheme(): Promise<ThemeSettings | null> {
    await this.initializeThemes()
    return this.themes.find(theme => theme.isActive) || null
  }

  static getThemeById(id: string): ThemeSettings | null {
    return this.themes.find(theme => theme._id === id) || null
  }

  static async setActiveTheme(id: string): Promise<boolean> {
    await this.initializeThemes()
    
    try {
      const { dbService } = await import('./mongodb')
      const success = await dbService.setActiveTheme(id)
      
      if (success) {
        // Update local cache
        this.themes.forEach(t => t.isActive = false)
        const theme = this.getThemeById(id)
        if (theme) {
          // Ensure theme has all required properties with defaults
          const completeTheme = this.ensureCompleteTheme(theme)
          Object.assign(theme, completeTheme)
          theme.isActive = true
          theme.updatedAt = new Date()
          await this.addToHistory(theme, 'Theme activated', 'admin')
        }
      }
      
      return success
    } catch (error) {
      console.error('Error setting active theme:', error)
      return false
    }
  }

  // Helper method to ensure theme has all required properties
  static ensureCompleteTheme(theme: any): ThemeSettings {
    const defaultTheme = this.getDefaultTheme()
    
    return {
      _id: theme._id || theme.id,
      name: theme.name || 'Custom Theme',
      description: theme.description || '',
      isActive: theme.isActive || false,
      createdAt: theme.createdAt || new Date(),
      updatedAt: theme.updatedAt || new Date(),
      version: theme.version || 1,
      colors: {
        primary: theme.colors?.primary || defaultTheme.colors.primary,
        secondary: theme.colors?.secondary || defaultTheme.colors.secondary,
        accent: theme.colors?.accent || defaultTheme.colors.accent,
        background: theme.colors?.background || defaultTheme.colors.background,
        foreground: theme.colors?.foreground || defaultTheme.colors.foreground,
        muted: theme.colors?.muted || defaultTheme.colors.muted,
        border: theme.colors?.border || defaultTheme.colors.border,
        card: theme.colors?.card || defaultTheme.colors.card,
        popover: theme.colors?.popover || defaultTheme.colors.popover,
        destructive: theme.colors?.destructive || defaultTheme.colors.destructive,
        warning: theme.colors?.warning || defaultTheme.colors.warning,
        success: theme.colors?.success || defaultTheme.colors.success,
        textPrimary: theme.colors?.textPrimary || theme.colors?.foreground || defaultTheme.colors.foreground,
        textSecondary: theme.colors?.textSecondary || theme.colors?.muted || defaultTheme.colors.muted,
        textMuted: theme.colors?.textMuted || theme.colors?.muted || defaultTheme.colors.muted,
        textAccent: theme.colors?.textAccent || theme.colors?.accent || defaultTheme.colors.accent,
        textInverse: theme.colors?.textInverse || theme.colors?.background || defaultTheme.colors.background,
      },
      typography: {
        fontFamily: theme.typography?.fontFamily || defaultTheme.typography.fontFamily,
        fontSize: {
          xs: theme.typography?.fontSize?.xs || defaultTheme.typography.fontSize.xs,
          sm: theme.typography?.fontSize?.sm || defaultTheme.typography.fontSize.sm,
          base: theme.typography?.fontSize?.base || defaultTheme.typography.fontSize.base,
          lg: theme.typography?.fontSize?.lg || defaultTheme.typography.fontSize.lg,
          xl: theme.typography?.fontSize?.xl || defaultTheme.typography.fontSize.xl,
          '2xl': theme.typography?.fontSize?.['2xl'] || defaultTheme.typography.fontSize['2xl'],
          '3xl': theme.typography?.fontSize?.['3xl'] || defaultTheme.typography.fontSize['3xl'],
          '4xl': theme.typography?.fontSize?.['4xl'] || defaultTheme.typography.fontSize['4xl'],
          '5xl': theme.typography?.fontSize?.['5xl'] || defaultTheme.typography.fontSize['5xl'],
          '6xl': theme.typography?.fontSize?.['6xl'] || defaultTheme.typography.fontSize['6xl'],
        },
        fontWeight: {
          light: theme.typography?.fontWeight?.light || defaultTheme.typography.fontWeight.light,
          normal: theme.typography?.fontWeight?.normal || defaultTheme.typography.fontWeight.normal,
          medium: theme.typography?.fontWeight?.medium || defaultTheme.typography.fontWeight.medium,
          semibold: theme.typography?.fontWeight?.semibold || defaultTheme.typography.fontWeight.semibold,
          bold: theme.typography?.fontWeight?.bold || defaultTheme.typography.fontWeight.bold,
          extrabold: theme.typography?.fontWeight?.extrabold || defaultTheme.typography.fontWeight.extrabold,
        },
      },
      layout: {
        spacing: {
          xs: theme.layout?.spacing?.xs || defaultTheme.layout.spacing.xs,
          sm: theme.layout?.spacing?.sm || defaultTheme.layout.spacing.sm,
          md: theme.layout?.spacing?.md || defaultTheme.layout.spacing.md,
          lg: theme.layout?.spacing?.lg || defaultTheme.layout.spacing.lg,
          xl: theme.layout?.spacing?.xl || defaultTheme.layout.spacing.xl,
          '2xl': theme.layout?.spacing?.['2xl'] || defaultTheme.layout.spacing['2xl'],
        },
        borderRadius: theme.layout?.borderRadius || defaultTheme.layout.borderRadius,
        shadows: {
          sm: theme.layout?.shadows?.sm || defaultTheme.layout.shadows.sm,
          md: theme.layout?.shadows?.md || defaultTheme.layout.shadows.md,
          lg: theme.layout?.shadows?.lg || defaultTheme.layout.shadows.lg,
          xl: theme.layout?.shadows?.xl || defaultTheme.layout.shadows.xl,
        },
      },
      animations: {
        enabled: theme.animations?.enabled || defaultTheme.animations.enabled,
        duration: theme.animations?.duration || defaultTheme.animations.duration,
        easing: theme.animations?.easing || defaultTheme.animations.easing,
      },
      effects: {
        backgroundParticles: theme.effects?.backgroundParticles || defaultTheme.effects.backgroundParticles,
        glowEffects: theme.effects?.glowEffects || defaultTheme.effects.glowEffects,
        glassmorphism: theme.effects?.glassmorphism || defaultTheme.effects.glassmorphism,
        neonBorders: theme.effects?.neonBorders || defaultTheme.effects.neonBorders,
        gradientBackgrounds: theme.effects?.gradientBackgrounds || defaultTheme.effects.gradientBackgrounds,
        animatedElements: theme.effects?.animatedElements || defaultTheme.effects.animatedElements,
        hoverEffects: theme.effects?.hoverEffects || defaultTheme.effects.hoverEffects,
        scrollAnimations: theme.effects?.scrollAnimations || defaultTheme.effects.scrollAnimations,
      },
    }
  }

  static async createTheme(theme: Omit<ThemeSettings, '_id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<string> {
    await this.initializeThemes()
    
    try {
      const { dbService } = await import('./mongodb')
      const themeId = await dbService.createTheme(theme)
      
      // Update local cache
      const newTheme: ThemeSettings = {
        ...theme,
        _id: themeId,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
      }
      this.themes.push(newTheme)
      await this.addToHistory(newTheme, 'Theme created', 'admin')
      
      return themeId
    } catch (error) {
      console.error('Error creating theme:', error)
      throw error
    }
  }

  static async updateTheme(id: string, updates: Partial<ThemeSettings>, changeDescription: string = 'Theme updated'): Promise<boolean> {
    await this.initializeThemes()
    
    try {
      const { dbService } = await import('./mongodb')
      const success = await dbService.updateTheme(id, updates)
      
      if (success) {
        // Update local cache
        const theme = this.getThemeById(id)
        if (theme) {
          const oldVersion = theme.version || 1
          Object.assign(theme, updates, { 
            updatedAt: new Date(),
            version: oldVersion + 1
          })
          await this.addToHistory(theme, changeDescription, 'admin')
        }
      }
      
      return success
    } catch (error) {
      console.error('Error updating theme:', error)
      return false
    }
  }

  static deleteTheme(id: string): boolean {
    const index = this.themes.findIndex(theme => theme._id === id)
    if (index === -1) return false

    // Don't delete if it's the only theme
    if (this.themes.length <= 1) return false

    // Add to history before deleting
    this.addToHistory(this.themes[index], 'Theme deleted', 'admin')

    // If deleting active theme, activate another one
    if (this.themes[index].isActive) {
      const nextTheme = this.themes.find((_, i) => i !== index)
      if (nextTheme) nextTheme.isActive = true
    }

    this.themes.splice(index, 1)
    return true
  }

  // History tracking methods
  static getThemeHistory(themeId?: string): ThemeHistory[] {
    if (themeId) {
      return this.themeHistory.filter(history => history.themeId === themeId)
    }
    return this.themeHistory.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  static revertTheme(themeId: string, historyId: string): boolean {
    const history = this.themeHistory.find(h => h._id === historyId && h.themeId === themeId)
    if (!history) return false
    
    const themeIndex = this.themes.findIndex(theme => theme._id === themeId)
    if (themeIndex === -1) return false
    
    // Revert to the historical version
    this.themes[themeIndex] = {
      ...history.settings,
      updatedAt: new Date()
    }
    
    // Add revert action to history
    this.addToHistory(this.themes[themeIndex], `Reverted to version ${history.version}`, 'admin')
    
    return true
  }

  static duplicateTheme(themeId: string, newName: string): string {
    const originalTheme = this.themes.find(theme => theme._id === themeId)
    if (!originalTheme) return ''
    
    const duplicatedTheme: ThemeSettings = {
      ...originalTheme,
      _id: `theme_${Date.now()}`,
      name: newName,
      isActive: false,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    this.themes.push(duplicatedTheme)
    this.addToHistory(duplicatedTheme, `Duplicated from ${originalTheme.name}`, 'admin')
    
    return duplicatedTheme._id
  }

  private static async addToHistory(theme: ThemeSettings, changeDescription: string, changedBy: string): Promise<void> {
    const historyEntry: ThemeHistory = {
      _id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      themeId: theme._id,
      version: theme.version || 1,
      name: theme.name,
      settings: { ...theme },
      changeDescription,
      changedBy,
      createdAt: new Date()
    }
    
    try {
      const { dbService } = await import('./mongodb')
      await dbService.addThemeHistory(historyEntry)
    } catch (error) {
      console.error('Error adding theme history:', error)
    }
    
    // Update local cache
    this.themeHistory.push(historyEntry)
    
    // Keep only last 50 history entries per theme
    const themeHistories = this.themeHistory.filter(h => h.themeId === theme._id)
    if (themeHistories.length > 50) {
      const toRemove = themeHistories.slice(0, themeHistories.length - 50)
      this.themeHistory = this.themeHistory.filter(h => !toRemove.includes(h))
    }
  }

  static generateCSS(theme: ThemeSettings): string {
    // Safe property access with defaults
    const colors = theme.colors || {}
    const typography = theme.typography || { fontFamily: 'Inter, sans-serif', fontSize: {}, fontWeight: {} }
    const layout = theme.layout || { spacing: {}, borderRadius: '0.5rem', shadows: {} }
    
    return `
      :root {
        --primary: ${colors.primary || '#000000'};
        --secondary: ${colors.secondary || '#666666'};
        --accent: ${colors.accent || '#007bff'};
        --background: ${colors.background || '#ffffff'};
        --foreground: ${colors.foreground || '#000000'};
        --muted: ${colors.muted || '#f8f9fa'};
        --border: ${colors.border || '#e9ecef'};
        --card: ${colors.card || '#ffffff'};
        --popover: ${colors.popover || '#ffffff'};
        --destructive: ${colors.destructive || '#dc3545'};
        --warning: ${colors.warning || '#ffc107'};
        --success: ${colors.success || '#28a745'};
        
        --text-primary: ${colors.textPrimary || colors.foreground || '#000000'};
        --text-secondary: ${colors.textSecondary || colors.muted || '#666666'};
        --text-muted: ${colors.textMuted || colors.muted || '#999999'};
        --text-accent: ${colors.textAccent || colors.accent || '#007bff'};
        --text-inverse: ${colors.textInverse || colors.background || '#ffffff'};
        
        --font-family: ${typography.fontFamily || 'Inter, sans-serif'};
        --font-size-xs: ${typography.fontSize?.xs || '0.75rem'};
        --font-size-sm: ${typography.fontSize?.sm || '0.875rem'};
        --font-size-base: ${typography.fontSize?.base || '1rem'};
        --font-size-lg: ${typography.fontSize?.lg || '1.125rem'};
        --font-size-xl: ${typography.fontSize?.xl || '1.25rem'};
        --font-size-2xl: ${typography.fontSize?.['2xl'] || '1.5rem'};
        --font-size-3xl: ${typography.fontSize?.['3xl'] || '1.875rem'};
        --font-size-4xl: ${typography.fontSize?.['4xl'] || '2.25rem'};
        --font-size-5xl: ${typography.fontSize?.['5xl'] || '3rem'};
        --font-size-6xl: ${typography.fontSize?.['6xl'] || '3.75rem'};
        
        --font-weight-light: ${typography.fontWeight?.light || '300'};
        --font-weight-normal: ${typography.fontWeight?.normal || '400'};
        --font-weight-medium: ${typography.fontWeight?.medium || '500'};
        --font-weight-semibold: ${typography.fontWeight?.semibold || '600'};
        --font-weight-bold: ${typography.fontWeight?.bold || '700'};
        --font-weight-extrabold: ${typography.fontWeight?.extrabold || '800'};
        
        --border-radius: ${layout.borderRadius || '0.5rem'};
        --spacing-xs: ${layout.spacing?.xs || '0.25rem'};
        --spacing-sm: ${layout.spacing?.sm || '0.5rem'};
        --spacing-md: ${layout.spacing?.md || '1rem'};
        --spacing-lg: ${layout.spacing?.lg || '1.5rem'};
        --spacing-xl: ${layout.spacing?.xl || '2rem'};
        --spacing-2xl: ${layout.spacing?.['2xl'] || '3rem'};
        
        --shadow-sm: ${layout.shadows?.sm || '0 1px 2px 0 rgb(0 0 0 / 0.05)'};
        --shadow-md: ${layout.shadows?.md || '0 4px 6px -1px rgb(0 0 0 / 0.1)'};
        --shadow-lg: ${layout.shadows?.lg || '0 10px 15px -3px rgb(0 0 0 / 0.1)'};
        --shadow-xl: ${layout.shadows?.xl || '0 20px 25px -5px rgb(0 0 0 / 0.1)'};
        
        --animation-duration: ${theme.animations?.duration === 'fast' ? '150ms' : theme.animations?.duration === 'slow' ? '500ms' : '300ms'};
        --animation-easing: ${theme.animations?.easing || 'ease-in-out'};
      }
      
      ${theme.animations?.enabled ? `
      * {
        transition: all var(--animation-duration) var(--animation-easing);
      }
      ` : ''}
      
      body {
        font-family: var(--font-family);
        background-color: var(--background);
        color: var(--foreground);
      }
    `
  }
}
