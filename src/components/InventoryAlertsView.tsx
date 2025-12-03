import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Package,
  Calendar,
  TrendingDown,
  TrendingUp,
  Filter,
  Download,
  Edit,
  Trash2,
  Plus,
  X,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import {
  getInventoryAlertLevel,
  getAlertConfig,
  getDaysUntilExpiry,
  formatDate,
  getCategoryLabel,
  hasExpiryTracking,
  getRestockRecommendation,
  getProgressBarColor,
  getStockPercentage,
  getInventoryStats,
  isEmergency,
  getCriticalProducts,
  exportToCSV,
} from '../utils/inventoryAlertUtils';
import type { ProductInventory, InventoryStats } from '../types/inventory';

interface InventoryAlertsViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

const InventoryAlertsView: React.FC<InventoryAlertsViewProps> = ({ storeData, setStoreData, onSave }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [products, setProducts] = useState<ProductInventory[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductInventory | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const stored = localStorage.getItem('eshro_inventory_alerts');
    if (stored) {
      try {
        setProducts(JSON.parse(stored));
      } catch (e) {
        loadDefaultProducts();
      }
    } else {
      loadDefaultProducts();
    }
  };

  const loadDefaultProducts = () => {
    const defaultProducts: ProductInventory[] = [
      {
        productId: '1',
        productName: 'كريم ترطيب يومي SPF 30',
        sku: 'SKIN-001',
        currentQuantity: 25, // Above threshold - good stock
        minQuantity: 5, // الحد الأدنى الجديد: 5 قطع
        maxQuantity: 100,
        category: 'skincare',
        manufacturingDate: '2024-09-01',
        expiryDate: '2026-09-01',
        price: 35.0,
        warehouse: 'مخزن طريق المطار',
      },
      {
        productId: '2',
        productName: 'سيروم فيتامين C',
        sku: 'SKIN-002',
        currentQuantity: 3, // Below threshold - warning level
        minQuantity: 5,
        maxQuantity: 80,
        category: 'skincare',
        manufacturingDate: '2024-08-15',
        expiryDate: '2026-08-15',
        price: 45.0,
        warehouse: 'مخزن غوط الشعال',
      },
      {
        productId: '3',
        productName: 'ماسكات تنظيف الوجه',
        sku: 'SKIN-003',
        currentQuantity: 0, // Critical - out of stock
        minQuantity: 5,
        maxQuantity: 120,
        category: 'skincare',
        manufacturingDate: '2024-07-01',
        expiryDate: '2026-07-01',
        price: 25.0,
        warehouse: 'مخزن طريق المطار',
      },
      {
        productId: '4',
        productName: 'زيت الأرغان النقي',
        sku: 'SKIN-004',
        currentQuantity: 8, // Above threshold
        minQuantity: 5,
        maxQuantity: 60,
        category: 'skincare',
        manufacturingDate: '2024-06-01',
        expiryDate: '2026-06-01',
        price: 55.0,
        warehouse: 'مخزن شهداء الشط',
      },
      {
        productId: '5',
        productName: 'كريم اليدين الليلي',
        sku: 'SKIN-005',
        currentQuantity: 6, // Just above threshold
        minQuantity: 5,
        maxQuantity: 90,
        category: 'skincare',
        manufacturingDate: '2024-05-15',
        expiryDate: '2026-05-15',
        price: 28.0,
        warehouse: 'مخزن الكريمية',
      },
      {
        productId: '6',
        productName: 'جل تنظيف الوجه',
        sku: 'SKIN-006',
        currentQuantity: 2, // Warning level
        minQuantity: 5,
        maxQuantity: 75,
        category: 'skincare',
        manufacturingDate: '2024-04-01',
        expiryDate: '2026-04-01',
        price: 32.0,
        warehouse: 'مخزن قمينس',
      },
    ];
    setProducts(defaultProducts);
    localStorage.setItem('eshro_inventory_alerts', JSON.stringify(defaultProducts));
  };

  const updateLocalStorage = (newProducts: ProductInventory[]) => {
    setProducts(newProducts);
    localStorage.setItem('eshro_inventory_alerts', JSON.stringify(newProducts));
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch =
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.warehouse.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterLevel === 'all') return matchesSearch;

      const level = getInventoryAlertLevel(product);
      return matchesSearch && level === filterLevel;
    });
  }, [products, searchTerm, filterLevel]);

  const stats = useMemo(() => {
    return getInventoryStats(products);
  }, [products]);

  const handleEditProduct = (product: ProductInventory) => {
    setSelectedProduct({ ...product });
    setShowEditModal(true);
  };

  const handleSaveProduct = () => {
    if (!selectedProduct) return;

    const updatedProducts = products.map(p =>
      p.productId === selectedProduct.productId ? selectedProduct : p
    );

    updateLocalStorage(updatedProducts);
    alert('✅ تم تحديث المنتج بنجاح');
    setShowEditModal(false);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج من التتبع؟')) {
      const updatedProducts = products.filter(p => p.productId !== productId);
      updateLocalStorage(updatedProducts);
      alert('✅ تم حذف المنتج بنجاح');
    }
  };

  const handleExportData = () => {
    const csvContent = exportToCSV(products);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert('✅ تم تصدير تقرير المخزون بنجاح');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">المخزون الذكي</h2>
          <p className="text-gray-600 mt-1">نظام تنبيهات المخزون مع تتبع انتهاء الصلاحية</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
          <Plus className="h-4 w-4 ml-2" />
          إضافة منتج جديد
        </Button>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-xs font-medium text-gray-600">الإجمالي</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-xs font-medium text-green-700">متوفر</p>
              <p className="text-2xl font-bold text-green-700">🟢 {stats.available}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-xs font-medium text-orange-700">تحذير</p>
              <p className="text-2xl font-bold text-orange-700">🟠 {stats.warning}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-xs font-medium text-orange-700">قريب من الانتهاء</p>
              <p className="text-2xl font-bold text-orange-700">🟠 {stats.expiringSoon}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-xs font-medium text-red-700">حرج</p>
              <p className="text-2xl font-bold text-red-700">🔴 {stats.critical}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-100">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-xs font-medium text-red-800">منتهي الصلاحية</p>
              <p className="text-2xl font-bold text-red-800">⚫ {stats.expired}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                placeholder="البحث في المنتجات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المنتجات</SelectItem>
                <SelectItem value="available">متوفر 🟢</SelectItem>
                <SelectItem value="warning">تحذير 🟠</SelectItem>
                <SelectItem value="expiring_soon">قريب من الانتهاء 🟠</SelectItem>
                <SelectItem value="critical">حرج 🔴</SelectItem>
                <SelectItem value="expired">منتهي الصلاحية ⚫</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 ml-2" />
              تصدير
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>حالة المخزون</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3 font-semibold">المنتج</th>
                  <th className="text-right p-3 font-semibold">الحالة</th>
                  <th className="text-right p-3 font-semibold">الكمية</th>
                  <th className="text-right p-3 font-semibold">الفئة</th>
                  <th className="text-right p-3 font-semibold">الصلاحية</th>
                  <th className="text-right p-3 font-semibold">المخزن</th>
                  <th className="text-right p-3 font-semibold">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const alertLevel = getInventoryAlertLevel(product);
                  const alertConfig = getAlertConfig(alertLevel);
                  const daysUntilExpiry = hasExpiryTracking(product.category) && product.expiryDate
                    ? getDaysUntilExpiry(product.expiryDate)
                    : null;

                  return (
                    <tr key={product.productId} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <p className="font-semibold">{product.productName}</p>
                          <p className="text-xs text-gray-600">{product.sku}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${alertConfig.bgColor}`}>
                          <span>{alertConfig.icon}</span>
                          <span className={`text-xs font-medium ${alertConfig.color}`}>{alertConfig.label}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-lg">{product.currentQuantity}</span>
                            <span className="text-sm text-gray-600">/ {product.maxQuantity}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(product)}`}
                              style={{ width: `${getStockPercentage(product)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600">
                            {getRestockRecommendation(product)}
                          </p>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">{getCategoryLabel(product.category)}</Badge>
                      </td>
                      <td className="p-3">
                        {hasExpiryTracking(product.category) && product.expiryDate ? (
                          <div>
                            <p className="text-xs">{formatDate(product.expiryDate)}</p>
                            {daysUntilExpiry !== null && (
                              <p className={`text-xs font-semibold ${
                                daysUntilExpiry < 0 ? 'text-red-600' :
                                daysUntilExpiry <= 60 ? 'text-orange-600' :
                                'text-green-600'
                              }`}>
                                {daysUntilExpiry < 0 
                                  ? `منتهي (${Math.abs(daysUntilExpiry)} يوم)` 
                                  : `${daysUntilExpiry} يوم`}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-600">بدون صلاحية</p>
                        )}
                      </td>
                      <td className="p-3">
                        <p className="text-xs">{product.warehouse}</p>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.productId)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد منتجات تطابق معايير البحث</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">نظام الألوان المرمزة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <span className="text-2xl">🟢</span>
              <div>
                <p className="font-semibold text-green-700">متوفر</p>
                <p className="text-sm text-gray-600">الكمية كافية للعمل العادي</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <span className="text-2xl">🟠</span>
              <div>
                <p className="font-semibold text-orange-700">تحذير</p>
                <p className="text-sm text-gray-600">الكمية قريبة من الحد الأدنى (5 قطع أو أقل)</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <span className="text-2xl">🟠</span>
              <div>
                <p className="font-semibold text-orange-700">قريب من الانتهاء</p>
                <p className="text-sm text-gray-600">الصلاحية تنتهي خلال 60 يوم</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <span className="text-2xl">🔴</span>
              <div>
                <p className="font-semibold text-red-700">حرج</p>
                <p className="text-sm text-gray-600">المخزون فارغ - إعادة تخزين فوري</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <span className="text-2xl">⚫</span>
              <div>
                <p className="font-semibold text-red-800">منتهي الصلاحية</p>
                <p className="text-sm text-gray-600">يجب إزالة المنتج من المخزن</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">{selectedProduct.productName}</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowEditModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-lg mb-3">{selectedProduct.productName}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">كود المنتج:</span>
                      <p className="font-medium">{selectedProduct.sku}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">المخزن:</span>
                      <p className="font-medium">{selectedProduct.warehouse}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="flex items-center justify-between">
                      الكمية الحالية
                      <span className="text-sm text-gray-600">
                        ({getStockPercentage(selectedProduct)}% من الحد الأقصى)
                      </span>
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      max={selectedProduct.maxQuantity}
                      value={selectedProduct.currentQuantity}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          currentQuantity: Math.max(0, Math.min(parseInt(e.target.value) || 0, selectedProduct.maxQuantity)),
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>الحد الأدنى (عتبة التنبيه)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={selectedProduct.minQuantity}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          minQuantity: Math.max(1, parseInt(e.target.value) || 5),
                        })
                      }
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      سيتم إرسال تنبيه عند وصول المخزون إلى هذا الحد (أو أقل)
                    </p>
                  </div>

                  <div>
                    <Label>الحد الأقصى</Label>
                    <Input
                      type="number"
                      min={selectedProduct.minQuantity}
                      value={selectedProduct.maxQuantity}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          maxQuantity: Math.max(selectedProduct.minQuantity, parseInt(e.target.value) || 100),
                        })
                      }
                    />
                  </div>
                </div>

                {hasExpiryTracking(selectedProduct.category) && (
                  <div>
                    <Label>تاريخ انتهاء الصلاحية</Label>
                    <Input
                      type="date"
                      value={selectedProduct.expiryDate || ''}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          expiryDate: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleSaveProduct}
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  حفظ
                </Button>
                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                  إلغاء
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { InventoryAlertsView };
