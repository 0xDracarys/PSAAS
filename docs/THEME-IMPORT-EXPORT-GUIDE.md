# Theme Import/Export Guide

## Overview

The theme management system now supports importing and exporting themes as JSON files. This allows you to:
- Share themes between different portfolio instances
- Create backups of your favorite themes
- Share custom themes with the community
- Quickly duplicate and modify themes

## How to Export a Theme

1. Navigate to **Admin Dashboard** → **Themes** tab
2. Find the theme you want to export
3. Click the **Download** icon (📥) on the theme card
4. A JSON file will be downloaded: `theme-[theme-name].json`

## How to Import a Theme

1. Navigate to **Admin Dashboard** → **Themes** tab
2. Click the **Import Theme** button at the top right
3. Select a theme JSON file from your computer
4. The theme will be automatically added to your collection
5. You can now activate, edit, or duplicate it like any other theme

## Theme JSON Structure

### Required Fields

Every theme JSON file must contain these core sections:

```json
{
  "name": "My Custom Theme",
  "colors": {
    "primary": "#3b82f6",
    "secondary": "#64748b",
    "accent": "#f59e0b",
    "background": "#0f172a",
    "foreground": "#f9fafb",
    "muted": "#1f2937",
    "border": "#374151",
    "card": "#1f2937",
    "popover": "#1f2937",
    "destructive": "#ef4444",
    "warning": "#f59e0b",
    "success": "#10b981",
    "textPrimary": "#f9fafb",
    "textSecondary": "#d1d5db",
    "textMuted": "#9ca3af",
    "textAccent": "#f59e0b",
    "textInverse": "#111827"
  },
  "typography": {
    "fontFamily": "Inter, sans-serif",
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem"
    },
    "fontWeight": {
      "light": "300",
      "normal": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700",
      "extrabold": "800"
    }
  },
  "layout": {
    "borderRadius": "0.5rem",
    "spacing": {
      "xs": "0.25rem",
      "sm": "0.5rem",
      "md": "1rem",
      "lg": "1.5rem",
      "xl": "2rem",
      "2xl": "3rem"
    },
    "shadows": {
      "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
    }
  },
  "components": {
    "button": {
      "style": "default",
      "size": "md",
      "rounded": true
    },
    "card": {
      "style": "default",
      "border": true,
      "shadow": true
    },
    "input": {
      "style": "default",
      "border": true
    }
  },
  "animations": {
    "enabled": true,
    "duration": "normal",
    "easing": "ease-in-out"
  },
  "effects": {
    "backgroundParticles": false,
    "glowEffects": true,
    "glassmorphism": false,
    "neonBorders": false,
    "gradientBackgrounds": true,
    "animatedElements": true,
    "hoverEffects": true,
    "scrollAnimations": true
  },
  "customCSS": "",
  "version": 1
}
```

## Field Descriptions

### Colors Object (17 required colors)
- `primary`: Main brand color
- `secondary`: Secondary brand color
- `accent`: Accent/highlight color
- `background`: Main background color
- `foreground`: Main text color
- `muted`: Muted background color
- `border`: Border color
- `card`: Card background color
- `popover`: Popover background color
- `destructive`: Error/danger color
- `warning`: Warning color
- `success`: Success color
- `textPrimary`: Primary text color
- `textSecondary`: Secondary text color
- `textMuted`: Muted text color
- `textAccent`: Accent text color
- `textInverse`: Inverse text color (for dark backgrounds)

### Typography Object
- `fontFamily`: Font stack (e.g., "Inter, sans-serif")
- `fontSize`: Object with 10 size keys (xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl)
- `fontWeight`: Object with 6 weight keys (light, normal, medium, semibold, bold, extrabold)

### Layout Object
- `borderRadius`: Default border radius value
- `spacing`: Object with 6 spacing values (xs, sm, md, lg, xl, 2xl)
- `shadows`: Object with 4 shadow definitions (sm, md, lg, xl)

### Components Object
- `button`: Button styling preferences (style, size, rounded)
- `card`: Card styling preferences (style, border, shadow)
- `input`: Input styling preferences (style, border)

Available styles:
- Button: `default`, `outline`, `ghost`, `link`
- Card: `default`, `glassmorphism`, `minimal`
- Input: `default`, `glassmorphism`, `minimal`

### Animations Object
- `enabled`: Boolean - Enable/disable animations
- `duration`: `fast`, `normal`, or `slow`
- `easing`: `linear`, `ease`, `ease-in`, `ease-out`, or `ease-in-out`

### Effects Object (8 boolean toggles)
- `backgroundParticles`: Animated background particles
- `glowEffects`: Glowing elements
- `glassmorphism`: Glass morphism effects
- `neonBorders`: Neon border effects
- `gradientBackgrounds`: Gradient backgrounds
- `animatedElements`: Animated UI elements
- `hoverEffects`: Hover animations
- `scrollAnimations`: Scroll-triggered animations

### Optional Fields
- `customCSS`: Custom CSS to inject (string)
- `version`: Theme version number (default: 1)

## Sample Theme Templates

