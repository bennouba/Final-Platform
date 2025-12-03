# Indeesh Store Creation - Pre-Cleanup Verification

## ⚠️ Important: Check Before Store Creation

Before creating the **Indeesh** store, you MUST verify that the following DO NOT exist in the system:

### Store Information
- **Store Name**: Indeesh
- **Store Slug**: indeesh (or similar)

### Owner Email Addresses
- **Email 1**: salem.eshger@gmail.com
- **Email 2**: fahmi.aghmati@gmail.com

## ✅ Verification Steps

### Option 1: Using Backend Endpoints

1. **Check if data already exists:**
```bash
curl -X POST http://localhost:4000/api/stores/check-exists \
  -H "Content-Type: application/json" \
  -d '{
    "storeName": "Indeesh",
    "storeSlug": "indeesh",
    "email1": "salem.eshger@gmail.com",
    "email2": "fahmi.aghmati@gmail.com"
  }'
```

**Expected Response** (if not exists - OK to proceed):
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

**If it returns exists: true**, then proceed to cleanup.

2. **Cleanup existing data (if found):**
```bash
curl -X POST http://localhost:4000/api/stores/cleanup \
  -H "Content-Type: application/json" \
  -d '{
    "storeName": "Indeesh",
    "storeSlug": "indeesh",
    "email1": "salem.eshger@gmail.com",
    "email2": "fahmi.aghmati@gmail.com",
    "deleteStore": true,
    "deleteUsers": true
  }'
```

**Expected Response** (after cleanup):
```json
{
  "success": true,
  "message": "Cleanup completed",
  "deleted": {
    "store": true,
    "users": [
      "salem.eshger@gmail.com",
      "fahmi.aghmati@gmail.com"
    ]
  }
}
```

### Option 2: Using MySQL Command Line

If you have direct database access:

```sql
-- Check for store
SELECT * FROM stores WHERE name = 'Indeesh' OR slug = 'indeesh';

-- Check for users
SELECT * FROM users WHERE email IN ('salem.eshger@gmail.com', 'fahmi.aghmati@gmail.com');

-- Delete store (if exists)
DELETE FROM stores WHERE name = 'Indeesh' OR slug = 'indeesh';

-- Delete users (if exists)
DELETE FROM users WHERE email IN ('salem.eshger@gmail.com', 'fahmi.aghmati@gmail.com');
```

## 🚀 After Cleanup

Once you've verified that:
- ✅ Store "Indeesh" doesn't exist
- ✅ Email "salem.eshger@gmail.com" is NOT registered
- ✅ Email "fahmi.aghmati@gmail.com" is NOT registered

You can proceed to create the store through the frontend at step 8. The system will:

1. **Pre-check validation**: Verify again that store/emails don't exist
2. **Backend health check**: Ensure the backend is running
3. **Store creation**: Create all necessary files and directories
4. **Success notification**: Show success modal and update homepage

## 🔍 Validation Logic

The system now validates at multiple levels:

### Frontend Check (Before Form Submission)
- Validates form data
- Checks backend health

### Backend Check (Before Database Write)
- Verifies store slug is unique
- Verifies store name is unique
- Verifies owner email is not already registered
- Verifies secondary email is not already registered

If any duplicate is found, the API returns a **409 Conflict** error with a clear message.

## ⚙️ Technical Details

### New Endpoints Added

1. **POST `/api/stores/check-exists`**
   - Check if store/emails already exist
   - No data modification
   - Safe to call multiple times

2. **POST `/api/stores/cleanup`**
   - Delete existing store and/or users
   - Requires `deleteStore` and `deleteUsers` flags
   - Must be called before recreating

3. **Modified POST `/api/stores/create-with-images`**
   - Now validates store/email uniqueness
   - Returns 409 if duplicates found
   - Only creates store if all validations pass

## 📝 Notes

- All email checks are **case-insensitive** in the database
- Store slugs must be unique and lowercase
- Once cleanup is done, wait a moment before creating the new store
- Check browser console for detailed error messages if issues occur
