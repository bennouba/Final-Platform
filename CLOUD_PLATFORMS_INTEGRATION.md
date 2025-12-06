# Cloud Platforms Integration Guide
## EISHRO Platform V7 - Complete Deployment Architecture

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    End User Browser                          │
└────────────────────────────┬────────────────────────────────┘
                             │
                    HTTPS Request/Response
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
        ▼                                         ▼
┌──────────────────────────┐          ┌──────────────────────────┐
│  VERCEL                  │          │  RENDER                  │
│  (Frontend)              │          │  (Backend)               │
│                          │          │                          │
│  - React + TypeScript    │◄─────────│  - Node.js + Express    │
│  - Vite Builder          │   API    │  - TypeScript            │
│  - Static Files (dist/)  │  Calls   │  - REST API              │
│  - Auto-deploy on push   │          │  - Auto-deploy on push   │
│                          │          │                          │
│  URL: *.vercel.app       │          │  URL: *.onrender.com     │
└──────────────────────────┘          └──────────────────────────┘
        │                                     │
        └─────────────────┬───────────────────┘
                          │
                  HTTP Requests
                          │
        ┌─────────────────┴──────────────────┐
        │                                    │
        ▼                                    ▼
┌──────────────────────┐          ┌──────────────────────┐
│  External Services   │          │  Third-party APIs    │
│  - Moamalat Payment  │          │  - Google OAuth      │
│  - Minimax AI        │          │  - AWS S3 (Images)   │
│  - Leaflet Maps      │          │  - Database Host     │
└──────────────────────┘          └──────────────────────┘
```

---

## Platform Responsibilities

### VERCEL (Frontend - React Application)

**Purpose**: Serve the user interface
- Build Vite project to static files
- Host on Vercel CDN
- Auto-deploy from GitHub push
- Handle SPA routing

**Technology Stack**:
- React 18+
- TypeScript
- Vite (build tool)
- Tailwind CSS
- Shadcn UI components

**Build Process**:
```
1. npm install (download dependencies)
2. npm run build (vite build → dist/)
3. Upload dist/ to Vercel CDN
4. Serve from nearest edge location
```

**Auto-deployment**:
- Trigger: Push to `main` branch on GitHub
- Build time: ~2-3 minutes
- Deploy time: ~1-2 minutes
- Total: ~5 minutes

---

### RENDER (Backend - Node.js Server)

**Purpose**: Provide REST API for frontend
- Run Express.js server
- Handle business logic
- Manage database connections
- Process payments
- Handle file uploads

**Technology Stack**:
- Node.js 18+
- Express.js
- TypeScript
- MySQL (external DB)
- JWT Authentication

**Start Process**:
```
1. npm install (download dependencies)
2. Compile TypeScript to JavaScript
3. Connect to MySQL database
4. Start Express server on port 5000
5. Listen for API requests from frontend
```

**Auto-deployment**:
- Trigger: Push to `main` branch on GitHub
- Build time: ~3-5 minutes
- Start time: ~1-2 minutes
- Total: ~6 minutes

---

## Communication Flow

### Frontend → Backend API Calls

```typescript
// In React component (Vercel hosted)
const API_URL = import.meta.env.VITE_API_URL;
// Points to: https://eishro-backend.onrender.com/api

// Make request
const response = await fetch(`${API_URL}/products`, {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
});

// Backend (Render hosted) receives and processes
// Response flows back to frontend and updates UI
```

### Data Flow Example: Product Search

```
1. User types in search box (Vercel)
2. Frontend: GET /api/products?search=phone
3. HTTP Request → Render backend
4. Backend: Query MySQL database
5. Backend: Return matching products (JSON)
6. HTTP Response → Vercel frontend
7. Frontend: Update UI with results
```

### Payment Processing Example: Moamalat

```
1. User clicks "Proceed to Payment" (Vercel)
2. Frontend: POST /api/payment/moamalat/hash
3. Backend validates and generates secure hash
4. Backend returns hash to frontend
5. Frontend opens Moamalat lightbox
6. User enters card details
7. Moamalat processes payment
8. Webhook callback to Backend
9. Backend updates order status
10. Frontend redirects to success page
```

---

## Environment Variables Configuration

### Required for VERCEL (Frontend)

```env
# Backend Connection
VITE_API_URL=https://eishro-backend.onrender.com/api
VITE_BACKEND_URL=https://eishro-backend.onrender.com
VITE_MOAMALAT_HASH_ENDPOINT=https://eishro-backend.onrender.com

# Third-party Services
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_MINIMAX_API_URL=https://api.minimax.chat/v1

# Application Settings
VITE_FRONTEND_URL=https://your-app.vercel.app
VITE_CORS_ORIGIN=https://eishro-backend.onrender.com
```

### Required for RENDER (Backend)

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
DB_HOST=your-mysql-host
DB_PORT=3306
DB_USER=eishro_user
DB_PASSWORD=secure-password
DB_NAME=eishro_db

# Authentication
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE=7d

# Payment Gateway (Moamalat)
MOAMALAT_MID=10081014649
MOAMALAT_TID=99179395
MOAMALAT_SECRET=3a488a89b3f7993476c252f017c488bb
MOAMALAT_ENV=production

# Frontend Connection
FRONTEND_URL=https://your-app.vercel.app

# Optional Services
MINIMAX_API_KEY=your-minimax-key
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
```

---

## Deployment Sequence

### Initial Setup (First Time)

