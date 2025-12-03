import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  AlertTriangle,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Filter
} from 'lucide-react';
import { getDefaultProductImageSync } from '@/utils/imageUtils';

interface CleaningProduct {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  originalPrice?: number;
  category: 'detergents' | 'disinfectants' | 'cleaning_tools' | 'personal_hygiene' | 'laundry';
  brand: string;
  size: string;
  unit: string;
  stockQuantity: number;
  minStockLevel: number;
  images: string[];
  barcode?: string;
  sku: string;
  isActive: boolean;
  isOrganic: boolean;
  isEcoFriendly: boolean;
  expiryDate?: string;
  manufactureDate?: string;
  supplier: string;
  lastRestocked: string;
}

const CLEANING_CATEGORIES = [
  { value: 'detergents', label: 'منظفات', labelEn: 'Detergents' },
  { value: 'disinfectants', label: 'مطهرات', labelEn: 'Disinfectants' },
  { value: 'cleaning_tools', label: 'أدوات تنظيف', labelEn: 'Cleaning Tools' },
  { value: 'personal_hygiene', label: 'عناية شخصية', labelEn: 'Personal Hygiene' },
  { value: 'laundry', label: 'غسيل', labelEn: 'Laundry' }
];

const SAMPLE_CLEANING_PRODUCTS: CleaningProduct[] = [
  {
    id: 'clean-001',
    name: 'مسحوق الغسيل الأصلي',
    nameEn: 'Original Washing Powder',
    description: 'مسحوق غسيل عالي الجودة لإزالة البقع الصعبة',
    descriptionEn: 'High-quality washing powder for tough stain removal',
    price: 15.50,
    originalPrice: 18.00,
    category: 'laundry',
    brand: 'فايري',
    size: '3',
    unit: 'كيلو',
    stockQuantity: 45,
    minStockLevel: 10,
    images: ['/assets/products/cleaning/fairy-powder.jpg'],
    barcode: '1234567890123',
    sku: 'LAUN-001',
    isActive: true,
    isOrganic: false,
    isEcoFriendly: true,
    supplier: 'مؤسسة الخليج التجارية',
    lastRestocked: '2024-11-25'
  },
  {
    id: 'clean-002',
    name: 'سائل الجلي الأوتوماتيك',
    nameEn: 'Automatic Dishwasher Liquid',
    description: 'سائل جلي مخصص للغسالات الأوتوماتيكية',
    descriptionEn: 'Liquid detergent for automatic dishwashers',
    price: 25.75,
    category: 'detergents',
    brand: 'فايري',
    size: '1',
    unit: 'لتر',
    stockQuantity: 8,
    minStockLevel: 15,
    images: ['/assets/products/cleaning/fairy-dish.jpg'],
    barcode: '1234567890124',
    sku: 'DET-002',
    isActive: true,
    isOrganic: false,
    isEcoFriendly: true,
    supplier: 'مؤسسة الخليج التجارية',
    lastRestocked: '2024-11-20'
  },
  {
    id: 'clean-003',
    name: 'مطهر الأسطح الطبي',
    nameEn: 'Medical Surface Disinfectant',
    description: 'مطهر طبي متخصص للأسطح والمستشفيات',
    descriptionEn: 'Medical disinfectant for surfaces and hospitals',
    price: 35.00,
    originalPrice: 40.00,
    category: 'disinfectants',
    brand: 'كلوروكس',
    size: '1',
    unit: 'لتر',
    stockQuantity: 3,
    minStockLevel: 20,
    images: ['/assets/products/cleaning/clorox-surface.jpg'],
    barcode: '1234567890125',
    sku: 'DIS-003',
    isActive: true,
    isOrganic: false,
    isEcoFriendly: false,
    expiryDate: '2025-06-15',
    supplier: 'شركة ليبيا للصيدلة',
    lastRestocked: '2024-11-18'
  },
  {
    id: 'clean-004',
    name: 'فرش تنظيف متعددة الاستخدام',
    nameEn: 'Multi-Purpose Cleaning Brush',
    description: 'فرش تنظيف متنوعة للأطباق والأسطح والأثاث',
    descriptionEn: 'Versatile cleaning brush for dishes, surfaces, and furniture',
    price: 8.50,
    category: 'cleaning_tools',
    brand: 'سانكو',
    size: 'متوسط',
    unit: 'قطعة',
    stockQuantity: 67,
    minStockLevel: 25,
    images: ['/assets/products/cleaning/brush-set.jpg'],
    sku: 'TOOL-004',
    isActive: true,
    isOrganic: false,
    isEcoFriendly: false,
    supplier: 'معرض طرابلس للأدوات',
    lastRestocked: '2024-11-22'
  },
  {
    id: 'clean-005',
    name: 'شامبو الأطفال الطبيعي',
    nameEn: 'Natural Baby Shampoo',
    description: 'شامبو أطفال طبيعي خالي من المواد الكيميائية الضارة',
    descriptionEn: 'Natural baby shampoo free from harmful chemicals',
    price: 22.00,
    category: 'personal_hygiene',
    brand: 'جانو',
    size: '500',
    unit: 'مل',
    stockQuantity: 28,
    minStockLevel: 12,
    images: ['/assets/products/cleaning/baby-shampoo.jpg'],
    barcode: '1234567890126',
    sku: 'HYG-005',
    isActive: true,
    isOrganic: true,
    isEcoFriendly: true,
    expiryDate: '2025-12-01',
    supplier: 'مؤسسة الطبيعة للصيدلة',
    lastRestocked: '2024-11-26'
  }
];

