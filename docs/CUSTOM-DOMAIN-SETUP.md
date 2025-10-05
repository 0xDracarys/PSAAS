# Custom Domain Setup - dracarys.space

**Date:** October 6, 2025  
**Domain:** dracarys.space  
**Netlify Site:** zenitthhhhh  
**Current Status:** ✅ Domain already configured

---

## Current Configuration

According to `netlify status`, your custom domain is **already set up**:
- **Project URL:** https://dracarys.space
- **Netlify Site:** zenitthhhhh
- **Admin URL:** https://app.netlify.com/projects/zenitthhhhh

---

## Verification Checklist

### 1. Check Domain Configuration in Netlify Dashboard

Visit: https://app.netlify.com/sites/zenitthhhhh/settings/domain

**What to verify:**
- ✅ Primary domain: `dracarys.space`
- ✅ Default subdomain: `zenitthhhhh.netlify.app`
- ✅ SSL/TLS certificate: Should show "Certificate active"
- ✅ HTTPS: Should be "Enabled"

### 2. DNS Configuration (Domain Registrar)

You need to configure DNS records at your domain registrar (where you bought dracarys.space).

**Required DNS Records:**

#### Option A: Using Netlify DNS (Recommended)
If you transferred DNS management to Netlify:
- Netlify automatically manages all DNS records
- No additional configuration needed

#### Option B: Using External DNS (Your Registrar)
If DNS is still with your registrar (GoDaddy, Namecheap, Cloudflare, etc.):

**For Root Domain (dracarys.space):**
```
Type: A
Name: @
Value: 75.2.60.5
TTL: 3600 (or automatic)
```

**For WWW Subdomain (www.dracarys.space):**
```
Type: CNAME
Name: www
Value: zenitthhhhh.netlify.app
TTL: 3600 (or automatic)
```

