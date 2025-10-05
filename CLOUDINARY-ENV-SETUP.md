# Cloudinary Upload Fix - Environment Variables Setup

## 🚨 The Issue
Cloudinary uploads are failing because environment variables are not set in Netlify.

## ✅ Quick Fix Steps

### 1. Get Your Cloudinary Credentials
Go to: https://cloudinary.com/console
- **Cloud Name**: Found in dashboard (e.g., "dracarys")
- **API Key**: Found in dashboard
- **API Secret**: Found in dashboard (click "API Keys" tab)

### 2. Add to Netlify
1. Go to: https://app.netlify.com/sites/zenitthhhhh/configuration/env
2. Click "Add a variable" or "New variable"
3. Add these THREE variables:

```
CLOUDINARY_CLOUD_NAME = your_cloud_name
CLOUDINARY_API_KEY = your_api_key  
CLOUDINARY_API_SECRET = your_api_secret
```

### 3. Deploy
After saving the variables, trigger a new deploy:
- Either push a new commit
- Or click "Trigger deploy" → "Deploy site" in Netlify dashboard

### 4. Test
Once deployed, go to Admin → Settings tab and try uploading an image.

## 🔍 Verify Locally (Optional)

Create `.env.local` file in project root:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MONGODB_URI=your_mongodb_uri
MONGODB_DB=portfolio
```

**Note:** Never commit `.env.local` to git (it's already in .gitignore)

## 📊 Current Status
- ✅ Code is correct (externalized in netlify.toml)
- ✅ Error handling is comprehensive  
- ❌ Environment variables missing in Netlify
- ⏳ Waiting for you to add them

---

**Last Updated:** October 5, 2025
