import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Package,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Image,
  ShoppingBag,
  Bell,
  TrendingUp,
  Archive,
  ArchiveRestore,
  MessageCircle,
  Send,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { StoreIntegrationHelper } from '@/utils/storeIntegrationHelper';

interface UnavailableOrder {
  id: string | number;
  productCode?: string;
  productName: string;
  productImage: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  requestedQuantity: number;
  requestedAt: string;
  requestedTime?: string;
  status: 'pending' | 'available' | 'cancelled' | 'substitute_offered';
  merchantStatus: 'pending' | 'available' | 'cancelled' | 'substitute_offered';
  notes?: string;
  responseDate?: string;
  substituteProduct?: string;
  price?: number;
  storeId?: number;
}

interface UnavailableOrdersViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
  storeSlug?: string | undefined;
}

const UnavailableOrdersView: React.FC<UnavailableOrdersViewProps> = ({ storeData, setStoreData, onSave, storeSlug }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<UnavailableOrder | null>(null);
  const [responseStatus, setResponseStatus] = useState<'available' | 'upcoming' | 'cancelled'>('available');
  const [responseMessage, setResponseMessage] = useState('');
  const [communicationChannel, setCommunicationChannel] = useState<'email' | 'sms' | 'whatsapp'>('email');
  const [unavailableOrders, setUnavailableOrders] = useState<UnavailableOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUnavailableItems();
    window.addEventListener('unavailableItemsUpdated', loadUnavailableItems);
    return () => window.removeEventListener('unavailableItemsUpdated', loadUnavailableItems);
  }, []);

  const loadUnavailableItems = () => {
    const items = StoreIntegrationHelper.getUnavailableItems();
    const storeId = storeData?.id;
    
    const filteredItems = storeId 
      ? items.filter(item => item.storeId === storeId)
      : items;

    const orders: UnavailableOrder[] = filteredItems.map(item => ({
      id: item.id,
      productCode: `ESHRO-${item.id}`,
      productName: item.name,
      productImage: item.image,
      customerName: item.notificationData?.customerName || 'عميل',
      customerEmail: item.notificationData?.customerEmail || '',
      customerPhone: item.notificationData?.customerPhone || '',
      requestedQuantity: item.notificationData?.quantity || 1,
      requestedAt: new Date(item.requestedAt).toLocaleDateString('ar-LY'),
      requestedTime: new Date(item.requestedAt).toLocaleTimeString('ar-LY'),
      status: 'pending',
      merchantStatus: 'pending',
      price: item.price,
      storeId: item.storeId,
    }));

    setUnavailableOrders(orders);
    setLoading(false);
  };

  const filteredOrders = unavailableOrders.filter(order => {
    const matchesSearch =
      order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.productCode?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleRespond = (order: UnavailableOrder) => {
    setSelectedOrder(order);
    setResponseStatus('available');
    setResponseMessage('');
    setCommunicationChannel('email');
    setShowResponseModal(true);
  };

  const handleSendResponse = () => {
    if (!selectedOrder) return;

    const statusMessages = {
      available: `مرحباً ${selectedOrder.customerName}، المنتج "${selectedOrder.productName}" أصبح متوفراً الآن!`,
      upcoming: `مرحباً ${selectedOrder.customerName}، سيتم توفير "${selectedOrder.productName}" قريباً جداً.`,
      cancelled: `مرحباً ${selectedOrder.customerName}، للأسف المنتج "${selectedOrder.productName}" غير متوفر حالياً.`,
    };

    const messageTemplate = `${statusMessages[responseStatus]}\n${responseMessage ? `\nملاحظات: ${responseMessage}` : ''}`;

    const contactInfo = {
      email: selectedOrder.customerEmail,
      phone: selectedOrder.customerPhone,
      message: messageTemplate,
      channel: communicationChannel,
      productName: selectedOrder.productName,
      quantity: selectedOrder.requestedQuantity,
    };

    StoreIntegrationHelper.removeUnavailableItem(selectedOrder.id as number);
    
    const response = {
      orderId: selectedOrder.id,
      status: responseStatus,
      channel: communicationChannel,
      message: messageTemplate,
      sentAt: new Date().toISOString(),
      contact: contactInfo,
    };

    localStorage.setItem(
      'eshro_customer_responses',
      JSON.stringify([
        ...(JSON.parse(localStorage.getItem('eshro_customer_responses') || '[]')),
        response,
      ])
    );

    setShowResponseModal(false);
    setSelectedOrder(null);
    onSave();
  };

  const handleDeleteOrder = (orderId: string | number) => {
    StoreIntegrationHelper.removeUnavailableItem(orderId as number);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800' },
      available: { label: 'المنتج متوفر', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-800' },
      substitute_offered: { label: 'توفير بديل', color: 'bg-blue-100 text-blue-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <X className="h-4 w-4 text-red-600" />;
      case 'substitute_offered':
        return <RefreshCw className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">الطلبات الغير متوفرة</h2>
          <p className="text-gray-600 mt-1">إدارة طلبات المنتجات الغير متوفرة في متجرك</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في الطلبات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="تصفية حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الطلبات</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="available">متوفر</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
                <SelectItem value="substitute_offered">بديل متوفر</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 ml-2" />
              فرز
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 ml-2" />
              تصدير
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>الطلبات الغير متوفرة بالمتجر</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">جاري التحميل...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-3 font-semibold">كود المنتج</th>
                    <th className="text-right p-3 font-semibold">اسم المنتج</th>
                    <th className="text-right p-3 font-semibold">العميل</th>
                    <th className="text-right p-3 font-semibold">الكمية</th>
                    <th className="text-right p-3 font-semibold">تاريخ الطلب</th>
                    <th className="text-right p-3 font-semibold">حالة الطلب</th>
                    <th className="text-right p-3 font-semibold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="font-semibold text-blue-600">{order.productCode}</div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {order.productImage ? (
                              <img src={order.productImage} alt={order.productName} className="w-full h-full object-cover" />
                            ) : (
                              <Image className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold">{order.productName}</p>
                            <p className="text-sm text-gray-600">{order.price && `${order.price} د.ل`}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="font-semibold">{order.customerName}</p>
                          <p className="text-sm text-gray-600">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-center">
                          <p className="font-semibold">{order.requestedQuantity}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="font-semibold">{order.requestedAt}</p>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          {getStatusBadge(order.status)}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRespond(order)}
                            className="text-green-600 hover:text-green-700"
                            title="الرد على العميل"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteOrder(order.id)}
                            className="text-red-600 hover:text-red-700"
                            title="حذف"
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
          )}

          {!loading && filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد طلبات غير متوفرة</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        {showResponseModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowResponseModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">الرد على العميل</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowResponseModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold mb-3 text-gray-900">تفاصيل الطلب</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">المنتج</p>
                      <p className="font-semibold">{selectedOrder.productName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">العميل</p>
                      <p className="font-semibold">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">الكمية المطلوبة</p>
                      <p className="font-semibold">{selectedOrder.requestedQuantity}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">البريد الإلكتروني</p>
                      <p className="font-semibold text-blue-600">{selectedOrder.customerEmail}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="block font-semibold mb-2">اختر حالة المنتج</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'available', label: 'متوفر الآن', icon: '✓', color: 'green' },
                      { value: 'upcoming', label: 'قريباً جداً', icon: '⏱', color: 'yellow' },
                      { value: 'cancelled', label: 'غير متوفر', icon: '✕', color: 'red' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setResponseStatus(option.value as any)}
                        className={`p-3 rounded-lg border-2 transition ${
                          responseStatus === option.value
                            ? `border-${option.color}-500 bg-${option.color}-50`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{option.icon}</div>
                        <p className="text-sm font-semibold">{option.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="block font-semibold mb-2">قناة التواصل</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'email', label: 'البريد الإلكتروني', icon: Mail },
                      { value: 'sms', label: 'رسالة نصية', icon: MessageCircle },
                      { value: 'whatsapp', label: 'واتساب', icon: Send },
                    ].map((channel) => {
                      const Icon = channel.icon;
                      return (
                        <button
                          key={channel.value}
                          onClick={() => setCommunicationChannel(channel.value as any)}
                          className={`p-3 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                            communicationChannel === channel.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <p className="text-sm font-semibold">{channel.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label>ملاحظات إضافية (اختياري)</Label>
                  <Textarea
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    placeholder="أضف تفاصيل إضافية للعميل..."
                    rows={3}
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold mb-2">معاينة الرسالة:</p>
                  <div className="p-3 bg-white border rounded text-sm text-gray-700 whitespace-pre-wrap">
                    {responseStatus === 'available' && `مرحباً ${selectedOrder.customerName}، المنتج "${selectedOrder.productName}" أصبح متوفراً الآن!`}
                    {responseStatus === 'upcoming' && `مرحباً ${selectedOrder.customerName}، سيتم توفير "${selectedOrder.productName}" قريباً جداً.`}
                    {responseStatus === 'cancelled' && `مرحباً ${selectedOrder.customerName}، للأسف المنتج "${selectedOrder.productName}" غير متوفر حالياً.`}
                    {responseMessage && `\n\nملاحظات: ${responseMessage}`}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleSendResponse}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                >
                  <Send className="h-4 w-4 ml-2" />
                  إرسال الرد
                </Button>
                <Button variant="outline" onClick={() => setShowResponseModal(false)}>
                  إلغاء
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <AlertCircle className="h-5 w-5" />
            آلية عمل الطلبات الغير متوفرة
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
              <div>
                <p className="font-semibold">قيد الانتظار</p>
                <p className="text-sm">المنتج غير متوفر حالياً في المخزن</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
              <div>
                <p className="font-semibold">المنتج متوفر</p>
                <p className="text-sm">تم توفير المنتج وإشعار العميل</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
              <div>
                <p className="font-semibold">ملغي</p>
                <p className="text-sm">تم إلغاء طلب التوفير</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
              <div>
                <p className="font-semibold">توفير بديل</p>
                <p className="text-sm">اقتراح منتج بديل للعميل</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { UnavailableOrdersView };
