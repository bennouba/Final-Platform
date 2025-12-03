import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  ChevronDown,
  Copy,
  Download,
  Edit,
  Eye,
  EyeOff,
  Filter,
  Globe,
  Info,
  Mail,
  MapPin,
  MoreVertical,
  Phone,
  PieChart,
  Plus,
  Save,
  Search,
  Settings,
  Target,
  Trash2,
  TrendingUp,
  User,
  Users,
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
import { libyanCities } from '@/data/libya/cities/cities';

interface CustomerGroup {
  id: string;
  name: string;
  description: string;
  customerCount: number;
  percentage: number;
  gender: 'male' | 'female' | 'mixed';
  status: 'active' | 'inactive';
  criteria: {
    minOrders?: number;
    maxOrders?: number;
    city?: string;
    gender?: 'male' | 'female' | 'all';
    birthDateFrom?: string;
    birthDateTo?: string;
    isNewsletterSubscriber?: boolean;
    customerType?: 'new' | 'regular' | 'vip' | 'all';
    salesChannel?: string;
  };
  createdAt: string | undefined;
  color: string;
}

interface CustomerGroupsViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

const COLOR_CONFIG: Record<string, { background: string; progress: string }> = {
  '#3B82F6': { background: 'bg-[#3B82F6]', progress: 'progress-color-blue' },
  '#10B981': { background: 'bg-[#10B981]', progress: 'progress-color-emerald' },
  '#8B5CF6': { background: 'bg-[#8B5CF6]', progress: 'progress-color-violet' },
  '#F59E0B': { background: 'bg-[#F59E0B]', progress: 'progress-color-amber' },
  '#EF4444': { background: 'bg-[#EF4444]', progress: 'progress-color-rose' },
  '#EC4899': { background: 'bg-[#EC4899]', progress: 'progress-color-pink' },
  '#6366F1': { background: 'bg-[#6366F1]', progress: 'progress-color-indigo' },
  '#14B8A6': { background: 'bg-[#14B8A6]', progress: 'progress-color-teal' },
};

const COLOR_OPTIONS = Object.keys(COLOR_CONFIG);

const getBackgroundClass = (color: string) => COLOR_CONFIG[color]?.background ?? 'bg-gray-400';

const getProgressClass = (color: string) => COLOR_CONFIG[color]?.progress ?? 'progress-color-default';

