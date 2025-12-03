import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface Order {
  id: string;
  date: string;
  items: any[];
  total: number;
  finalTotal?: number;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
  shippingCost: number;
  discountAmount: number;
  customer: any;
  payment: any;
  shipping: any;
}

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  formatDate: (dateString: string) => { date: string; time: string };
  getStatusInfo: (status: string) => { label: string; color: string; icon: React.ReactNode };
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose, formatDate, getStatusInfo }) => {
  const statusInfo = getStatusInfo(order.status);
  const formattedDate = formatDate(order.date);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">تفاصيل الطلب #{order.id}</h2>
              <p className="text-gray-600 mt-1">
                {formattedDate.date} - {formattedDate.time}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${statusInfo.color} text-white`}>
                {statusInfo.icon}
                <span className="mr-1">{statusInfo.label}</span>
              </Badge>
              <Button type="button" onClick={onClose} variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {/* بيانات العميل */}
            <Card>
              <CardHeader>
                <CardTitle>بيانات العميل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">الاسم:</span> {order.customer?.name || 'غير محدد'}
                  </div>
                  <div>
                    <span className="font-medium">رقم الهاتف:</span> {order.customer?.phone || 'غير محدد'}
                  </div>
                  <div>
                    <span className="font-medium">البريد الإلكتروني:</span> {order.customer?.email || 'غير محدد'}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* المنتجات */}
            <Card>
              <CardHeader>
                <CardTitle>المنتجات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
                      </div>
                      <p className="font-medium">{item.price?.toFixed(2)} د.ل</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* بيانات الدفع والشحن */}
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>بيانات الدفع</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>طريقة الدفع:</span>
                    <span>{order.payment?.method || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>حالة الدفع:</span>
                    <span>{order.payment?.status || 'غير محدد'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>بيانات الشحن</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>عنوان الشحن:</span>
                    <span>{order.shipping?.address || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>رسوم الشحن:</span>
                    <span>{order.shippingCost?.toFixed(2)} د.ل</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* الإجمالي */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>المجموع الفرعي:</span>
                    <span>{order.total.toFixed(2)} د.ل</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>رسوم الشحن:</span>
                    <span>{order.shippingCost.toFixed(2)} د.ل</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>الخصم:</span>
                      <span>-{order.discountAmount.toFixed(2)} د.ل</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>المجموع الإجمالي:</span>
                    <span>{(order.finalTotal || order.total).toFixed(2)} د.ل</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