**Alternative (Netlify's Load Balancer IP):**
```
Type: A
Name: @
Value: 75.2.60.5
```

### 3. SSL/TLS Certificate

**Automatic (Netlify handles this):**
- Netlify automatically provisions Let's Encrypt SSL certificate
- Certificate renews automatically every 90 days
- HTTPS is enforced by default

**What to check:**
1. Go to: https://app.netlify.com/sites/zenitthhhhh/settings/domain
2. Look for "HTTPS" section
3. Should show: "Certificate is being provisioned" or "Certificate active"
4. Wait 24-48 hours if still provisioning

### 4. Verify Domain is Working

**Test Commands:**
```bash
# Check if domain resolves to Netlify
nslookup dracarys.space

# Should return Netlify's IP (75.2.60.5 or similar)
```

```bash
# Check HTTPS certificate
curl -I https://dracarys.space

# Should return 200 OK with Netlify headers
```

**Browser Test:**
1. Visit: https://dracarys.space
2. Should show your portfolio site
3. Green padlock icon (SSL active)
4. No certificate warnings

### 5. Redirect Configuration

**Recommended Setup:**

**In Netlify Dashboard:**
- ✅ Redirect HTTP to HTTPS: Enabled
- ✅ Redirect www to non-www (or vice versa): Choose preference

**Add to `netlify.toml` (if not already present):**
```toml
[[redirects]]
  from = "https://www.dracarys.space/*"
  to = "https://dracarys.space/:splat"
  status = 301
  force = true

[[redirects]]
  from = "http://dracarys.space/*"
  to = "https://dracarys.space/:splat"
  status = 301
  force = true
```

### 6. Environment Variables Check

All environment variables should already be set for `dracarys.space`:
- ✅ CLOUDINARY_CLOUD_NAME = djxdsicuv
- ✅ CLOUDINARY_API_KEY = 614924959886856
- ✅ CLOUDINARY_API_SECRET = (set)
- ✅ MONGODB_URI = (set)
- ✅ MONGODB_DB = portfolio_db
- ✅ NEXTAUTH_SECRET = (set)
- ✅ NEXTAUTH_URL = (needs update - see below)

**IMPORTANT - Update NEXTAUTH_URL:**
```bash
# In Netlify Dashboard → Site settings → Environment variables
# Update NEXTAUTH_URL from localhost to production domain:

NEXTAUTH_URL=https://dracarys.space
```

---

## What Needs to Be Done

### ✅ Already Configured (No Action Needed)
1. Custom domain added to Netlify ✓
2. Site deployed and accessible ✓
3. Cloudinary environment variables ✓
4. MongoDB environment variables ✓

### ⚠️ Requires Verification

#### 1. DNS Records (At Your Domain Registrar)
**Action:** Log in to where you bought `dracarys.space` and verify:
- A record pointing to Netlify's IP (75.2.60.5)
- OR if using Netlify DNS, nameservers point to Netlify

**How to check:**
```bash
nslookup dracarys.space
# Should resolve to Netlify's IP
```

#### 2. SSL Certificate Status
**Action:** Check SSL is active:
- Go to: https://app.netlify.com/sites/zenitthhhhh/settings/domain
- Under "HTTPS" section, verify certificate is active
- If provisioning, wait 24-48 hours

#### 3. Update NEXTAUTH_URL
**Action:** Update environment variable:
```bash
netlify env:set NEXTAUTH_URL "https://dracarys.space"
```

**Or in Netlify Dashboard:**
1. Go to: Site settings → Environment variables
2. Find `NEXTAUTH_URL`
3. Change value from `http://localhost:3000` to `https://dracarys.space`
4. Redeploy site

#### 4. Test Domain Access
**Action:** Visit these URLs and verify they work:
- https://dracarys.space (should load site)
- https://www.dracarys.space (should redirect to non-www)
- http://dracarys.space (should redirect to HTTPS)

---

## Troubleshooting

### Domain Not Resolving

**Problem:** `dracarys.space` doesn't load or shows error.

**Solutions:**
1. **Check DNS propagation:**
   ```bash
   nslookup dracarys.space
   ```
   - If returns wrong IP, update DNS at registrar
   - DNS changes take 24-48 hours to propagate

2. **Verify domain in Netlify:**
   - Go to: Site settings → Domain management
   - Ensure `dracarys.space` is listed as primary domain
   - Click "Verify DNS configuration"

3. **Check nameservers (if using Netlify DNS):**
   - Should point to Netlify's nameservers:
     ```
     dns1.p01.nsone.net
     dns2.p01.nsone.net
     dns3.p01.nsone.net
     dns4.p01.nsone.net
     ```

### SSL Certificate Not Active

**Problem:** "Not secure" warning or certificate error.

**Solutions:**
1. Wait 24-48 hours for certificate provisioning
2. Remove and re-add domain in Netlify
3. Contact Netlify support if still not working

### WWW vs Non-WWW Issues

**Problem:** www.dracarys.space doesn't redirect properly.

**Solution:** Add redirect in `netlify.toml`:
```toml
[[redirects]]
  from = "https://www.dracarys.space/*"
  to = "https://dracarys.space/:splat"
  status = 301
  force = true
```

---

## Quick Setup Commands

If you need to reconfigure from scratch:

```bash
# 1. Add custom domain
netlify domains:add dracarys.space

# 2. Update NEXTAUTH_URL
netlify env:set NEXTAUTH_URL "https://dracarys.space"

# 3. Trigger new deployment
git commit --allow-empty -m "chore: Trigger deployment for domain config"
git push

# 4. Check status
netlify status

# 5. Open site settings
netlify open:site
```

---

## Final Verification Checklist

✅ **Domain resolves to Netlify**
```bash
nslookup dracarys.space
# Should return: 75.2.60.5 or Netlify's IP
```

✅ **HTTPS certificate active**
- Visit: https://dracarys.space
- Green padlock icon visible
- No security warnings

✅ **All redirects working**
- http://dracarys.space → https://dracarys.space ✓
- https://www.dracarys.space → https://dracarys.space ✓

✅ **Environment variables updated**
- NEXTAUTH_URL = https://dracarys.space ✓
- All Cloudinary variables set ✓
- MongoDB URI set ✓

✅ **Site features working**
- Admin panel accessible ✓
- Image upload (Cloudinary) working ✓
- Settings save working ✓
- Theme system working ✓

---

## Next Steps

1. **Verify DNS at your domain registrar** (most important)
2. **Update NEXTAUTH_URL** to https://dracarys.space
3. **Wait for SSL certificate** (if not already active)
4. **Test the site** at https://dracarys.space
5. **Update any hardcoded URLs** in your code to use environment variable

---

**Status:** Domain configured in Netlify ✅  
**Action Required:** Verify DNS at registrar + Update NEXTAUTH_URL  
**Estimated Time:** DNS propagation 24-48 hours (if just updated)