### Light Theme Template
```json
{
  "name": "Clean Light",
  "colors": {
    "primary": "#2563eb",
    "secondary": "#64748b",
    "accent": "#f59e0b",
    "background": "#ffffff",
    "foreground": "#0f172a",
    "muted": "#f8fafc",
    "border": "#e2e8f0",
    "card": "#ffffff",
    "popover": "#ffffff",
    "destructive": "#ef4444",
    "warning": "#f59e0b",
    "success": "#10b981",
    "textPrimary": "#0f172a",
    "textSecondary": "#475569",
    "textMuted": "#64748b",
    "textAccent": "#f59e0b",
    "textInverse": "#ffffff"
  },
  "typography": {
    "fontFamily": "Inter, sans-serif",
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem"
    },
    "fontWeight": {
      "light": "300",
      "normal": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700",
      "extrabold": "800"
    }
  },
  "layout": {
    "borderRadius": "0.375rem",
    "spacing": {
      "xs": "0.25rem",
      "sm": "0.5rem",
      "md": "1rem",
      "lg": "1.5rem",
      "xl": "2rem",
      "2xl": "3rem"
    },
    "shadows": {
      "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
    }
  },
  "components": {
    "button": { "style": "default", "size": "md", "rounded": true },
    "card": { "style": "minimal", "border": true, "shadow": false },
    "input": { "style": "minimal", "border": true }
  },
  "animations": {
    "enabled": true,
    "duration": "fast",
    "easing": "ease-out"
  },
  "effects": {
    "backgroundParticles": false,
    "glowEffects": false,
    "glassmorphism": false,
    "neonBorders": false,
    "gradientBackgrounds": false,
    "animatedElements": true,
    "hoverEffects": true,
    "scrollAnimations": false
  },
  "customCSS": "",
  "version": 1
}
```

### Dark Theme Template
```json
{
  "name": "Midnight Dark",
  "colors": {
    "primary": "#3b82f6",
    "secondary": "#6b7280",
    "accent": "#f59e0b",
    "background": "#0a0a0a",
    "foreground": "#f9fafb",
    "muted": "#1a1a1a",
    "border": "#333333",
    "card": "#111111",
    "popover": "#1a1a1a",
    "destructive": "#ef4444",
    "warning": "#f59e0b",
    "success": "#10b981",
    "textPrimary": "#f9fafb",
    "textSecondary": "#d1d5db",
    "textMuted": "#9ca3af",
    "textAccent": "#f59e0b",
    "textInverse": "#0a0a0a"
  },
  "typography": {
    "fontFamily": "Inter, sans-serif",
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem"
    },
    "fontWeight": {
      "light": "300",
      "normal": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700",
      "extrabold": "800"
    }
  },
  "layout": {
    "borderRadius": "0.5rem",
    "spacing": {
      "xs": "0.25rem",
      "sm": "0.5rem",
      "md": "1rem",
      "lg": "1.5rem",
      "xl": "2rem",
      "2xl": "3rem"
    },
    "shadows": {
      "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.2)",
      "md": "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
      "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.4)",
      "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.5)"
    }
  },
  "components": {
    "button": { "style": "default", "size": "md", "rounded": true },
    "card": { "style": "default", "border": true, "shadow": true },
    "input": { "style": "default", "border": true }
  },
  "animations": {
    "enabled": true,
    "duration": "normal",
    "easing": "ease-in-out"
  },
  "effects": {
    "backgroundParticles": true,
    "glowEffects": true,
    "glassmorphism": false,
    "neonBorders": false,
    "gradientBackgrounds": true,
    "animatedElements": true,
    "hoverEffects": true,
    "scrollAnimations": true
  },
  "customCSS": "",
  "version": 1
}
```

## Tips & Best Practices

1. **Color Consistency**: Ensure your colors work well together and provide good contrast
2. **Font Loading**: Use web-safe fonts or fonts from Google Fonts/Adobe Fonts
3. **Accessibility**: Test text colors for WCAG compliance (minimum 4.5:1 contrast ratio)
4. **Performance**: Avoid too many effects enabled at once for better performance
5. **Testing**: Always test your imported theme before activating it
6. **Backups**: Export your active theme before making major changes
7. **Naming**: Use descriptive names for easy identification
8. **Version Control**: Increment version number when making significant changes

## Troubleshooting

### Theme Won't Import
- Verify JSON syntax is valid (use a JSON validator)
- Check that all required fields are present
- Ensure color values are valid hex codes
- Verify font family names are correct

### Theme Looks Broken
- Check browser console for CSS errors
- Verify all color values have proper contrast
- Test font family availability
- Clear browser cache and reload

### Custom CSS Not Working
- Check for syntax errors in customCSS field
- Ensure CSS selectors are specific enough
- Verify no conflicts with existing styles
- Use browser DevTools to debug

## Community Themes

Share your themes on GitHub or portfolio communities! Include:
- Theme name and description
- Preview screenshots
- Use case (portfolio type, industry)
- Credits and attribution

## API Integration

You can also import/export themes programmatically:

### Export via API
```javascript
const response = await fetch('/api/themes');
const { themes } = await response.json();
const themeToExport = themes.find(t => t.name === 'My Theme');
// Download as JSON
```

### Import via API
```javascript
const themeData = { /* theme object */ };
const response = await fetch('/api/themes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(themeData)
});
```

---

**Last Updated**: October 5, 2025  
**Version**: 1.0
