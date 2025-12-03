import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Save,
  X,
  Bell,
  Eye,
  EyeOff,
  Settings,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  Send,
  DollarSign,
  Package,
  User,
  MapPin,
  Download,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Gift,
  Target,
  RefreshCw,
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

interface StockNotification {
  id: string;
  productName: string;
  productBrand: string;
  customerEmail: string;
  customerPhone: string;
  requestedQuantity: number;
  subscriptionDate: string;
  status: 'active' | 'notified' | 'cancelled';
  notifiedAt?: string;
  notificationMethod: 'email' | 'sms' | 'both';
  customerLocation?: string;
  productImage?: string;
  lastNotificationDate?: string;
  notificationCount: number;
}

interface StockNotificationsViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

const StockNotificationsView: React.FC<StockNotificationsViewProps> = ({ storeData, setStoreData, onSave }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    notificationDelay: 60,
    offerDiscount: false,
    discountCode: '',
    emailTitleAr: 'عزيزنا {customer_name}، تم توفر {product_name} في منصة إشرو، بإمكانك طلبه الآن {product_url}',
    emailTitleEn: 'Dear {customer_name}, {product_name} is now back in stock, you can order it now {product_url}',
    discountValue: 0,
  });

  // Sample stock notifications data
  const notifications: StockNotification[] = [
    {
      id: '1',
      productName: 'بوركيني عصري قطعتين',
      productBrand: 'سمارا',
      customerEmail: 'ahmed.salem@gmail.com',
      customerPhone: '0922682101',
      requestedQuantity: 2,
      subscriptionDate: '2024-01-10',
      status: 'active',
      notificationMethod: 'email',
      customerLocation: 'طرابلس',
      notificationCount: 0,
    },
    {
      id: '2',
      productName: 'حذاء نسائي عصري',
      productBrand: 'زارا',
      customerEmail: 'fatima.mohammed@hotmail.com',
      customerPhone: '0915234567',
      requestedQuantity: 1,
      subscriptionDate: '2024-02-05',
      status: 'active',
      notificationMethod: 'both',
      customerLocation: 'بنغازي',
      notificationCount: 0,
    },
    {
      id: '3',
      productName: 'فستان كريستال سهرية',
      productBrand: 'مانجو',
      customerEmail: 'omar.ali@gmail.com',
      customerPhone: '0918765432',
      requestedQuantity: 1,
      subscriptionDate: '2024-01-20',
      status: 'active',
      notificationMethod: 'email',
      customerLocation: 'مصراتة',
      notificationCount: 0,
    },
  ];

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch =
      notification.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.customerPhone.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (notificationId: string, newStatus: StockNotification['status']) => {
    // In real app, this would update the notification status

    onSave();
  };

  const handleBulkNotification = () => {
    // In real app, this would send notifications to all active subscribers

    onSave();
  };

  const getStatusBadge = (status: StockNotification['status']) => {
    const statusConfig = {
      active: { label: 'مفعل', color: 'bg-green-100 text-green-800' },
      notified: { label: 'تم الإشعار', color: 'bg-blue-100 text-blue-800' },
      cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getMethodBadge = (method: StockNotification['notificationMethod']) => {
    const methodConfig = {
      email: { label: 'بريد إلكتروني', color: 'bg-blue-100 text-blue-800' },
      sms: { label: 'رسائل نصية', color: 'bg-green-100 text-green-800' },
      both: { label: 'الكل', color: 'bg-purple-100 text-purple-800' },
    };

    const config = methodConfig[method];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">إشعارات المخزون</h2>
          <p className="text-gray-600 mt-1">إشعار العملاء عند توفر المنتجات مرة أخرى</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleBulkNotification}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            <Send className="h-4 w-4 ml-2" />
            إرسال إشعارات جماعية
          </Button>
          <Button
            onClick={() => setShowSettingsModal(true)}
            variant="outline"
          >
            <Settings className="h-4 w-4 ml-2" />
            إعدادات التنبيهات
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">عدد الإشعارات المسجلة</p>
                <p className="text-3xl font-bold text-gray-900">{notifications.length}</p>
                <p className="text-sm text-gray-600">خلال الشهر الجاري</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الإشعارات المرسلة</p>
                <p className="text-3xl font-bold text-green-600">
                  {notifications.filter(n => n.status === 'notified').length}
                </p>
                <p className="text-sm text-gray-600">تنبيه</p>
              </div>
              <Send className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المبيعات</p>
                <p className="text-3xl font-bold text-purple-600">0 د.ل</p>
                <p className="text-sm text-gray-600">من الإشعارات</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">معدل التحويل</p>
                <p className="text-3xl font-bold text-orange-600">0%</p>
                <p className="text-sm text-gray-600">من الإشعارات المرسلة</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
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
                placeholder="البحث عن تنبيه معين..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="حالة الإشعار" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">مفعل</SelectItem>
                <SelectItem value="notified">تم الإشعار</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 ml-2" />
              تصدير
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة التنبيهات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3 font-semibold">المنتج</th>
                  <th className="text-right p-3 font-semibold">الماركة</th>
                  <th className="text-right p-3 font-semibold">تاريخ الإشعار بتوفير المنتج</th>
                  <th className="text-right p-3 font-semibold">البريد الإلكتروني</th>
                  <th className="text-right p-3 font-semibold">رقم الموبايل</th>
                  <th className="text-right p-3 font-semibold">الكمية المطلوبة</th>
                  <th className="text-right p-3 font-semibold">تاريخ الاشتراك</th>
                  <th className="text-right p-3 font-semibold">حالة الإشعار</th>
                  <th className="text-right p-3 font-semibold">التواصل</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotifications.map((notification) => (
                  <tr key={notification.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <p className="font-semibold">{notification.productName}</p>
                        <p className="text-sm text-gray-600">{notification.customerLocation}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold">{notification.productBrand}</p>
                    </td>
                    <td className="p-3">
                      <p className="text-sm">
                        {notification.notifiedAt ? new Date(notification.notifiedAt).toLocaleDateString('ar') : '-'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {notification.notifiedAt ? new Date(notification.notifiedAt).toLocaleTimeString('ar') : ''}
                      </p>
                    </td>
                    <td className="p-3">
                      <p className="font-medium">{notification.customerEmail}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-medium">{notification.customerPhone}</p>
                    </td>
                    <td className="p-3">
                      <div className="text-center">
                        <p className="font-semibold">{notification.requestedQuantity}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="text-sm">{new Date(notification.subscriptionDate).toLocaleDateString('ar')}</p>
                    </td>
                    <td className="p-3">
                      {getStatusBadge(notification.status)}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {getMethodBadge(notification.notificationMethod)}
                        {notification.status === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(notification.id, 'notified')}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredNotifications.length === 0 && (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد تنبيهات تطابق معايير البحث</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowSettingsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">إعدادات التنبيهات التلقائية</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettingsModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <Label>توقيت الإشعار</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="number"
                      value={settings.notificationDelay}
                      onChange={(e) => setSettings({ ...settings, notificationDelay: Number(e.target.value) })}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-600">دقيقة</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    منذ إعادة توفير المنتج
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">إضافة عرض خاص</p>
                      <p className="text-sm text-gray-600">إضافة كود خصم مع الإشعار</p>
                    </div>
                    <Checkbox
                      checked={settings.offerDiscount}
                      onCheckedChange={(checked) => setSettings({ ...settings, offerDiscount: checked as boolean })}
                    />
                  </div>

                  {settings.offerDiscount && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>كود الخصم</Label>
                        <Input
                          value={settings.discountCode}
                          onChange={(e) => setSettings({ ...settings, discountCode: e.target.value })}
                          placeholder="أدخل كود الخصم"
                        />
                      </div>
                      <div>
                        <Label>قيمة الخصم (%)</Label>
                        <Input
                          type="number"
                          value={settings.discountValue}
                          onChange={(e) => setSettings({ ...settings, discountValue: Number(e.target.value) })}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">نصوص الإشعارات</h4>

                  <div>
                    <Label>المنتج بالعربية</Label>
                    <Textarea
                      value={settings.emailTitleAr}
                      onChange={(e) => setSettings({ ...settings, emailTitleAr: e.target.value })}
                      placeholder="عزيزنا {customer_name}، تم توفر {product_name} في منصة إشرو، بإمكانك طلبه الآن {product_url}"
                      rows={3}
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      القيم المقترحة: customer_name - اسم العميل، product_name - اسم المنتج، product_url - رابط المنتج
                    </p>
                  </div>

                  <div>
                    <Label>المنتج بالإنجليزية</Label>
                    <Textarea
                      value={settings.emailTitleEn}
                      onChange={(e) => setSettings({ ...settings, emailTitleEn: e.target.value })}
                      placeholder="Dear {customer_name}, {product_name} is now back in stock, you can order it now {product_url}"
                      rows={3}
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      Suggested values: customer_name - customer name, product_name - product name, product_url - product link
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => setShowSettingsModal(false)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Save className="h-4 w-4 ml-2" />
                  حفظ الإعدادات
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { StockNotificationsView };