const CustomerGroupsView: React.FC<CustomerGroupsViewProps> = ({ storeData, setStoreData, onSave }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CustomerGroup | null>(null);

  // Form state
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    gender: 'mixed' as CustomerGroup['gender'],
    status: 'active' as CustomerGroup['status'],
    criteria: {
      minOrders: 0,
      maxOrders: 0,
      city: '',
      gender: 'all' as 'male' | 'female' | 'all',
      birthDateFrom: '',
      birthDateTo: '',
      isNewsletterSubscriber: false,
      customerType: 'all' as 'new' | 'regular' | 'vip' | 'all',
      salesChannel: '',
    },
    color: '#3B82F6',
  });

  // Sample customer groups data
  const customerGroups: CustomerGroup[] = [
    {
      id: '1',
      name: 'العملاء المنتظمون',
      description: 'العملاء الذين يشترون بانتظام',
      customerCount: 156,
      percentage: 65,
      gender: 'mixed',
      status: 'active',
      criteria: {
        minOrders: 3,
        customerType: 'regular',
      },
      createdAt: '2024-01-01',
      color: '#10B981',
    },
    {
      id: '2',
      name: 'عملاء طرابلس النشطين',
      description: 'العملاء النشطين من مدينة طرابلس',
      customerCount: 145,
      percentage: 34,
      gender: 'mixed',
      status: 'active',
      criteria: {
        city: 'طرابلس',
        customerType: 'regular',
      },
      createdAt: '2024-01-15',
      color: '#3B82F6',
    },
    {
      id: '3',
      name: 'عملاء الطلبات الكبيرة',
      description: 'العملاء الذين يقومون بطلبات ذات قيمة عالية',
      customerCount: 89,
      percentage: 28,
      gender: 'mixed',
      status: 'active',
      criteria: {
        customerType: 'vip',
      },
      createdAt: '2024-02-01',
      color: '#8B5CF6',
    },
  ];

  const filteredGroups = customerGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddGroup = () => {
    setEditingGroup(null);
    setGroupForm({
      name: '',
      description: '',
      gender: 'mixed',
      status: 'active',
      criteria: {
        minOrders: 0,
        maxOrders: 0,
        city: '',
        gender: 'all',
        birthDateFrom: '',
        birthDateTo: '',
        isNewsletterSubscriber: false,
        customerType: 'all',
        salesChannel: '',
      },
      color: '#3B82F6',
    });
    setShowGroupModal(true);
  };

  const handleEditGroup = (group: CustomerGroup) => {
    setEditingGroup(group);
    setGroupForm({
      name: group.name,
      description: group.description,
      gender: group.gender,
      status: group.status,
      criteria: {
        minOrders: group.criteria.minOrders ?? 0,
        maxOrders: group.criteria.maxOrders ?? 0,
        city: group.criteria.city ?? '',
        gender: group.criteria.gender ?? 'all',
        birthDateFrom: group.criteria.birthDateFrom ?? '',
        birthDateTo: group.criteria.birthDateTo ?? '',
        isNewsletterSubscriber: group.criteria.isNewsletterSubscriber ?? false,
        customerType: group.criteria.customerType ?? 'all',
        salesChannel: group.criteria.salesChannel ?? '',
      },
      color: group.color,
    });
    setShowGroupModal(true);
  };

  const handleSaveGroup = () => {
    if (!storeData) return;

    // Form validation
    if (!groupForm.name.trim()) {
      alert('يرجى إدخال اسم المجموعة');
      return;
    }

    if (!groupForm.description.trim()) {
      alert('يرجى إدخال وصف المجموعة');
      return;
    }

    // TODO: Calculate actual customer count and percentage based on criteria
    // For now, keeping as 0 for new groups and preserving existing values for edits
    const newGroup: CustomerGroup = {
      id: editingGroup ? editingGroup.id : Date.now().toString(),
      name: groupForm.name,
      description: groupForm.description,
      customerCount: editingGroup ? editingGroup.customerCount ?? 0 : 0,
      percentage: editingGroup ? editingGroup.percentage ?? 0 : 0,
      gender: groupForm.gender,
      status: groupForm.status,
      criteria: groupForm.criteria,
      createdAt: editingGroup ? editingGroup.createdAt ?? new Date().toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      color: groupForm.color,
    };

    if (editingGroup) {
      // Edit existing group
      const updatedGroups = customerGroups.map(g => g.id === editingGroup.id ? newGroup : g);
      setStoreData({
        ...storeData,
        customerGroups: updatedGroups,
      });
    } else {
      // Add new group
      const updatedGroups = [...customerGroups, newGroup];
      setStoreData({
        ...storeData,
        customerGroups: updatedGroups,
      });
    }

    setShowGroupModal(false);
    onSave();
  };

  const handleDeleteGroup = (groupId: string) => {
    const updatedGroups = customerGroups.filter(g => g.id !== groupId);
    setStoreData({
      ...storeData,
      customerGroups: updatedGroups,
    });
    onSave();
  };

  const getGenderBadge = (gender: CustomerGroup['gender']) => {
    const genderConfig = {
      male: { label: 'ذكر', color: 'bg-blue-100 text-blue-800' },
      female: { label: 'أنثى', color: 'bg-pink-100 text-pink-800' },
      mixed: { label: 'مختلط', color: 'bg-purple-100 text-purple-800' },
    };

    const config = genderConfig[gender];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: CustomerGroup['status']) => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800">نشط</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">غير نشط</Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">مجموعات العملاء</h2>
          <p className="text-gray-600 mt-1">عملاؤك ضمن مجموعات لسهولة المتابعة والإدارة</p>
        </div>
        <Button
          onClick={handleAddGroup}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <Plus className="h-4 w-4 ml-2" />
          إنشاء مجموعة
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في مجموعات العملاء..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 ml-2" />
              فلترة
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 ml-2" />
              تصدير
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${getBackgroundClass(group.color)}`}
                    >
                      {group.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{group.name}</h3>
                      <p className="text-sm text-gray-600">{group.customerCount} عميل</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditGroup(group)} aria-label={`تعديل ${group.name}`}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteGroup(group.id)}
                      className="text-red-600 hover:text-red-700"
                      aria-label={`حذف ${group.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{group.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">النسبة المئوية:</span>
                    <span className="font-semibold">{group.percentage}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">الجنس:</span>
                    {getGenderBadge(group.gender)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">الحالة:</span>
                    {getStatusBadge(group.status)}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <progress
                    className={`progress-element ${getProgressClass(group.color)}`}
                    max={100}
                    value={Math.max(0, Math.min(100, group.percentage))}
                    aria-label={`نسبة تقدم مجموعة ${group.name}`}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">لا توجد مجموعات عملاء تطابق معايير البحث</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Group Modal */}
      <AnimatePresence>
        {showGroupModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowGroupModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingGroup ? 'تعديل المجموعة' : 'إنشاء مجموعة جديدة'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGroupModal(false)}
                  aria-label="إغلاق نموذج المجموعات"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">اسم المجموعة</Label>
                    <Input
                      id="name"
                      value={groupForm.name}
                      onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                      placeholder="أدخل اسم المجموعة"
                    />
                  </div>

                  <div>
                    <Label htmlFor="color">لون المجموعة</Label>
                    <div className="flex gap-2">
                      {COLOR_OPTIONS.map((color) => {
                        const backgroundClass = getBackgroundClass(color);
                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setGroupForm({ ...groupForm, color })}
                            aria-label={`اختيار اللون ${color}`}
                            className={`w-8 h-8 rounded-full border-2 ${backgroundClass} ${
                              groupForm.color === color ? 'border-gray-800' : 'border-gray-300'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">وصف المجموعة</Label>
                  <Textarea
                    id="description"
                    value={groupForm.description}
                    onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                    placeholder="وصف مختصر للمجموعة"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>الجنس</Label>
                    <Select value={groupForm.gender} onValueChange={(value) => setGroupForm({ ...groupForm, gender: value as CustomerGroup['gender'] })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">ذكر</SelectItem>
                        <SelectItem value="female">أنثى</SelectItem>
                        <SelectItem value="mixed">مختلط</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>الحالة</Label>
                    <Select value={groupForm.status} onValueChange={(value) => setGroupForm({ ...groupForm, status: value as CustomerGroup['status'] })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">نشط</SelectItem>
                        <SelectItem value="inactive">غير نشط</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Criteria Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">تفاصيل المجموعة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>عدد الطلبات أكثر من</Label>
                        <Input
                          type="number"
                          value={groupForm.criteria.minOrders}
                          onChange={(e) => setGroupForm({
                            ...groupForm,
                            criteria: { ...groupForm.criteria, minOrders: Number(e.target.value) }
                          })}
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <Label>المدينة</Label>
                        <Select
                          value={groupForm.criteria.city}
                          onValueChange={(value) => setGroupForm({
                            ...groupForm,
                            criteria: { ...groupForm.criteria, city: value }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المدينة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">جميع المدن</SelectItem>
                            {libyanCities.map((city) => (
                              <SelectItem key={city.id} value={city.name}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>نوع العميل</Label>
                        <Select
                          value={groupForm.criteria.customerType}
                          onValueChange={(value) => setGroupForm({
                            ...groupForm,
                            criteria: { ...groupForm.criteria, customerType: value as any }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">الكل</SelectItem>
                            <SelectItem value="new">جديد</SelectItem>
                            <SelectItem value="regular">منتظم</SelectItem>
                            <SelectItem value="vip">VIP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isNewsletterSubscriber"
                          checked={groupForm.criteria.isNewsletterSubscriber}
                          onCheckedChange={(checked) => setGroupForm({
                            ...groupForm,
                            criteria: { ...groupForm.criteria, isNewsletterSubscriber: checked as boolean }
                          })}
                        />
                        <Label htmlFor="isNewsletterSubscriber">مشتركي النشرة البريدية</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleSaveGroup}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  disabled={!groupForm.name.trim() || !groupForm.description.trim()}
                >
                  <Save className="h-4 w-4 ml-2" />
                  حفظ المجموعة
                </Button>
                <Button variant="outline" onClick={() => setShowGroupModal(false)}>
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

export { CustomerGroupsView };
