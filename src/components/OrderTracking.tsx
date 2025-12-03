import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  Package,
  Phone,
  RefreshCw,
  Truck,
  User
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import NotificationManager from '@/services/NotificationManager';

interface OrderLocation {
  lat: number;
  lng: number;
  address: string;
  timestamp: Date;
}

interface DeliveryDriver {
  id: string;
  name: string;
  phone: string;
  photo?: string;
  vehicle: string;
  rating: number;
}

interface OrderStatus {
  id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  label: string;
  description: string;
  timestamp: Date;
  location?: OrderLocation;
}

interface OrderTrackingProps {
  orderId: string;
  onContactDriver?: (driver: DeliveryDriver) => void;
  onReportIssue?: (orderId: string, issue: string) => void;
  className?: string;
}

class OrderTrackingService {
  private static mockOrders: Map<string, {
    orderId: string;
    status: OrderStatus[];
    currentLocation: OrderLocation;
    driver: DeliveryDriver;
    estimatedDelivery: Date;
    customerLocation: OrderLocation;
    warehouseLocation: OrderLocation;
  }> = new Map();

  static initializeMockData(orderId: string) {
    if (!this.mockOrders.has(orderId)) {
      const now = new Date();
      const estimatedDelivery = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now

      this.mockOrders.set(orderId, {
        orderId,
        status: [
          {
            id: '1',
            status: 'confirmed',
            label: 'تم تأكيد الطلب',
            description: 'تم تأكيد طلبك وجاري تحضيره',
            timestamp: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
            location: {
              lat: 32.8872,
              lng: 13.1913,
              address: 'مستودع إشرو - طرابلس',
              timestamp: new Date(now.getTime() - 30 * 60 * 1000)
            }
          },
          {
            id: '2',
            status: 'preparing',
            label: 'جاري تحضير الطلب',
            description: 'فريقنا يحضر طلبك بعناية',
            timestamp: new Date(now.getTime() - 15 * 60 * 1000), // 15 minutes ago
            location: {
              lat: 32.8872,
              lng: 13.1913,
              address: 'مستودع إشرو - طرابلس',
              timestamp: new Date(now.getTime() - 15 * 60 * 1000)
            }
          },
          {
            id: '3',
            status: 'ready',
            label: 'الطلب جاهز',
            description: 'طلبك جاهز وفي انتظار السائق',
            timestamp: new Date(now.getTime() - 5 * 60 * 1000), // 5 minutes ago
            location: {
              lat: 32.8872,
              lng: 13.1913,
              address: 'مستودع إشرو - طرابلس',
              timestamp: new Date(now.getTime() - 5 * 60 * 1000)
            }
          },
          {
            id: '4',
            status: 'picked_up',
            label: 'تم استلام الطلب',
            description: 'السائق استلم طلبك وفي طريقه إليك',
            timestamp: new Date(),
            location: {
              lat: 32.8872,
              lng: 13.1913,
              address: 'مستودع إشرو - طرابلس',
              timestamp: new Date()
            }
          }
        ],
        currentLocation: {
          lat: 32.8872,
          lng: 13.1913,
          address: 'في الطريق إلى العنوان',
          timestamp: new Date()
        },
        driver: {
          id: 'driver_1',
          name: 'أحمد محمد',
          phone: '+218911234567',
          vehicle: 'تويوتا كورولا - أبيض',
          rating: 4.8
        },
        estimatedDelivery,
        customerLocation: {
          lat: 32.8872,
          lng: 13.1913,
          address: 'طرابلس، ليبيا',
          timestamp: new Date()
        },
        warehouseLocation: {
          lat: 32.8872,
          lng: 13.1913,
          address: 'مستودع إشرو - طرابلس',
          timestamp: new Date()
        }
      });

      // Simulate real-time updates
      this.startRealTimeUpdates(orderId);
    }
  }

