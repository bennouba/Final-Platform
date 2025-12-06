# Render Deployment Configuration Guide

## Backend Service (Node.js/Express)

### Build & Start Commands
```
Build: cd backend && npm install && npm run build
Start: cd backend && npm start
```

### Environment Variables Required
```
NODE_ENV=production
DB_HOST=your-mysql-host
DB_PORT=3306
DB_USER=eishro_user
DB_PASSWORD=your-secure-password
DB_NAME=eishro_db
JWT_SECRET=your-jwt-secret-key
MOAMALAT_MID=10081014649
MOAMALAT_TID=99179395
MOAMALAT_SECRET=3a488a89b3f7993476c252f017c488bb
MOAMALAT_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Health Check
- Path: `/api/health`
- Interval: 60 seconds

### Important Notes
- Backend should run on port 5000 (default)
- Database must be externally hosted (MySQL)
- CORS should allow frontend origin

---

## Frontend Service (Vite React)

### Build & Start Commands
```
Build: npm install && npm run build
Start: serve dist (handled by Render)
```

### Environment Variables Required
```
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_BACKEND_URL=https://your-backend-url.onrender.com
VITE_FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Output Directory
- `dist` (Vite build output)

---

## Connection Between Services

### Frontend → Backend
- Frontend makes API calls to: `VITE_API_URL` (Render Backend URL)
- Calls reach: `https://your-backend-service.onrender.com/api`

### Backend → Frontend
- Used for CORS setup and redirects
- Configuration: `FRONTEND_URL` env variable

---

## Deployment Steps

1. **Push to GitHub**
   - ✅ Done: Project synced to bennouba/Final-Platform

2. **Connect GitHub to Render**
   - Go to Render Dashboard
   - Create New → Web Service
   - Connect GitHub repository
   - Select branch: `main`

3. **Configure Backend Service**
   - Service Name: eishro-backend
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
   - Add all environment variables from above

4. **Configure Frontend Service**
   - Service Name: eishro-frontend
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Add environment variables

5. **Verify Deployment**
   - Backend: Check `/api/health` endpoint
   - Frontend: Check if it loads without errors
   - Test API connectivity

---

## Database Setup

Render does NOT include a built-in MySQL database.

**Options:**
1. **External MySQL Host** (Recommended)
   - AWS RDS
   - DigitalOcean Managed DB
   - Supabase PostgreSQL
   - PlanetScale MySQL

2. **Connection String Format**
   ```
   mysql://user:password@host:3306/eishro_db
   ```

---

## Troubleshooting

### Build Fails
- Check `package.json` build scripts
- Verify `typescript` is installed
- Check for missing dependencies

### Environment Variables Not Working
- Ensure variables are set in Render dashboard
- Restart service after updating variables
- Check variable names match exactly

### CORS Errors
- Update `backend/src/config/security.ts`
- Add Render frontend URL to allowed origins
- Restart backend service

### Database Connection Fails
- Verify database is running
- Check connection string
- Verify firewall rules allow Render IP

---

## Verification Checklist

- [ ] GitHub repository synced with latest code
- [ ] Render backend service created and connected
- [ ] Render frontend service created and connected
- [ ] All environment variables configured
- [ ] Backend starts without errors
- [ ] Frontend builds successfully
- [ ] API health check responds
- [ ] Frontend loads without CORS errors
- [ ] API calls from frontend succeed
- [ ] Payment gateway configured (Moamalat)
- [ ] Database connection verified

