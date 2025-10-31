# Settings API 405 Error Fix

**Date:** October 6, 2025  
**Issue:** Settings API returning 405 "Method Not Allowed" errors  
**Error Messages:**
```
Failed to load resource: the server responded with a status of 404 ()
Failed to load resource: the server responded with a status of 405 ()
```

## Root Causes Identified

### Issue #1: Missing OPTIONS Handler for CORS
**Problem:** Next.js API routes on Netlify require explicit OPTIONS handler for CORS preflight requests.

**Fix Applied (Commit f6880c1):**
```typescript
// Added to app/api/settings/route.ts
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
```

### Issue #2: updateWebsiteSettings Return Logic
**Problem:** Method returned `false` when MongoDB modifiedCount was 0 (even though operation succeeded).

**Fix Applied (Commit 93da562):**
```typescript
// Changed from:
return result.modifiedCount > 0 || result.upsertedCount > 0

// To:
return result.acknowledged
```

## Deployment Status

**Commits Pushed:**
1. `843d0fc` - Trigger deployment for Cloudinary fix
2. `93da562` - Fix updateWebsiteSettings return logic
3. `f6880c1` - Add OPTIONS handler for CORS

**Netlify Auto-Deploy:** Triggered on each push to `menu-blog` branch

## Testing Instructions

### After Deployment Completes:

1. **Clear Browser Cache:**
   ```
   Chrome: Ctrl+Shift+Delete → Clear cached images and files
   Or: Hard refresh with Ctrl+F5
   ```

2. **Test Settings Update:**
   - Go to: https://zenitthhhhh.netlify.app/admin
   - Navigate to Settings tab
   - Upload a profile image (Cloudinary - should work ✓)
   - Click "Save Changes"
   - **Expected:** Success message, no 405 error

3. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for any remaining 404/405 errors
   - Settings API should respond with 200 OK

4. **Verify Settings Persist:**
   - Refresh the page
   - Check if uploaded image is still there
   - Verify all other settings maintained

## Troubleshooting

### If 405 Errors Persist:

1. **Check Deployment Status:**
   ```bash
   netlify status
   # OR visit: https://app.netlify.com/sites/zenitthhhhh/deploys
   ```

2. **Verify Latest Commit Deployed:**
   - Check deployment log shows commit `f6880c1`
   - Build should complete without errors

3. **Clear Netlify Cache:**
   ```bash
   # Trigger new deploy with cache clear
   netlify deploy --prod --build --clear-cache
   ```

4. **Check API Route Exists:**
   - Visit: https://zenitthhhhh.netlify.app/api/settings
   - Should return settings JSON (GET works)
   - If 404, API routes may not be deployed

### If Settings Don't Save:

1. **Check MongoDB Connection:**
   - Verify environment variables in Netlify dashboard
   - `MONGODB_URI` should be set
   - Check MongoDB Atlas for connection logs

2. **Check Browser Network Tab:**
   - See actual request/response
   - Check if PUT request is being sent
   - Look at response body for error details

3. **Check Netlify Function Logs:**
   ```bash
   netlify functions:log settings
   # OR check dashboard: Functions → settings → Logs
   ```

## Next.js API Routes on Netlify

### Important Notes:

1. **Automatic Function Conversion:**
   - Next.js API routes automatically become Netlify Functions
   - Located at: `.netlify/functions-internal/`

2. **Required HTTP Methods:**
   - `GET` - Retrieve data
   - `POST` - Create data
   - `PUT` - Update data (our case)
   - `OPTIONS` - CORS preflight (must be explicit)

3. **CORS Configuration:**
   - Headers set in `netlify.toml` apply globally
   - Individual routes need OPTIONS handler
   - Both are required for proper CORS

4. **Environment Variables:**
   - Must be set in Netlify dashboard
   - Not available during build time (only runtime)
   - Functions access them via `process.env`

## Related Files

- `app/api/settings/route.ts` - Main API route (fixed)
- `lib/mongodb.ts` - Database service (fixed)
- `netlify.toml` - Netlify configuration (CORS headers)
- `app/admin/page.tsx` - Admin panel making API calls

## Status

✅ **FIXED (Pending Deployment):**
- Added OPTIONS handler for CORS
- Fixed updateWebsiteSettings return logic
- Commits pushed, deployment in progress

🔄 **WAITING:**
- Netlify deployment to complete (~2-5 minutes)
- User to test and confirm fix works

## Prevention

### For Future API Routes:

```typescript
// Template for Netlify-compatible Next.js API routes

import { type NextRequest, NextResponse } from "next/server"

// Always include OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function GET(request: NextRequest) {
  try {
    // Your GET logic
    return NextResponse.json({ success: true, data: {} })
  } catch (error) {
    console.error('[API] Error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    // Your PUT logic
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] Error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
```

---

**Last Updated:** October 6, 2025  
**Deployment Commits:** 843d0fc, 93da562, f6880c1  
**Status:** Fixes deployed, awaiting user confirmation
