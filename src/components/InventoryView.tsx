import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Eye,
  Filter,
  Globe,
  GripVertical,
  Info,
  Mail,
  MapPin,
  Package,
  Phone,
  PieChart,
  Plus,
  Save,
  Search,
  Settings,
  ShoppingBag,
  Trash2,
  TrendingDown,
  TrendingUp,
  Truck,
  Users,
  X,
  XCircle,
  Bell,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { libyanCities } from '@/data/libya/cities/cities';
import { InventoryAlertsSystem } from './InventoryAlertsSystem';

interface Warehouse {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  area: string;
  isActive: boolean;
  priority: number;
  productsCount: number;
  totalValue: number;
  monthlyOrders: number;
  status: 'active' | 'inactive' | 'maintenance';
  manager?: string;
  establishedDate: string | undefined;
  lastActivity: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface Product {
  id: string;
  name: string;
  image?: string;
  quantity: number;
  minimumStock: number;
  warehouse: string;
  lastUpdated: string;
  storeSlug: string;
  storeName: string;
  sku: string;
}

interface InventoryViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

const InventoryView: React.FC<InventoryViewProps> = ({ storeData, setStoreData, onSave }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [activeTab, setActiveTab] = useState('warehouses');

  // Form state
  const [warehouseForm, setWarehouseForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    area: '',
    manager: '',
    isActive: true,
    priority: 1,
  });

  // Sample warehouses data
  const warehouses: Warehouse[] = [
    {
      id: '1',
      name: 'مخزن طريق المطار',
      phone: '+218911234567',
      email: 'airport.warehouse@eshro.com',
      address: 'طريق المطار، قرب مطار طرابلس الدولي',
      city: 'طرابلس',
      area: 'طريق المطار',
      isActive: true,
      priority: 1,
      productsCount: 127,
      totalValue: 45000,
      monthlyOrders: 89,
      status: 'active',
      manager: 'أحمد محمد',
      establishedDate: '2024-01-15',
      lastActivity: '2024-12-15T10:30:00Z',
    },
    {
      id: '2',
      name: 'مخزن غوط الشعال',
      phone: '+218912345678',
      email: 'ghut.warehouse@eshro.com',
      address: 'غوط الشعال، بالقرب من جامعة طرابلس',
      city: 'طرابلس',
      area: 'غوط الشعال',
      isActive: true,
      priority: 2,
      productsCount: 89,
      totalValue: 32000,
      monthlyOrders: 67,
      status: 'active',
      manager: 'فاطمة علي',
      establishedDate: '2024-02-01',
      lastActivity: '2024-12-15T09:15:00Z',
    },
    {
      id: '3',
      name: 'مخزن شهداء الشط',
      phone: '+218913456789',
      email: 'shuhada.warehouse@eshro.com',
      address: 'شهداء الشط، منطقة الشط',
      city: 'طرابلس',
      area: 'شهداء الشط',
      isActive: true,
      priority: 3,
      productsCount: 76,
      totalValue: 28000,
      monthlyOrders: 45,
      status: 'active',
      manager: 'محمد عمر',
      establishedDate: '2024-03-10',
      lastActivity: '2024-12-15T08:45:00Z',
    },
    {
      id: '4',
      name: 'مخزن الكريمية',
      phone: '+218914567890',
      email: 'karimia.warehouse@eshro.com',
      address: 'الكريمية، طريق الشط',
      city: 'طرابلس',
      area: 'الكريمية',
      isActive: true,
      priority: 4,
      productsCount: 92,
      totalValue: 38000,
      monthlyOrders: 58,
      status: 'active',
      manager: 'سارة أحمد',
      establishedDate: '2024-01-20',
      lastActivity: '2024-12-15T11:20:00Z',
    },
    {
      id: '5',
      name: 'مخزن قمينس',
      phone: '+218915678901',
      email: 'qamins.warehouse@eshro.com',
      address: 'قمينس، بنغازي',
      city: 'بنغازي',
      area: 'قمينس',
      isActive: false,
      priority: 5,
      productsCount: 45,
      totalValue: 15000,
      monthlyOrders: 12,
      status: 'inactive',
      manager: 'عمر حسن',
      establishedDate: '2024-04-05',
      lastActivity: '2024-12-10T14:30:00Z',
    },
  ];

