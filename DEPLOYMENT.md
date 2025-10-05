# PSAAS Deployment Guide

## 🚀 Netlify Deployment

Your PSAAS project is configured for automatic deployment on Netlify.

### Live Site
- **URL:** https://willowy-daifuku-0f6759.netlify.app
- **Admin Dashboard:** https://app.netlify.com/projects/willowy-daifuku-0f6759

---

## ⚡ Automatic Deployment

Every push to the `menu-blog` branch automatically triggers a Netlify deployment.

```bash
git add .
git commit -m "your commit message"
git push origin menu-blog
```

Netlify will:
1. ✅ Detect the push via webhook
2. ✅ Build on Linux servers (no Windows symlink issues)
3. ✅ Deploy automatically to production

---

## ⚠️ Windows Build Limitation

**Local builds WILL FAIL on Windows** due to Next.js standalone mode creating symlinks, which require administrator privileges on Windows.

### Error You'll See:
```
Error: EPERM: operation not permitted, symlink
errno: -4048, code: 'EPERM', syscall: 'symlink'
```

### Solution:
**Don't build locally on Windows.** Instead:
1. Push your code to GitHub
2. Let Netlify build on their Linux servers
3. Test on the deployed site

---

## 🔧 Environment Variables

Set these in Netlify Dashboard: https://app.netlify.com/sites/willowy-daifuku-0f6759/settings/env

### Required Variables:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
MONGODB_DB=portfolio_db
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=https://willowy-daifuku-0f6759.netlify.app
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
NODE_ENV=production
```

After adding/changing environment variables, Netlify will automatically redeploy.

---

## 🛠️ Manual Deployment (If Needed)

If you need to trigger a manual deployment:

```bash
# Option 1: Via Netlify CLI (will fail on Windows due to build)
netlify deploy --prod

# Option 2: Via Netlify Dashboard (RECOMMENDED)
# Go to https://app.netlify.com/projects/willowy-daifuku-0f6759
# Click "Trigger deploy" → "Deploy site"
```

---

## 📊 Monitoring Deployments

### Via CLI:
```bash
# Check site status
netlify status

# Open site in browser
netlify open:site

# Open admin dashboard
netlify open:admin

# View deploy logs
netlify watch
```

### Via Dashboard:
Visit: https://app.netlify.com/projects/willowy-daifuku-0f6759/deploys

---

## 🔄 Deployment Configuration

### Netlify Config (`netlify.toml`):
- **Build Command:** `pnpm install && pnpm run build`
- **Publish Directory:** `.next`
- **Node Version:** 18
- **Functions:** Next.js API routes auto-deploy as serverless functions

### Next.js Config (`next.config.mjs`):
- **Output Mode:** Standalone (set automatically by @netlify/plugin-nextjs)
- **Image Optimization:** Unoptimized (handled by Cloudinary)
- **Build ID:** Timestamp-based for unique builds

---

## 🐛 Troubleshooting

### Deployment Fails on Netlify:
1. Check build logs in Netlify Dashboard
2. Verify all environment variables are set
3. Check MongoDB Atlas network access allows Netlify IPs
4. Verify Cloudinary credentials are correct

### Site Shows Errors:
1. Check Netlify Function logs
2. Verify MongoDB connection string
3. Check if all required env vars are set
4. Review recent commits for breaking changes

### Build Takes Too Long:
- Netlify has a 15-minute build timeout on free tier
- Consider upgrading to Pro if needed
- Optimize dependencies and build scripts

---

## 📝 Best Practices

1. **Always test locally with `npm run dev`** (dev server works fine on Windows)
2. **Push to GitHub** for production builds
3. **Monitor Netlify dashboard** for deployment status
4. **Use preview deployments** for branches other than `menu-blog`
5. **Keep environment variables in sync** between local `.env` and Netlify

---

## 🎯 Quick Commands

```bash
# Local development (works on Windows)
npm run dev

# Push and deploy
git add .
git commit -m "your changes"
git push origin menu-blog

# Check deployment status
netlify status

# Open live site
netlify open:site

# View environment variables
netlify env:list
```

---

**Last Updated:** October 5, 2025  
**Deployment Platform:** Netlify  
**Project:** PSAAS (Portfolio SaaS)
