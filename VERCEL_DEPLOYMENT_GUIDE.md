# Vercel Deployment Configuration Guide

## Frontend Service (Vite React + TypeScript)

### Build Configuration
```json
{
  "version": 2,
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci --include=dev",
  "rewrites": [
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ],
  "regions": ["iad1"]
}
```

### Environment Variables Required

**Production Environment:**
```
VITE_API_URL=https://your-render-backend.onrender.com/api
VITE_BACKEND_URL=https://your-render-backend.onrender.com
VITE_FRONTEND_URL=https://your-vercel-frontend.vercel.app
VITE_CORS_ORIGIN=https://your-render-backend.onrender.com
VITE_MOAMALAT_HASH_ENDPOINT=https://your-render-backend.onrender.com
VITE_MINIMAX_API_URL=https://api.minimax.chat/v1
VITE_MINIMAX_API_KEY=your-minimax-api-key
VITE_MINIMAX_ENABLED=true
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

**Development Environment:**
```
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
VITE_FRONTEND_URL=http://localhost:5173
VITE_MOAMALAT_HASH_ENDPOINT=http://localhost:5000
```

### Build Output
- **Framework**: Vite
- **Output Directory**: `dist`
- **Node Version**: 18.x or higher

### SPA (Single Page Application) Configuration
- All routes (except `/api/*`) redirect to `index.html`
- Allows React Router to handle client-side routing
- API routes (`/api/*`) pass through to backend

---

## Vercel Configuration Details

### Project Settings
```
Framework Preset: Other (Custom)
Build Command: npm run build
Output Directory: dist
Install Command: npm ci --include=dev
```

### Domains & SSL
- Auto HTTPS enabled
- Vercel provides free SSL certificate
- Custom domains supported

### Performance Optimizations
- Image Optimization: Enabled
- Automatic Compression: Enabled
- Edge Caching: Enabled

---

## GitHub Integration

### Automatic Deployments
1. **Vercel** automatically deploys on:
   - Push to `main` branch
   - Pull requests (preview deployments)
   - Manual redeploys from dashboard

2. **Branch Deployments**
   - Production: `main` branch
   - Preview: Pull requests
   - Development: Optional staging branch

### Webhook Configuration
- Vercel automatically sets up GitHub webhook
- Listens for `push` and `pull_request` events
- Triggers deployment automatically

---

## Environment Variables Setup in Vercel

### Step-by-Step Guide

1. Go to Vercel Project Settings
2. Navigate to "Environment Variables"
3. Add variables for each environment:

**Production**
- Add production API URL
- Add production backend URL
- Add Moamalat production keys

**Preview** (Pull Requests)
- Optional: Use production URLs or staging URLs
- Or use same as production

**Development**
- Local testing URLs (http://localhost:5000)

### Important Notes
- Variables are automatically injected at build time
- `VITE_` prefix makes them available to frontend code
- Redeploy after changing environment variables
- Use "Preview" link to test before production

---

## Deployment Process

### Automatic Deployment (Recommended)
1. Make changes locally
2. Commit to GitHub: `git commit -m "message"`
3. Push to main: `git push origin main`
4. Vercel automatically builds and deploys
5. Check deployment status at vercel.com

### Manual Deployment
1. Go to Vercel Project Dashboard
2. Click "Redeploy"
3. Select branch and redeploy
4. Wait for build to complete

### Rollback
1. Go to "Deployments" tab
2. Click on previous deployment
3. Click "Rollback to this Deployment"

---

## Frontend → Backend Communication

### API Base URL
```typescript
// Used in all API calls
const API_URL = import.meta.env.VITE_API_URL;
// Example: https://eishro-backend.onrender.com/api
```

### Payment Gateway Integration
```typescript
const MOAMALAT_ENDPOINT = import.meta.env.VITE_MOAMALAT_HASH_ENDPOINT;
// Example: https://eishro-backend.onrender.com
```

### Example API Call
```typescript
const response = await fetch(`${API_URL}/payment/moamalat/hash`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ orderId, amount, currency })
});
```

---

## Monitoring & Logs

### Real-time Logs
- Go to Deployments tab
- Click on active deployment
- View build and runtime logs

### Error Handling
- Check Function Logs for errors
- Check Application Logs for runtime issues
- Use browser DevTools for frontend errors

### Performance Analytics
- Vercel provides built-in analytics
- Monitor First Contentful Paint (FCP)
- Monitor Largest Contentful Paint (LCP)
- Monitor Cumulative Layout Shift (CLS)

---

## Common Issues & Solutions

### Build Fails
**Problem**: Build command fails
**Solution**:
- Run locally: `npm run build`
- Check for TypeScript errors
- Verify all dependencies installed
- Check `tsconfig.json` configuration

### CORS Errors
**Problem**: API calls fail with CORS error
**Solution**:
- Verify `VITE_API_URL` is correct
- Check backend CORS configuration
- Ensure backend is running
- Verify environment variables set

### Environment Variables Not Working
**Problem**: Variables showing as undefined
**Solution**:
- Verify variables set in Vercel dashboard
- Ensure `VITE_` prefix for frontend variables
- Redeploy after changing variables
- Check variable names exact match

### Deployment Hangs
**Problem**: Deployment stuck in progress
**Solution**:
- Cancel deployment and retry
- Check GitHub for hanging processes
- Try manual redeploy
- Check Vercel status page

---

## Verification Checklist

- [ ] `vercel.json` configured correctly
- [ ] Build command works locally: `npm run build`
- [ ] Output directory exists: `dist/`
- [ ] Environment variables set in Vercel
- [ ] GitHub connected to Vercel
- [ ] Automatic deployments enabled
- [ ] Frontend builds successfully on Vercel
- [ ] No build errors in Vercel logs
- [ ] Frontend loads at Vercel URL
- [ ] API calls succeed with backend URL
- [ ] CORS errors resolved
- [ ] Payment gateway working
- [ ] All routes load correctly
- [ ] Images load without issues

---

## Production Deployment Checklist

Before marking as production-ready:

- [ ] All features tested locally
- [ ] No console errors in browser
- [ ] API endpoints responding correctly
- [ ] Database queries optimized
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Custom domain configured (if needed)
- [ ] Performance acceptable (<3s load time)
- [ ] Mobile responsive layout working
- [ ] Payment gateway fully functional
- [ ] Analytics configured
- [ ] Error logging enabled
- [ ] Backup strategy in place