  // Sample product inventory data for testing alerts
  const productInventory: Product[] = [
    {
      id: '1',
      name: 'فستان كريستال عصري سهرية',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300',
      quantity: 3,
      minimumStock: 5,
      warehouse: 'مخزن غوط الشعال',
      lastUpdated: new Date().toISOString(),
      storeSlug: 'fashion-store',
      storeName: 'متجر الأزياء العصرية',
      sku: 'ESHRO-FSH-001'
    },
    {
      id: '2',
      name: 'حذاء نسائي ZARA',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300',
      quantity: 0,
      minimumStock: 10,
      warehouse: 'مخزن طريق المطار',
      lastUpdated: new Date().toISOString(),
      storeSlug: 'shoes-store',
      storeName: 'متجر الأحذية العصرية',
      sku: 'ESHRO-SHO-002'
    },
    {
      id: '3',
      name: 'بوركيني بحر جديد',
      image: 'https://images.unsplash.com/photo-1571907480495-d07d121b21c8?w=300',
      quantity: 8,
      minimumStock: 5,
      warehouse: 'مخزن الكريمية',
      lastUpdated: new Date().toISOString(),
      storeSlug: 'swimwear-store',
      storeName: 'متجر أزياء البحر',
      sku: 'ESHRO-SWM-003'
    },
    {
      id: '4',
      name: 'عطر نسائي AZARO',
      image: 'https://images.unsplash.com/photo-1549298901-2ec2b4571f1d?w=300',
      quantity: 0,
      minimumStock: 8,
      warehouse: 'مخزن شهداء الشط',
      lastUpdated: new Date().toISOString(),
      storeSlug: 'beauty-store',
      storeName: 'متجر العطور والجمال',
      sku: 'ESHRO-PER-004'
    },
    {
      id: '5',
      name: 'فستان صيفي أنيق',
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=300',
      quantity: 15,
      minimumStock: 5,
      warehouse: 'مخزن غوط الشعال',
      lastUpdated: new Date().toISOString(),
      storeSlug: 'fashion-store',
      storeName: 'متجر الأزياء العصرية',
      sku: 'ESHRO-FSH-005'
    },
    {
      id: '6',
      name: 'حقيبة يد جلدية',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300',
      quantity: 1,
      minimumStock: 5,
      warehouse: 'مخزن طريق المطار',
      lastUpdated: new Date().toISOString(),
      storeSlug: 'accessories-store',
      storeName: 'متجر الإكسسوارات',
      sku: 'ESHRO-ACC-006'
    },
  ];

