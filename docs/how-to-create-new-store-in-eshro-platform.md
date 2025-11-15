# How to Create New Store in EISHRO Platform

## Overview

This comprehensive guide walks merchants through the process of creating and configuring a new store on the EISHRO e-commerce platform. The process is designed to be user-friendly and can be completed in under 15 minutes.

## Prerequisites

### Account Requirements
- ✅ Valid email address
- ✅ Phone number for verification
- ✅ Business identification (optional but recommended)
- ✅ Store logo and branding materials (prepared in advance)

### Technical Requirements
- ✅ Stable internet connection
- ✅ Modern web browser (Chrome, Firefox, Safari, Edge)
- ✅ Device with camera for photo uploads (recommended)

## Step-by-Step Store Creation Process

### Phase 1: Account Registration

#### Step 1.1: Access the Platform
```
🌐 Visit: https://eshro.ly
📱 Or download the mobile app
```

#### Step 1.2: Start Registration
1. Click **"تاجر جديد"** (New Merchant) on the homepage
2. Select your preferred registration method:
   - **Email Registration** (recommended)
   - **Phone Number** (alternative)

#### Step 1.3: Enter Basic Information
```json
{
  "email": "merchant@yourstore.com",
  "password": "SecurePassword123!",
  "firstName": "اسمك",
  "lastName": "لقبك",
  "phone": "+218 XX XXX XXXX"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

#### Step 1.4: Email Verification
1. Check your email inbox (and spam folder)
2. Click the verification link
3. Complete the email verification process

### Phase 2: Store Configuration

#### Step 2.1: Launch Store Creation Wizard
After email verification, you'll be automatically redirected to the store creation wizard.

#### Step 2.2: Choose Store Type
Select from pre-configured store templates:

**🛍️ Nawaem Fashion Store**
- Women's fashion and clothing
- Pre-configured categories: dresses, tops, bottoms, accessories
- Optimized for fashion retail

**💍 Sheirine Jewelry Store**
- Jewelry and accessories
- Categories: rings, necklaces, earrings, bracelets
- High-quality image display features

**🏪 Delta General Store**
- General retail products
- Flexible category structure
- Suitable for various product types

**💄 Magna Beauty Store**
- Cosmetics and beauty products
- Skincare, makeup, haircare categories
- Beauty-focused features

**🎨 Custom Store**
- Build from scratch
- Fully customizable categories
- Advanced configuration options

#### Step 2.3: Basic Store Information
```json
{
  "storeName": "اسم المتجر",
  "storeSlug": "store-url-slug",
  "category": "fashion|jewelry|general|beauty|custom",
  "description": "وصف المتجر (اختياري)",
  "storeType": "selected_template"
}
```

**Store Slug Guidelines:**
- Use lowercase letters only
- No spaces (use hyphens instead)
- Maximum 50 characters
- Must be unique across the platform

#### Step 2.4: Branding and Visual Identity
**Logo Upload:**
- Supported formats: PNG, JPG, SVG
- Recommended size: 500x500 pixels
- Maximum file size: 2MB
- Transparent background preferred

**Color Scheme:**
- Primary color (brand color)
- Secondary color (accent)
- Background color
- Text colors

**Banner Image (Optional):**
- Dimensions: 1200x400 pixels
- Used for store header
- Should represent your brand

### Phase 3: Product Setup

#### Step 3.1: Category Configuration
Based on your store type, initial categories are pre-configured. You can:

**Modify Existing Categories:**
- Rename categories
- Change display order
- Add subcategories

**Add New Categories:**
- Click "إضافة فئة جديدة"
- Enter category name in Arabic and English
- Upload category icon/image

#### Step 3.2: Add Your First Products
**Product Information Required:**
```json
{
  "name": "اسم المنتج",
  "description": "وصف تفصيلي للمنتج",
  "price": 99.99,
  "category": "selected_category",
  "sku": "unique_product_code",
  "quantity": 100,
  "images": ["image1.jpg", "image2.jpg"],
  "variants": {
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["أحمر", "أزرق", "أخضر"]
  }
}
```

**Product Image Guidelines:**
- Minimum 3 images per product
- High resolution (at least 1000x1000 pixels)
- Multiple angles and views
- Consistent styling

### Phase 4: Payment and Shipping Setup

#### Step 4.1: Payment Methods
The platform automatically integrates with:
- **مؤملات (Moamalat)** - Primary Libyan payment gateway
- **Cash on Delivery** - Available for all stores
- **Bank Transfer** - Direct bank payments

**Configuration Required:**
- Bank account details (for transfers)
- Delivery partner selection
- Payment preferences

#### Step 4.2: Shipping Configuration
**Delivery Partners:**
- Aramex
- Libyan Post
- Local couriers
- In-store pickup

**Shipping Zones:**
- Tripoli
- Benghazi
- Misrata
- Other cities
- International (future)

**Shipping Rates:**
- Free shipping thresholds
- Flat rates per zone
- Weight-based pricing

### Phase 5: Store Launch

#### Step 5.1: Final Review
Before launching, review:
- ✅ Store information accuracy
- ✅ Product catalog completeness
- ✅ Payment methods configured
- ✅ Shipping settings
- ✅ Branding and design

#### Step 5.2: Test Store
**Testing Checklist:**
- [ ] Store page loads correctly
- [ ] Products display properly
- [ ] Add to cart functionality
- [ ] Checkout process
- [ ] Payment integration
- [ ] Mobile responsiveness

#### Step 5.3: Go Live
1. Click **"Launch Store"**
2. Confirm launch
3. Receive confirmation email
4. Store becomes visible to customers

## Post-Launch Management

### Store Dashboard Overview
```
📊 Dashboard Features:
├── 📈 Sales Analytics
├── 📦 Order Management
├── 🛍️ Product Inventory
├── 👥 Customer Management
├── 💳 Payment Reports
└── ⚙️ Store Settings
```

### Essential First Steps
1. **Add More Products** - Expand your catalog
2. **Set Up Promotions** - Create special offers
3. **Configure Notifications** - Email and SMS alerts
4. **Connect Social Media** - Link your social accounts
5. **Set Up Customer Support** - Configure help channels

## Advanced Configuration

### Store Settings
**General Settings:**
- Store hours
- Contact information
- Return policy
- Terms and conditions

**SEO Optimization:**
- Meta descriptions
- Search keywords
- Store description for search engines

**Customer Communication:**
- Welcome messages
- Order confirmations
- Shipping notifications
- Customer service channels

### Analytics and Reporting
**Available Reports:**
- Sales performance
- Customer demographics
- Popular products
- Traffic sources
- Conversion rates

## Troubleshooting

### Common Issues

**❌ Store Not Loading**
- Check internet connection
- Clear browser cache
- Try different browser
- Contact support if persists

**❌ Products Not Displaying**
- Verify product images uploaded
- Check product status (active/inactive)
- Ensure categories are configured
- Review product information completeness

**❌ Payment Issues**
- Verify payment gateway configuration
- Check bank account details
- Ensure merchant account is verified
- Contact payment provider support

**❌ Orders Not Processing**
- Check inventory levels
- Verify shipping configuration
- Ensure payment methods are active
- Review order processing workflow

### Support Resources
```
🆘 Need Help?
├── 📧 Email: support@eshro.ly
├── 📱 WhatsApp: +218 XX XXX XXXX
├── 💬 Live Chat: Available 24/7
├── 📚 Help Center: https://help.eshro.ly
└── 📖 Documentation: https://docs.eshro.ly
```

## Best Practices

### Store Optimization
1. **High-Quality Images** - Professional product photography
2. **Detailed Descriptions** - Comprehensive product information
3. **Competitive Pricing** - Research market rates
4. **Fast Shipping** - Reliable delivery partners
5. **Customer Service** - Responsive support

### Marketing Tips
1. **Social Media Integration** - Link all social accounts
2. **SEO Optimization** - Use relevant keywords
3. **Promotions** - Regular discounts and offers
4. **Customer Reviews** - Encourage feedback
5. **Email Marketing** - Build customer list

### Security Measures
1. **Regular Backups** - Automatic data backups
2. **Secure Passwords** - Strong authentication
3. **Two-Factor Authentication** - Enable 2FA
4. **Monitor Activity** - Regular security checks
5. **Update Regularly** - Keep platform updated

## Success Metrics

### Key Performance Indicators
- **Store Visibility**: Profile completion percentage
- **Product Catalog**: Number of active products
- **Sales Performance**: Monthly revenue targets
- **Customer Satisfaction**: Review ratings and feedback
- **Order Fulfillment**: On-time delivery rates

### Growth Milestones
```
📈 Month 1: Store setup and first sales
📈 Month 3: 100+ products, consistent sales
📈 Month 6: 1000+ customers, established reputation
📈 Month 12: Multiple revenue streams, brand recognition
```

## Conclusion

Creating a store on the EISHRO platform is designed to be straightforward and merchant-friendly. By following this guide, you'll have a professional online store ready to serve Libyan customers within minutes.

**Remember:** Your success depends on consistent effort, quality products, excellent customer service, and regular engagement with your audience.

**Need assistance?** Our support team is available 24/7 to help you succeed on the EISHRO platform.

---

*This guide was last updated in November 2025 for EISHRO Platform version 5.0*