  private static startRealTimeUpdates(orderId: string) {
    const updateInterval = setInterval(() => {
      const orderData = this.mockOrders.get(orderId);
      if (!orderData) {
        clearInterval(updateInterval);
        return;
      }

      // Simulate driver movement
      const currentLat = orderData.currentLocation.lat;
      const currentLng = orderData.currentLocation.lng;
      const customerLat = orderData.customerLocation.lat;
      const customerLng = orderData.customerLocation.lng;

      // Move closer to customer location
      const latDiff = customerLat - currentLat;
      const lngDiff = customerLng - currentLng;
      const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

      if (distance > 0.001) { // If not very close to destination
        const moveSpeed = 0.0005; // Simulate movement speed
        const newLat = currentLat + (latDiff / distance) * moveSpeed;
        const newLng = currentLng + (lngDiff / distance) * moveSpeed;

        orderData.currentLocation = {
          ...orderData.currentLocation,
          lat: newLat,
          lng: newLng,
          timestamp: new Date()
        };

        // Update estimated delivery time
        const remainingDistance = Math.sqrt(
          (customerLat - newLat) ** 2 + (customerLng - newLng) ** 2
        );
        const estimatedMinutes = Math.max(15, remainingDistance * 10000); // Rough estimation
        orderData.estimatedDelivery = new Date(Date.now() + estimatedMinutes * 60 * 1000);
      } else {
        // Arrived at destination
        if (orderData.status[orderData.status.length - 1]?.status !== 'delivered') {
          const deliveredStatus: OrderStatus = {
            id: Date.now().toString(),
            status: 'delivered',
            label: 'تم التوصيل',
            description: 'تم توصيل طلبك بنجاح',
            timestamp: new Date(),
            location: orderData.customerLocation
          };
          orderData.status.push(deliveredStatus);
        }
        clearInterval(updateInterval);
      }
    }, 10000); // Update every 10 seconds
  }

  static getOrderData(orderId: string) {
    return this.mockOrders.get(orderId);
  }

  static getCurrentStatus(orderId: string): OrderStatus | null {
    const orderData = this.mockOrders.get(orderId);
    return orderData ? orderData.status[orderData.status.length - 1] || null : null;
  }

  static getAllStatuses(orderId: string): OrderStatus[] {
    const orderData = this.mockOrders.get(orderId);
    return orderData ? orderData.status : [];
  }
}

