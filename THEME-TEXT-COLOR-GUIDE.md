# Theme Text Color Component Guide

## Overview
This document explains which theme component controls the color of specific text elements on your portfolio website.

---

## **About Me Section Text Color**

### **Text:** 
"I'm Shubham Bhasker, a university student and cybersecurity professional working in security research and customer success..."

### **HTML Class:** 
```html
<p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
```

### **CSS Variable Mapping:**
- **Tailwind Class:** `text-muted-foreground`
- **CSS Variable:** `--muted-foreground` (from `globals.css`)
- **Alternative:** `--text-muted` (from dynamic themes)

### **Theme Component:**
📍 **Location:** `lib/theme-storage.ts`  
📍 **Property:** `colors.textMuted`

---

## **How to Change This Color**

### **Option 1: Edit Theme in Admin Dashboard**
1. Go to: https://zenitthhhhh.netlify.app/admin
2. Login with: `admin` / `admin123`
3. Navigate to: **Themes** tab
4. Select your active theme
5. Click **Edit Theme**
6. Find the field: **`textMuted`** under Colors section
7. Change the hex color value (e.g., from `#888888` to `#ffffff`)
8. Save changes

### **Option 2: Edit Theme File Directly**
1. Open: `lib/theme-storage.ts`
2. Find your theme in the `defaultThemes` array
3. Locate the `colors` object
4. Change the `textMuted` value:
   ```typescript
   colors: {
     // ... other colors
     textMuted: '#YOUR_NEW_COLOR_HERE',
   }
   ```
5. Commit and deploy

---

## **Theme Color Properties Reference**

| Property | Purpose | Example Value |
|----------|---------|---------------|
| `textPrimary` | Main heading text | `#000000` |
| `textSecondary` | Subheadings | `#666666` |
| **`textMuted`** | **Body text, descriptions** | **`#888888`** |
| `textAccent` | Highlighted text | `#007bff` |
| `textInverse` | Text on dark backgrounds | `#ffffff` |

---

## **Current Theme Text Colors**

### **HackTheBox Hacker Theme:**
```typescript
textPrimary: '#9fef00',    // Bright green
textSecondary: '#a4b816',  // Yellow-green
textMuted: '#6c8f3f',      // Olive green (THIS CONTROLS "ABOUT ME" TEXT)
textAccent: '#2ecc71',     // Accent green
textInverse: '#0a0e0f'     // Dark background
```

### **Minimal Clean Theme:**
```typescript
textPrimary: '#1a1a1a',    // Near black
textSecondary: '#4a4a4a',  // Medium gray
textMuted: '#888888',      // Light gray (THIS CONTROLS "ABOUT ME" TEXT)
textAccent: '#3b82f6',     // Blue accent
textInverse: '#ffffff'     // White
```

---

## **CSS Variable Hierarchy**

1. **Dynamic Theme CSS** (highest priority)
   - Generated from `theme.colors.textMuted`
   - Applied via `--text-muted` CSS variable

2. **Tailwind Utility Class**
   - `text-muted-foreground` → maps to `--muted-foreground`

3. **Global CSS Defaults** (lowest priority)
   - Light mode: `--text-muted: oklch(0.5 0 0)`
   - Dark mode: `--text-muted: oklch(0.6 0 0)`

---

## **Quick Fix for Better Readability**

If the "About Me" text is hard to read, change `textMuted` to a higher contrast color:

- **For dark backgrounds:** Use lighter colors (`#cccccc`, `#e0e0e0`, `#ffffff`)
- **For light backgrounds:** Use darker colors (`#333333`, `#444444`, `#555555`)

### **Recommended Values:**
- **High Contrast:** `#ffffff` (white) or `#000000` (black)
- **Medium Contrast:** `#cccccc` (light gray) or `#333333` (dark gray)
- **Low Contrast:** `#888888` (medium gray)

---

## **Testing Your Changes**

1. Edit the theme's `textMuted` value
2. Activate the theme in admin dashboard
3. Refresh the homepage
4. Check the "About Me" section
5. Verify readability in both light and dark mode

---

**Last Updated:** October 5, 2025
