import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  FileText,
  ShoppingCart,
  RotateCcw,
  Settings,
  Info,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface InventoryChange {
  id: string;
  productName: string;
  sku: string;
  reason: 'sale' | 'return' | 'adjustment' | 'damage' | 'restock' | 'transfer';
  channel: string;
  warehouse: string;
  quantityBefore: number;
  quantityChanged: number;
  quantityAfter: number;
  date: string;
  time: string;
  notes?: string;
  user?: string;
  reference?: string;
  type: 'in' | 'out';
}

interface InventoryChangesViewProps {
  storeData: any;
  setStoreData?: (data: any) => void;
  onSave?: () => void;
}

const InventoryChangesView: React.FC<InventoryChangesViewProps> = ({ storeData, setStoreData, onSave }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Sample inventory changes data
  const inventoryChanges: InventoryChange[] = [
    {
      id: '1',
      productName: 'فستان كريستال عصري سهرية',
      sku: 'ESHRO-87287187',
      reason: 'sale',
      channel: 'منصة إشرو',
      warehouse: 'مخزن غوط الشعال',
      quantityBefore: 13,
      quantityChanged: -4,
      quantityAfter: 9,
      date: '2025-09-20',
      time: '12:30:12 مساءً',
      notes: 'بيع عبر الموقع الإلكتروني',
      user: 'نظام إشرو',
      type: 'out',
    },
    {
      id: '2',
      productName: 'حذاء نسائي ZARA',
      sku: 'ESHRO-83370002',
      reason: 'sale',
      channel: 'منصة إشرو',
      warehouse: 'مخزن طريق المطار',
      quantityBefore: 100,
      quantityChanged: -20,
      quantityAfter: 80,
      date: '2025-09-10',
      time: '18:30:12 مساءً',
      notes: 'طلب كبير للحذاء',
      user: 'نظام إشرو',
      type: 'out',
    },
    {
      id: '3',
      productName: 'بوركيني بحر جديد',
      sku: 'ESHRO-80000342',
      reason: 'restock',
      channel: 'المورد الرئيسي',
      warehouse: 'مخزن الكريمية',
      quantityBefore: 180,
      quantityChanged: 220,
      quantityAfter: 400,
      date: '2025-08-10',
      time: '15:30:12 ظهرًا',
      notes: 'شحنة جديدة من المورد',
      user: 'مدير المخزن',
      type: 'in',
    },
    {
      id: '4',
      productName: 'عطر نسائي AZARO',
      sku: 'ESHRO-92666692',
      reason: 'damage',
      channel: 'فحص المخزون',
      warehouse: 'مخزن طريق الشط',
      quantityBefore: 50,
      quantityChanged: -30,
      quantityAfter: 20,
      date: '2025-08-22',
      time: '10:30:12 صباحًا',
      notes: 'منتجات تالفة تم اكتشافها أثناء الفحص الدوري',
      user: 'فريق الجودة',
      type: 'out',
    },
    {
      id: '5',
      productName: 'فستان صيفي أنيق',
      sku: 'ESHRO-55544433',
      reason: 'transfer',
      channel: 'نقل داخلي',
      warehouse: 'مخزن غوط الشعال',
      quantityBefore: 25,
      quantityChanged: -10,
      quantityAfter: 15,
      date: '2025-09-15',
      time: '09:15:30 صباحًا',
      notes: 'نقل إلى مخزن طريق المطار لتلبية الطلبات',
      user: 'مدير المخزون',
      type: 'out',
    },
  ];

  const filteredChanges = inventoryChanges.filter(change => {
    const matchesSearch =
      change.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      change.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      change.warehouse.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesReason = reasonFilter === 'all' || change.reason === reasonFilter;
    const matchesWarehouse = warehouseFilter === 'all' || change.warehouse === warehouseFilter;
    const matchesType = typeFilter === 'all' || change.type === typeFilter;

    return matchesSearch && matchesReason && matchesWarehouse && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredChanges.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedChanges = filteredChanges.slice(startIndex, startIndex + itemsPerPage);

  const getReasonBadge = (reason: string) => {
    const reasonConfig = {
      sale: { label: 'بيع', color: 'bg-green-100 text-green-800', icon: <TrendingDown className="h-3 w-3" /> },
      return: { label: 'إرجاع', color: 'bg-blue-100 text-blue-800', icon: <RotateCcw className="h-3 w-3" /> },
      adjustment: { label: 'تعديل', color: 'bg-yellow-100 text-yellow-800', icon: <Settings className="h-3 w-3" /> },
      damage: { label: 'تلف', color: 'bg-red-100 text-red-800', icon: <AlertCircle className="h-3 w-3" /> },
      restock: { label: 'إعادة تخزين', color: 'bg-purple-100 text-purple-800', icon: <Package className="h-3 w-3" /> },
      transfer: { label: 'نقل', color: 'bg-orange-100 text-orange-800', icon: <ArrowUp className="h-3 w-3" /> },
    };

    const config = reasonConfig[reason as keyof typeof reasonConfig] || { label: reason, color: 'bg-gray-100 text-gray-800', icon: <Info className="h-3 w-3" /> };
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    return type === 'in' ? (
      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
        <ArrowUp className="h-3 w-3 text-green-600" />
      </div>
    ) : (
      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
        <ArrowDown className="h-3 w-3 text-red-600" />
      </div>
    );
  };

  const getWarehouseList = () => {
    const warehouses = [...new Set(inventoryChanges.map(change => change.warehouse))];
    return warehouses;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">إدارة تغييرات المخزون</h2>
          <p className="text-gray-600 mt-1">راجع وحدث تفاصيل المنتجات والمخزون حسب كل مستودع لتواكب احتياجات متجرك</p>
        </div>
      </div>

      {/* Warehouse Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>اختيار المخزن</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">جميع المخازن</TabsTrigger>
              <TabsTrigger value="karimia">مخزن الكريمية</TabsTrigger>
              <TabsTrigger value="ghut">مخزن غوط الشعال</TabsTrigger>
              <TabsTrigger value="airport">مخزن طريق المطار</TabsTrigger>
              <TabsTrigger value="qamins">مخزن قمينس</TabsTrigger>
              <TabsTrigger value="shuhada">مخزن شهداء الشط</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي التغييرات</p>
                <p className="text-3xl font-bold text-gray-900">{inventoryChanges.length}</p>
                <p className="text-sm text-gray-600">هذا الشهر</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المنتجات الداخلة</p>
                <p className="text-3xl font-bold text-green-600">
                  {inventoryChanges.filter(c => c.type === 'in').reduce((sum, c) => sum + Math.abs(c.quantityChanged), 0)}
                </p>
                <p className="text-sm text-gray-600">إجمالي الوارد</p>
              </div>
              <ArrowUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المنتجات الخارجة</p>
                <p className="text-3xl font-bold text-red-600">
                  {inventoryChanges.filter(c => c.type === 'out').reduce((sum, c) => sum + Math.abs(c.quantityChanged), 0)}
                </p>
                <p className="text-sm text-gray-600">إجمالي الصادر</p>
              </div>
              <ArrowDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">صافي التغيير</p>
                <p className={`text-3xl font-bold ${
                  inventoryChanges.reduce((sum, c) => sum + c.quantityChanged, 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {inventoryChanges.reduce((sum, c) => sum + c.quantityChanged, 0) >= 0 ? '+' : ''}
                  {inventoryChanges.reduce((sum, c) => sum + c.quantityChanged, 0)}
                </p>
                <p className="text-sm text-gray-600">صافي المخزون</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في تغييرات المخزون..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={reasonFilter} onValueChange={setReasonFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="سبب التغيير" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأسباب</SelectItem>
                <SelectItem value="sale">بيع</SelectItem>
                <SelectItem value="return">إرجاع</SelectItem>
                <SelectItem value="adjustment">تعديل</SelectItem>
                <SelectItem value="damage">تلف</SelectItem>
                <SelectItem value="restock">إعادة تخزين</SelectItem>
                <SelectItem value="transfer">نقل</SelectItem>
              </SelectContent>
            </Select>
            <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="المخزن" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المخازن</SelectItem>
                {getWarehouseList().map((warehouse) => (
                  <SelectItem key={warehouse} value={warehouse}>
                    {warehouse}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="نوع التغيير" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="in">داخل</SelectItem>
                <SelectItem value="out">خارج</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 ml-2" />
              تصدير
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Changes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            سجل تغييرات المخزون
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3 font-semibold">المنتج</th>
                  <th className="text-right p-3 font-semibold">كود SKU</th>
                  <th className="text-right p-3 font-semibold">سبب التعديل</th>
                  <th className="text-right p-3 font-semibold">قناة البيع</th>
                  <th className="text-right p-3 font-semibold">المخزن</th>
                  <th className="text-right p-3 font-semibold">الكمية قبل</th>
                  <th className="text-right p-3 font-semibold">التغيير</th>
                  <th className="text-right p-3 font-semibold">الكمية بعد</th>
                  <th className="text-right p-3 font-semibold">التاريخ/الوقت</th>
                </tr>
              </thead>
              <tbody>
                {paginatedChanges.map((change) => (
                  <tr key={change.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <p className="font-semibold">{change.productName}</p>
                        {change.notes && (
                          <p className="text-sm text-gray-600">{change.notes}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-blue-600">{change.sku}</p>
                    </td>
                    <td className="p-3">
                      {getReasonBadge(change.reason)}
                    </td>
                    <td className="p-3">
                      <p className="font-medium">{change.channel}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-medium">{change.warehouse}</p>
                    </td>
                    <td className="p-3">
                      <div className="text-center">
                        <p className="font-semibold">{change.quantityBefore}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        {getTypeIcon(change.type)}
                        <span className={`font-semibold ${change.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                          {change.type === 'in' ? '+' : ''}{change.quantityChanged}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-center">
                        <p className="font-semibold">{change.quantityAfter}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold">{change.date}</p>
                      <p className="text-sm text-gray-600">{change.time}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginatedChanges.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد تغييرات في المخزون تطابق معايير البحث</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                عرض {startIndex + 1} إلى {Math.min(startIndex + itemsPerPage, filteredChanges.length)} من أصل {filteredChanges.length} نتيجة
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  السابق
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  التالي
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              توزيع أسباب التغيير
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(
                inventoryChanges.reduce((acc, change) => {
                  acc[change.reason] = (acc[change.reason] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([reason, count]) => (
                <div key={reason} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getReasonBadge(reason)}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${(count / inventoryChanges.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              إحصائيات المخازن
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getWarehouseList().map((warehouse) => {
                const warehouseChanges = inventoryChanges.filter(c => c.warehouse === warehouse);
                const inbound = warehouseChanges.filter(c => c.type === 'in').reduce((sum, c) => sum + c.quantityChanged, 0);
                const outbound = Math.abs(warehouseChanges.filter(c => c.type === 'out').reduce((sum, c) => sum + c.quantityChanged, 0));

                return (
                  <div key={warehouse} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{warehouse}</span>
                      <span className="text-sm text-gray-600">{warehouseChanges.length} تغيير</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-green-600">
                        <span className="font-semibold">+{inbound}</span> وارد
                      </div>
                      <div className="text-red-600">
                        <span className="font-semibold">-{outbound}</span> صادر
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { InventoryChangesView };