```
1. Create GitHub repository (bennouba/Final-Platform)
2. Connect Vercel to GitHub
   - Select repository
   - Configure build settings
   - Add environment variables
   - Deploy
   
3. Connect Render to GitHub
   - Create Web Service
   - Select GitHub repository
   - Configure build commands
   - Add environment variables
   - Deploy

4. Verify Connectivity
   - Frontend loads at Vercel URL
   - Backend API responds at Render URL
   - Frontend API calls succeed
```

### Continuous Deployment

```
Every Git Push to main branch:

GitHub
  ↓
Vercel: Auto-build & deploy (~5 min)
Render: Auto-build & deploy (~6 min)
  ↓
Both live after successful deployment
```

---

## Health Checks & Monitoring

### Frontend Health (Vercel)
```
- Endpoint: https://your-app.vercel.app
- Expected: HTML page loads
- Check: Open in browser, no errors
- Monitor: Vercel analytics dashboard
```

### Backend Health (Render)
```
- Endpoint: https://eishro-backend.onrender.com/api/health
- Expected: JSON response {"status": "ok"}
- Check: curl or browser
- Monitor: Render logs dashboard
```

### Connectivity Test
```
1. From Vercel frontend:
   - Open console: F12 → Console
   - Test: fetch(`${API_URL}/health`)
   - Expected: Successful response

2. From Render backend logs:
   - Verify incoming requests
   - Check for CORS errors
   - Monitor response times
```

---

## Common Issues & Solutions

### Issue 1: CORS Errors
```
Error: "Access to XMLHttpRequest blocked by CORS policy"

Cause: Backend not allowing frontend domain

Solution:
1. Update backend/src/config/security.ts
2. Add Vercel URL to CORS whitelist
3. Redeploy backend
4. Clear browser cache
```

### Issue 2: API URL Mismatch
```
Error: "GET https://undefined/api/products 404"

Cause: VITE_API_URL not set in Vercel

Solution:
1. Go to Vercel Project Settings
2. Add VITE_API_URL environment variable
3. Redeploy frontend
4. Verify new URL in Network tab
```

### Issue 3: Database Connection Failed
```
Error: "ER_ACCESS_DENIED_FOR_USER"

Cause: Invalid DB credentials in Render

Solution:
1. Verify DB_HOST, DB_USER, DB_PASSWORD
2. Check database is running and accessible
3. Update Render environment variables
4. Restart Render service
5. Check logs: Render → Logs tab
```

### Issue 4: Deployment Takes Too Long
```
Problem: Build stuck for >15 minutes

Solution:
1. Check Vercel/Render logs for errors
2. Cancel deployment
3. Retry: Manual redeploy
4. If persists: Check GitHub for large files
5. Try: npm ci instead of npm install
```

---

## Updating Code

### Local Development
```bash
# Pull latest
git pull origin main

# Make changes
# Edit files...

# Test locally
npm run dev

# Commit changes
git add .
git commit -m "Feature: Your description"

# Push to GitHub
git push origin main

# Watch automatic deployment on both platforms
# Vercel: vercel.com dashboard
# Render: render.com dashboard
```

### Direct Changes (Not Recommended)
```bash
# If you need to fix immediately without GitHub:
1. Make changes locally
2. Push via git immediately
3. Both platforms redeploy automatically

# Never manually SSH into Render/Vercel
# Always use Git for changes
```

---

## Scaling Considerations

### Current Setup
- **Frontend**: Vercel free tier (sufficient for most loads)
- **Backend**: Render free tier (limited resources)
- **Database**: External hosting (scalable separately)

### When to Upgrade

**Upgrade Render** if:
- Response times exceed 3 seconds
- Frequent 503 Service Unavailable errors
- Traffic spikes cause crashes

**Upgrade Vercel** if:
- Build times exceed 10 minutes
- Page load times exceed 3 seconds
- Edge function timeouts

**Upgrade Database** if:
- Query times exceed 1 second
- Connection pool exhausted
- Disk space running low

---

## Disaster Recovery

### Rollback Deployment
```
1. Go to platform dashboard
2. Find previous successful deployment
3. Click "Promote to Production" or "Redeploy"
4. Verify application still works
```

### Restore from Git
```
1. If both platforms are broken
2. Go to GitHub: Commits history
3. Revert to last working commit
4. Both platforms automatically redeploy
```

### Database Backup
```
1. Recommend daily backups
2. Store backup copies externally
3. Test restore procedure monthly
```

---

## Verification Checklist

- [ ] GitHub repository accessible
- [ ] Vercel project created and connected
- [ ] Render service created and connected
- [ ] All environment variables set in both platforms
- [ ] Frontend builds successfully on Vercel
- [ ] Backend starts successfully on Render
- [ ] Frontend loads at Vercel URL
- [ ] Backend health check responds
- [ ] API calls from frontend succeed
- [ ] CORS errors resolved
- [ ] Payment gateway working
- [ ] Database connected and queries work
- [ ] Images/assets loading properly
- [ ] No console errors in frontend
- [ ] Auto-deployment working on git push

---

## Support & Debugging

### Get Help
```
Frontend Issues (Vercel):
- Dashboard: vercel.com
- Logs: Click deployment → logs
- Support: vercel.com/support

Backend Issues (Render):
- Dashboard: render.com
- Logs: Services → Logs
- Support: render.com/support
```

### Debug Techniques
```
1. Browser DevTools (F12)
   - Network tab: See API requests/responses
   - Console: JavaScript errors
   - Application: Check local storage

2. Backend Logs
   - Render: Real-time logs
   - Check error messages
   - Verify request received

3. Network Tools
   - curl: Test API endpoints
   - Postman: Test with different parameters
   - Console: Check environment variables
```

