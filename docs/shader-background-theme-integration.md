# Shader Background Theme Integration

## Overview
The shader background now automatically adapts to match your active portfolio theme, creating a cohesive visual experience.

## Theme Color Mappings

### 1. Modern Minimal
- **Style**: Subtle, professional
- **Background**: Very light gray-blue gradient
- **Lines**: Muted blue accent
- **Effect**: Clean, minimalist look with gentle movement

### 2. Tech Noir
- **Style**: Cyberpunk, futuristic
- **Background**: Deep navy blue gradient
- **Lines**: Bright neon cyan
- **Effect**: Dark, high-tech atmosphere with glowing lines

### 3. Gradient Pop
- **Style**: Modern, vibrant
- **Background**: Nearly white with purple tint
- **Lines**: Vivid purple
- **Effect**: Bright, energetic feel with bold accents

### 4. Retro Wave
- **Style**: 80s inspired
- **Background**: Dark blue-gray gradient
- **Lines**: Hot pink/neon
- **Effect**: Nostalgic synthwave aesthetic

## How It Works

1. **Automatic Detection**: The shader background component fetches the active theme every 30 seconds
2. **Color Engineering**: Each theme has carefully engineered shader colors for optimal visual harmony
3. **Dynamic Generation**: If a new theme is added, colors are dynamically generated from the theme's color palette
4. **Admin Override**: Admins can manually customize colors in the Settings panel, which overrides theme defaults

## Color Engineering Principles

- **Dark Themes**: Use darker background gradients with bright, saturated line colors for contrast
- **Light Themes**: Use very light background gradients with darker, saturated line colors
- **Saturation**: Line colors are always more saturated than backgrounds for visibility
- **Harmony**: All colors are derived from or complement the theme's primary, secondary, and accent colors

## Customization Priority

1. Admin-customized colors (highest priority)
2. Predefined theme shader colors
3. Dynamically generated colors from theme palette
4. Default fallback colors
