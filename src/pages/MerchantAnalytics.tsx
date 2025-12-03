
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SalesReportsView from '@/components/merchant/SalesReportsView';
import InventoryReportsView from '@/components/merchant/InventoryReportsView';
import CustomerReportsView from '@/components/merchant/CustomerReportsView';
import FinancialAnalyticsView from '@/components/merchant/FinancialAnalyticsView';
import {
  Activity,
  BarChart3,
  DollarSign,
  Download,
  Eye,
  Globe,
  MapPin,
  Menu,
  Package,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Users,
  X
} from 'lucide-react';

const MerchantAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('live-analytics');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigationItems = [
    { id: 'live-analytics', label: 'التحليلات المباشرة', icon: Activity },
    { id: 'sales-reports', label: 'تقارير المبيعات', icon: BarChart3 },
    { id: 'inventory-reports', label: 'تقارير المخزون', icon: Package },
    { id: 'customer-reports', label: 'تقارير العملاء', icon: Users },
    { id: 'financial-analytics', label: 'المالية', icon: DollarSign }
  ];
  const liveAnalyticsData = {
    customers: {
      total: 6,
      active: 6,
      visitors: 909,
      spread: 34,
      purchased: 10,
      completed: 6
    },
    visits: {
      total: 800,
      orders: 11,
      sales: 3288.27
    },
    customerJourney: [
      { stage: 'زائر', count: 909, color: 'bg-blue-500' },
      { stage: 'عضوية متجر', count: 34, color: 'bg-green-500' },
      { stage: 'أضاف للسلة', count: 10, color: 'bg-yellow-500' },
      { stage: 'إتم الشراء', count: 6, color: 'bg-purple-500' }
    ],
    salesEvolution: [
      { month: 'يناير', sales: 2500 },
      { month: 'فبراير', sales: 3200 },
      { month: 'مارس', sales: 2800 },
      { month: 'أبريل', sales: 3500 },
      { month: 'مايو', sales: 4200 },
      { month: 'يونيو', sales: 3800 }
    ],
    geographicData: {
      location: 'ليبيا / طرابلس',
      activeLocations: 0,
      totalSales: 0,
      totalOrders: 0,
      visits: 4,
      newVisitors: 0
    },
    topPages: [
      { page: 'الصفحة الرئيسية', visits: 450 },
      { page: 'صفحة المنتجات', visits: 320 },
      { page: 'صفحة التواصل', visits: 180 },
      { page: 'صفحة عن المتجر', visits: 95 }
    ]
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ElementType;
    color: string;
  }> = ({ title, value, subtitle, icon: Icon, color }) => (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CustomerJourneyCard: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          رحلة العميل
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          تصور لمراحل رحلة العملاء في متجرك
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {liveAnalyticsData.customerJourney.map((stage, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full ${stage.color}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{stage.stage}</span>
                  <span className="text-lg font-bold">{stage.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className={`h-2 rounded-full ${stage.color}`}
                    style={{ width: `${(stage.count / 909) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const SalesEvolutionCard: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          تطور المبيعات خلال الأشهر الماضية
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {liveAnalyticsData.salesEvolution.map((data, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="font-medium">{data.month}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(data.sales / 4200) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold w-16 text-right">
                  {data.sales.toLocaleString()} د.ل
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const GeographicCard: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          التحليلات الجغرافية وتوزيع الزوار
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Globe className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="font-semibold">الخريطة الجغرافية</p>
            <p className="text-sm text-muted-foreground">
              تركيز في {liveAnalyticsData.geographicData.location}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {liveAnalyticsData.geographicData.activeLocations}
              </p>
              <p className="text-sm text-muted-foreground">المواقع النشطة</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {liveAnalyticsData.geographicData.totalSales.toLocaleString()} د.ل
              </p>
              <p className="text-sm text-muted-foreground">إجمالي المبيعات</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {liveAnalyticsData.geographicData.totalOrders}
              </p>
              <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {liveAnalyticsData.geographicData.visits}
              </p>
              <p className="text-sm text-muted-foreground">زيارة</p>
            </div>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-2xl font-bold text-green-600">
              {liveAnalyticsData.geographicData.newVisitors}
            </p>
            <p className="text-sm text-muted-foreground">الزوار الجدد</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const TopPagesCard: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          الصفحات الأكثر زيارة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {liveAnalyticsData.topPages.map((page, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="font-medium">{page.page}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(page.visits / 450) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold w-12 text-right">
                  {page.visits}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  التحليلات
                </h1>
                <p className="text-sm text-muted-foreground">تحليلات حقيقية ومتحدثة للحظة الحالية</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <RefreshCw className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-r border-slate-200 dark:border-slate-700 transition-transform duration-300 ease-in-out lg:translate-x-0`}>
          <div className="flex flex-col h-full">
            <div className="p-6">
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? 'default' : 'ghost'}
                    className={`w-full justify-start h-12 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.label}</span>
                  </Button>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:ml-0">
          {activeTab === 'live-analytics' && (
            <div className="space-y-6">
              {/* Header with Date */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">التحليلات المباشرة</h2>
                  <p className="text-muted-foreground">
                    تحليلات حقيقية ومتحدثة للحظة الحالية
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-lg font-semibold">2025 سبتمبر 22 - يوم 24</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="العملاء"
                  value={liveAnalyticsData.customers.total}
                  subtitle="عملاء نشطون"
                  icon={Users}
                  color="bg-blue-500"
                />
                <StatCard
                  title="عدد الزيارات"
                  value={`${liveAnalyticsData.visits.total} زيارة`}
                  subtitle="إجمالي الزيارات"
                  icon={Eye}
                  color="bg-green-500"
                />
                <StatCard
                  title="عدد الطلبات"
                  value={`${liveAnalyticsData.visits.orders} طلب`}
                  subtitle="طلبات مكتملة"
                  icon={ShoppingCart}
                  color="bg-purple-500"
                />
                <StatCard
                  title="إجمالي المبيعات"
                  value={`${liveAnalyticsData.visits.sales.toLocaleString()} د.ل`}
                  subtitle="إجمالي الإيرادات"
                  icon={DollarSign}
                  color="bg-orange-500"
                />
              </div>

              {/* Customer Journey and Sales Evolution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CustomerJourneyCard />
                <SalesEvolutionCard />
              </div>

              {/* Geographic and Top Pages */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GeographicCard />
                <TopPagesCard />
              </div>
            </div>
          )}

          {activeTab === 'sales-reports' && <SalesReportsView />}

          {activeTab === 'inventory-reports' && <InventoryReportsView />}

          {activeTab === 'customer-reports' && <CustomerReportsView />}

          {activeTab === 'financial-analytics' && <FinancialAnalyticsView />}
        </main>
      </div>
    </div>
  );
};

export default MerchantAnalytics;
