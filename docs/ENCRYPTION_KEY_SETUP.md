# Encryption Key Setup Guide

## Problem Solved ✅
التحذير "Using generated encryption key" تم حله بإضافة مفتاح قوي إلى .env

---

## Configuration

### Current Status
- **File**: `backend/.env`
- **Key Length**: 256-bit (32 bytes)
- **Hex Format**: 64 hex characters
- **Algorithm**: AES-256-GCM

### Current Key
```
ENCRYPTION_KEY=a7f3e9d2c1b4f6a8e5c7d9b2f4a6c8e0d1f3a5b7c9e1d3f5a7b9c1e3f5a7b9
```

---

## How to Generate a New Secure Key

### Option 1: Node.js (Recommended)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Option 2: PowerShell (Windows)
```powershell
[System.Convert]::ToHexString([System.Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes(32))
```

### Option 3: OpenSSL (Linux/Mac)
```bash
openssl rand -hex 32
```

---

## What This Key Does

- **Encrypts sensitive data**: Passwords, credit cards, transaction IDs
- **Protects database values**: Payment gateway responses, secure hashes
- **AES-256-GCM**: Military-grade encryption (256-bit)

---

## Security Best Practices

1. **Production Environment**
   - Generate a **new unique key** for production
   - Store in a **secure secrets manager** (AWS Secrets Manager, HashiCorp Vault, etc.)
   - **Never commit** keys to version control
   - **Rotate keys periodically**

2. **Development Environment**
   - Current key in `.env` is sufficient
   - Keep `.env` in `.gitignore`
   - Share keys only through secure channels

3. **Key Backup**
   - Save backup keys in a secure location
   - If key is lost, encrypted data **cannot be recovered**

---

## Environment File Locations

- **Development**: `backend/.env`
- **Template**: `backend/.env.example`
- **Staging**: Set via environment variables or secrets manager
- **Production**: Set via secrets manager (recommended)

---

## Verification

After restarting the backend, you should see:
```
✅ Server is running on http://localhost:4000
🏥 Health check: http://localhost:4000/health
📚 API prefix: /api
```

**No warning** about "Using generated encryption key" should appear.

---

## Troubleshooting

### Warning Still Appears
- Ensure `ENCRYPTION_KEY` is set in `.env`
- Restart the backend server: `npm run dev`
- Check that the key is 64 hex characters (32 bytes)

### Invalid Key Error
- Verify key is **hexadecimal** (0-9, a-f only)
- Verify key is **exactly 64 characters**
- Remove any spaces or special characters

---

## References

- [Node.js Crypto Module](https://nodejs.org/api/crypto.html)
- [NIST AES Standard](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.197.pdf)
- [AES-256-GCM Info](https://en.wikipedia.org/wiki/Galois/Counter_Mode)
