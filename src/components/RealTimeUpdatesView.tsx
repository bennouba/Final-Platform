import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  Bell,
  Eye,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Star,
  Package,
  Truck,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Info,
  Settings,
  RefreshCw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Zap,
  Target,
  Award,
  Clock,
  Calendar,
  MapPin,
  Globe,
  Wifi,
  WifiOff,
  Signal,
  Battery,
  Power,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';

interface RealTimeUpdate {
  id: string;
  type: 'order' | 'visitor' | 'sale' | 'review' | 'question' | 'stock' | 'system';
  title: string;
  description: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  isRead: boolean;
  data?: any;
}

interface RealTimeUpdatesViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

const RealTimeUpdatesView: React.FC<RealTimeUpdatesViewProps> = ({ storeData, setStoreData, onSave }) => {
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [updates, setUpdates] = useState<RealTimeUpdate[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connected');

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTimeEnabled) return;

    const interval = setInterval(() => {
      const newUpdate: RealTimeUpdate = {
        id: Date.now().toString(),
        type: ['order', 'visitor', 'sale', 'review', 'question', 'stock', 'system'][Math.floor(Math.random() * 7)] as any,
        title: getRandomUpdateTitle() || 'تحديث جديد',
        description: getRandomUpdateDescription() || 'وصف التحديث',
        timestamp: new Date().toISOString(),
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
        isRead: false,
      };

      setUpdates(prev => [newUpdate, ...prev.slice(0, 49)]); // Keep only last 50 updates
    }, Math.random() * 10000 + 5000); // Random interval between 5-15 seconds

    return () => clearInterval(interval);
  }, [isRealTimeEnabled]);

  const getRandomUpdateTitle = () => {
    const titles = [
      'طلب جديد تم استلامه',
      'زائر جديد في المتجر',
      'مبيعة جديدة تم إتمامها',
      'تقييم جديد تم إضافته',
      'سؤال جديد من عميل',
      'تحديث في المخزون',
      'إشعار نظام مهم',
      'عرض ترويجي جديد',
      'تحديث في حالة الطلب',
      'عميل جديد سجل في المتجر',
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  };

  const getRandomUpdateDescription = () => {
    const descriptions = [
      'تم استلام طلب جديد بقيمة 250 دينار ليبي',
      'زائر من طرابلس يتصفح المنتجات الآن',
      'تم إتمام عملية شراء بنجاح',
      'عميل جديد أضاف تقييم 5 نجوم',
      'سؤال جديد حول منتج في قسم العطور',
      'تحديث في كمية المنتج في المخزن',
      'نسخة احتياطية تم إنشاؤها بنجاح',
      'عرض ترويجي جديد تم تفعيله',
      'حالة الطلب تغيرت إلى "تم الشحن"',
      'عميل جديد سجل في المتجر بنجاح',
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const getUpdateIcon = (type: string) => {
    const iconConfig = {
      order: <ShoppingBag className="h-4 w-4" />,
      visitor: <Eye className="h-4 w-4" />,
      sale: <DollarSign className="h-4 w-4" />,
      review: <Star className="h-4 w-4" />,
      question: <MessageSquare className="h-4 w-4" />,
      stock: <Package className="h-4 w-4" />,
      system: <Settings className="h-4 w-4" />,
    };
    return iconConfig[type as keyof typeof iconConfig] || <Info className="h-4 w-4" />;
  };

  const getPriorityColor = (priority: string) => {
    const colorConfig = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
    };
    return colorConfig[priority as keyof typeof colorConfig] || 'bg-gray-100 text-gray-800';
  };

  const getConnectionStatus = () => {
    switch (connectionStatus) {
      case 'connected':
        return { icon: <Wifi className="h-4 w-4 text-green-600" />, text: 'متصل', color: 'text-green-600' };
      case 'connecting':
        return { icon: <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />, text: 'جاري الاتصال', color: 'text-yellow-600' };
      case 'disconnected':
        return { icon: <WifiOff className="h-4 w-4 text-red-600" />, text: 'غير متصل', color: 'text-red-600' };
    }
  };

  const unreadCount = updates.filter(update => !update.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">التحديثات المباشرة</h2>
          <p className="text-gray-600 mt-1">تتبع الأنشطة والتحديثات في الوقت الفعلي</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {getConnectionStatus().icon}
            <span className={getConnectionStatus().color}>{getConnectionStatus().text}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isRealTimeEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              {isRealTimeEnabled ? <Pause className="h-4 w-4 ml-2" /> : <Play className="h-4 w-4 ml-2" />}
              {isRealTimeEnabled ? 'إيقاف التحديثات' : 'تشغيل التحديثات'}
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 ml-2" />
              الإعدادات
            </Button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">التحديث التلقائي</span>
                <Switch
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">الصوت</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">
                {unreadCount} غير مقروء
              </Badge>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 ml-2" />
                تحديث الآن
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الزوار المباشرين</p>
                <p className="text-3xl font-bold text-green-600">12</p>
                <p className="text-sm text-gray-600">نشط الآن</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الطلبات اليوم</p>
                <p className="text-3xl font-bold text-blue-600">8</p>
                <p className="text-sm text-gray-600">طلب جديد</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المبيعات اليوم</p>
                <p className="text-3xl font-bold text-purple-600">د.ل 2,450</p>
                <p className="text-sm text-gray-600">إجمالي المبيعات</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الأنشطة</p>
                <p className="text-3xl font-bold text-orange-600">{updates.length}</p>
                <p className="text-sm text-gray-600">نشاط اليوم</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            تغذية الأنشطة المباشرة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {updates.map((update, index) => (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    !update.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getUpdateIcon(update.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{update.title}</p>
                      <Badge className={getPriorityColor(update.priority)}>
                        {update.priority}
                      </Badge>
                      {!update.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{update.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{new Date(update.timestamp).toLocaleTimeString('ar')}</span>
                      <span>{new Date(update.timestamp).toLocaleDateString('ar')}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {updates.length === 0 && (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد أنشطة حديثة</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Signal className="h-5 w-5" />
              حالة النظام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">قاعدة البيانات</span>
                </div>
                <Badge className="bg-green-100 text-green-800">متصل</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">الخادم</span>
                </div>
                <Badge className="bg-green-100 text-green-800">يعمل</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium">آخر نسخة احتياطية</span>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">قبل ساعتين</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Battery className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">استهلاك الذاكرة</span>
                </div>
                <Badge className="bg-blue-100 text-blue-800">45%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              الأداء المباشر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-blue-500"></div>
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">94%</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">الأداء</h3>
                <p className="text-gray-600">مؤشر الأداء الحالي</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">●</div>
                  <p className="text-sm text-gray-600">سرعة الاستجابة</p>
                  <p className="text-xs text-gray-500">120ms</p>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">●</div>
                  <p className="text-sm text-gray-600">وقت التشغيل</p>
                  <p className="text-xs text-gray-500">99.9%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            التنبيهات المباشرة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-green-900">طلب جديد تم استلامه</p>
                <p className="text-sm text-green-700">طلب بقيمة 350 دينار ليبي من العميل محمد أحمد</p>
              </div>
              <div className="text-xs text-green-600">الآن</div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Eye className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-blue-900">زائر جديد في المتجر</p>
                <p className="text-sm text-blue-700">زائر من طرابلس يتصفح قسم العطور</p>
              </div>
              <div className="text-xs text-blue-600">قبل دقيقة</div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <p className="font-medium text-orange-900">تنبيه المخزون</p>
                <p className="text-sm text-orange-700">منتج "عطر Hugo Boss" وصل للحد الأدنى من الكمية</p>
              </div>
              <div className="text-xs text-orange-600">قبل 5 دقائق</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { RealTimeUpdatesView };
