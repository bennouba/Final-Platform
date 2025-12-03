import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';

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

interface OrderCardProps {
  order: Order;
  onViewDetails: () => void;
  formatDate: (dateString: string) => { date: string; time: string };
  getStatusInfo: (status: string) => { label: string; color: string; icon: React.ReactNode };
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onViewDetails, formatDate, getStatusInfo }) => {
  const statusInfo = getStatusInfo(order.status);
  const formattedDate = formatDate(order.date);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">طلب #{order.id}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {formattedDate.date} - {formattedDate.time}
            </p>
          </div>
          <Badge className={`${statusInfo.color} text-white`}>
            {statusInfo.icon}
            <span className="mr-1">{statusInfo.label}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>عدد المنتجات:</span>
            <span>{order.items.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>المجموع:</span>
            <span>{order.total.toFixed(2)} د.ل</span>
          </div>
          {order.finalTotal && (
            <div className="flex justify-between text-sm font-medium">
              <span>المجموع الإجمالي:</span>
              <span>{order.finalTotal.toFixed(2)} د.ل</span>
            </div>
          )}
          <Button type="button" onClick={onViewDetails}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Eye className="h-4 w-4 mr-2" />
            عرض التفاصيل
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
