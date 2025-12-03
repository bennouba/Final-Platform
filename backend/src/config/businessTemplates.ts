interface CategoryTemplate {
  name: string;
  nameAr: string;
  description?: string;
  image?: string;
  sortOrder: number;
}

interface ProductTemplate {
  name: string;
  nameAr: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  discountType?: string;
  image: string;
  images?: string[];
  quantity: number;
  productCode?: string;
  barcode?: string;
  brand?: string;
}

interface BusinessTemplate {
  type: string;
  name: string;
  nameAr: string;
  categories: CategoryTemplate[];
  products: ProductTemplate[];
}

const businessTemplates: BusinessTemplate[] = [
  {
    type: 'clothing',
    name: 'Clothing Store',
    nameAr: 'متجر ملابس',
    categories: [
      {
        name: 'Women\'s Clothing',
        nameAr: 'ملابس نسائية',
        description: 'Fashionable clothing for women',
        sortOrder: 1,
      },
      {
        name: 'Men\'s Clothing',
        nameAr: 'ملابس رجالية',
        description: 'Stylish clothing for men',
        sortOrder: 2,
      },
      {
        name: 'Youth Clothing',
        nameAr: 'ملابس شبابية',
        description: 'Trendy clothing for young adults',
        sortOrder: 3,
      },
      {
        name: 'Occasion Clothing',
        nameAr: 'ملابس مناسبات',
        description: 'Special occasion dresses and suits',
        sortOrder: 4,
      },
      {
        name: 'Children\'s Clothing',
        nameAr: 'ملابس أطفال',
        description: 'Cute and comfortable clothing for kids',
        sortOrder: 5,
      },
      {
        name: 'Newborn Clothing',
        nameAr: 'ملابس مواليد',
        description: 'Soft and gentle clothing for newborns',
        sortOrder: 6,
      },
    ],
    products: [
      // Women's Clothing
      {
        name: 'Elegant Evening Dress',
        nameAr: 'فستان أنيق للمساء',
        description: 'Beautiful evening dress perfect for special occasions',
        price: 89.99,
        originalPrice: 120.00,
        discountPercent: 25,
        discountType: 'season_end',
        image: '/assets/products/clothing/womens-dress-1.jpg',
        images: ['/assets/products/clothing/womens-dress-1.jpg', '/assets/products/clothing/womens-dress-1-2.jpg'],
        quantity: 15,
        productCode: 'WD001',
        barcode: '1234567890123',
        brand: 'Fashion Brand',
      },
      {
        name: 'Casual Summer Blouse',
        nameAr: 'بلوزة صيفية كاجوال',
        description: 'Light and comfortable blouse for summer days',
        price: 29.99,
        image: '/assets/products/clothing/womens-blouse-1.jpg',
        quantity: 25,
        productCode: 'WB001',
        barcode: '1234567890124',
        brand: 'Summer Collection',
      },
      // Men's Clothing
      {
        name: 'Classic Business Suit',
        nameAr: 'بدلة أعمال كلاسيكية',
        description: 'Professional suit for business meetings',
        price: 199.99,
        originalPrice: 250.00,
        discountPercent: 20,
        discountType: 'store_clearance',
        image: '/assets/products/clothing/mens-suit-1.jpg',
        images: ['/assets/products/clothing/mens-suit-1.jpg', '/assets/products/clothing/mens-suit-1-2.jpg'],
        quantity: 8,
        productCode: 'MS001',
        barcode: '1234567890125',
        brand: 'Business Wear',
      },
      {
        name: 'Casual Polo Shirt',
        nameAr: 'قميص بولو كاجوال',
        description: 'Comfortable polo shirt for everyday wear',
        price: 24.99,
        image: '/assets/products/clothing/mens-polo-1.jpg',
        quantity: 30,
        productCode: 'MP001',
        barcode: '1234567890126',
        brand: 'Casual Wear',
      },
      // Youth Clothing
      {
        name: 'Trendy Hoodie',
        nameAr: 'هودي عصري',
        description: 'Stylish hoodie perfect for young adults',
        price: 39.99,
        originalPrice: 49.99,
        discountPercent: 20,
        discountType: 'new_year',
        image: '/assets/products/clothing/youth-hoodie-1.jpg',
        quantity: 20,
        productCode: 'YH001',
        barcode: '1234567890127',
        brand: 'Youth Fashion',
      },
      // Children's Clothing
      {
        name: 'Cute Kids Dress',
        nameAr: 'فستان أطفال جميل',
        description: 'Adorable dress for little girls',
        price: 19.99,
        image: '/assets/products/clothing/kids-dress-1.jpg',
        quantity: 12,
        productCode: 'KD001',
        barcode: '1234567890128',
        brand: 'Kids Wear',
      },
      // Newborn Clothing
      {
        name: 'Soft Baby Onesie',
        nameAr: 'بدلة رضع ناعمة',
        description: 'Ultra-soft onesie for newborns',
        price: 14.99,
        image: '/assets/products/clothing/baby-onesie-1.jpg',
        quantity: 18,
        productCode: 'BO001',
        barcode: '1234567890129',
        brand: 'Baby Care',
      },
    ],
  },
  {
    type: 'beauty',
    name: 'Beauty Store',
    nameAr: 'متجر تجميل',
    categories: [
      {
        name: 'Skincare',
        nameAr: 'عناية بالبشرة',
        description: 'Products for healthy and glowing skin',
        sortOrder: 1,
      },
      {
        name: 'Makeup',
        nameAr: 'مكياج',
        description: 'Cosmetics and makeup products',
        sortOrder: 2,
      },
      {
        name: 'Hair Care',
        nameAr: 'عناية بالشعر',
        description: 'Shampoos, conditioners, and hair treatments',
        sortOrder: 3,
      },
      {
        name: 'Fragrances',
        nameAr: 'عطور',
        description: 'Perfumes and colognes',
        sortOrder: 4,
      },
    ],
    products: [
      {
        name: 'Hydrating Face Cream',
        nameAr: 'كريم وجه مرطب',
        description: 'Deeply hydrating cream for all skin types',
        price: 34.99,
        originalPrice: 45.00,
        discountPercent: 22,
        discountType: 'eid_al_fitr',
        image: '/assets/products/beauty/face-cream-1.jpg',
        quantity: 20,
        productCode: 'FC001',
        barcode: '2234567890123',
        brand: 'SkinGlow',
      },
      {
        name: 'Luxury Lipstick',
        nameAr: 'أحمر شفاه فاخر',
        description: 'Long-lasting, moisturizing lipstick',
        price: 19.99,
        image: '/assets/products/beauty/lipstick-1.jpg',
        quantity: 15,
        productCode: 'LP001',
        barcode: '2234567890124',
        brand: 'Beauty Luxe',
      },
    ],
  },
  {
    type: 'electronics',
    name: 'Electronics Store',
    nameAr: 'متجر إلكترونيات',
    categories: [
      {
        name: 'Smartphones',
        nameAr: 'هواتف ذكية',
        description: 'Latest smartphones and accessories',
        sortOrder: 1,
      },
      {
        name: 'Laptops',
        nameAr: 'حواسيب محمولة',
        description: 'Portable computers and laptops',
        sortOrder: 2,
      },
      {
        name: 'Accessories',
        nameAr: 'إكسسوارات',
        description: 'Phone cases, chargers, and tech accessories',
        sortOrder: 3,
      },
    ],
    products: [
      {
        name: 'Latest Smartphone',
        nameAr: 'هاتف ذكي حديث',
        description: 'High-performance smartphone with advanced features',
        price: 699.99,
        originalPrice: 799.99,
        discountPercent: 12,
        discountType: 'summer',
        image: '/assets/products/electronics/smartphone-1.jpg',
        quantity: 10,
        productCode: 'SP001',
        barcode: '3234567890123',
        brand: 'TechBrand',
      },
      {
        name: 'Gaming Laptop',
        nameAr: 'حاسوب محمول للألعاب',
        description: 'Powerful laptop for gaming and work',
        price: 1299.99,
        image: '/assets/products/electronics/laptop-1.jpg',
        quantity: 5,
        productCode: 'LP001',
        barcode: '3234567890124',
        brand: 'GameTech',
      },
    ],
  },
];

export type { BusinessTemplate, CategoryTemplate, ProductTemplate };
export { businessTemplates };