const OrderTracking: React.FC<OrderTrackingProps> = ({
  orderId,
  onContactDriver,
  onReportIssue,
  className = ""
}) => {
  const [orderData, setOrderData] = useState<ReturnType<typeof OrderTrackingService.getOrderData>>(OrderTrackingService.getOrderData(orderId));
  const [currentStatus, setCurrentStatus] = useState<OrderStatus | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const updateOrderData = useCallback(() => {
    const data = OrderTrackingService.getOrderData(orderId);
    const status = OrderTrackingService.getCurrentStatus(orderId);

    setOrderData(data);

    setCurrentStatus(prevStatus => {
      if (prevStatus && status && prevStatus.status !== status.status) {
        NotificationManager.createNotification({
          type: 'order',
          title: `تحديث حالة الطلب ${orderId}`,
          message: `تم تحديث حالة طلبك إلى: ${status.label}`,
          priority: status.status === 'delivered' ? 'high' : 'medium',
          actionUrl: `/orders/${orderId}`,
          actionText: 'عرض التفاصيل'
        }).catch(() => {
          void 0;
        });
      }
      return status ?? null;
    });
  }, [orderId]);

  useEffect(() => {
    OrderTrackingService.initializeMockData(orderId);
    updateOrderData();

    const updateInterval = setInterval(updateOrderData, 5000);

    return () => clearInterval(updateInterval);
  }, [orderId, updateOrderData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateOrderData();
    setIsRefreshing(false);
  };

  const getStatusProgress = (status: string): number => {
    const statusOrder = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'in_transit', 'delivered'];
    const index = statusOrder.indexOf(status);
    return index >= 0 ? ((index + 1) / statusOrder.length) * 100 : 0;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-orange-100 text-orange-800';
      case 'picked_up': return 'bg-purple-100 text-purple-800';
      case 'in_transit': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeRemaining = (): string => {
    if (!orderData?.estimatedDelivery) return '';

    const now = new Date();
    const diff = orderData.estimatedDelivery.getTime() - now.getTime();

    if (diff <= 0) return 'تم التوصيل';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours} ساعة و ${minutes} دقيقة`;
    } else {
      return `${minutes} دقيقة`;
    }
  };

  if (!orderData || !currentStatus) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">جاري تحميل بيانات الطلب...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Order Status Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              تتبع الطلب #{orderId}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ml-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current Status */}
            <div className="text-center">
              <Badge className={`text-lg px-4 py-2 ${getStatusColor(currentStatus.status)}`}>
                {currentStatus.label}
              </Badge>
              <p className="text-gray-600 mt-2">{currentStatus.description}</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>حالة الطلب</span>
                <span>{Math.round(getStatusProgress(currentStatus.status))}%</span>
              </div>
              <Progress value={getStatusProgress(currentStatus.status)} className="h-2" />
            </div>

            {/* Estimated Delivery */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800">
                <Clock className="h-5 w-5" />
                <div>
                  <p className="font-semibold">الوقت المقدر للتوصيل</p>
                  <p className="text-sm">
                    {formatDate(orderData.estimatedDelivery)} - {formatTime(orderData.estimatedDelivery)}
                  </p>
                  <p className="text-sm font-medium">
                    متبقي: {getTimeRemaining()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Driver Information */}
      {currentStatus.status !== 'delivered' && currentStatus.status !== 'cancelled' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              معلومات السائق
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback>
                    {orderData.driver.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{orderData.driver.name}</h4>
                  <p className="text-sm text-gray-600">{orderData.driver.vehicle}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm">{orderData.driver.rating}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onContactDriver?.(orderData.driver)}
                >
                  <Phone className="h-4 w-4 ml-2" />
                  اتصال
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onContactDriver?.(orderData.driver)}
                >
                  <MessageCircle className="h-4 w-4 ml-2" />
                  رسالة
                </Button>
              </div>
            </div>

            {/* Current Location */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-700">
                <Navigation className="h-4 w-4" />
                <span className="text-sm">{orderData.currentLocation.address}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                آخر تحديث: {formatTime(orderData.currentLocation.timestamp)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الطلب</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {OrderTrackingService.getAllStatuses(orderId).map((status, index) => (
              <div key={status.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === OrderTrackingService.getAllStatuses(orderId).length - 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {index === OrderTrackingService.getAllStatuses(orderId).length - 1 ? (
                      <Truck className="h-4 w-4" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </div>
                  {index < OrderTrackingService.getAllStatuses(orderId).length - 1 && (
                    <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
                  )}
                </div>

                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{status.label}</h4>
                    <span className="text-sm text-gray-500">
                      {formatTime(status.timestamp)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{status.description}</p>
                  {status.location && (
                    <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                      <MapPin className="h-3 w-3" />
                      {status.location.address}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {currentStatus.status !== 'delivered' && currentStatus.status !== 'cancelled' && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onReportIssue?.(orderId, 'تأخير في التوصيل')}
              >
                <AlertCircle className="h-4 w-4 ml-2" />
                الإبلاغ عن مشكلة
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onContactDriver?.(orderData.driver)}
              >
                <MessageCircle className="h-4 w-4 ml-2" />
                تواصل مع الدعم
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delivery Confirmation */}
      {currentStatus.status === 'delivered' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                تم توصيل طلبك بنجاح!
              </h3>
              <p className="text-green-700 mb-4">
                شكراً لك على اختيار إشرو. نتمنى أن يعجبك طلبك.
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 ml-2" />
                  إعادة الطلب
                </Button>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 ml-2" />
                  تقييم الخدمة
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderTracking;
