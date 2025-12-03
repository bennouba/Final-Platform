import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  DollarSign,
  Download,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  Filter,
  Gift,
  Globe,
  Info,
  Link as LinkIcon,
  Percent,
  Plus,
  Save,
  Search,
  Settings,
  Tag as TagIcon,
  Target,
  ToggleLeft,
  ToggleRight,
  Trash2,
  UserCheck,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface DiscountCoupon {
  id: string;
  code: string;
  name: string;
  type: 'single' | 'multiple';
  startDate: string;
  endDate: string;
  applicationMethod: 'manual' | 'automatic';
  discountType: 'fixed' | 'percentage' | 'shipping';
  value: number;
  freeShipping: boolean;
  unlimitedUsage: boolean;
  maxUses: number;
  applicableProducts: 'all' | 'specific' | 'category' | 'exclude';
  excludeDiscounted: boolean;
  platforms: string[];
  createdAt: string;
  description?: string;
}

interface Marketer {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  marketingRoute: string;
  rating: number;
  commission: number;
  status: 'active' | 'inactive' | 'vacation' | 'terminated';
  changeRoute: boolean;
}

interface DiscountCouponsViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

const DiscountCouponsView: React.FC<DiscountCouponsViewProps> = ({ storeData, setStoreData, onSave }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showMarketerModal, setShowMarketerModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<DiscountCoupon | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  // Form state
  const [couponForm, setCouponForm] = useState({
    code: '',
    name: '',
    couponType: 'single' as 'single' | 'multiple',
    startDate: '',
    endDate: '',
    applicationMethod: 'manual' as 'manual' | 'automatic',
    discountType: 'fixed' as 'fixed' | 'percentage' | 'shipping',
    fixedAmount: 0,
    percentageValue: 0,
    freeShipping: false,
    unlimitedUsage: false,
    maxUses: 0,
    applicableProducts: 'all' as 'all' | 'specific' | 'category' | 'exclude',
    excludeDiscounted: false,
    platforms: [] as string[],
    onlineStoreEnabled: true,
    mazeedEnabled: false,
    accountantEnabled: false,
    merchantAppEnabled: false,
    description: '',
  });

  // Marketer form state
  const [marketerForm, setMarketerForm] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    commission: 5,
  });

  // Sample coupons data
  const coupons: DiscountCoupon[] = [
    {
      id: '1',
      code: 'eshro-4897986',
      name: 'فستان أحمر بأكمام دانتيل Mango',
      type: 'single',
      startDate: '2024-09-01',
      endDate: '2024-09-30',
      applicationMethod: 'manual',
      discountType: 'percentage',
      value: 25,
      freeShipping: false,
      unlimitedUsage: false,
      maxUses: 25,
      applicableProducts: 'all',
      excludeDiscounted: false,
      platforms: ['eshro'],
      createdAt: '2024-08-25',
      description: 'خصم 25% على الفستان الأحمر',
    },
    {
      id: '2',
      code: 'SAVE10',
      name: 'خصم 10% على جميع المنتجات',
      type: 'single',
      startDate: '2024-09-15',
      endDate: '2024-12-31',
      applicationMethod: 'automatic',
      discountType: 'percentage',
      value: 10,
      freeShipping: false,
      unlimitedUsage: true,
      maxUses: 0,
      applicableProducts: 'all',
      excludeDiscounted: false,
      platforms: ['eshro'],
      createdAt: '2024-09-10',
      description: 'خصم تلقائي 10% على جميع المنتجات',
    },
  ];

  // Sample marketers data
  const marketers: Marketer[] = [
    {
      id: '1',
      name: 'عبدالله ساسي',
      phone: '0922679921',
      email: 'abdullah@example.com',
      location: 'غوط الرمان',
      marketingRoute: 'تاجوراء- عين زارة - طريق الشط- البيفي',
      rating: 3,
      commission: 3.5,
      status: 'active',
      changeRoute: false,
    },
    {
      id: '2',
      name: 'محمد فرج البوراي',
      phone: '0914445921',
      email: 'mohamed@example.com',
      location: 'السياحية',
      marketingRoute: 'الغيران- السياحية - قرقارش- غوط الشعال- حي الاندلس',
      rating: 4,
      commission: 4,
      status: 'active',
      changeRoute: false,
    },
  ];

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && new Date(coupon.endDate) > new Date()) ||
      (statusFilter === 'expired' && new Date(coupon.endDate) <= new Date());

    return matchesSearch && matchesStatus;
  });

  const handleAddCoupon = () => {
    setEditingCoupon(null);
    setCouponForm({
      code: '',
      name: '',
      couponType: 'single',
      startDate: '',
      endDate: '',
      applicationMethod: 'manual',
      discountType: 'fixed',
      fixedAmount: 0,
      percentageValue: 0,
      freeShipping: false,
      unlimitedUsage: false,
      maxUses: 0,
      applicableProducts: 'all',
      excludeDiscounted: false,
      platforms: [],
      onlineStoreEnabled: true,
      mazeedEnabled: false,
      accountantEnabled: false,
      merchantAppEnabled: false,
      description: '',
    });
    setShowCouponModal(true);
    setActiveTab('basic');
  };

  const handleEditCoupon = (coupon: DiscountCoupon) => {
    setEditingCoupon(coupon);
    setCouponForm({
      code: coupon.code,
      name: coupon.name,
      couponType: coupon.type,
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      applicationMethod: coupon.applicationMethod,
      discountType: coupon.discountType,
      fixedAmount: coupon.discountType === 'fixed' ? coupon.value : 0,
      percentageValue: coupon.discountType === 'percentage' ? coupon.value : 0,
      freeShipping: coupon.freeShipping,
      unlimitedUsage: coupon.unlimitedUsage,
      maxUses: coupon.maxUses,
      applicableProducts: coupon.applicableProducts,
      excludeDiscounted: coupon.excludeDiscounted,
      platforms: coupon.platforms,
      onlineStoreEnabled: coupon.platforms.includes('eshro'),
      mazeedEnabled: coupon.platforms.includes('mazeed'),
      accountantEnabled: coupon.platforms.includes('accountant'),
      merchantAppEnabled: coupon.platforms.includes('merchant_app'),
      description: coupon.description || '',
    });
    setShowCouponModal(true);
    setActiveTab('basic');
  };

  const handleSaveCoupon = () => {
    if (!storeData) return;

    const platforms: string[] = [];
    if (couponForm.onlineStoreEnabled) platforms.push('eshro');
    if (couponForm.mazeedEnabled) platforms.push('mazeed');
    if (couponForm.accountantEnabled) platforms.push('accountant');
    if (couponForm.merchantAppEnabled) platforms.push('merchant_app');

    const newCoupon: DiscountCoupon = {
      id: editingCoupon ? editingCoupon.id : Date.now().toString(),
      code: couponForm.code,
      name: couponForm.name,
      type: couponForm.couponType,
      startDate: couponForm.startDate,
      endDate: couponForm.endDate,
      applicationMethod: couponForm.applicationMethod,
      discountType: couponForm.discountType,
      value: couponForm.discountType === 'fixed' ? couponForm.fixedAmount : couponForm.percentageValue,
      freeShipping: couponForm.freeShipping,
      unlimitedUsage: couponForm.unlimitedUsage,
      maxUses: couponForm.maxUses,
      applicableProducts: couponForm.applicableProducts,
      excludeDiscounted: couponForm.excludeDiscounted,
      platforms,
      createdAt: editingCoupon ? editingCoupon.createdAt : new Date().toISOString().split('T')[0]!,
      description: couponForm.description,
    };

    if (editingCoupon) {
      // Edit existing coupon
      const updatedCoupons = coupons.map(c => c.id === editingCoupon.id ? newCoupon : c);
      setStoreData({
        ...storeData,
        discountCoupons: updatedCoupons,
      });
    } else {
      // Add new coupon
      const updatedCoupons = [...coupons, newCoupon];
      setStoreData({
        ...storeData,
        discountCoupons: updatedCoupons,
      });
    }

    setShowCouponModal(false);
    onSave();
  };

  const handleDeleteCoupon = (couponId: string) => {
    const updatedCoupons = coupons.filter(c => c.id !== couponId);
    setStoreData({
      ...storeData,
      discountCoupons: updatedCoupons,
    });
    onSave();
  };

  const handleAddMarketer = () => {
    setMarketerForm({
      name: '',
      phone: '',
      email: '',
      location: '',
      commission: 5,
    });
    setShowMarketerModal(true);
  };

  const handleSaveMarketer = () => {
    if (!storeData) return;

    const newMarketer: Marketer = {
      id: Date.now().toString(),
      name: marketerForm.name,
      phone: marketerForm.phone,
      email: marketerForm.email,
      location: marketerForm.location,
      marketingRoute: '',
      rating: 0,
      commission: marketerForm.commission,
      status: 'active',
      changeRoute: false,
    };

    const updatedMarketers = [...marketers, newMarketer];
    setStoreData({
      ...storeData,
      marketers: updatedMarketers,
    });

    setShowMarketerModal(false);
    onSave();
  };

  const getStatusBadge = (endDate: string) => {
    const today = new Date().toISOString().split('T')[0]!;
    const isExpired = endDate < today;

    if (isExpired) {
      return <Badge className="bg-red-100 text-red-800">منتهي</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">نشط</Badge>;
    }
  };

  const getDiscountTypeBadge = (type: string, value: number) => {
    const typeConfig = {
      fixed: { label: `قيمة ثابتة ${value} د.ل`, color: 'bg-blue-100 text-blue-800' },
      percentage: { label: `نسبة مئوية ${value}%`, color: 'bg-green-100 text-green-800' },
      shipping: { label: 'خصم شحن', color: 'bg-purple-100 text-purple-800' },
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">أكواد الخصم</h2>
          <p className="text-gray-600 mt-1">إدارة أكواد كوبون الخصم وعروض المتجر</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleAddMarketer}
            variant="outline"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <UserCheck className="h-4 w-4 ml-2" />
            إضافة مسوق جديد
          </Button>
          <Button
            onClick={handleAddCoupon}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <Plus className="h-4 w-4 ml-2" />
            إنشاء كود جديد
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 ml-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Active Coupons */}
      <Card>
        <CardHeader>
          <CardTitle>أكواد الخصم النشطة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coupons.filter(c => new Date(c.endDate) > new Date()).map((coupon) => (
              <div key={coupon.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <TagIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="px-2 py-1 bg-gray-100 rounded text-sm">{coupon.code}</code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(coupon.code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getDiscountTypeBadge(coupon.discountType, coupon.value)}
                    {getStatusBadge(coupon.endDate)}
                    <Button variant="outline" size="sm" onClick={() => handleEditCoupon(coupon)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCoupon(coupon.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">نوع الخصم:</span>
                    <span className="font-semibold ml-2">
                      {coupon.discountType === 'percentage' ? `${coupon.value}%` :
                       coupon.discountType === 'fixed' ? `${coupon.value} د.ل` :
                       'خصم شحن'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">عدد الاستخدامات:</span>
                    <span className="font-semibold ml-2">{coupon.maxUses || '∞'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">تاريخ الانتهاء:</span>
                    <span className="font-semibold ml-2">{coupon.endDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">رابط كود الخصم:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`https://eshro.ly/coupon/${coupon.code}`)}
                    >
                      <LinkIcon className="h-3 w-3 ml-1" />
                      نسخ
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Marketers Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              إدارة المسوقين
            </CardTitle>
            <Button onClick={handleAddMarketer}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة جديدة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3 font-semibold">الرقم</th>
                  <th className="text-right p-3 font-semibold">اسم المسوق</th>
                  <th className="text-right p-3 font-semibold">رقم الموبايل</th>
                  <th className="text-right p-3 font-semibold">محل الاقامة</th>
                  <th className="text-right p-3 font-semibold">مسار التسويق</th>
                  <th className="text-right p-3 font-semibold">التقييم</th>
                  <th className="text-right p-3 font-semibold">نسبة العمولة</th>
                  <th className="text-right p-3 font-semibold">الحالة</th>
                  <th className="text-right p-3 font-semibold">تغيير مسار</th>
                </tr>
              </thead>
              <tbody>
                {marketers.map((marketer, index) => (
                  <tr key={marketer.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <p className="font-semibold">{index + 1}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold">{marketer.name}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-medium">{marketer.phone}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-medium">{marketer.location}</p>
                    </td>
                    <td className="p-3">
                      <p className="text-sm text-gray-600">{marketer.marketingRoute}</p>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{marketer.rating}</span>
                        <span className="text-gray-600">/5</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold">{marketer.commission}%</p>
                    </td>
                    <td className="p-3">
                      <Select value={marketer.status} onValueChange={(value) => {
                        // Update marketer status logic here
                      }}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">نشط</SelectItem>
                          <SelectItem value="inactive">غير نشط</SelectItem>
                          <SelectItem value="vacation">إجازة</SelectItem>
                          <SelectItem value="terminated">متوقف</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3">
                      <Button variant="outline" size="sm">
                        تغيير مسار
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Coupon Modal */}
      <AnimatePresence>
        {showCouponModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowCouponModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">إنشاء كود جديد</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCouponModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">المعلومات الأساسية</TabsTrigger>
                  <TabsTrigger value="restrictions">القيود والشروط</TabsTrigger>
                  <TabsTrigger value="platforms">منصات البيع</TabsTrigger>
                  <TabsTrigger value="payment">طرق الدفع</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>نوع الكود</Label>
                      <Select value={couponForm.couponType} onValueChange={(value) => setCouponForm({ ...couponForm, couponType: value as any })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">كود خصم واحد</SelectItem>
                          <SelectItem value="multiple">أكواد خصم متعددة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>فترة الكود</Label>
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          value={couponForm.startDate}
                          onChange={(e) => setCouponForm({ ...couponForm, startDate: e.target.value })}
                        />
                        <Input
                          type="date"
                          value={couponForm.endDate}
                          onChange={(e) => setCouponForm({ ...couponForm, endDate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>طريقة التطبيق</Label>
                      <Select value={couponForm.applicationMethod} onValueChange={(value) => setCouponForm({ ...couponForm, applicationMethod: value as any })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">إدخال رمز كود الخصم يدويًا</SelectItem>
                          <SelectItem value="automatic">تلقائي داخل سلة المشتريات</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>أدخل الحروف والأرقام بدون مسافات</Label>
                      <Input
                        value={couponForm.code}
                        onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                        placeholder="مثال: SAVE20"
                      />
                    </div>

                    <div>
                      <Label>نوع الخصم</Label>
                      <Select value={couponForm.discountType} onValueChange={(value) => setCouponForm({ ...couponForm, discountType: value as any })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">قيمة ثابتة</SelectItem>
                          <SelectItem value="percentage">نسبة مئوية من الإجمالي</SelectItem>
                          <SelectItem value="shipping">خصم على تكلفة الشحن</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {couponForm.discountType === 'fixed' && (
                      <div>
                        <Label>مبلغ الخصم (د.ل)</Label>
                        <Input
                          type="number"
                          value={couponForm.fixedAmount}
                          onChange={(e) => setCouponForm({ ...couponForm, fixedAmount: Number(e.target.value) })}
                          placeholder="0"
                        />
                      </div>
                    )}

                    {couponForm.discountType === 'percentage' && (
                      <div>
                        <Label>النسبة المئوية</Label>
                        <Input
                          type="number"
                          value={couponForm.percentageValue}
                          onChange={(e) => setCouponForm({ ...couponForm, percentageValue: Number(e.target.value) })}
                          placeholder="0"
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="freeShipping"
                        checked={couponForm.freeShipping}
                        onCheckedChange={(checked) => setCouponForm({ ...couponForm, freeShipping: checked as boolean })}
                      />
                      <Label htmlFor="freeShipping">الشحن المجاني</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="unlimitedUsage"
                        checked={couponForm.unlimitedUsage}
                        onCheckedChange={(checked) => setCouponForm({ ...couponForm, unlimitedUsage: checked as boolean })}
                      />
                      <Label htmlFor="unlimitedUsage">استخدام غير محدود</Label>
                    </div>

                    {!couponForm.unlimitedUsage && (
                      <div>
                        <Label>عدد المرات المتاحة لاستخدام هذا العرض</Label>
                        <Input
                          type="number"
                          value={couponForm.maxUses}
                          onChange={(e) => setCouponForm({ ...couponForm, maxUses: Number(e.target.value) })}
                          placeholder="0"
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="restrictions" className="space-y-6">
                  <div>
                    <Label>منتجات</Label>
                    <Select value={couponForm.applicableProducts} onValueChange={(value) => setCouponForm({ ...couponForm, applicableProducts: value as any })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">كل المنتجات</SelectItem>
                        <SelectItem value="specific">المنتجات المختارة فقط</SelectItem>
                        <SelectItem value="category">منتجات من تصنيفات مختارة</SelectItem>
                        <SelectItem value="exclude">كل المنتجات باستثناء المنتجات المحددة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="excludeDiscounted"
                      checked={couponForm.excludeDiscounted}
                      onCheckedChange={(checked) => setCouponForm({ ...couponForm, excludeDiscounted: checked as boolean })}
                    />
                    <Label htmlFor="excludeDiscounted">استثناء المنتجات المخفّضة</Label>
                  </div>
                </TabsContent>

                <TabsContent value="platforms" className="space-y-6">
                  <div className="space-y-4">
                    <Label>اختر لأي منصات تريد تفعيل هذا الكود</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="onlineStore"
                          checked={couponForm.onlineStoreEnabled}
                          onCheckedChange={(checked) => setCouponForm({ ...couponForm, onlineStoreEnabled: checked as boolean })}
                        />
                        <Label htmlFor="onlineStore">تفعيل كود الخصم لعملاء المتجر الإلكتروني</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="mazeed"
                          checked={couponForm.mazeedEnabled}
                          onCheckedChange={(checked) => setCouponForm({ ...couponForm, mazeedEnabled: checked as boolean })}
                        />
                        <Label htmlFor="mazeed">تفعيل كود الخصم لعملاء "مزيد"</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="accountant"
                          checked={couponForm.accountantEnabled}
                          onCheckedChange={(checked) => setCouponForm({ ...couponForm, accountantEnabled: checked as boolean })}
                        />
                        <Label htmlFor="accountant">تفعيل كود الخصم لمحاسب إشرو</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="merchantApp"
                          checked={couponForm.merchantAppEnabled}
                          onCheckedChange={(checked) => setCouponForm({ ...couponForm, merchantAppEnabled: checked as boolean })}
                        />
                        <Label htmlFor="merchantApp">عرض كود الخصم داخل إشرو كاشير</Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="payment" className="space-y-6">
                  <div className="space-y-4">
                    <Label>خيارات إضافية</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="cashOnDelivery"
                          checked={couponForm.freeShipping}
                          onCheckedChange={(checked) => setCouponForm({ ...couponForm, freeShipping: checked as boolean })}
                        />
                        <Label htmlFor="cashOnDelivery">الدفع عند الإستلام مجاناً</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="freeShippingOption"
                          checked={couponForm.freeShipping}
                          onCheckedChange={(checked) => setCouponForm({ ...couponForm, freeShipping: checked as boolean })}
                        />
                        <Label htmlFor="freeShippingOption">شحن مجاني</Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setShowCouponModal(false)}>
                  إلغاء
                </Button>
                <Button
                  onClick={handleSaveCoupon}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  disabled={!couponForm.code.trim() || !couponForm.name.trim()}
                >
                  <Save className="h-4 w-4 ml-2" />
                  إنشاء
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Marketer Modal */}
      <AnimatePresence>
        {showMarketerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowMarketerModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">إضافة مسوق جديد</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMarketerModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>اسم المسوق</Label>
                  <Input
                    value={marketerForm.name}
                    onChange={(e) => setMarketerForm({ ...marketerForm, name: e.target.value })}
                    placeholder="أدخل اسم المسوق"
                  />
                </div>

                <div>
                  <Label>رقم الموبايل</Label>
                  <Input
                    value={marketerForm.phone}
                    onChange={(e) => setMarketerForm({ ...marketerForm, phone: e.target.value })}
                    placeholder="09xxxxxxxx"
                  />
                </div>

                <div>
                  <Label>البريد الإلكتروني</Label>
                  <Input
                    type="email"
                    value={marketerForm.email}
                    onChange={(e) => setMarketerForm({ ...marketerForm, email: e.target.value })}
                    placeholder="example@domain.com"
                  />
                </div>

                <div>
                  <Label>محل الإقامة</Label>
                  <Input
                    value={marketerForm.location}
                    onChange={(e) => setMarketerForm({ ...marketerForm, location: e.target.value })}
                    placeholder="أدخل محل الإقامة"
                  />
                </div>

                <div>
                  <Label>نسبة العمولة (%)</Label>
                  <Input
                    type="number"
                    value={marketerForm.commission}
                    onChange={(e) => setMarketerForm({ ...marketerForm, commission: Number(e.target.value) })}
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleSaveMarketer}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  disabled={!marketerForm.name.trim() || !marketerForm.phone.trim()}
                >
                  <Save className="h-4 w-4 ml-2" />
                  حفظ المسوق
                </Button>
                <Button variant="outline" onClick={() => setShowMarketerModal(false)}>
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

export { DiscountCouponsView };
