import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Copy,
  Edit,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Hash,
  Image as ImageIcon,
  Info,
  Layers,
  MoreVertical,
  Palette,
  Plus,
  Save,
  Search,
  Settings,
  Tag as TagIcon,
  Trash2,
  Type,
  Upload,
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

interface FilterValue {
  id: string;
  nameAr: string;
  nameEn: string;
  colorCode?: string;
  image?: string;
  sortOrder: number;
}

interface FilterCriteria {
  id: string;
  nameAr: string;
  nameEn: string;
  type: 'text' | 'colors' | 'images' | 'number' | 'select';
  values: FilterValue[];
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
}

interface FilterCriteriaViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

const FilterCriteriaView: React.FC<FilterCriteriaViewProps> = ({ storeData, setStoreData, onSave }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editingFilter, setEditingFilter] = useState<FilterCriteria | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  // Form state
  const [filterForm, setFilterForm] = useState({
    nameAr: '',
    nameEn: '',
    type: 'text' as FilterCriteria['type'],
    isActive: true,
    sortOrder: 1,
    values: [] as FilterValue[],
  });

  const [valueForm, setValueForm] = useState({
    nameAr: '',
    nameEn: '',
    colorCode: '',
    image: '',
    sortOrder: 1,
  });

  // Sample filter criteria data
  const filterCriteria: FilterCriteria[] = [
    {
      id: '1',
      nameAr: 'اللون',
      nameEn: 'Color',
      type: 'colors',
      isActive: true,
      sortOrder: 1,
      createdAt: '2024-01-15',
      values: [
        { id: '1', nameAr: 'أسود', nameEn: 'Black', colorCode: '#000000', sortOrder: 1 },
        { id: '2', nameAr: 'أحمر', nameEn: 'Red', colorCode: '#FF0000', sortOrder: 2 },
        { id: '3', nameAr: 'أزرق', nameEn: 'Blue', colorCode: '#0000FF', sortOrder: 3 },
        { id: '4', nameAr: 'أخضر', nameEn: 'Green', colorCode: '#00FF00', sortOrder: 4 },
        { id: '5', nameAr: 'أصفر', nameEn: 'Yellow', colorCode: '#FFFF00', sortOrder: 5 },
        { id: '6', nameAr: 'بنفسجي', nameEn: 'Purple', colorCode: '#800080', sortOrder: 6 },
        { id: '7', nameAr: 'وردي', nameEn: 'Pink', colorCode: '#FFC0CB', sortOrder: 7 },
        { id: '8', nameAr: 'رمادي', nameEn: 'Gray', colorCode: '#808080', sortOrder: 8 },
      ],
    },
    {
      id: '2',
      nameAr: 'الحجم',
      nameEn: 'Size',
      type: 'text',
      isActive: true,
      sortOrder: 2,
      createdAt: '2024-01-16',
      values: [
        { id: '9', nameAr: 'صغير', nameEn: 'Small', sortOrder: 1 },
        { id: '10', nameAr: 'متوسط', nameEn: 'Medium', sortOrder: 2 },
        { id: '11', nameAr: 'كبير', nameEn: 'Large', sortOrder: 3 },
        { id: '12', nameAr: 'كبير جداً', nameEn: 'Extra Large', sortOrder: 4 },
        { id: '13', nameAr: 'صغير جداً', nameEn: 'Extra Small', sortOrder: 5 },
      ],
    },
    {
      id: '3',
      nameAr: 'الماركة',
      nameEn: 'Brand',
      type: 'text',
      isActive: true,
      sortOrder: 3,
      createdAt: '2024-01-17',
      values: [
        { id: '14', nameAr: 'نايكي', nameEn: 'Nike', sortOrder: 1 },
        { id: '15', nameAr: 'أديداس', nameEn: 'Adidas', sortOrder: 2 },
        { id: '16', nameAr: 'زارا', nameEn: 'Zara', sortOrder: 3 },
        { id: '17', nameAr: 'إتش أند إم', nameEn: 'H&M', sortOrder: 4 },
        { id: '18', nameAr: 'مانجو', nameEn: 'Mango', sortOrder: 5 },
        { id: '19', nameAr: 'بول آند بير', nameEn: 'Pull & Bear', sortOrder: 6 },
        { id: '20', nameAr: 'بيرشكا', nameEn: 'Bershka', sortOrder: 7 },
        { id: '21', nameAr: 'ستراديفاريوس', nameEn: 'Stradivarius', sortOrder: 8 },
        { id: '22', nameAr: 'ماسيمو دوتي', nameEn: 'Massimo Dutti', sortOrder: 9 },
        { id: '23', nameAr: 'يو تيرن', nameEn: 'U Turn', sortOrder: 10 },
        { id: '24', nameAr: 'ديفاكتو', nameEn: 'Defacto', sortOrder: 11 },
        { id: '25', nameAr: 'إل سي وايكيكي', nameEn: 'LC Waikiki', sortOrder: 12 },
      ],
    },
    {
      id: '4',
      nameAr: 'نوع الجهاز',
      nameEn: 'Device Type',
      type: 'images',
      isActive: true,
      sortOrder: 4,
      createdAt: '2024-01-18',
      values: [
        { id: '26', nameAr: 'هاتف ذكي', nameEn: 'Smartphone', sortOrder: 1 },
        { id: '27', nameAr: 'حاسوب محمول', nameEn: 'Laptop', sortOrder: 2 },
        { id: '28', nameAr: 'جهاز لوحي', nameEn: 'Tablet', sortOrder: 3 },
        { id: '29', nameAr: 'ساعة ذكية', nameEn: 'Smartwatch', sortOrder: 4 },
        { id: '30', nameAr: 'سماعات', nameEn: 'Headphones', sortOrder: 5 },
        { id: '31', nameAr: 'شاحن', nameEn: 'Charger', sortOrder: 6 },
      ],
    },
  ];

  const filteredFilters = filterCriteria.filter(filter =>
    filter.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    filter.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFilter = () => {
    setEditingFilter(null);
    setFilterForm({
      nameAr: '',
      nameEn: '',
      type: 'text',
      isActive: true,
      sortOrder: filterCriteria.length + 1,
      values: [],
    });
    setShowFilterModal(true);
    setActiveTab('basic');
  };

  const handleEditFilter = (filter: FilterCriteria) => {
    setEditingFilter(filter);
    setFilterForm({
      nameAr: filter.nameAr,
      nameEn: filter.nameEn,
      type: filter.type,
      isActive: filter.isActive,
      sortOrder: filter.sortOrder,
      values: filter.values,
    });
    setShowFilterModal(true);
    setActiveTab('basic');
  };

  const handleSaveFilter = () => {
    if (!storeData) return;

    const newFilter: FilterCriteria = {
      id: editingFilter ? editingFilter.id : Date.now().toString(),
      nameAr: filterForm.nameAr,
      nameEn: filterForm.nameEn,
      type: filterForm.type,
      isActive: filterForm.isActive,
      sortOrder: filterForm.sortOrder,
      ...(editingFilter?.createdAt && { createdAt: editingFilter.createdAt }),
      values: filterForm.values,
    };

    if (editingFilter) {
      // Edit existing filter
      const updatedFilters = filterCriteria.map(f => f.id === editingFilter.id ? newFilter : f);
      setStoreData({
        ...storeData,
        filterCriteria: updatedFilters,
      });
    } else {
      // Add new filter
      const updatedFilters = [...filterCriteria, newFilter];
      setStoreData({
        ...storeData,
        filterCriteria: updatedFilters,
      });
    }

    setShowFilterModal(false);
    onSave();
  };

  const handleDeleteFilter = (filterId: string) => {
    const updatedFilters = filterCriteria.filter(f => f.id !== filterId);
    setStoreData({
      ...storeData,
      filterCriteria: updatedFilters,
    });
    onSave();
  };

  const handleAddValue = () => {
    if (!valueForm.nameAr.trim()) return;

    const newValue: FilterValue = {
      id: Date.now().toString(),
      nameAr: valueForm.nameAr,
      nameEn: valueForm.nameEn,
      colorCode: valueForm.colorCode,
      image: valueForm.image,
      sortOrder: valueForm.sortOrder,
    };

    setFilterForm({
      ...filterForm,
      values: [...filterForm.values, newValue],
    });

    setValueForm({
      nameAr: '',
      nameEn: '',
      colorCode: '',
      image: '',
      sortOrder: 1,
    });
  };

  const handleDeleteValue = (valueId: string) => {
    setFilterForm({
      ...filterForm,
      values: filterForm.values.filter(v => v.id !== valueId),
    });
  };

  const getTypeBadge = (type: FilterCriteria['type']) => {
    const typeConfig = {
      text: { label: 'نص', color: 'bg-blue-100 text-blue-800', icon: <Type className="h-3 w-3" /> },
      colors: { label: 'ألوان', color: 'bg-green-100 text-green-800', icon: <Palette className="h-3 w-3" /> },
      images: { label: 'صور', color: 'bg-purple-100 text-purple-800', icon: <ImageIcon className="h-3 w-3" /> },
      number: { label: 'رقم', color: 'bg-orange-100 text-orange-800', icon: <Hash className="h-3 w-3" /> },
      select: { label: 'قائمة', color: 'bg-pink-100 text-pink-800', icon: <Layers className="h-3 w-3" /> },
    };

    const config = typeConfig[type] || { label: type, color: 'bg-gray-100 text-gray-800', icon: <Info className="h-3 w-3" /> };
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const renderValuePreview = (value: FilterValue, filterType: FilterCriteria['type']) => {
    switch (filterType) {
      case 'colors':
        return (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="8" cy="8" r="7" fill={value.colorCode || '#000000'} stroke="#D1D5DB" strokeWidth="1" />
            </svg>
            <span>{value.nameAr}</span>
          </div>
        );
      case 'images':
        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
              <ImageIcon className="h-4 w-4 text-gray-400" />
            </div>
            <span>{value.nameAr}</span>
          </div>
        );
      default:
        return <span>{value.nameAr}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">معايير التصفية</h2>
          <p className="text-gray-600 mt-1">استخدم معايير التصفية لتسهيل بحث العملاء عن المنتجات في متجرك</p>
        </div>
        <Button
          onClick={handleAddFilter}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <Plus className="h-4 w-4 ml-2" />
          إنشاء فلتر جديد
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث عن معايير التصفية..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 ml-2" />
              فلترة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Filters */}
      <Card>
        <CardHeader>
          <CardTitle>الفلاتر الموجودة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredFilters.map((filter) => (
              <div key={filter.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <TagIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{filter.nameAr}</h3>
                      <p className="text-sm text-gray-600">{filter.nameEn}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTypeBadge(filter.type)}
                    <Badge variant={filter.isActive ? 'default' : 'secondary'}>
                      {filter.isActive ? 'نشط' : 'غير نشط'}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleEditFilter(filter)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteFilter(filter.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {filter.values.slice(0, 6).map((value) => (
                    <div key={value.id} className="p-2 border rounded text-center">
                      {renderValuePreview(value, filter.type)}
                    </div>
                  ))}
                  {filter.values.length > 6 && (
                    <div className="p-2 border rounded text-center text-gray-500">
                      +{filter.values.length - 6} أخرى
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div className="text-sm text-gray-600">
                    {filter.values.length} قيمة
                  </div>
                  <div className="text-sm text-gray-600">
                    ترتيب العرض: {filter.sortOrder}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFilters.length === 0 && (
            <div className="text-center py-8">
              <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد فلاتر تطابق معايير البحث</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Filter Modal */}
      <AnimatePresence>
        {showFilterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowFilterModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-80 bg-gray-50 border-l p-6 overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      {editingFilter ? 'تعديل الفلتر' : 'إنشاء فلتر جديد'}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilterModal(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <nav className="space-y-2">
                    <button
                      onClick={() => setActiveTab('basic')}
                      className={`w-full text-right p-3 rounded-lg transition-colors ${
                        activeTab === 'basic' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                      }`}
                    >
                      معلومات أساسية
                    </button>
                    <button
                      onClick={() => setActiveTab('values')}
                      className={`w-full text-right p-3 rounded-lg transition-colors ${
                        activeTab === 'values' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                      }`}
                    >
                      القيم المرتبطة بالفلتر
                    </button>
                  </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {activeTab === 'basic' && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-gray-900">معلومات الفلتر الأساسية</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="nameAr">اسم الفلتر بالعربية</Label>
                          <Input
                            id="nameAr"
                            value={filterForm.nameAr}
                            onChange={(e) => setFilterForm({ ...filterForm, nameAr: e.target.value })}
                            placeholder="اسم الفلتر بالعربية"
                          />
                        </div>

                        <div>
                          <Label htmlFor="nameEn">اسم الفلتر بالإنجليزية</Label>
                          <Input
                            id="nameEn"
                            value={filterForm.nameEn}
                            onChange={(e) => setFilterForm({ ...filterForm, nameEn: e.target.value })}
                            placeholder="Filter name in English"
                          />
                        </div>

                        <div>
                          <Label htmlFor="type">نوع الفلتر</Label>
                          <Select value={filterForm.type} onValueChange={(value) => setFilterForm({ ...filterForm, type: value as FilterCriteria['type'] })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">نص</SelectItem>
                              <SelectItem value="colors">بالألوان</SelectItem>
                              <SelectItem value="images">بالصور</SelectItem>
                              <SelectItem value="number">رقم</SelectItem>
                              <SelectItem value="select">قائمة اختيار</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="sortOrder">ترتيب العرض</Label>
                          <Input
                            id="sortOrder"
                            type="number"
                            value={filterForm.sortOrder}
                            onChange={(e) => setFilterForm({ ...filterForm, sortOrder: Number(e.target.value) })}
                            placeholder="1"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isActive"
                          checked={filterForm.isActive}
                          onCheckedChange={(checked) => setFilterForm({ ...filterForm, isActive: checked as boolean })}
                        />
                        <Label htmlFor="isActive">فلتر نشط</Label>
                      </div>
                    </div>
                  )}

                  {activeTab === 'values' && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-gray-900">القيم المرتبطة بالفلتر</h3>

                      {/* Add New Value */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">إضافة قيمة جديدة للفلتر</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="valueNameAr">الاسم بالعربية</Label>
                              <Input
                                id="valueNameAr"
                                value={valueForm.nameAr}
                                onChange={(e) => setValueForm({ ...valueForm, nameAr: e.target.value })}
                                placeholder="الاسم بالعربية"
                              />
                            </div>

                            <div>
                              <Label htmlFor="valueNameEn">الاسم بالإنجليزية</Label>
                              <Input
                                id="valueNameEn"
                                value={valueForm.nameEn}
                                onChange={(e) => setValueForm({ ...valueForm, nameEn: e.target.value })}
                                placeholder="Name in English"
                              />
                            </div>

                            {filterForm.type === 'colors' && (
                              <div>
                                <Label htmlFor="colorCode">اختيار اللون</Label>
                                <div className="flex gap-2">
                                  <Input
                                    id="colorCode"
                                    type="color"
                                    value={valueForm.colorCode}
                                    onChange={(e) => setValueForm({ ...valueForm, colorCode: e.target.value })}
                                    className="w-16 h-10 p-1"
                                  />
                                  <Input
                                    value={valueForm.colorCode}
                                    onChange={(e) => setValueForm({ ...valueForm, colorCode: e.target.value })}
                                    placeholder="#000000"
                                    className="flex-1"
                                  />
                                </div>
                              </div>
                            )}

                            {filterForm.type === 'images' && (
                              <div>
                                <Label>رفع الصورة</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                                  <ImageIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                                  <p className="text-sm text-gray-600 mb-2">اسحب الملف وأفلته هنا</p>
                                  <Button variant="outline" size="sm">
                                    <Upload className="h-4 w-4 ml-2" />
                                    اختيار صورة
                                  </Button>
                                  <p className="text-xs text-gray-500 mt-2">PNG, JPG, JPEG, GIF, WEBP أو SVG (الحد الأقصى: 2.048MB)</p>
                                </div>
                              </div>
                            )}

                            <div>
                              <Label htmlFor="valueSortOrder">ترتيب العرض</Label>
                              <Input
                                id="valueSortOrder"
                                type="number"
                                value={valueForm.sortOrder}
                                onChange={(e) => setValueForm({ ...valueForm, sortOrder: Number(e.target.value) })}
                                placeholder="1"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end mt-4">
                            <Button onClick={handleAddValue} disabled={!valueForm.nameAr.trim()}>
                              إضافة القيمة
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Existing Values */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">القيم الحالية ({filterForm.values.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {filterForm.values.map((value) => (
                              <div key={value.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-2">
                                  {renderValuePreview(value, filterForm.type)}
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteValue(value.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>

                          {filterForm.values.length === 0 && (
                            <div className="text-center py-6 text-gray-500">
                              لا توجد قيم مضافة بعد
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Modal Actions */}
                  <div className="flex justify-between mt-8 pt-6 border-t">
                    <Button variant="outline" onClick={() => setShowFilterModal(false)}>
                      إلغاء
                    </Button>
                    <Button
                      onClick={handleSaveFilter}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      disabled={!filterForm.nameAr.trim()}
                    >
                      <Save className="h-4 w-4 ml-2" />
                      {editingFilter ? 'حفظ التغييرات' : 'حفظ الفلتر'}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { FilterCriteriaView };
