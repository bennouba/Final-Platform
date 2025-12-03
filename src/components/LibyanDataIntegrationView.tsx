import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle,
  Edit,
  Globe,
  Info,
  Landmark,
  MapPin,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  X,
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
import { libyanAreas } from '@/data/libya/areas/areas';
import { libyanBanks } from '@/data/libya/banks/banks';

interface LibyanDataIntegrationViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

const LibyanDataIntegrationView: React.FC<LibyanDataIntegrationViewProps> = ({ storeData, setStoreData, onSave }) => {
  const [activeTab, setActiveTab] = useState('cities');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'city' | 'area' | 'bank'>('city');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    city: '',
    phone: '',
    email: '',
    address: '',
    coordinates: {
      lat: '',
      lng: '',
    },
  });

  const handleAddItem = (type: 'city' | 'area' | 'bank') => {
    setModalType(type);
    setEditingItem(null);
    setFormData({
      name: '',
      nameEn: '',
      city: '',
      phone: '',
      email: '',
      address: '',
      coordinates: {
        lat: '',
        lng: '',
      },
    });
    setShowAddModal(true);
  };

  const handleEditItem = (item: any, type: 'city' | 'area' | 'bank') => {
    setModalType(type);
    setEditingItem(item);
    setFormData({
      name: item.name || item.nameAr || '',
      nameEn: item.nameEn || '',
      city: item.city || '',
      phone: item.phone || '',
      email: item.email || '',
      address: item.address || '',
      coordinates: {
        lat: item.lat || item.coordinates?.lat || '',
        lng: item.lng || item.coordinates?.lng || '',
      },
    });
    setShowAddModal(true);
  };

  const handleSaveItem = () => {
    if (!storeData) return;

    const newItem = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      name: formData.name,
      nameEn: formData.nameEn,
      city: formData.city,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      coordinates: {
        lat: Number(formData.coordinates.lat),
        lng: Number(formData.coordinates.lng),
      },
    };

    // In real app, this would save to the appropriate data file

    setShowAddModal(false);
    onSave();
  };

  const handleDeleteItem = (itemId: string, type: 'city' | 'area' | 'bank') => {
    // In real app, this would delete from the appropriate data file

    onSave();
  };

  const filteredCities = libyanCities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAreas = libyanAreas.filter(area =>
    area.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">التكامل مع البيانات الليبية</h2>
          <p className="text-gray-600 mt-1">إدارة وتكامل البيانات الجغرافية والمصرفية الليبية</p>
        </div>
      </div>

      {/* Data Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المدن الليبية</p>
                <p className="text-3xl font-bold text-blue-600">{libyanCities.length}</p>
                <p className="text-sm text-gray-600">مدينة متاحة</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المناطق</p>
                <p className="text-3xl font-bold text-green-600">{libyanAreas.length}</p>
                <p className="text-sm text-gray-600">منطقة متاحة</p>
              </div>
              <Globe className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المصارف</p>
                <p className="text-3xl font-bold text-purple-600">{libyanBanks.length}</p>
                <p className="text-sm text-gray-600">مصرف متاح</p>
              </div>
              <Landmark className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Management Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>إدارة البيانات الليبية</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cities" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                المدن
              </TabsTrigger>
              <TabsTrigger value="areas" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                المناطق
              </TabsTrigger>
              <TabsTrigger value="banks" className="flex items-center gap-2">
                <Landmark className="h-4 w-4" />
                المصارف
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cities" className="mt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="البحث في المدن..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={() => handleAddItem('city')}>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة مدينة
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCities.map((city) => (
                  <Card key={city.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{city.name}</h3>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" onClick={() => handleEditItem(city, 'city')}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteItem(city.id, 'city')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>عدد المناطق: {libyanAreas.filter(area => area.city === city.name).length}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="areas" className="mt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="البحث في المناطق..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={() => handleAddItem('area')}>
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة منطقة
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredAreas.map((area) => {
                  const city = libyanCities.find(c => c.name === area.city);
                  return (
                    <Card key={area.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{area.name}</h3>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" onClick={() => handleEditItem(area, 'area')}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteItem(area.id, 'area')}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>المدينة: {city?.name || 'غير محدد'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="banks" className="mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {libyanBanks.map((bank) => (
                    <Card key={bank.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{bank.name}</h3>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" onClick={() => handleEditItem(bank, 'bank')}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteItem(bank.id, 'bank')}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <Badge className="bg-green-100 text-green-800">مصرف ليبي</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            حالة التكامل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">المدن والمناطق</p>
                  <p className="text-sm text-green-700">تم التكامل بنجاح مع {libyanCities.length} مدينة و {libyanAreas.length} منطقة</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">مُفعل</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">المصارف الليبية</p>
                  <p className="text-sm text-green-700">تم التكامل بنجاح مع {libyanBanks.length} مصرف ليبي</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">مُفعل</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">البيانات المحدثة</p>
                  <p className="text-sm text-blue-700">آخر تحديث: {new Date().toLocaleDateString('ar')}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 ml-2" />
                تحديث البيانات
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingItem ? 'تعديل' : 'إضافة'} {modalType === 'city' ? 'مدينة' : modalType === 'area' ? 'منطقة' : 'مصرف'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>{modalType === 'city' ? 'اسم المدينة' : modalType === 'area' ? 'اسم المنطقة' : 'اسم المصرف'}</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={modalType === 'city' ? 'أدخل اسم المدينة' : modalType === 'area' ? 'أدخل اسم المنطقة' : 'أدخل اسم المصرف'}
                  />
                </div>

                {modalType === 'city' && (
                  <div>
                    <Label>اسم المدينة بالإنجليزية</Label>
                    <Input
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      placeholder="City name in English"
                    />
                  </div>
                )}

                {modalType === 'bank' && (
                  <div>
                    <Label>اسم المصرف بالإنجليزية</Label>
                    <Input
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      placeholder="Bank name in English"
                    />
                  </div>
                )}

                {modalType === 'area' && (
                  <div>
                    <Label>المدينة التابعة لها</Label>
                    <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
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
                )}

                {(modalType === 'city' || modalType === 'area') && (
                  <>
                    <div>
                      <Label>الإحداثيات - خط العرض</Label>
                      <Input
                        type="number"
                        value={formData.coordinates.lat}
                        onChange={(e) => setFormData({
                          ...formData,
                          coordinates: { ...formData.coordinates, lat: e.target.value }
                        })}
                        placeholder="32.8872"
                      />
                    </div>

                    <div>
                      <Label>الإحداثيات - خط الطول</Label>
                      <Input
                        type="number"
                        value={formData.coordinates.lng}
                        onChange={(e) => setFormData({
                          ...formData,
                          coordinates: { ...formData.coordinates, lng: e.target.value }
                        })}
                        placeholder="13.1913"
                      />
                    </div>
                  </>
                )}

                {modalType === 'city' && (
                  <>
                    <div>
                      <Label>رقم الهاتف</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+218911234567"
                      />
                    </div>

                    <div>
                      <Label>البريد الإلكتروني</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="city@libya.gov.ly"
                      />
                    </div>

                    <div>
                      <Label>العنوان</Label>
                      <Textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="العنوان التفصيلي للمدينة"
                        rows={2}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleSaveItem}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  disabled={!formData.name.trim()}
                >
                  <Save className="h-4 w-4 ml-2" />
                  {editingItem ? 'حفظ التغييرات' : 'إضافة'}
                </Button>
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
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

export { LibyanDataIntegrationView };
