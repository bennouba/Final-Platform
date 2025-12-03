import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Note: Using any type for Google Maps to avoid conflicts with existing declarations
import {
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  MapPin,
  Building,
  Settings,
  MoreVertical,
  GripVertical,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Package,
  Users,
  TrendingUp,
  Map,
  Navigation,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { libyanCities } from '@/data/libya/cities/cities';

interface Warehouse {
  id: string;
  name: string;
  location: string;
  city: string;
  area: string;
  status: 'active' | 'inactive';
  totalOrders: number;
  isActive: boolean;
  priority: number;
}

interface WarehouseManagementViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

const WarehouseManagementView: React.FC<WarehouseManagementViewProps> = ({ storeData, setStoreData, onSave }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [warehouseForm, setWarehouseForm] = useState({
    name: '',
    location: '',
    city: '',
    area: '',
    coordinates: { lat: 32.8872, lng: 13.1913 }, // Default to Tripoli coordinates
    address: '',
  });

  const [selectedLocation, setSelectedLocation] = useState({
    lat: 32.8872,
    lng: 13.1913,
    address: 'طرابلس، ليبيا'
  });

  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const warehouses = storeData?.warehouses || [
    {
      id: '1',
      name: 'مخزن طريق المطار',
      location: 'طريق المطار',
      city: 'طرابلس',
      area: 'طرابلس',
      status: 'active' as const,
      totalOrders: 45,
      isActive: true,
      priority: 1,
    },
    {
      id: '2',
      name: 'مخزن غوط الشعال',
      location: 'غوط الشعال',
      city: 'طرابلس',
      area: 'طرابلس',
      status: 'active' as const,
      totalOrders: 32,
      isActive: true,
      priority: 2,
    },
    {
      id: '3',
      name: 'مخزن شهداء الشط',
      location: 'شهداء الشط',
      city: 'طرابلس',
      area: 'طرابلس',
      status: 'active' as const,
      totalOrders: 28,
      isActive: true,
      priority: 3,
    },
    {
      id: '4',
      name: 'مخزن الكريمية',
      location: 'الكريمية',
      city: 'طرابلس',
      area: 'طرابلس',
      status: 'inactive' as const,
      totalOrders: 15,
      isActive: false,
      priority: 4,
    },
    {
      id: '5',
      name: 'مخزن قمينس',
      location: 'قمينس',
      city: 'بنغازي',
      area: 'بنغازي',
      status: 'active' as const,
      totalOrders: 127,
      isActive: true,
      priority: 5,
    },
  ];

  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateWarehouse = () => {

    setWarehouseForm({
      name: '',
      location: '',
      city: '',
      area: '',
      coordinates: { lat: 32.8872, lng: 13.1913 },
      address: '',
    });
    setSelectedLocation({
      lat: 32.8872,
      lng: 13.1913,
      address: 'طرابلس، ليبيا'
    });
    setShowCreateModal(true);
  };

  // Google Maps Integration Functions
  const loadGoogleMapsScript = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if ((window as any).google && (window as any).google.maps) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places&language=ar&region=LY&loading=async`;
      script.async = true;
      script.defer = true;

      script.onload = () => {

        resolve();
      };

      script.onerror = () => {

        reject(new Error('Failed to load Google Maps'));
      };

      document.head.appendChild(script);
    });
  }, []);

  const initializeMap = useCallback(async () => {
    if (!mapRef.current || !(window as any).google) return;

    setIsMapLoading(true);

    try {
      const google = (window as any).google;
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: selectedLocation.lat, lng: selectedLocation.lng },
        zoom: 12,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      googleMapRef.current = map;

      const marker = new google.maps.Marker({
        position: { lat: selectedLocation.lat, lng: selectedLocation.lng },
        map: map,
        draggable: true,
        title: 'موقع المخزن'
      });

      markerRef.current = marker;

      // Add click listener to map
      map.addListener('click', (event: any) => {
        if (event.latLng) {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          marker.setPosition({ lat, lng });
          setSelectedLocation({
            lat,
            lng,
            address: `خط العرض: ${lat.toFixed(6)}, خط الطول: ${lng.toFixed(6)}`
          });
        }
      });

      // Add drag listener to marker
      marker.addListener('dragend', (event: any) => {
        if (event.latLng) {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          setSelectedLocation({
            lat,
            lng,
            address: `خط العرض: ${lat.toFixed(6)}, خط الطول: ${lng.toFixed(6)}`
          });
        }
      });

      setMapLoaded(true);
    } catch (error) {

    } finally {
      setIsMapLoading(false);
    }
  }, [selectedLocation]);

  const handleOpenMapModal = async () => {
    setShowMapModal(true);
    setIsMapLoading(true);

    try {
      await loadGoogleMapsScript();
      // Wait a bit for the script to fully load
      setTimeout(() => {
        initializeMap();
      }, 1000);
    } catch (error) {

      setIsMapLoading(false);
    }
  };

  const handleConfirmLocation = () => {
    setWarehouseForm({
      ...warehouseForm,
      coordinates: { lat: selectedLocation.lat, lng: selectedLocation.lng },
      address: selectedLocation.address,
    });
    setShowMapModal(false);
  };

  const handleSaveWarehouse = async () => {

    if (!storeData) {

      return;
    }

    if (!warehouseForm.name.trim() || !warehouseForm.city) {

      const missingFields: string[] = [];
      if (!warehouseForm.name.trim()) missingFields.push('• اسم المخزن');
      if (!warehouseForm.city) missingFields.push('• المدينة');

      alert(`⚠️ يرجى إكمال البيانات التالية:\n${missingFields.join('\n')}`);
      return;
    }

    setIsLoading(true);

    try {
      const newWarehouse: Warehouse = {
        id: Date.now().toString(),
        name: warehouseForm.name,
        location: warehouseForm.location,
        city: warehouseForm.city,
        area: warehouseForm.area,
        status: 'active',
        totalOrders: 0,
        isActive: true,
        priority: warehouses.length + 1,
      };



      const updatedWarehouses = [...warehouses, newWarehouse];


      setStoreData({
        ...storeData,
        warehouses: updatedWarehouses,
      });

      // Show success animation
      setShowSuccessAnimation(true);

      // Show enhanced success message with beautiful styling
      const successMessage = `🎉 تم إنشاء المخزن بنجاح!\n\n` +
        `🏪 اسم المخزن: ${newWarehouse.name}\n` +
        `📍 الموقع: ${newWarehouse.location}\n` +
        `🌍 المدينة: ${newWarehouse.city}\n` +
        `🏢 المنطقة: ${newWarehouse.area}\n` +
        `✅ الحالة: نشط\n` +
        `🔢 الأولوية: ${newWarehouse.priority}\n` +
        `📊 إجمالي المخازن الآن: ${updatedWarehouses.length}\n\n` +
        `🚀 المخزن جاهز للاستخدام في نظام إدارة المخزون!\n` +
        `✅ تم إضافته لقائمة المخازن فوراً\n` +
        `📈 الإحصائيات محدثة تلقائياً`;

      // Refresh the list to show the new warehouse
      setRefreshKey(prev => prev + 1);

      // Show success message after a short delay for better UX
      setTimeout(() => {
        alert(successMessage);
        setShowSuccessAnimation(false);
      }, 500);

      setWarehouseForm({
        name: '',
        location: '',
        city: '',
        area: '',
        coordinates: { lat: 32.8872, lng: 13.1913 },
        address: '',
      });
      setShowCreateModal(false);
      onSave();
    } catch (error) {

      alert('❌ حدث خطأ أثناء حفظ المخزن!\n\nتأكد من:\n• ملء جميع الحقول المطلوبة\n• اختيار المدينة من القائمة\n• اسم المخزن غير مكرر\n\nإذا استمرت المشكلة، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, warehouseId: string) => {
    setDraggedItem(warehouseId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetWarehouseId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetWarehouseId) return;

    const draggedIndex = warehouses.findIndex(w => w.id === draggedItem);
    const targetIndex = warehouses.findIndex(w => w.id === targetWarehouseId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const updatedWarehouses = [...warehouses];
    const [draggedWarehouse] = updatedWarehouses.splice(draggedIndex, 1);
    updatedWarehouses.splice(targetIndex, 0, draggedWarehouse);

    // Update priorities
    updatedWarehouses.forEach((warehouse, index) => {
      warehouse.priority = index + 1;
    });

    setStoreData({
      ...storeData,
      warehouses: updatedWarehouses,
    });

    setDraggedItem(null);
    onSave();
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (isActive) {
      return <Badge className="bg-green-100 text-green-800">مُفعّل</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800">مُعطّل</Badge>;
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
          onClick={handleCreateWarehouse}
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
                <p className="text-sm font-medium text-gray-600">المخازن النشطة</p>
                <p className="text-3xl font-bold text-gray-900">{warehouses.filter(w => w.isActive).length}</p>
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
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الطلبات المرسلة</p>
                <p className="text-3xl font-bold text-gray-900">{warehouses.reduce((sum, w) => sum + w.totalOrders, 0)}</p>
                <p className="text-sm text-gray-600">هذا الشهر</p>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            أولوية السحب من المخازن
          </CardTitle>
          <p className="text-sm text-gray-600">
            اسحب المواقع لإعادة ترتيبها حسب الأولوية
          </p>
          <p className="text-xs text-gray-500">
            تُوجه الطلبات أولاً للموقع الأعلى، وإذا لم يُنفذ الطلب بالكامل، يُقسم بين عدة مستودعات
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {warehouses
              .sort((a, b) => a.priority - b.priority)
              .map((warehouse, index) => (
                <div
                  key={warehouse.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, warehouse.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, warehouse.id)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-4 p-4 border rounded-lg cursor-move transition-all ${
                    draggedItem === warehouse.id ? 'opacity-50 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <GripVertical className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                        {warehouse.priority}
                      </div>
                      <div>
                        <h4 className="font-semibold">{warehouse.name}</h4>
                        <p className="text-sm text-gray-600">{warehouse.city}, ليبيا</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-600">الطلبات المرسلة</p>
                    <p className="font-semibold">{warehouse.totalOrders}</p>
                  </div>
                  {getStatusBadge(warehouse.status, warehouse.isActive)}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Warehouse List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة المخازن</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث في المخازن..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 ml-2" />
                تصدير
              </Button>
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
                  <tr
                    key={`${warehouse.id}-${refreshKey}`}
                    className={`border-b hover:bg-gray-50 ${
                      showSuccessAnimation && warehouse.id === Date.now().toString()
                        ? 'bg-green-50 animate-pulse'
                        : ''
                    }`}
                  >
                    <td className="p-3">
                      <div>
                        <p className="font-semibold">{warehouse.name}</p>
                        <p className="text-sm text-gray-600">{warehouse.location}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold">{warehouse.city}</p>
                    </td>
                    <td className="p-3">
                      <p className="text-gray-600">ليبيا</p>
                    </td>
                    <td className="p-3">
                      {getStatusBadge(warehouse.status, warehouse.isActive)}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MapPin className="h-4 w-4" />
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

      {/* Create Warehouse Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => {

              setWarehouseForm({
                name: '',
                location: '',
                city: '',
                area: '',
                coordinates: { lat: 32.8872, lng: 13.1913 },
                address: '',
              });
              setShowCreateModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">إنشاء مخزن جديد</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {

                    setWarehouseForm({
                      name: '',
                      location: '',
                      city: '',
                      area: '',
                      coordinates: { lat: 32.8872, lng: 13.1913 },
                      address: '',
                    });
                    setShowCreateModal(false);
                  }}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="warehouseName">اسم المخزن</Label>
                  <Input
                    id="warehouseName"
                    value={warehouseForm.name}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                    placeholder="أدخل اسم المخزن"
                  />
                </div>

                <div>
                  <Label htmlFor="warehouseLocation">موقع المخزن</Label>
                  <Input
                    id="warehouseLocation"
                    value={warehouseForm.location}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, location: e.target.value })}
                    placeholder="أدخل موقع المخزن"
                  />
                </div>

                <div>
                  <Label htmlFor="warehouseCity">المدينة</Label>
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
                  <Label htmlFor="warehouseArea">المنطقة</Label>
                  <Input
                    id="warehouseArea"
                    value={warehouseForm.area}
                    onChange={(e) => setWarehouseForm({ ...warehouseForm, area: e.target.value })}
                    placeholder="أدخل المنطقة"
                  />
                </div>

                <div>
                  <Label>تحديد الموقع على الخريطة</Label>
                  <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
                    <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-3">
                      {warehouseForm.address || 'لم يتم تحديد موقع بعد'}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleOpenMapModal}
                      className="w-full"
                    >
                      <Map className="h-4 w-4 ml-2" />
                      اختر الموقع من الخريطة
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleSaveWarehouse}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  disabled={!warehouseForm.name.trim() || !warehouseForm.city || isLoading}
                >
                  <Save className="h-4 w-4 ml-2" />
                  {isLoading ? 'جاري إنشاء المخزن...' : 'إنشاء المخزن'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {

                    setWarehouseForm({
                      name: '',
                      location: '',
                      city: '',
                      area: '',
                      coordinates: { lat: 32.8872, lng: 13.1913 },
                      address: '',
                    });
                    setShowCreateModal(false);
                  }}
                  disabled={isLoading}
                >
                  إلغاء
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Modal */}
      <AnimatePresence>
        {showMapModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
            onClick={() => setShowMapModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-4xl mx-4 shadow-2xl border max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">اختر موقع المخزن على الخريطة</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMapModal(false)}
                  disabled={isMapLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 relative">
                {isMapLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                      <p className="text-gray-600">جاري تحميل الخريطة...</p>
                    </div>
                  </div>
                )}

                <div
                  ref={mapRef}
                  className="w-full h-96 min-h-[400px] bg-gray-100 rounded-lg"
                />

                {!mapLoaded && !isMapLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Map className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">انقر على الخريطة لتحديد موقع المخزن</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Navigation className="h-4 w-4" />
                  <span>الموقع المحدد: {selectedLocation.address}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  onClick={handleConfirmLocation}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  disabled={isMapLoading}
                >
                  <CheckCircle className="h-4 w-4 ml-2" />
                  تأكيد الموقع
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowMapModal(false)}
                  disabled={isMapLoading}
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

export { WarehouseManagementView };