  const filteredWarehouses = warehouses.filter(warehouse => {
    const matchesSearch =
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.area.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || warehouse.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAddWarehouse = () => {

    setEditingWarehouse(null);
    setWarehouseForm({
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      area: '',
      manager: '',
      isActive: true,
      priority: warehouses.length + 1,
    });
    setShowWarehouseModal(true);

  };

  const handleEditWarehouse = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setWarehouseForm({
      name: warehouse.name,
      phone: warehouse.phone,
      email: warehouse.email,
      address: warehouse.address,
      city: warehouse.city,
      area: warehouse.area,
      manager: warehouse.manager || '',
      isActive: warehouse.isActive,
      priority: warehouse.priority,
    });
    setShowWarehouseModal(true);
  };

  const handleSaveWarehouse = () => {

    if (!storeData) {

      return;
    }

    if (!warehouseForm.name.trim() || !warehouseForm.city) {

      const missingFields: string[] = [];
      if (!warehouseForm.name.trim()) missingFields.push('• اسم المخزن');
      if (!warehouseForm.city) missingFields.push('• المدينة');

      alert(`⚠️ يرجى إكمال البيانات التالية:\n${missingFields.join('\n')}\n\nهذه الحقول مطلوبة لإنشاء المخزن بنجاح.\n\n💡 نصيحة: تأكد من:\n• إدخال اسم واضح ومميز للمخزن\n• اختيار المدينة من القائمة المنسدلة\n• إدخال باقي البيانات حسب الحاجة`);
      return;
    }

    const newWarehouse: Warehouse = {
      id: editingWarehouse ? editingWarehouse.id : Date.now().toString(),
      name: warehouseForm.name,
      phone: warehouseForm.phone,
      email: warehouseForm.email,
      address: warehouseForm.address,
      city: warehouseForm.city,
      area: warehouseForm.area,
      isActive: warehouseForm.isActive,
      priority: warehouseForm.priority,
      productsCount: editingWarehouse ? editingWarehouse.productsCount : 0,
      totalValue: editingWarehouse ? editingWarehouse.totalValue : 0,
      monthlyOrders: editingWarehouse ? editingWarehouse.monthlyOrders : 0,
      status: warehouseForm.isActive ? 'active' : 'inactive',
      manager: warehouseForm.manager,
      establishedDate: editingWarehouse?.establishedDate || new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString(),
    };

    if (editingWarehouse) {
      // Edit existing warehouse
      const updatedWarehouses = warehouses.map(w => w.id === editingWarehouse.id ? newWarehouse : w);
      setStoreData({
        ...storeData,
        warehouses: updatedWarehouses,
      });
      alert(`✅ تم تحديث المخزن بنجاح!\n\n🏪 اسم المخزن: ${newWarehouse.name}\n📍 العنوان: ${newWarehouse.address}\n🌍 المدينة: ${newWarehouse.city}\n🏢 المنطقة: ${newWarehouse.area}\n👨‍💼 المدير: ${newWarehouse.manager || 'غير محدد'}\n📞 الهاتف: ${newWarehouse.phone || 'غير محدد'}\n📧 البريد الإلكتروني: ${newWarehouse.email || 'غير محدد'}\n✅ الحالة: ${newWarehouse.isActive ? 'نشط' : 'غير نشط'}\n🔢 الأولوية: ${newWarehouse.priority}\n\nتم حفظ جميع التغييرات بنجاح!`);
    } else {
      // Add new warehouse
      const updatedWarehouses = [...warehouses, newWarehouse];
      setStoreData({
        ...storeData,
        warehouses: updatedWarehouses,
      });
      alert(`✅ تم إنشاء المخزن بنجاح!\n\n🏪 اسم المخزن: ${newWarehouse.name}\n📍 العنوان: ${newWarehouse.address}\n🌍 المدينة: ${newWarehouse.city}\n🏢 المنطقة: ${newWarehouse.area}\n👨‍💼 المدير: ${newWarehouse.manager || 'غير محدد'}\n📞 الهاتف: ${newWarehouse.phone || 'غير محدد'}\n📧 البريد الإلكتروني: ${newWarehouse.email || 'غير محدد'}\n✅ الحالة: ${newWarehouse.isActive ? 'نشط' : 'غير نشط'}\n🔢 الأولوية: ${newWarehouse.priority}\n\nالمخزن جاهز للاستخدام في نظام إدارة المخزون!`);
    }

    setShowWarehouseModal(false);
    onSave();
  };

  const handleDeleteWarehouse = (warehouseId: string) => {
    const updatedWarehouses = warehouses.filter(w => w.id !== warehouseId);
    setStoreData({
      ...storeData,
      warehouses: updatedWarehouses,
    });
    onSave();
  };

  const toggleWarehouseStatus = (warehouseId: string) => {
    const updatedWarehouses = warehouses.map(w =>
      w.id === warehouseId ? { ...w, isActive: !w.isActive, status: w.isActive ? 'inactive' : 'active' } : w
    );
    setStoreData({
      ...storeData,
      warehouses: updatedWarehouses,
    });
    onSave();
  };

  const moveWarehouse = (fromIndex: number, toIndex: number) => {
    const updatedWarehouses = [...warehouses];
    const moved = updatedWarehouses[fromIndex];
    if (moved) {
      updatedWarehouses.splice(fromIndex, 1);
      updatedWarehouses.splice(toIndex, 0, moved);

      // Update priorities
      const reorderedWarehouses = updatedWarehouses.map((warehouse, index) => ({
        ...warehouse,
        priority: index + 1,
      }));

      setStoreData({
        ...storeData,
        warehouses: reorderedWarehouses,
      });
      onSave();
    }
  };

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive) {
      return <Badge className="bg-red-100 text-red-800">مُعطّل</Badge>;
    }

    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">مُفعّل</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">غير مفعل</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800">صيانة</Badge>;
      default:
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">المخزون</h2>
          <p className="text-gray-600 mt-1">إدارة مخازنك في ليبيا وأولوية السحب</p>
        </div>
        <Button
          onClick={handleAddWarehouse}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-200 hover:shadow-lg"
        >
          <Plus className="h-4 w-4 ml-2" />
          إنشاء مخزن جديد
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المخازن</p>
                <p className="text-3xl font-bold text-gray-900">{warehouses.length}</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">مخازن في ليبيا</p>
                <p className="text-3xl font-bold text-gray-900">{warehouses.filter(w => w.city !== 'بنغازي').length}</p>
              </div>
              <MapPin className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المخازن النشطة</p>
                <p className="text-3xl font-bold text-gray-900">{warehouses.filter(w => w.isActive).length}</p>
                <p className="text-sm text-gray-600">من أصل {warehouses.length} مخازن</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المخازن المعطلة</p>
                <p className="text-3xl font-bold text-gray-900">{warehouses.filter(w => !w.isActive).length}</p>
                <p className="text-sm text-gray-600">تحتاج صيانة</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUp className="h-5 w-5" />
            أولوية السحب من المخازن
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              اسحب المواقع لإعادة ترتيبها حسب الأولوية
            </p>
            <p className="text-xs text-gray-500">
              ملاحظة: تُوجَّه الطلبات أولاً للموقع الأعلى، وإذا لم يُنفَّذ الطلب بالكامل، يُقسَّم بين عدة مستودعات
            </p>

