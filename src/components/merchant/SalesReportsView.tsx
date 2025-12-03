import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  Target,
  Award
} from 'lucide-react';

interface SalesData {
  daily: { date: string; sales: number; orders: number; customers: number }[];
  monthly: { month: string; sales: number; orders: number; customers: number }[];
  yearly: { year: string; sales: number; orders: number; customers: number }[];
  profitMargin: number;
  returnedProducts: number;
  frequentCustomers: number;
  giftCustomers: number;
  retailPercentage: number;
}

const SalesReportsView: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  const [selectedChart, setSelectedChart] = useState<'bar' | 'line' | 'pie'>('bar');

  const salesData: SalesData = {
    daily: [
      { date: '2024-01-01', sales: 1250, orders: 15, customers: 12 },
      { date: '2024-01-02', sales: 2100, orders: 22, customers: 18 },
      { date: '2024-01-03', sales: 1800, orders: 19, customers: 16 },
      { date: '2024-01-04', sales: 3200, orders: 28, customers: 24 },
      { date: '2024-01-05', sales: 2800, orders: 25, customers: 21 },
      { date: '2024-01-06', sales: 3500, orders: 32, customers: 28 },
      { date: '2024-01-07', sales: 4200, orders: 38, customers: 33 }
    ],
    monthly: [
      { month: 'يناير', sales: 45000, orders: 156, customers: 134 },
      { month: 'فبراير', sales: 52000, orders: 178, customers: 152 },
      { month: 'مارس', sales: 48000, orders: 165, customers: 141 },
      { month: 'أبريل', sales: 61000, orders: 203, customers: 175 },
      { month: 'مايو', sales: 58000, orders: 192, customers: 168 },
      { month: 'يونيو', sales: 67000, orders: 221, customers: 189 },
      { month: 'يوليو', sales: 71000, orders: 235, customers: 201 },
      { month: 'أغسطس', sales: 69000, orders: 228, customers: 195 },
      { month: 'سبتمبر', sales: 75000, orders: 248, customers: 212 },
      { month: 'أكتوبر', sales: 78000, orders: 256, customers: 218 },
      { month: 'نوفمبر', sales: 82000, orders: 271, customers: 231 },
      { month: 'ديسمبر', sales: 85000, orders: 282, customers: 241 }
    ],
    yearly: [
      { year: '2022', sales: 650000, orders: 2150, customers: 1840 },
      { year: '2023', sales: 720000, orders: 2380, customers: 2035 },
      { year: '2024', sales: 850000, orders: 2810, customers: 2405 }
    ],
    profitMargin: 23.5,
    returnedProducts: 2.1,
    frequentCustomers: 156,
    giftCustomers: 89,
    retailPercentage: 78.3
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
                {Math.abs(trend.value)}% من الفترة السابقة
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

  const ChartCard: React.FC = () => {
    const currentData = selectedPeriod === 'daily' ? salesData.daily :
                      selectedPeriod === 'monthly' ? salesData.monthly :
                      salesData.yearly;

    const maxSales = Math.max(...currentData.map(d => d.sales));

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {selectedChart === 'bar' && <BarChart3 className="h-5 w-5" />}
              {selectedChart === 'line' && <TrendingUp className="h-5 w-5" />}
              {selectedChart === 'pie' && <PieChart className="h-5 w-5" />}
              تقرير المبيعات - {selectedPeriod === 'daily' ? 'يومي' : selectedPeriod === 'monthly' ? 'شهري' : 'سنوي'}
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
              <Button
                size="sm"
                variant={selectedChart === 'pie' ? 'default' : 'outline'}
                onClick={() => setSelectedChart('pie')}
              >
                دائري
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedChart === 'bar' && (
              <div className="space-y-3">
                {currentData.map((data, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-20 text-sm font-medium">
                      {selectedPeriod === 'daily' ? new Date(data.date).toLocaleDateString('ar') :
                       selectedPeriod === 'monthly' ? data.month : data.year}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                            style={{ width: `${(data.sales / maxSales) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold w-20 text-right">
                          {data.sales.toLocaleString()} د.ل
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>الطلبات: {data.orders}</span>
                        <span>العملاء: {data.customers}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedChart === 'line' && (
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">مخطط خطي تفاعلي</p>
                  <p className="text-xs text-muted-foreground mt-1">سيتم عرضه هنا قريباً</p>
                </div>
              </div>
            )}

            {selectedChart === 'pie' && (
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">مخطط دائري تفاعلي</p>
                  <p className="text-xs text-muted-foreground mt-1">سيتم عرضه هنا قريباً</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">تقارير المبيعات</h2>
          <p className="text-muted-foreground">
            تعرض فيه كل البيانات التفصيلية لكل المنتجات بإحصائيات
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

      {/* Period Selection */}
      <div className="flex gap-2">
        <Button
          variant={selectedPeriod === 'daily' ? 'default' : 'outline'}
          onClick={() => setSelectedPeriod('daily')}
        >
          يومية
        </Button>
        <Button
          variant={selectedPeriod === 'monthly' ? 'default' : 'outline'}
          onClick={() => setSelectedPeriod('monthly')}
        >
          شهرية
        </Button>
        <Button
          variant={selectedPeriod === 'yearly' ? 'default' : 'outline'}
          onClick={() => setSelectedPeriod('yearly')}
        >
          سنوية
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="نسبة المرابيح من المبيعات"
          value={`${salesData.profitMargin}%`}
          icon={Target}
          color="bg-green-500"
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatCard
          title="نسبة المنتجات المسترجعة"
          value={`${salesData.returnedProducts}%`}
          icon={RefreshCw}
          color="bg-red-500"
          trend={{ value: -1.3, isPositive: false }}
        />
        <StatCard
          title="عدد الزوار الاكثر تردد للمتجر"
          value={salesData.frequentCustomers}
          subtitle="زبون منتظم"
          icon={Users}
          color="bg-blue-500"
          trend={{ value: 12.8, isPositive: true }}
        />
        <StatCard
          title="عدد الزوار من كسب هدايا"
          value={salesData.giftCustomers}
          subtitle="من خلال البرامج الترويجية"
          icon={Award}
          color="bg-purple-500"
          trend={{ value: 8.7, isPositive: true }}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="نسبة البيع بالتجزئة"
          value={`${salesData.retailPercentage}%`}
          subtitle="من إجمالي المبيعات"
          icon={Package}
          color="bg-orange-500"
          trend={{ value: 3.1, isPositive: true }}
        />
        <StatCard
          title="متوسط قيمة الطلب"
          value="2,847 د.ل"
          subtitle="للطلب الواحد"
          icon={ShoppingCart}
          color="bg-indigo-500"
          trend={{ value: 7.4, isPositive: true }}
        />
      </div>

      {/* Main Chart */}
      <ChartCard />

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>أداء المنتجات الأفضل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'هاتف ذكي سامسونج', sales: 45000, percentage: 15.2 },
                { name: 'لابتوب ديل', sales: 38000, percentage: 12.8 },
                { name: 'سماعات بلوتوث', sales: 32000, percentage: 10.8 },
                { name: 'شاحن متنقل', sales: 28000, percentage: 9.4 },
                { name: 'كاميرا رقمية', sales: 25000, percentage: 8.4 }
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.percentage}% من المبيعات</p>
                  </div>
                  <div className="text-left">
                    <p className="font-bold">{product.sales.toLocaleString()} د.ل</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>تحليل المبيعات حسب الفئات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { category: 'إلكترونيات', sales: 125000, percentage: 42.1 },
                { category: 'ملابس', sales: 78000, percentage: 26.3 },
                { category: 'منتجات منزلية', sales: 52000, percentage: 17.5 },
                { category: 'كتب ومكتبات', sales: 28000, percentage: 9.4 },
                { category: 'أخرى', sales: 14000, percentage: 4.7 }
              ].map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{category.category}</p>
                    <p className="text-sm text-muted-foreground">{category.percentage}% من المبيعات</p>
                  </div>
                  <div className="text-left">
                    <p className="font-bold">{category.sales.toLocaleString()} د.ل</p>
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

export default SalesReportsView;
