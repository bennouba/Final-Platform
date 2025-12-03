import React, { useState } from 'react';
import {
  Users,
  Eye,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  MapPin,
  Globe,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface RealTimeAnalyticsViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

const RealTimeAnalyticsView: React.FC<RealTimeAnalyticsViewProps> = ({ storeData, setStoreData, onSave }) => {
  const [dateRange, setDateRange] = useState('2025-09-22');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">التحليلات المباشرة</h2>
          <p className="text-gray-600 mt-1">تحليلات حقيقية ومتحدثة للحظة الحالية</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 ml-2" />
            فلترة
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 ml-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Date Range */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">الفترة الزمنية:</span>
            <Button variant="outline" size="sm">
              {dateRange} - يوم 24
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">العملاء</p>
                <p className="text-3xl font-bold text-gray-900">6</p>
                <p className="text-sm text-green-600">عملاء نشطون</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">عدد الزيارات</p>
                <p className="text-3xl font-bold text-gray-900">800 زيارة</p>
                <p className="text-sm text-gray-600">إجمالي الزيارات</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">عدد الطلبات</p>
                <p className="text-3xl font-bold text-gray-900">11 طلب</p>
                <p className="text-sm text-gray-600">طلبات مكتملة</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المبيعات</p>
                <p className="text-3xl font-bold text-gray-900">3,288.27 د.ل</p>
                <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Journey */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            رحلة العميل
          </CardTitle>
          <p className="text-sm text-gray-600">تصور لمراحل رحلة العملاء في متجرك</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">909</span>
              </div>
              <p className="text-sm font-medium">زائر</p>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-1">
                    <span className="text-purple-600 font-bold text-xs">34</span>
                  </div>
                  <p className="text-xs text-gray-600">متجر</p>
                </div>
                <div className="w-8 h-px bg-gray-300"></div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-1">
                    <span className="text-orange-600 font-bold text-xs">10</span>
                  </div>
                  <p className="text-xs text-gray-600">شراء</p>
                </div>
                <div className="w-8 h-px bg-gray-300"></div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-1">
                    <span className="text-green-600 font-bold text-xs">6</span>
                  </div>
                  <p className="text-xs text-gray-600">طلب</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 font-bold">6</span>
              </div>
              <p className="text-sm font-medium">مكمل</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Evolution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            تطور المبيعات خلال الأشهر الماضية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">مخطط تطور المبيعات</p>
              <p className="text-xs text-gray-500 mt-1">سيتم تطويره قريباً</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Geographic Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              التحليلات الجغرافية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">تركيز في ليبيا / طرابلس</p>
                  <p className="text-sm text-gray-600">المنطقة الأكثر نشاطاً</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">رئيسي</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">المواقع النشطة</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">إجمالي المبيعات</span>
                  <span className="font-semibold">0 طلب</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">إجمالي الطلبات</span>
                  <span className="font-semibold">4 زيارة</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">زيارة</span>
                  <span className="font-semibold">0 زيارة</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">الزوار الجدد</span>
                  <span className="font-semibold">0 زيارة</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              الخريطة الجغرافية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">خريطة تفاعلية</p>
                <p className="text-xs text-gray-500 mt-1">عرض التوزيع الجغرافي</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Most Visited Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            الصفحات الأكثر زيارة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium">الصفحة الرئيسية</p>
                  <p className="text-sm text-gray-600">الصفحة الرئيسية للمتجر</p>
                </div>
              </div>
              <div className="text-center">
                <p className="font-semibold">1,234</p>
                <p className="text-sm text-gray-600">زيارة</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { RealTimeAnalyticsView };
