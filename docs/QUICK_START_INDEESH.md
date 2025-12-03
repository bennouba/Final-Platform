# ⚡ Quick Start: Creating Indeesh Store

## Pre-Flight Check

### 1️⃣ Clean the Database
Run this command to check for and remove any existing Indeesh store data:

```bash
cd backend
node scripts/cleanup-store.js
```

**Expected output if system is clean:**
```
✅ No existing store found
✅ No existing users found
✅ No cleanup needed. System is clean and ready for store creation!
```

**If data exists:**
- Script automatically deletes it
- Shows confirmation

### 2️⃣ Verify Backend is Running
Make sure the backend server is running on port 4000:

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd .  (from project root)
npm run dev
```

Check health endpoint:
```bash
curl http://localhost:4000/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-18T..."
}
```

## Creating the Store

### 3️⃣ Open Store Creation Wizard

1. Navigate to frontend (http://localhost:5173 or similar)
2. Click "إنشاء متجر" or similar option to start store creation
3. Fill in the wizard steps (1-7):

| Step | Information |
|------|-------------|
| 1 | Owner Name, Email, Phone |
| 2 | Store name (Arabic): Indeesh |
| 3 | Store slug: indeesh |
| 4 | Store description |
| 5 | Add products |
| 6 | Add sliders |
| 7 | Upload logo/documents |

### 4️⃣ Complete Step 8 - Create Store

**At Step 8:**
1. Review all information
2. Verify:
   - ✅ Store name: Indeesh
   - ✅ Store slug: indeesh
   - ✅ Emails: salem.eshger@gmail.com or fahmi.aghmati@gmail.com
3. Click "إنشاء المتجر" (Create Store)

**System will automatically:**
- ✅ Check backend is running
- ✅ Check no duplicates exist
- ✅ Validate all form data
- ✅ Upload images to backend
- ✅ Create store files and directories
- ✅ Show success modal

### 5️⃣ Verify Success

After successful creation:
- ✅ Success modal appears
- ✅ Store appears on homepage
- ✅ Files created in `backend/public/assets/indeesh/`
- ✅ Database shows new store record

---

## 🆘 Troubleshooting

### Error: "الخادم غير متاح" (Server Unavailable)
**Solution**:
```bash
# Check if backend is running
curl http://localhost:4000/health

# If not, restart it
cd backend
npm run dev
```

### Error: "موجود مسبقاً" (Already Exists)
**Solution**:
```bash
# Clean up existing data
cd backend
node scripts/cleanup-store.js

# Then retry store creation
```

### Error: "البريد موجود بالفعل" (Email Already Registered)
**Solution**:
```bash
# Run cleanup script to delete existing users
cd backend
node scripts/cleanup-store.js
```

### Store Created But Files Missing
**Check**:
1. Backend still running?
   ```bash
   curl http://localhost:4000/health
   ```

2. Check logs for errors:
   ```bash
   # Look for error messages in terminal running `npm run dev`
   ```

3. Check if files were created:
   ```bash
   ls -la backend/public/assets/indeesh/
   ```

---

## 📋 Checklist

Before you start:
- [ ] Backend server running (`npm run dev` in backend folder)
- [ ] Frontend server running (`npm run dev` in project root)
- [ ] Ran cleanup script (`node backend/scripts/cleanup-store.js`)
- [ ] Got "No cleanup needed" or cleanup completed message
- [ ] Backend health check passes (`curl http://localhost:4000/health`)

During creation:
- [ ] Filled all 7 steps
- [ ] Selected appropriate store name (Indeesh)
- [ ] Provided valid email addresses
- [ ] Added at least one product
- [ ] Uploaded product images

After creation:
- [ ] Success modal appeared
- [ ] Store name shows on homepage
- [ ] Files exist: `backend/public/assets/indeesh/`

---

## 📞 File Locations

**Frontend Store Creation**: 
- `src/pages/CreateStorePage.tsx`

**Backend Store Controller**: 
- `backend/src/routes/storeController.ts`
- `backend/src/routes/storeRoutes.ts`

**Cleanup Script**: 
- `backend/scripts/cleanup-store.js`

**Store Assets**: 
- `backend/public/assets/indeesh/`

---

## 🎯 Summary

```
1. Run cleanup script
   ↓
2. Verify system clean
   ↓
3. Fill store creation form
   ↓
4. System validates all data
   ↓
5. System uploads files
   ↓
6. System creates store
   ↓
7. Success modal shows
   ↓
8. Store appears on homepage ✅
```

---

**Ready? Let's create Indeesh! 🚀**

For more details, see:
- `CLEANUP_INSTRUCTIONS.md` - Detailed cleanup procedures
- `STORE_CREATION_CHANGES.md` - Technical changes documentation
