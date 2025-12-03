import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Download,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Archive,
  Truck,
  ShoppingCart,
  AlertCircle,
  DollarSign
} from 'lucide-react';

interface InventoryData {
  totalProducts: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
  monthlyMovement: { month: string; inbound: number; outbound: number }[];
  categoryDistribution: { category: string; count: number; value: number; percentage: number }[];
  topMovingProducts: { name: string; sold: number; remaining: number; turnover: number }[];
  stockAlerts: { product: string; status: 'low' | 'out' | 'expiring'; message: string }[];
}

const InventoryReportsView: React.FC = () => {
  const [selectedChart, setSelectedChart] = useState<'bar' | 'pie' | 'line'>('bar');

  const inventoryData: InventoryData = {
    totalProducts: 1247,
    inStock: 1156,
    lowStock: 67,
    outOfStock: 24,
    totalValue: 185000,
    monthlyMovement: [
      { month: 'يناير', inbound: 450, outbound: 380 },
      { month: 'فبراير', inbound: 520, outbound: 490 },
      { month: 'مارس', inbound: 380, outbound: 420 },
      { month: 'أبريل', inbound: 600, outbound: 550 },
      { month: 'مايو', inbound: 480, outbound: 520 },
      { month: 'يونيو', inbound: 550, outbound: 580 }
    ],
    categoryDistribution: [
      { category: 'إلكترونيات', count: 450, value: 95000, percentage: 36.1 },
      { category: 'ملابس', count: 380, value: 42000, percentage: 30.5 },
      { category: 'منتجات منزلية', count: 250, value: 28000, percentage: 20.1 },
      { category: 'كتب ومكتبات', count: 120, value: 15000, percentage: 9.6 },
      { category: 'أخرى', count: 47, value: 5000, percentage: 3.7 }
    ],
    topMovingProducts: [
      { name: 'هاتف ذكي سامسونج', sold: 145, remaining: 23, turnover: 6.3 },
      { name: 'لابتوب ديل', sold: 98, remaining: 15, turnover: 6.5 },
      { name: 'سماعات بلوتوث', sold: 234, remaining: 45, turnover: 5.2 },
      { name: 'شاحن متنقل', sold: 189, remaining: 12, turnover: 15.8 },
      { name: 'كاميرا رقمية', sold: 76, remaining: 8, turnover: 9.5 }
    ],
    stockAlerts: [
      { product: 'شاحن متنقل أنكر', status: 'low', message: 'الكمية منخفضة (5 قطع متبقية)' },
      { product: 'سماعات أبل', status: 'out', message: 'نفدت الكمية من المخزون' },
      { product: 'بطاريات AA', status: 'expiring', message: 'ستنتهي صلاحيتها قريباً' }
    ]
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ElementType;
    color: string;
    trend?: { value: number; isPositive: boolean };
  }> = ({ title, value, subtitle, icon: Icon, color, trend }) => (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <p className={`text-sm flex items-center gap-1 ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {Math.abs(trend.value)}% من الشهر الماضي
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const MovementChart: React.FC = () => {
    const maxMovement = Math.max(
      ...inventoryData.monthlyMovement.map(m => Math.max(m.inbound, m.outbound))
    );

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              حركة المخزون الشهرية
            </CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={selectedChart === 'bar' ? 'default' : 'outline'}
                onClick={() => setSelectedChart('bar')}
              >
                عمودي
              </Button>
              <Button
                size="sm"
                variant={selectedChart === 'line' ? 'default' : 'outline'}
                onClick={() => setSelectedChart('line')}
              >
                خطي
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventoryData.monthlyMovement.map((data, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{data.month}</span>
                  <div className="flex gap-4 text-xs">
                    <span className="text-green-600">داخل: {data.inbound}</span>
                    <span className="text-red-600">خارج: {data.outbound}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(data.inbound / maxMovement) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-center mt-1 text-green-600">
                      {data.inbound} وحدة
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${(data.outbound / maxMovement) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-center mt-1 text-red-600">
                      {data.outbound} وحدة
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const CategoryChart: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          توزيع المنتجات حسب الفئات
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inventoryData.categoryDistribution.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{category.category}</span>
                <div className="text-right">
                  <p className="font-bold">{category.count} منتج</p>
                  <p className="text-sm text-muted-foreground">
                    {category.value.toLocaleString()} د.ل
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {category.percentage}% من إجمالي المنتجات
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const TopProductsCard: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          أكثر المنتجات حركة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inventoryData.topMovingProducts.map((product, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{product.name}</h4>
                <Badge variant="outline">
                  {product.turnover}x معدل الدوران
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">تم البيع</p>
                  <p className="font-bold text-green-600">{product.sold} قطعة</p>
                </div>
                <div>
                  <p className="text-muted-foreground">متبقي</p>
                  <p className="font-bold text-blue-600">{product.remaining} قطعة</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const StockAlertsCard: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          تنبيهات المخزون
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {inventoryData.stockAlerts.map((alert, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-800">{alert.product}</p>
                <p className="text-sm text-red-600">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">تقارير المخزون</h2>
          <p className="text-muted-foreground">
            إدارة وتتبع المخزون والمنتجات
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            فلترة
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            تصدير
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي المنتجات"
          value={inventoryData.totalProducts}
          subtitle="منتج في المخزون"
          icon={Package}
          color="bg-blue-500"
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatCard
          title="متوفر في المخزون"
          value={inventoryData.inStock}
          subtitle="منتج جاهز للبيع"
          icon={CheckCircle}
          color="bg-green-500"
          trend={{ value: 3.1, isPositive: true }}
        />
        <StatCard
          title="منخفض المخزون"
          value={inventoryData.lowStock}
          subtitle="يحتاج إعادة طلب"
          icon={AlertTriangle}
          color="bg-yellow-500"
          trend={{ value: -8.5, isPositive: false }}
        />
        <StatCard
          title="نفد المخزون"
          value={inventoryData.outOfStock}
          subtitle="غير متوفر"
          icon={AlertCircle}
          color="bg-red-500"
          trend={{ value: -12.3, isPositive: false }}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="القيمة الإجمالية للمخزون"
          value={`${inventoryData.totalValue.toLocaleString()} د.ل`}
          subtitle="تقدير القيمة الحالية"
          icon={DollarSign}
          color="bg-purple-500"
        />
        <StatCard
          title="معدل دوران المخزون"
          value="4.8x"
          subtitle="مرات في السنة"
          icon={RefreshCw}
          color="bg-indigo-500"
          trend={{ value: 7.2, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MovementChart />
        <CategoryChart />
      </div>

      {/* Top Products and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProductsCard />
        <StockAlertsCard />
      </div>
    </div>
  );
};

export default InventoryReportsView;
