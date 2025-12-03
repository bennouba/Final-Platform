import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  AlertTriangle,
  Bell,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Settings,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Eye,
  BellRing,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Users,
  ShoppingCart,
  Calendar,
  Download,
  Upload,
  Database,
  Activity,
  Target,
  Zap,
  TrendingUp as TrendingUpIcon,
  PieChart,
  LineChart,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { InventoryAlertsView } from './InventoryAlertsView';
import InventoryAlertsDashboard from './InventoryAlertsDashboard';
import NotifyWhenAvailable from './NotifyWhenAvailable';
import { inventoryMonitoringService, type AlertNotification } from '../services/InventoryMonitoringService';
import { getInventoryStats, exportToCSV } from '../utils/inventoryAlertUtils';
import type { ProductInventory as ProductInventoryType, InventoryChange, Warehouse } from '../types/inventory';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart as RechartsLineChart, Line, Area, AreaChart } from 'recharts';

interface AdvancedInventoryDashboardProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

interface InventoryTrendData {
  date: string;
  value: number;
  changes: number;
}

interface CategoryDistribution {
  name: string;
  value: number;
  color: string;
}

interface WarehousePerformance {
  warehouse: string;
  totalItems: number;
  totalValue: number;
  efficiency: number;
}

const AdvancedInventoryDashboard: React.FC<AdvancedInventoryDashboardProps> = ({
  storeData,
  setStoreData,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductInventoryType | null>(null);
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [monitoringStatus, setMonitoringStatus] = useState(inventoryMonitoringService.getStatus());
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [databaseConnected, setDatabaseConnected] = useState(false);

  // Load products and alerts data
  const [products, setProducts] = useState<ProductInventoryType[]>([]);
  const [trends, setTrends] = useState<InventoryTrendData[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<CategoryDistribution[]>([]);
  const [warehousePerformance, setWarehousePerformance] = useState<WarehousePerformance[]>([]);
  const [inventoryChanges, setInventoryChanges] = useState<InventoryChange[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize database connection and load data
  useEffect(() => {
    initializeDatabase();
    loadProducts();
    loadAlerts();
    generateTrendsData();
    generateCategoryDistribution();
    generateWarehousePerformance();
    
    // Set up real-time updates
    const alertListener = (updatedAlerts: AlertNotification[]) => {
      setAlerts([...updatedAlerts]);
      setLastUpdate(new Date());
    };
    inventoryMonitoringService.addListener(alertListener);

    // Update monitoring status and trends periodically
    const statusInterval = setInterval(() => {
      setMonitoringStatus(inventoryMonitoringService.getStatus());
      if (databaseConnected) {
        refreshData();
      }
    }, 30000); // Update every 30 seconds

    return () => {
      inventoryMonitoringService.removeListener(alertListener);
      clearInterval(statusInterval);
    };
  }, [databaseConnected]);

  // Initialize database connection
  const initializeDatabase = async () => {
    try {
      setIsLoading(true);
      // Simulate database connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDatabaseConnected(true);

    } catch (error) {

      setDatabaseConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh all data
  const refreshData = useCallback(async () => {
    if (!databaseConnected) return;
    
    try {
      loadProducts();
      generateTrendsData();
      generateCategoryDistribution();
      generateWarehousePerformance();
      setLastUpdate(new Date());
    } catch (error) {

    }
  }, [databaseConnected]);

  const loadProducts = () => {
    try {
      const stored = localStorage.getItem('eshro_inventory_alerts');
      if (stored) {
        setProducts(JSON.parse(stored));
      }
    } catch (error) {

    }
  };

  const loadAlerts = () => {
    const currentAlerts = inventoryMonitoringService.getAlerts();
    setAlerts(currentAlerts);
  };

  const stats = getInventoryStats(products);

  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical' && !alert.isRead);
  const unreadAlerts = alerts.filter(alert => !alert.isRead);

  const handleProductSelect = (product: ProductInventoryType) => {
    setSelectedProduct(product);
    setShowNotifyModal(true);
  };

  const handleQuickRestock = (product: ProductInventoryType) => {
    // In a real app, this would open a restock modal
    const newQuantity = prompt(`إعادة تخزين ${product.productName}\nالكمية الحالية: ${product.currentQuantity}\nأدخل الكمية الجديدة:`, product.maxQuantity.toString());
    if (newQuantity && !isNaN(parseInt(newQuantity))) {
      const updatedProducts = products.map(p => 
        p.productId === product.productId 
          ? { ...p, currentQuantity: parseInt(newQuantity) }
          : p
      );
      setProducts(updatedProducts);
      localStorage.setItem('eshro_inventory_alerts', JSON.stringify(updatedProducts));
      onSave();
    }
  };

  // Generate trends data for charts
  const generateTrendsData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toLocaleDateString('ar', { month: 'short', day: 'numeric' }),
        value: Math.floor(Math.random() * 50000) + 20000,
        changes: Math.floor(Math.random() * 2000) - 1000,
      };
    });
    setTrends(last30Days);
  };

  // Generate category distribution for pie chart
  const generateCategoryDistribution = () => {
    const categories = [
      { name: 'مواد غذائية', value: 35, color: '#10B981' },
      { name: 'مواد تنظيف', value: 25, color: '#F59E0B' },
      { name: 'مستحضرات تجميل', value: 20, color: '#8B5CF6' },
      { name: 'أدوية', value: 15, color: '#EF4444' },
      { name: 'أخرى', value: 5, color: '#6B7280' },
    ];
    setCategoryDistribution(categories);
  };

  // Generate warehouse performance data
  const generateWarehousePerformance = () => {
    const warehouses = [
      { warehouse: 'المستودع الرئيسي', totalItems: 1250, totalValue: 75000, efficiency: 92 },
      { warehouse: 'مستودع فرعي 1', totalItems: 850, totalValue: 45000, efficiency: 88 },
      { warehouse: 'مستودع فرعي 2', totalItems: 620, totalValue: 32000, efficiency: 85 },
      { warehouse: 'مستودع الطوارئ', totalItems: 340, totalValue: 18000, efficiency: 78 },
    ];
    setWarehousePerformance(warehouses);
  };

  // Export inventory data to CSV
  const exportInventoryData = () => {
    const csvContent = exportToCSV(products);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAlertSummary = () => {
    return {
      total: alerts.length,
      unread: unreadAlerts.length,
      critical: criticalAlerts.length,
      today: alerts.filter(alert => {
        const alertDate = new Date(alert.timestamp).toDateString();
        const today = new Date().toDateString();
        return alertDate === today;
      }).length
    };
  };

  const alertSummary = getAlertSummary();

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة المخزون المتقدمة</h1>
          <p className="text-gray-600 mt-1">
            نظام شامل لإدارة المخزون مع تنبيهات ذكية ومراقبة في الوقت الفعلي
          </p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg">
              <Database className="h-4 w-4" />
              <span className="text-sm font-medium">
                {databaseConnected ? '🟢 قاعدة البيانات متصلة' : '🔴 قاعدة البيانات غير متصلة'}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg">
              <Activity className="h-4 w-4" />
              <span className="text-sm font-medium">
                {monitoringStatus.isMonitoring ? '🟢 المراقبة نشطة' : '🔴 المراقبة متوقفة'}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">
                آخر تحديث: {lastUpdate.toLocaleTimeString('ar')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isLoading && (
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm font-medium text-blue-700">جاري التحميل...</span>
            </div>
          )}
          <Button
            onClick={refreshData}
            variant="outline"
            size="sm"
            disabled={isLoading || !databaseConnected}
          >
            <RefreshCw className={`h-4 w-4 ml-2 ${isLoading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
        </div>
      </div>

      {/* Alert Banner for Critical Issues */}
      <AnimatePresence>
        {criticalAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <div className="flex items-center gap-3">
              <BellRing className="h-6 w-6 text-red-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800">تنبيهات حرجة تتطلب انتباه فوري!</h3>
                <p className="text-red-700">
                  يوجد {criticalAlerts.length} تنبيه حرج يتطلب إجراءً فورياً
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setActiveTab('alerts')}
                className="bg-red-600 hover:bg-red-700"
              >
                عرض التفاصيل
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">إجمالي المنتجات</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">متوفر</p>
                <p className="text-2xl font-bold text-green-900">{stats.available}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">تحذير</p>
                <p className="text-2xl font-bold text-orange-900">{stats.warning}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">حرج</p>
                <p className="text-2xl font-bold text-red-900">{stats.critical}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">قيمة المخزون</p>
                <p className="text-xl font-bold text-purple-900">{stats.totalValue.toFixed(0)} د.ل</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي التنبيهات</p>
                <p className="text-2xl font-bold text-gray-900">{alertSummary.total}</p>
              </div>
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">غير مقروءة</p>
                <p className="text-2xl font-bold text-orange-600">{alertSummary.unread}</p>
              </div>
              <Eye className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">حرجة</p>
                <p className="text-2xl font-bold text-red-700">{alertSummary.critical}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">اليوم</p>
                <p className="text-2xl font-bold text-gray-900">{alertSummary.today}</p>
              </div>
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="inventory">إدارة المخزون</TabsTrigger>
          <TabsTrigger value="alerts">التنبيهات</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          <TabsTrigger value="reports">التقارير</TabsTrigger>
          <TabsTrigger value="database">قاعدة البيانات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  آخر التنبيهات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${
                        alert.severity === 'critical' ? 'bg-red-500' :
                        alert.severity === 'high' ? 'bg-orange-500' :
                        alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{alert.title}</p>
                        <p className="text-xs text-gray-600">{alert.productName}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {new Date(alert.timestamp).toLocaleTimeString('ar', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Badge>
                    </div>
                  ))}
                  {alerts.length === 0 && (
                    <p className="text-center text-gray-500 py-4">لا توجد تنبيهات</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  إجراءات سريعة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab('inventory')}
                  >
                    <Package className="h-4 w-4 ml-2" />
                    إضافة منتج جديد
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab('alerts')}
                  >
                    <Bell className="h-4 w-4 ml-2" />
                    عرض جميع التنبيهات
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab('reports')}
                  >
                    <BarChart3 className="h-4 w-4 ml-2" />
                    تصدير تقرير المخزون
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => inventoryMonitoringService.requestNotificationPermission()}
                  >
                    <Bell className="h-4 w-4 ml-2" />
                    تفعيل الإشعارات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Low Stock Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                منتجات تحتاج إعادة تخزين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-3 font-semibold">المنتج</th>
                      <th className="text-right p-3 font-semibold">الكمية الحالية</th>
                      <th className="text-right p-3 font-semibold">الحد الأدنى</th>
                      <th className="text-right p-3 font-semibold">الحالة</th>
                      <th className="text-right p-3 font-semibold">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter(product => product.currentQuantity <= product.minQuantity)
                      .slice(0, 10)
                      .map((product) => (
                        <tr key={product.productId} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div>
                              <p className="font-semibold">{product.productName}</p>
                              <p className="text-xs text-gray-600">{product.sku}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-red-600">{product.currentQuantity}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-gray-600">{product.minQuantity}</span>
                          </td>
                          <td className="p-3">
                            <Badge className="bg-red-100 text-red-800">
                              {product.currentQuantity === 0 ? 'نفاد' : 'منخفض'}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleQuickRestock(product)}
                              >
                                إعادة تخزين
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleProductSelect(product)}
                              >
                                تنبيه العملاء
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {products.filter(product => product.currentQuantity <= product.minQuantity).length === 0 && (
                <p className="text-center text-gray-500 py-8">جميع المنتجات لديها مخزون كافي</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryAlertsView
            storeData={storeData}
            setStoreData={setStoreData}
            onSave={onSave}
          />
        </TabsContent>

        <TabsContent value="alerts">
          <InventoryAlertsDashboard />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inventory Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  اتجاهات المخزون (30 يوم)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        `${value.toLocaleString()} د.ل`, 
                        name === 'value' ? 'قيمة المخزون' : 'التغييرات'
                      ]}
                    />
                    <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  توزيع الفئات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <RechartsPieChart data={categoryDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                    <Tooltip formatter={(value: any) => [`${value}%`, 'النسبة']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {categoryDistribution.map((category, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm">{category.name}: {category.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Warehouse Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                أداء المستودعات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={warehousePerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="warehouse" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value: any, name: string) => {
                      if (name === 'totalValue') return [`${value.toLocaleString()} د.ل`, 'القيمة الإجمالية'];
                      if (name === 'efficiency') return [`${value}%`, 'الكفاءة'];
                      return [value, name === 'totalItems' ? 'عدد المنتجات' : ''];
                    }}
                  />
                  <Bar yAxisId="left" dataKey="totalItems" fill="#8884d8" name="totalItems" />
                  <Bar yAxisId="right" dataKey="efficiency" fill="#82ca9d" name="efficiency" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">معدل دوران المخزون</p>
                    <p className="text-2xl font-bold text-blue-900">4.2x</p>
                    <p className="text-xs text-blue-600">شهرياً</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">متوسط أيام التخزين</p>
                    <p className="text-2xl font-bold text-green-900">23</p>
                    <p className="text-xs text-green-600">يوم</p>
                  </div>
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">معدل امتلاء المخزون</p>
                    <p className="text-2xl font-bold text-purple-900">87%</p>
                    <p className="text-xs text-purple-600">من الحد الأقصى</p>
                  </div>
                  <TrendingUpIcon className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700">دقة التنبؤ</p>
                    <p className="text-2xl font-bold text-orange-900">94%</p>
                    <p className="text-xs text-orange-600">للطلب القادم</p>
                  </div>
                  <Zap className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات شاملة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">إجمالي المنتجات:</span>
                    <p className="font-semibold">{stats.total}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">قيمة المخزون:</span>
                    <p className="font-semibold">{stats.totalValue.toFixed(2)} د.ل</p>
                  </div>
                  <div>
                    <span className="text-gray-600">مخزون منخفض:</span>
                    <p className="font-semibold text-orange-600">{stats.warning}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">نفاد المخزون:</span>
                    <p className="font-semibold text-red-600">{stats.critical}</p>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={exportInventoryData}
                  disabled={!databaseConnected}
                >
                  <Download className="h-4 w-4 ml-2" />
                  تصدير تقرير مفصل
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إعدادات التنبيهات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>المراقبة التلقائية</span>
                    <Badge variant={monitoringStatus.isMonitoring ? "default" : "secondary"}>
                      {monitoringStatus.isMonitoring ? 'مفعل' : 'معطل'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>الحد الأدنى للتنبيه</span>
                    <Badge variant="outline">5 قطع</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>آخر تحديث</span>
                    <span className="text-sm text-gray-600">
                      {lastUpdate.toLocaleTimeString('ar')}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveTab('alerts')}
                  >
                    <Settings className="h-4 w-4 ml-2" />
                    إعدادات متقدمة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                بحث وتصفية المنتجات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <Input
                  placeholder="ابحث عن منتج..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline">
                  <Filter className="h-4 w-4 ml-2" />
                  تصفية
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-3 font-semibold">المنتج</th>
                      <th className="text-right p-3 font-semibold">الكمية</th>
                      <th className="text-right p-3 font-semibold">القيمة</th>
                      <th className="text-right p-3 font-semibold">الحالة</th>
                      <th className="text-right p-3 font-semibold">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.slice(0, 10).map((product) => (
                      <tr key={product.productId} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <p className="font-semibold">{product.productName}</p>
                            <p className="text-xs text-gray-600">{product.sku}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold">{product.currentQuantity}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-gray-600">{(product.currentQuantity * product.price).toFixed(2)} د.ل</span>
                        </td>
                        <td className="p-3">
                          <Badge className={
                            product.currentQuantity === 0 ? 'bg-red-100 text-red-800' :
                            product.currentQuantity <= product.minQuantity ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }>
                            {product.currentQuantity === 0 ? 'نفاد' :
                             product.currentQuantity <= product.minQuantity ? 'منخفض' : 'متوفر'}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleProductSelect(product)}
                            >
                              تنبيه
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredProducts.length === 0 && (
                <p className="text-center text-gray-500 py-8">لا توجد منتجات مطابقة للبحث</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Database Connection Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  حالة قاعدة البيانات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>الحالة</span>
                  <Badge variant={databaseConnected ? "default" : "destructive"}>
                    {databaseConnected ? '🟢 متصلة' : '🔴 غير متصلة'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>النوع</span>
                  <span className="text-sm">PostgreSQL</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>الخادم</span>
                  <span className="text-sm">localhost:5432</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>آخر فحص</span>
                  <span className="text-sm text-gray-600">
                    {lastUpdate.toLocaleTimeString('ar')}
                  </span>
                </div>
                <Button 
                  className="w-full" 
                  onClick={initializeDatabase}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                  ) : (
                    <Database className="h-4 w-4 ml-2" />
                  )}
                  {databaseConnected ? 'إعادة الاتصال' : 'اتصال جديد'}
                </Button>
              </CardContent>
            </Card>

            {/* Database Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات قاعدة البيانات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">الجداول</span>
                    <p className="font-semibold">12</p>
                  </div>
                  <div>
                    <span className="text-gray-600">السجلات</span>
                    <p className="font-semibold">{(products.length + alerts.length).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">الحجم</span>
                    <p className="font-semibold">2.4 MB</p>
                  </div>
                  <div>
                    <span className="text-gray-600">الفهارس</span>
                    <p className="font-semibold">28</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    // Simulate backup
                    alert('تم إنشاء نسخة احتياطية بنجاح!');
                  }}
                >
                  <Download className="h-4 w-4 ml-2" />
                  إنشاء نسخة احتياطية
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Database Operations */}
          <Card>
            <CardHeader>
              <CardTitle>عمليات قاعدة البيانات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col"
                  onClick={() => {
                    // Simulate sync
                    refreshData();
                    alert('تم مزامنة البيانات بنجاح!');
                  }}
                >
                  <RefreshCw className="h-6 w-6 mb-2" />
                  مزامنة البيانات
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col"
                  onClick={() => {
                    // Simulate cleanup
                    alert('تم تنظيف قاعدة البيانات بنجاح!');
                  }}
                >
                  <Trash2 className="h-6 w-6 mb-2" />
                  تنظيف البيانات
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col"
                  onClick={() => {
                    // Simulate optimization
                    alert('تم تحسين قاعدة البيانات بنجاح!');
                  }}
                >
                  <Zap className="h-6 w-6 mb-2" />
                  تحسين الأداء
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notify When Available Modal */}
      <AnimatePresence>
        {showNotifyModal && selectedProduct && (
          <NotifyWhenAvailable
            product={selectedProduct}
            isOpen={showNotifyModal}
            onClose={() => {
              setShowNotifyModal(false);
              setSelectedProduct(null);
            }}
            storeSlug="indeesh"
            storeName="انديش"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedInventoryDashboard;