const CleaningMaterialsView: React.FC = () => {
  const [products, setProducts] = useState<CleaningProduct[]>(SAMPLE_CLEANING_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CleaningProduct | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<CleaningProduct>>({});

  // Calculate statistics
  const stats = {
    totalProducts: products.length,
    lowStockCount: products.filter(p => p.stockQuantity <= p.minStockLevel).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0),
    outOfStockCount: products.filter(p => p.stockQuantity === 0).length,
    categoriesCount: new Set(products.map(p => p.category)).size
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesLowStock = !showLowStockOnly || product.stockQuantity <= product.minStockLevel;
    
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const getStockStatus = (product: CleaningProduct) => {
    if (product.stockQuantity === 0) return { status: 'out', color: 'bg-red-500', label: 'نفد' };
    if (product.stockQuantity <= product.minStockLevel) return { status: 'low', color: 'bg-yellow-500', label: 'منخفض' };
    return { status: 'good', color: 'bg-green-500', label: 'متوفر' };
  };

  const formatPrice = (price: number) => `${price.toFixed(2)} د.ل`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('ar-LY');

  const handleEditProduct = (product: CleaningProduct) => {
    setEditingProduct(product);
    setNewProduct(product);
    setIsModalOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setNewProduct({});
    setIsModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...newProduct, id: editingProduct.id } as CleaningProduct : p));
    } else {
      const product: CleaningProduct = {
        ...newProduct,
        id: `clean-${Date.now()}`,
        sku: `CLEAN-${Date.now()}`,
        isActive: true,
        stockQuantity: newProduct.stockQuantity || 0,
        minStockLevel: newProduct.minStockLevel || 10,
        images: newProduct.images || [getDefaultProductImageSync()]
      } as CleaningProduct;
      setProducts([...products, product]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">مواد التنظيف</h2>
        <Button 
          onClick={handleAddProduct}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          إضافة منتج جديد
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المنتجات</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">مخزون منخفض</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.lowStockCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">نفد المخزون</p>
                <p className="text-2xl font-bold text-red-600">{stats.outOfStockCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">القيمة الإجمالية</p>
                <p className="text-2xl font-bold text-green-600">{formatPrice(stats.totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">التصنيفات</p>
                <p className="text-2xl font-bold text-purple-600">{stats.categoriesCount}</p>
              </div>
              <Filter className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">البحث</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="البحث بالاسم أو العلامة التجارية..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="category-filter">التصنيف</Label>
              <select
                id="category-filter"
                title="اختر تصنيف المنتجات للبحث"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">جميع التصنيفات</option>
                {CLEANING_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="lowStock"
                title="عرض المنتجات التي وصل مخزونها للحد الأدنى فقط"
                checked={showLowStockOnly}
                onChange={(e) => setShowLowStockOnly(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="lowStock">مخزون منخفض فقط</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product);
          return (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{product.nameEn}</p>
                    <p className="text-sm text-gray-500 mt-1">{product.brand}</p>
                  </div>
                  <Badge className={`${stockStatus.color} text-white`}>
                    {stockStatus.label}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">الكمية:</span>
                  <span className="font-medium">{product.stockQuantity} {product.unit}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">السعر:</span>
                  <span className="font-medium text-green-600">{formatPrice(product.price)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">التصنيف:</span>
                  <span className="text-sm">
                    {CLEANING_CATEGORIES.find(c => c.value === product.category)?.label}
                  </span>
                </div>

                {product.isOrganic && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    عضوي
                  </Badge>
                )}
                
                {product.isEcoFriendly && (
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    صديق للبيئة
                  </Badge>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditProduct(product)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory ? 'لم يتم العثور على منتجات تطابق البحث' : 'لم يتم إضافة أي منتجات بعد'}
            </p>
            {!searchTerm && !selectedCategory && (
              <Button onClick={handleAddProduct}>
                <Plus className="h-4 w-4 mr-2" />
                إضافة أول منتج
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>اسم المنتج (عربي)</Label>
                  <Input
                    value={newProduct.name || ''}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="اسم المنتج"
                  />
                </div>
                <div>
                  <Label>اسم المنتج (إنجليزي)</Label>
                  <Input
                    value={newProduct.nameEn || ''}
                    onChange={(e) => setNewProduct({...newProduct, nameEn: e.target.value})}
                    placeholder="Product Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>العلامة التجارية</Label>
                  <Input
                    value={newProduct.brand || ''}
                    onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                    placeholder="العلامة التجارية"
                  />
                </div>
                <div>
                  <Label htmlFor="product-category">التصنيف</Label>
                  <select
                    id="product-category"
                    title="اختر تصنيف المنتج"
                    value={newProduct.category || ''}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value as any})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">اختر التصنيف</option>
                    {CLEANING_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>السعر</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newProduct.price || ''}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>الكمية</Label>
                  <Input
                    type="number"
                    value={newProduct.stockQuantity || ''}
                    onChange={(e) => setNewProduct({...newProduct, stockQuantity: parseInt(e.target.value)})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>الحد الأدنى</Label>
                  <Input
                    type="number"
                    value={newProduct.minStockLevel || ''}
                    onChange={(e) => setNewProduct({...newProduct, minStockLevel: parseInt(e.target.value)})}
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>الحجم</Label>
                  <Input
                    value={newProduct.size || ''}
                    onChange={(e) => setNewProduct({...newProduct, size: e.target.value})}
                    placeholder="الحجم"
                  />
                </div>
                <div>
                  <Label>الوحدة</Label>
                  <Input
                    value={newProduct.unit || ''}
                    onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                    placeholder="كيلو، لتر، قطعة"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  id="isOrganic"
                  title="تمييز المنتج كمنتج عضوي"
                  checked={newProduct.isOrganic || false}
                  onChange={(e) => setNewProduct({...newProduct, isOrganic: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="isOrganic">منتج عضوي</Label>
                
                <input
                  type="checkbox"
                  id="isEcoFriendly"
                  title="تمييز المنتج كمنتج صديق للبيئة"
                  checked={newProduct.isEcoFriendly || false}
                  onChange={(e) => setNewProduct({...newProduct, isEcoFriendly: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="isEcoFriendly">صديق للبيئة</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleSaveProduct}>
                  حفظ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CleaningMaterialsView;
