import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Eye,
  Users,
  DollarSign,
  Package,
  ShoppingBag,
  MapPin,
  Globe,
  Activity,
  Target,
  Award,
  Zap,
  Layers,
  Grid,
  Settings,
  Maximize,
  Minimize,
  RotateCcw,
  Save,
  Share,
  Printer,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface InteractiveChartsViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

const InteractiveChartsView: React.FC<InteractiveChartsViewProps> = ({ storeData, setStoreData, onSave }) => {
  const [chartType, setChartType] = useState('bar');
  const [timeRange, setTimeRange] = useState('30d');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sample data for charts
  const salesData = [
    { month: 'يناير', sales: 12000, orders: 45, customers: 38 },
    { month: 'فبراير', sales: 15000, orders: 52, customers: 41 },
    { month: 'مارس', sales: 18000, orders: 48, customers: 44 },
    { month: 'أبريل', sales: 22000, orders: 61, customers: 52 },
    { month: 'مايو', sales: 25000, orders: 55, customers: 48 },
    { month: 'يونيو', sales: 28000, orders: 67, customers: 58 },
    { month: 'يوليو', sales: 32000, orders: 73, customers: 64 },
    { month: 'أغسطس', sales: 35000, orders: 78, customers: 69 },
    { month: 'سبتمبر', sales: 38000, orders: 82, customers: 71 },
    { month: 'أكتوبر', sales: 42000, orders: 89, customers: 76 },
    { month: 'نوفمبر', sales: 45000, orders: 94, customers: 81 },
    { month: 'ديسمبر', sales: 48000, orders: 98, customers: 85 },
  ];

  const categoryData = [
    { name: 'العطور', value: 35, sales: 16800, color: '#3B82F6' },
    { name: 'الملابس النسائية', value: 25, sales: 12000, color: '#10B981' },
    { name: 'الإكسسوارات', value: 20, sales: 9600, color: '#8B5CF6' },
    { name: 'الأحذية', value: 15, sales: 7200, color: '#F59E0B' },
    { name: 'الساعات', value: 5, sales: 2400, color: '#EF4444' },
  ];

  const dailyVisitors = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    visitors: Math.floor(Math.random() * 100) + 20,
    pageViews: Math.floor(Math.random() * 500) + 100,
    bounceRate: Math.floor(Math.random() * 30) + 10,
  }));

  const renderBarChart = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">المبيعات الشهرية</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 ml-2" />
            تصدير
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 ml-2" />
            مشاركة
          </Button>
        </div>
      </div>
      <div className="h-80 flex items-end justify-between gap-2">
        {salesData.slice(-6).map((data, index) => (
          <div key={data.month} className="flex flex-col items-center gap-2 flex-1">
            <div className="text-xs text-gray-600 mb-2">{data.month}</div>
            <div className="relative w-full max-w-[60px]">
              <div
                className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-all duration-300 cursor-pointer group"
                style={{ height: `${(data.sales / 50000) * 100}%` }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    {data.sales.toLocaleString()} د.ل
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500">{data.orders} طلب</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPieChart = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">توزيع المبيعات حسب التصنيف</h3>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 ml-2" />
          تخصيص
        </Button>
      </div>
      <div className="flex items-center gap-8">
        <div className="relative">
          <div className="w-48 h-48 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center">
              <PieChart className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          {/* Pie slices would be rendered here with SVG or Canvas */}
        </div>
        <div className="flex-1 space-y-3">
          {categoryData.map((category, index) => (
            <div key={category.name} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: category.color }}
              ></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{category.name}</span>
                  <span className="text-sm text-gray-600">{category.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${category.value}%`,
                      backgroundColor: category.color
                    }}
                  ></div>
                </div>
              </div>
              <div className="text-sm font-semibold">{category.sales.toLocaleString()} د.ل</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLineChart = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">الزيارات اليومية</h3>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 أيام</SelectItem>
              <SelectItem value="30d">30 يوم</SelectItem>
              <SelectItem value="90d">90 يوم</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="h-80 relative">
        <div className="absolute inset-0">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="border-t border-gray-100"></div>
            ))}
          </div>
          <div className="absolute inset-0 flex justify-between">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="border-l border-gray-100"></div>
            ))}
          </div>
        </div>

        {/* Line chart */}
        <div className="absolute inset-0 flex items-end justify-between">
          {dailyVisitors.map((data, index) => (
            <div key={data.day} className="flex flex-col items-center gap-2 flex-1">
              <div className="relative w-full h-full flex items-end justify-center">
                <div
                  className="w-2 bg-gradient-to-t from-green-500 to-green-400 rounded-t hover:from-green-600 hover:to-green-500 transition-all duration-300 cursor-pointer group"
                  style={{ height: `${(data.visitors / 120) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                      {data.visitors} زائر
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500">{data.day}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAreaChart = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">نمو العملاء</h3>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 ml-2" />
          تحديث البيانات
        </Button>
      </div>
      <div className="h-80 relative">
        <div className="absolute inset-0">
          {/* Area chart background */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-100 to-transparent rounded-lg"></div>
        </div>

        {/* Area chart line */}
        <div className="absolute inset-0 flex items-end justify-between">
          {salesData.slice(-8).map((data, index) => (
            <div key={data.month} className="flex flex-col items-center gap-2 flex-1">
              <div className="relative w-full h-full flex items-end justify-center">
                <div
                  className="w-full bg-gradient-to-t from-purple-500 to-purple-300 rounded-t hover:from-purple-600 hover:to-purple-400 transition-all duration-300 cursor-pointer group"
                  style={{ height: `${(data.customers / 90) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                      {data.customers} عميل
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500">{data.month}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGeographicChart = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">التوزيع الجغرافي للعملاء</h3>
        <Button variant="outline" size="sm">
          <MapPin className="h-4 w-4 ml-2" />
          عرض الخريطة
        </Button>
      </div>
      <div className="h-80 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233B82F6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="text-center z-10">
          <Globe className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h4 className="font-semibold text-gray-900 mb-2">خريطة ليبيا التفاعلية</h4>
          <p className="text-gray-600 mb-4">توزيع الطلبات والعملاء حسب المناطق</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>مناطق عالية النشاط</span>
                <Badge className="bg-green-500">●</Badge>
              </div>
              <div className="flex justify-between">
                <span>مناطق متوسطة النشاط</span>
                <Badge className="bg-yellow-500">●</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>مناطق منخفضة النشاط</span>
                <Badge className="bg-red-500">●</Badge>
              </div>
              <div className="flex justify-between">
                <span>مناطق بدون نشاط</span>
                <Badge variant="outline">●</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboardChart = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">نظرة عامة على الأداء</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 ml-2" />
            الفترة الزمنية
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 ml-2" />
            فلترة
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي المبيعات', value: 'د.ل 380,000', change: '+12%', icon: <DollarSign className="h-5 w-5" />, color: 'text-green-600' },
          { label: 'عدد الطلبات', value: '892', change: '+8%', icon: <ShoppingBag className="h-5 w-5" />, color: 'text-blue-600' },
          { label: 'العملاء الجدد', value: '156', change: '+15%', icon: <Users className="h-5 w-5" />, color: 'text-purple-600' },
          { label: 'معدل التحويل', value: '3.2%', change: '+0.5%', icon: <Target className="h-5 w-5" />, color: 'text-orange-600' },
        ].map((metric, index) => (
          <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className={metric.color}>{metric.icon}</div>
              <span className="text-xs font-semibold text-green-600">{metric.change}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
            <div className="text-sm text-gray-600">{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">الرسوم البيانية التفاعلية</h2>
          <p className="text-gray-600 mt-1">تحليلات بصرية متقدمة لأداء متجرك</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setIsFullscreen(!isFullscreen)}
            variant="outline"
          >
            {isFullscreen ? <Minimize className="h-4 w-4 ml-2" /> : <Maximize className="h-4 w-4 ml-2" />}
            {isFullscreen ? 'خروج من ملء الشاشة' : 'ملء الشاشة'}
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 ml-2" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* Chart Type Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
            >
              <BarChart3 className="h-4 w-4 ml-2" />
              رسم بياني عمودي
            </Button>
            <Button
              variant={chartType === 'pie' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('pie')}
            >
              <PieChart className="h-4 w-4 ml-2" />
              رسم بياني دائري
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
            >
              <LineChart className="h-4 w-4 ml-2" />
              رسم بياني خطي
            </Button>
            <Button
              variant={chartType === 'area' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('area')}
            >
              <Activity className="h-4 w-4 ml-2" />
              رسم بياني مساحي
            </Button>
            <Button
              variant={chartType === 'geo' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('geo')}
            >
              <MapPin className="h-4 w-4 ml-2" />
              خريطة جغرافية
            </Button>
            <Button
              variant={chartType === 'dashboard' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('dashboard')}
            >
              <Grid className="h-4 w-4 ml-2" />
              لوحة القيادة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chart Display */}
      <Card className={`${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
        <CardContent className="p-6">
          {chartType === 'bar' && renderBarChart()}
          {chartType === 'pie' && renderPieChart()}
          {chartType === 'line' && renderLineChart()}
          {chartType === 'area' && renderAreaChart()}
          {chartType === 'geo' && renderGeographicChart()}
          {chartType === 'dashboard' && renderDashboardChart()}
        </CardContent>
      </Card>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              اتجاهات الأداء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-medium">المبيعات</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">+18%</div>
                  <div className="text-sm text-gray-600">مقابل الشهر الماضي</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">العملاء الجدد</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-blue-600">+12%</div>
                  <div className="text-sm text-gray-600">مقابل الشهر الماضي</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">معدل التحويل</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-purple-600">+0.8%</div>
                  <div className="text-sm text-gray-600">مقابل الشهر الماضي</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              أفضل المنتجات أداءً
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'عطر Hugo Intense 100ml', sales: 12500, percentage: 85, category: 'العطور' },
                { name: 'فستان سهرة أنيق', sales: 8900, percentage: 72, category: 'الملابس النسائية' },
                { name: 'حقيبة يد جلدية', sales: 6700, percentage: 68, category: 'الإكسسوارات' },
                { name: 'حذاء رياضي Nike', sales: 5400, percentage: 61, category: 'الأحذية' },
              ].map((product, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{product.sales.toLocaleString()} د.ل</p>
                    <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                      <div
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: `${product.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { InteractiveChartsView };