            <div className="space-y-2">
              {warehouses
                .sort((a, b) => a.priority - b.priority)
                .map((warehouse, index) => (
                  <div key={warehouse.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        warehouse.priority === 1 ? 'bg-yellow-100 text-yellow-800' :
                        warehouse.priority === 2 ? 'bg-gray-100 text-gray-800' :
                        warehouse.priority === 3 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {warehouse.priority}
                      </div>
                      <div>
                        <p className="font-semibold">{warehouse.name}</p>
                        <p className="text-sm text-gray-600">{warehouse.city}, ليبيا</p>
                      </div>
                    </div>
                    <div className="flex-1"></div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{warehouse.productsCount} منتج</p>
                      <p className="text-xs text-gray-600">{warehouse.monthlyOrders} طلب شهري</p>
                    </div>
                    {getStatusBadge(warehouse.status, warehouse.isActive)}
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warehouses Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة المخازن</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث في المخازن..."
                  aria-label="البحث في قائمة المخازن"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48" aria-label="تصفية حالة المخزن">
                  <SelectValue placeholder="حالة المخزن" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المخازن</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                  <SelectItem value="maintenance">صيانة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3 font-semibold">الاسم</th>
                  <th className="text-right p-3 font-semibold">المدينة</th>
                  <th className="text-right p-3 font-semibold">البلد</th>
                  <th className="text-right p-3 font-semibold">الحالة</th>
                  <th className="text-right p-3 font-semibold">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredWarehouses.map((warehouse) => (
                  <tr key={warehouse.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <p className="font-semibold">{warehouse.name}</p>
                        <p className="text-sm text-gray-600">{warehouse.manager || 'غير محدد'}</p>
                        <p className="text-xs text-gray-500">{warehouse.phone}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold">{warehouse.city}</p>
                      <p className="text-sm text-gray-600">{warehouse.area}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold">ليبيا</p>
                    </td>
                    <td className="p-3">
                      {getStatusBadge(warehouse.status, warehouse.isActive)}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleWarehouseStatus(warehouse.id)}
                        >
                          {warehouse.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteWarehouse(warehouse.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredWarehouses.length === 0 && (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد مخازن تطابق معايير البحث</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Warehouse Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              أداء المخازن
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {warehouses
                .sort((a, b) => b.monthlyOrders - a.monthlyOrders)
                .slice(0, 5)
                .map((warehouse) => (
                  <div key={warehouse.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{warehouse.name}</p>
                      <p className="text-sm text-gray-600">{warehouse.productsCount} منتج</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{warehouse.monthlyOrders}</p>
                      <p className="text-sm text-gray-600">طلب هذا الشهر</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              توزيع المخزون
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {warehouses.map((warehouse) => (
                <div key={warehouse.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{warehouse.name}</span>
                    <span className="text-sm text-gray-600">{warehouse.productsCount} منتج</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(warehouse.productsCount / Math.max(...warehouses.map(w => w.productsCount))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Warehouse Modal */}
       <AnimatePresence>
         {showWarehouseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
            onClick={(e) => {
              if (e.target === e.currentTarget) {

                setWarehouseForm({
                  name: '',
                  phone: '',
                  email: '',
                  address: '',
                  city: '',
                  area: '',
                  manager: '',
                  isActive: true,
                  priority: 1,
                });
                setShowWarehouseModal(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-2xl border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingWarehouse ? 'تعديل المخزن' : 'إنشاء مخزن جديد'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {

                    setWarehouseForm({
                      name: '',
                      phone: '',
                      email: '',
                      address: '',
                      city: '',
                      area: '',
                      manager: '',
                      isActive: true,
                      priority: 1,
                    });
                    setShowWarehouseModal(false);
                  }}
                  className="hover:bg-gray-100 transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">اسم المخزن</Label>
                  <Input
                    id="name"
                    value={warehouseForm.name}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                    placeholder="أدخل اسم المخزن"
                  />
                </div>

                <div>
                  <Label htmlFor="manager">مدير المخزن</Label>
                  <Input
                    id="manager"
                    value={warehouseForm.manager}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, manager: e.target.value })}
                    placeholder="اسم مدير المخزن"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={warehouseForm.phone}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, phone: e.target.value })}
                    placeholder="+218911234567"
                  />
                </div>

                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={warehouseForm.email}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, email: e.target.value })}
                    placeholder="warehouse@eshro.com"
                  />
                </div>

                <div>
                  <Label htmlFor="city">المدينة</Label>
                  <Select value={warehouseForm.city} onValueChange={(value) => setWarehouseForm({ ...warehouseForm, city: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المدينة" />
                    </SelectTrigger>
                    <SelectContent>
                      {libyanCities.map((city) => (
                        <SelectItem key={city.id} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="area">المنطقة</Label>
                  <Input
                    id="area"
                    value={warehouseForm.area}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, area: e.target.value })}
                    placeholder="أدخل اسم المنطقة"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address">العنوان التفصيلي</Label>
                  <Textarea
                    id="address"
                    value={warehouseForm.address}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, address: e.target.value })}
                    placeholder="أدخل العنوان التفصيلي للمخزن"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="priority">أولوية السحب</Label>
                  <Input
                    id="priority"
                    type="number"
                    value={warehouseForm.priority}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, priority: Number(e.target.value) })}
                    placeholder="1"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={warehouseForm.isActive}
                    onCheckedChange={(checked) => setWarehouseForm({ ...warehouseForm, isActive: checked as boolean })}
                  />
                  <Label htmlFor="isActive">مخزن نشط</Label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleSaveWarehouse}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-200 hover:shadow-lg"
                  disabled={!warehouseForm.name.trim() || !warehouseForm.city}
                >
                  <Save className="h-4 w-4 ml-2" />
                  {editingWarehouse ? 'حفظ التغييرات' : 'إنشاء المخزن'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {

                    setWarehouseForm({
                      name: '',
                      phone: '',
                      email: '',
                      address: '',
                      city: '',
                      area: '',
                      manager: '',
                      isActive: true,
                      priority: 1,
                    });
                    setShowWarehouseModal(false);
                  }}
                  className="transition-all duration-200 hover:bg-gray-50"
                >
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

export { InventoryView };
