# Store Creation - System Updates

## 📋 Summary of Changes

This document summarizes the **validation and duplicate prevention** system added to ensure the "Indeesh" store can be safely created or recreated.

---

## 🔧 Backend Changes

### 1. **Store Controller Updates** (`src/routes/storeController.ts`)

#### A. Enhanced `createStoreWithImages` Function
- **Added validation**: Checks if store name/slug already exists
- **Added validation**: Checks if owner email(s) are already registered
- **Returns 409 Conflict**: If duplicates are found
- **Sequelize ORM**: Uses proper `Op.or` syntax for queries

**Validation Order**:
1. Basic field validation
2. Store slug uniqueness check
3. Store name uniqueness check
4. Primary email uniqueness check
5. Secondary email uniqueness check
6. File processing and storage generation

#### B. New `checkStoreExists` Function
- **Purpose**: Check if store/emails exist WITHOUT modifying data
- **Endpoint**: `POST /api/stores/check-exists`
- **Request Body**:
  ```json
  {
    "storeName": "Indeesh",
    "storeSlug": "indeesh",
    "email1": "salem.eshger@gmail.com",
    "email2": "fahmi.aghmati@gmail.com"
  }
  ```
- **Response**: Returns existence status with details

#### C. New `cleanupStoreAndUsers` Function
- **Purpose**: Delete existing store/users safely
- **Endpoint**: `POST /api/stores/cleanup`
- **Request Body**:
  ```json
  {
    "storeName": "Indeesh",
    "storeSlug": "indeesh",
    "email1": "salem.eshger@gmail.com",
    "email2": "fahmi.aghmati@gmail.com",
    "deleteStore": true,
    "deleteUsers": true
  }
  ```
- **Requires explicit flags**: Won't delete without `deleteStore` or `deleteUsers` set to true

### 2. **Store Routes** (`src/routes/storeRoutes.ts`)

Added new endpoints:
```typescript
router.post('/check-exists', checkStoreExists);
router.post('/cleanup', cleanupStoreAndUsers);
```

**Full endpoint paths**:
- Check: `POST /api/stores/check-exists`
- Cleanup: `POST /api/stores/cleanup`
- Create: `POST /api/stores/create-with-images`

---

## 🎨 Frontend Changes

### 1. **Create Store Page** (`src/pages/CreateStorePage.tsx`)

#### A. Pre-Submission Duplicate Check
- Added new check step before database write
- Calls `/api/stores/check-exists` endpoint
- **Shows alert** if store/emails already exist
- **Prevents form submission** if duplicates found

**Check Code** (Line ~411-438):
```typescript
const checkResponse = await fetch('http://localhost:4000/api/stores/check-exists', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    storeName: formData.nameAr,
    storeSlug: formData.subdomain,
    email1: formData.email,
    email2: formData.alternateEmail || null
  })
});
```

#### B. Enhanced FormData for Backend
- Added `ownerEmail` field
- Added `ownerSecondEmail` field
- These fields are now sent to backend for validation

**Updated FormData** (Line ~568-569):
```typescript
apiFormData.append('ownerEmail', formData.email);
apiFormData.append('ownerSecondEmail', formData.alternateEmail || '');
```

---

## 🧹 Cleanup Script

### Location
`backend/scripts/cleanup-store.js`

### Purpose
Automated script to safely check and clean up existing store/users from the database

### Usage
```bash
# Navigate to backend directory
cd backend

# Run the cleanup script
node scripts/cleanup-store.js
```

### What It Does
1. Connects to the database
2. Checks for store "Indeesh" (by name or slug)
3. Checks for both email addresses
4. Shows what exists
5. Automatically deletes if found
6. Confirms completion

### Example Output
```
🔌 Connecting to database...
✅ Database connection established

🔍 Checking for existing data...

⚠️  Found store(s):
   - ID: 1, Name: Indeesh, Slug: indeesh

⚠️  Found user(s):
   - ID: uuid-123, Email: salem.eshger@gmail.com, Name: Salem Eshger
   - ID: uuid-456, Email: fahmi.aghmati@gmail.com, Name: Fahmi Aghmati

⚠️  Data exists. Proceeding with cleanup...

🗑️  Deleted store(s)
🗑️  Deleted user(s)

✅ Cleanup completed successfully!
```

