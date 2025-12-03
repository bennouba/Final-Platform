import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ShoppingCart,
  Search,
  Filter,
  Download,
  Send,
  MessageSquare,
  Gift,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Target,
  Percent,
  Reply,
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

interface AbandonedCart {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  subtotal: number;
  abandonedAt: string;
  lastActivity: string;
  reminderCount: number;
  status: 'new' | 'reminded' | 'multiple_reminders' | 'recovered' | 'lost';
  potentialValue: number;
  recoveryChance: 'high' | 'medium' | 'low';
  discountApplied?: number;
  reminderScheduled?: string;
  notes?: string;
}

interface CartItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  image: string;
}

interface AbandonedCartsViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

const AbandonedCartsView: React.FC<AbandonedCartsViewProps> = ({ storeData, setStoreData, onSave }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedCart, setSelectedCart] = useState<AbandonedCart | null>(null);
  const [selectedCarts, setSelectedCarts] = useState<Set<string>>(new Set());
  const [bulkReminderEnabled, setBulkReminderEnabled] = useState(true);
  const [reminderType, setReminderType] = useState('email');
  const [reminderMessage, setReminderMessage] = useState('مرحباً! لاحظنا أن سلة تسوقك ما زالت تحتوي على منتجات رائعة. هل تريد إتمام طلبك؟');
  const [actionReply, setActionReply] = useState('');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('eshro_abandoned_carts');
    if (stored) {
      try {
        setAbandonedCarts(JSON.parse(stored));
      } catch (e) {
        loadDefaultCarts();
      }
    } else {
      loadDefaultCarts();
    }
  }, []);

  const loadDefaultCarts = () => {
    const defaultCarts: AbandonedCart[] = [
      {
        id: '1',
        customerName: 'سارة الطرابلسي',
        customerEmail: 'sarah.tripoli@gmail.com',
        customerPhone: '+218945678901',
        items: [
          { id: '1', productName: 'حقيبة بحر راقية', sku: 'BAG-001', quantity: 1, price: 260, image: '' },
          { id: '2', productName: 'شبشب صيفي جلد', sku: 'SHOE-002', quantity: 1, price: 210, image: '' },
        ],
        subtotal: 470,
        abandonedAt: '2024-12-15T14:30:00Z',
        lastActivity: '2024-12-15T14:30:00Z',
        reminderCount: 1,
        status: 'reminded',
        potentialValue: 470,
        recoveryChance: 'high',
        discountApplied: 0,
      },
      {
        id: '2',
        customerName: 'عمر المصراتي',
        customerEmail: 'omar.misrata@yahoo.com',
        customerPhone: '+218956789012',
        items: [
          { id: '3', productName: 'فستان صيفي بحرزام جلد', sku: 'DRESS-003', quantity: 1, price: 680, image: '' },
        ],
        subtotal: 680,
        abandonedAt: '2024-12-14T22:15:00Z',
        lastActivity: '2024-12-14T22:15:00Z',
        reminderCount: 2,
        status: 'multiple_reminders',
        potentialValue: 680,
        recoveryChance: 'medium',
        discountApplied: 0,
      },
      {
        id: '3',
        customerName: 'فاطمة سالم',
        customerEmail: 'fatima.salem@gmail.com',
        customerPhone: '+218912345678',
        items: [
          { id: '4', productName: 'فستان ماكسي كحلي', sku: 'DRESS-004', quantity: 1, price: 450, image: '' },
          { id: '5', productName: 'حذاء رياضي برتقالي', sku: 'SHOE-005', quantity: 1, price: 320, image: '' },
        ],
        subtotal: 770,
        abandonedAt: '2024-12-13T10:15:00Z',
        lastActivity: '2024-12-13T10:15:00Z',
        reminderCount: 0,
        status: 'new',
        potentialValue: 770,
        recoveryChance: 'high',
        discountApplied: 0,
      },
    ];
    setAbandonedCarts(defaultCarts);
    localStorage.setItem('eshro_abandoned_carts', JSON.stringify(defaultCarts));
  };

  const filteredCarts = useMemo(() => 
    abandonedCarts.filter(cart =>
      cart.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cart.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [abandonedCarts, searchTerm]
  );

  const updateLocalStorage = (newCarts: AbandonedCart[]) => {
    setAbandonedCarts(newCarts);
    localStorage.setItem('eshro_abandoned_carts', JSON.stringify(newCarts));
  };

  const handleSelectCart = (cartId: string, checked: boolean) => {
    const newSelected = new Set(selectedCarts);
    if (checked) {
      newSelected.add(cartId);
    } else {
      newSelected.delete(cartId);
    }
    setSelectedCarts(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCarts(new Set(filteredCarts.map(cart => cart.id)));
    } else {
      setSelectedCarts(new Set());
    }
  };

  const handleSendBulkReminder = () => {
    setShowReminderModal(true);
  };

  const handleSendReminder = () => {
    const updatedCarts = abandonedCarts.map(cart => {
      if (selectedCarts.has(cart.id)) {
        const nextStatus: AbandonedCart['status'] = cart.reminderCount === 0
          ? 'reminded'
          : cart.status === 'reminded'
            ? 'multiple_reminders'
            : cart.status;

        return {
          ...cart,
          reminderCount: cart.reminderCount + 1,
          status: nextStatus,
          lastActivity: new Date().toISOString(),
        };
      }
      return cart;
    });

    updateLocalStorage(updatedCarts);
    alert(`✅ تم إرسال التذكيرات بنجاح!\n\n📩 عدد المستلمين: ${selectedCarts.size}\n📧 النوع: ${reminderType === 'email' ? 'بريد إلكتروني' : reminderType === 'whatsapp' ? 'واتساب' : 'رسائل نصية'}`);
    setShowReminderModal(false);
    setSelectedCarts(new Set());
  };

  const handleOpenAction = (cart: AbandonedCart) => {
    setSelectedCart(cart);
    setActionReply('');
    setShowActionModal(true);
  };

  const handleReplyToCustomer = () => {
    if (!selectedCart || !actionReply.trim()) {
      alert('يرجى إدخال الرد');
      return;
    }

    alert(`✅ تم إرسال الرد بنجاح!\n\nإلى: ${selectedCart.customerName}\n📧 ${selectedCart.customerEmail}`);
    setShowActionModal(false);
  };

  const handleApplyDiscount = (cartId: string) => {
    const updatedCarts = abandonedCarts.map(cart => {
      if (cart.id === cartId) {
        const discountedValue = cart.potentialValue * (1 - discountPercent / 100);
        return {
          ...cart,
          discountApplied: discountPercent,
          potentialValue: discountedValue,
        };
      }
      return cart;
    });

    updateLocalStorage(updatedCarts);
    alert(`✅ تم تطبيق الخصم بنجاح!\n\n🎁 نسبة الخصم: ${discountPercent}%\n💰 القيمة الأصلية: ${abandonedCarts.find(c => c.id === cartId)?.potentialValue} د.ل\n💵 القيمة بعد الخصم: ${(abandonedCarts.find(c => c.id === cartId)?.potentialValue || 0) * (1 - discountPercent / 100)} د.ل`);
  };

  const handleDeleteCart = (cartId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه السلة المتروكة؟')) {
      const updatedCarts = abandonedCarts.filter(cart => cart.id !== cartId);
      updateLocalStorage(updatedCarts);
      alert('✅ تم حذف السلة بنجاح');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { label: 'جديد', color: 'bg-blue-100 text-blue-800' },
      reminded: { label: 'تم التذكير مرة واحدة', color: 'bg-yellow-100 text-yellow-800' },
      multiple_reminders: { label: 'تم التذكير عدة مرات', color: 'bg-orange-100 text-orange-800' },
      recovered: { label: 'تم الاسترداد', color: 'bg-green-100 text-green-800' },
      lost: { label: 'مفقود', color: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getRecoveryChanceBadge = (chance: string) => {
    const chanceConfig = {
      high: { label: 'احتمالية عالية', color: 'bg-green-100 text-green-800' },
      medium: { label: 'احتمالية متوسطة', color: 'bg-yellow-100 text-yellow-800' },
      low: { label: 'احتمالية منخفضة', color: 'bg-red-100 text-red-800' },
    };

    const config = chanceConfig[chance as keyof typeof chanceConfig];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">السلات المتروكة</h2>
          <p className="text-gray-600 mt-1">استرداد السلات المتروكة وزيادة المبيعات</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleSendBulkReminder}
            disabled={selectedCarts.size === 0}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            <Send className="h-4 w-4 ml-2" />
            إرسال تذكير جماعي ({selectedCarts.size})
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي السلات المتروكة</p>
                <p className="text-3xl font-bold text-gray-900">{abandonedCarts.length}</p>
                <p className="text-sm text-gray-600">يحتاج للمتابعة</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">قيمة السلات المتروكة</p>
                <p className="text-3xl font-bold text-gray-900">{abandonedCarts.reduce((sum, cart) => sum + cart.potentialValue, 0)} د.ل</p>
                <p className="text-sm text-gray-600">فرصة ضائعة</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">التذكيرات المرسلة</p>
                <p className="text-3xl font-bold text-gray-900">{abandonedCarts.reduce((sum, cart) => sum + cart.reminderCount, 0)}</p>
                <p className="text-sm text-green-600">معدل الاستجابة: 23%</p>
              </div>
              <Send className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">متوسط الخصم</p>
                <p className="text-3xl font-bold text-gray-900">8%</p>
                <p className="text-sm text-gray-600">للاسترداد</p>
              </div>
              <Percent className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            تحليل السلات المتروكة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{abandonedCarts.filter(c => c.status === 'new').length}</div>
              <p className="text-sm text-gray-600">سلات جديدة (لم يتم تذكيرها)</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{abandonedCarts.filter(c => c.status === 'reminded').length}</div>
              <p className="text-sm text-gray-600">سلات تم تذكيرها مرة واحدة</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{abandonedCarts.filter(c => c.status === 'multiple_reminders').length}</div>
              <p className="text-sm text-gray-600">سلات تم تذكيرها عدة مرات</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recovery Strategy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            استراتيجية الاسترداد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold mb-2">العملاء الجدد</h4>
              <p className="text-sm text-gray-600 mb-3">خصم 15%</p>
              <Badge className="bg-blue-100 text-blue-800">مُفعل</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold mb-2">العملاء المنتظمين</h4>
              <p className="text-sm text-gray-600 mb-3">خصم 10%</p>
              <Badge className="bg-green-100 text-green-800">مُفعل</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Gift className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold mb-2">عملاء VIP</h4>
              <p className="text-sm text-gray-600 mb-3">شحن مجاني</p>
              <Badge className="bg-purple-100 text-purple-800">مُفعل</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>السلات المتروكة - التفاصيل</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث في السلات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 ml-2" />
                تصفية
              </Button>
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
                  <th className="text-right p-3">
                    <Checkbox
                      checked={selectedCarts.size === filteredCarts.length && filteredCarts.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-right p-3 font-semibold">العميل</th>
                  <th className="text-right p-3 font-semibold">العناصر</th>
                  <th className="text-right p-3 font-semibold">القيمة</th>
                  <th className="text-right p-3 font-semibold">تاريخ الإنشاء</th>
                  <th className="text-right p-3 font-semibold">التذكيرات</th>
                  <th className="text-right p-3 font-semibold">الخصم المقترح</th>
                  <th className="text-right p-3 font-semibold">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredCarts.map((cart) => (
                  <tr key={cart.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <Checkbox
                        checked={selectedCarts.has(cart.id)}
                        onCheckedChange={(checked) => handleSelectCart(cart.id, checked as boolean)}
                      />
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="font-semibold">{cart.customerName}</p>
                        <p className="text-sm text-gray-600">{cart.customerEmail}</p>
                        <p className="text-sm text-gray-600">{cart.customerPhone}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        {cart.items.map((item) => (
                          <div key={item.id} className="text-sm">
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-gray-600">الكمية: {item.quantity} - السعر: {item.price} د.ل</p>
                          </div>
                        ))}
                        <p className="text-sm font-semibold text-blue-600">{cart.items.length} عنصر</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold">{cart.potentialValue} د.ل</p>
                    </td>
                    <td className="p-3">
                      <p className="text-sm">{new Date(cart.abandonedAt).toLocaleDateString('ar')}</p>
                      <p className="text-xs text-gray-600">{new Date(cart.abandonedAt).toLocaleTimeString('ar')}</p>
                    </td>
                    <td className="p-3">
                      <div className="text-center">
                        <p className="font-semibold">{cart.reminderCount} تذكير</p>
                        {getStatusBadge(cart.status)}
                      </div>
                    </td>
                    <td className="p-3">
                      {getRecoveryChanceBadge(cart.recoveryChance)}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2 flex-wrap">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOpenAction(cart)}
                          title="الرد على العميل"
                        >
                          <Reply className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleApplyDiscount(cart.id)}
                          title="تطبيق خصم"
                        >
                          <Gift className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteCart(cart.id)}
                          title="حذف"
                          className="hover:bg-red-50 hover:text-red-600"
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

          {filteredCarts.length === 0 && (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد سلات متروكة</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Recovery Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            إجراءات الاسترداد السريع
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Checkbox
                checked={true}
                onCheckedChange={() => {}}
              />
              <div>
                <p className="font-medium">إرسال تذكير عبر واتساب</p>
                <p className="text-sm text-gray-600">رسالة مخصصة للعميل</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Checkbox
                checked={true}
                onCheckedChange={() => {}}
              />
              <div>
                <p className="font-medium">إرسال تذكير بالإيميل</p>
                <p className="text-sm text-gray-600">تذكير احترافي بالبريد الإلكتروني</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Checkbox
                checked={true}
                onCheckedChange={() => {}}
              />
              <div>
                <p className="font-medium">تطبيق خصم تلقائي</p>
                <p className="text-sm text-gray-600">خصم بناءً على استراتيجية الاسترداد</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Reminder Modal */}
      <AnimatePresence>
        {showReminderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowReminderModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">إرسال تذكير جماعي</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReminderModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Checkbox
                    checked={bulkReminderEnabled}
                    onCheckedChange={(checked) => setBulkReminderEnabled(checked === true)}
                  />
                  <span className="font-medium">إرسال تذكير جماعي مفعل</span>
                </div>

                <div>
                  <Label>عدد السلات المحددة: {selectedCarts.size}</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    سيتم إرسال تذكير لـ {selectedCarts.size} سلة متروكة
                  </p>
                </div>

                <div>
                  <Label>نوع التذكير</Label>
                  <Select value={reminderType} onValueChange={setReminderType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">بريد إلكتروني</SelectItem>
                      <SelectItem value="whatsapp">واتساب</SelectItem>
                      <SelectItem value="sms">رسائل نصية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>نص الرسالة</Label>
                  <Textarea
                    placeholder="أدخل نص التذكير المخصص..."
                    rows={4}
                    value={reminderMessage}
                    onChange={(e) => setReminderMessage(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleSendReminder}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  <Send className="h-4 w-4 ml-2" />
                  إرسال التذكيرات
                </Button>
                <Button variant="outline" onClick={() => setShowReminderModal(false)}>
                  إلغاء
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Modal - Reply & Discount */}
      <AnimatePresence>
        {showActionModal && selectedCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowActionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedCart.customerName}</h3>
                  <p className="text-sm text-gray-600">{selectedCart.customerEmail}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowActionModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Gift className="h-4 w-4" /> تطبيق خصم
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <Label>نسبة الخصم (%)</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={discountPercent}
                          onChange={(e) => setDiscountPercent(parseInt(e.target.value) || 0)}
                        />
                        <Button
                          onClick={() => handleApplyDiscount(selectedCart.id)}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          تطبيق
                        </Button>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">القيمة الأصلية</p>
                      <p className="text-lg font-bold text-green-700">{selectedCart.potentialValue} د.ل</p>
                      <p className="text-sm text-gray-600 mt-2">بعد الخصم: {selectedCart.discountApplied ? (selectedCart.potentialValue * (100 - selectedCart.discountApplied) / 100).toFixed(2) : selectedCart.potentialValue.toFixed(2)} د.ل</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Reply className="h-4 w-4" /> الرد على العميل
                  </h4>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="أدخل ردك للعميل..."
                      rows={6}
                      value={actionReply}
                      onChange={(e) => setActionReply(e.target.value)}
                    />
                    <Button
                      onClick={handleReplyToCustomer}
                      className="w-full bg-blue-500 hover:bg-blue-600"
                    >
                      <Mail className="h-4 w-4 ml-2" /> إرسال الرد
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">محتويات السلة</h4>
                <div className="space-y-2">
                  {selectedCart.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{item.price} د.ل</p>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>الإجمالي:</span>
                    <span>{selectedCart.potentialValue} د.ل</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" onClick={() => setShowActionModal(false)} className="w-full mt-6">
                إغلاق
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { AbandonedCartsView };