---

## 📊 Database Validation Layer

### Store Model Constraints
- **slug**: UNIQUE constraint
- **name**: NO constraint (but checked in application)
- **merchantId**: Foreign key to users table

### User Model Constraints
- **email**: UNIQUE constraint (database level)
- **storeSlug**: UNIQUE constraint (if set)

### Application-Level Validation
- Checks both slug and name uniqueness
- Checks both email addresses
- All checks are case-insensitive
- Returns 409 Conflict if validation fails

---

## 🚀 Step-by-Step: Creating Indeesh Store

### Step 1: Verify System is Clean
```bash
# Option A: Using the cleanup script
cd backend
node scripts/cleanup-store.js

# Option B: Using curl
curl -X POST http://localhost:4000/api/stores/check-exists \
  -H "Content-Type: application/json" \
  -d '{
    "storeName": "Indeesh",
    "storeSlug": "indeesh",
    "email1": "salem.eshger@gmail.com",
    "email2": "fahmi.aghmati@gmail.com"
  }'
```

### Step 2: Verify Expected Response
```json
{
  "success": true,
  "message": "Store existence check completed",
  "data": {
    "store": null,
    "emails": []
  },
  "exists": false
}
```

### Step 3: Proceed with Store Creation
- Open the frontend store creation wizard
- Fill in all required information:
  - Owner Name
  - Email: salem.eshger@gmail.com or fahmi.aghmati@gmail.com
  - Store Name: Indeesh
  - Store Slug: indeesh
  - Add products and sliders
- Click "إنشاء المتجر" (Create Store) at step 8

### Step 4: Validation Flow
1. ✅ Backend health check
2. ✅ Duplicate store/email check
3. ✅ Form validation
4. ✅ File upload to backend
5. ✅ Store file generation
6. ✅ Success modal display

---

## 🔍 Error Messages

### If Store Already Exists
**Frontend Alert**:
```
موجود مسبقاً: متجر "Indeesh". يجب حذفها أولاً قبل الإنشاء.
```
(Already exists: Store "Indeesh". Must be deleted first before creating.)

**Backend Error** (409):
```json
{
  "success": false,
  "message": "Store with name \"Indeesh\" or slug \"indeesh\" already exists in the system"
}
```

### If Email Already Registered
**Backend Error** (409):
```json
{
  "success": false,
  "message": "Email \"salem.eshger@gmail.com\" is already registered in the system"
}
```

---

## 📝 Testing Checklist

- [ ] Backend server running on port 4000
- [ ] Database connection working
- [ ] Run cleanup script (shows no data exists)
- [ ] Fill store creation form with Indeesh data
- [ ] Form passes all 10 steps validation
- [ ] Click "Create Store" button
- [ ] No duplicate warnings appear
- [ ] Success modal shows
- [ ] Store appears on homepage
- [ ] Files created in backend assets folder

---

## 🆚 Before vs After

### Before These Changes
- ❌ No duplicate prevention
- ❌ Could create multiple stores with same name/email
- ❌ No easy way to clean up existing data
- ❌ Validation only in frontend localStorage

### After These Changes
- ✅ Database-level uniqueness validation
- ✅ Prevents duplicate stores/emails at API level
- ✅ Safe cleanup endpoint provided
- ✅ Automated cleanup script included
- ✅ Multi-layer validation (frontend + backend)
- ✅ Clear error messages for conflicts

---

## 🔗 Related Documentation

- **CLEANUP_INSTRUCTIONS.md**: Detailed cleanup procedures and troubleshooting
- **Backend API**: `/api/stores/` endpoints
- **Frontend**: Store creation wizard in CreateStorePage.tsx

---

## ⚡ Quick Reference

| Action | Command/Endpoint | Purpose |
|--------|-----------------|---------|
| Check Status | `POST /api/stores/check-exists` | See if data exists |
| Cleanup Data | `POST /api/stores/cleanup` | Delete store/users |
| Run Cleanup | `node backend/scripts/cleanup-store.js` | Automated cleanup |
| Create Store | `POST /api/stores/create-with-images` | Create new store |
| Health Check | `GET /health` | Verify backend is running |

---

**Last Updated**: November 18, 2025
**System**: Eishro Platform V7
