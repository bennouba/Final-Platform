import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  Bell,
  BellOff,
  X,
  Package,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Filter,
  Search,
  RefreshCw,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Play,
  Pause,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { inventoryMonitoringService, type AlertNotification, type MonitoringConfig } from '../services/InventoryMonitoringService';

const InventoryAlertsDashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [config, setConfig] = useState<MonitoringConfig>(inventoryMonitoringService.getConfig());
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [newRecipients, setNewRecipients] = useState('');

  useEffect(() => {
    // Load initial alerts
    setAlerts(inventoryMonitoringService.getAlerts());
    
    // Add listener for real-time updates
    inventoryMonitoringService.addListener((updatedAlerts) => {
      setAlerts([...updatedAlerts]);
    });

    // Request notification permission
    inventoryMonitoringService.requestNotificationPermission();

    return () => {
      inventoryMonitoringService.removeListener(() => {});
    };
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    
    return matchesSearch && matchesSeverity;
  });

  const unreadAlerts = alerts.filter(alert => !alert.isRead);
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical' && !alert.isRead);

  const getSeverityIcon = (severity: AlertNotification['severity']) => {
    switch (severity) {
      case 'low':
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSeverityBadge = (severity: AlertNotification['severity']) => {
    const config = {
      low: { label: 'منخفض', color: 'bg-blue-100 text-blue-800' },
      medium: { label: 'متوسط', color: 'bg-yellow-100 text-yellow-800' },
      high: { label: 'عالي', color: 'bg-orange-100 text-orange-800' },
      critical: { label: 'حرج', color: 'bg-red-100 text-red-800' },
    };

    const severityConfig = config[severity];
    return <Badge className={severityConfig.color}>{severityConfig.label}</Badge>;
  };

  const handleMarkAsRead = (alertId: string) => {
    inventoryMonitoringService.markAlertAsRead(alertId);
  };

  const handleDismissAlert = (alertId: string) => {
    inventoryMonitoringService.dismissAlert(alertId);
  };

  const handleUpdateConfig = (updates: Partial<MonitoringConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    inventoryMonitoringService.updateConfig(updates);
  };

  const handleAddRecipient = () => {
    if (newRecipients.trim()) {
      const recipients = newRecipients.split(',').map(email => email.trim());
      const updatedRecipients = [...config.notificationRecipients, ...recipients];
      handleUpdateConfig({ notificationRecipients: updatedRecipients });
      setNewRecipients('');
    }
  };

  const handleRemoveRecipient = (recipient: string) => {
    const updatedRecipients = config.notificationRecipients.filter(r => r !== recipient);
    handleUpdateConfig({ notificationRecipients: updatedRecipients });
  };

  const handleExportAlerts = () => {
    const csvContent = [
      ['التاريخ', 'العنوان', 'الرسالة', 'المنتج', 'الكمية', 'الحد الأدنى', 'الخطورة', 'المخزن', 'تم القراءة'].join(','),
      ...alerts.map(alert => [
        new Date(alert.timestamp).toLocaleDateString('ar'),
        alert.title,
        alert.message,
        alert.productName,
        alert.currentQuantity,
        alert.threshold,
        alert.severity,
        alert.warehouse,
        alert.isRead ? 'نعم' : 'لا'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_alerts_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">لوحة التنبيهات الذكية</h2>
          <p className="text-gray-600 mt-1">مراقبة وتنبيهات المخزون في الوقت الفعلي</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="outline"
          >
            <Settings className="h-4 w-4 ml-2" />
            الإعدادات
          </Button>
          <Button
            onClick={handleExportAlerts}
            variant="outline"
          >
            <Download className="h-4 w-4 ml-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي التنبيهات</p>
                <p className="text-3xl font-bold text-gray-900">{alerts.length}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">غير مقروءة</p>
                <p className="text-3xl font-bold text-orange-600">{unreadAlerts.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">حرجة</p>
                <p className="text-3xl font-bold text-red-700">{criticalAlerts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الحالة</p>
                <p className={`text-lg font-bold ${inventoryMonitoringService.getStatus().isMonitoring ? 'text-green-600' : 'text-red-600'}`}>
                  {inventoryMonitoringService.getStatus().isMonitoring ? 'نشط' : 'متوقف'}
                </p>
              </div>
              {inventoryMonitoringService.getStatus().isMonitoring ? (
                <Play className="h-8 w-8 text-green-600" />
              ) : (
                <Pause className="h-8 w-8 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card>
              <CardHeader>
                <CardTitle>إعدادات المراقبة والتنبيهات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>تفعيل المراقبة التلقائية</Label>
                      <Switch
                        checked={config.enabled}
                        onCheckedChange={(checked) => handleUpdateConfig({ enabled: checked })}
                      />
                    </div>

                    <div>
                      <Label>فترة الفحص (بالدقائق)</Label>
                      <Input
                        type="number"
                        value={config.checkInterval}
                        onChange={(e) => handleUpdateConfig({ checkInterval: parseInt(e.target.value) || 30 })}
                        min="5"
                        max="1440"
                      />
                    </div>

                    <div>
                      <Label>عتبة التنبيه المنخفض</Label>
                      <Input
                        type="number"
                        value={config.lowStockThreshold}
                        onChange={(e) => handleUpdateConfig({ lowStockThreshold: parseInt(e.target.value) || 5 })}
                        min="1"
                        max="100"
                      />
                    </div>

                    <div>
                      <Label>تحذير انتهاء الصلاحية (بالأيام)</Label>
                      <Input
                        type="number"
                        value={config.expiryWarningDays}
                        onChange={(e) => handleUpdateConfig({ expiryWarningDays: parseInt(e.target.value) || 30 })}
                        min="1"
                        max="365"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label>طرق الإشعار</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Push Notifications</Label>
                          <Switch
                            checked={config.enablePushNotifications}
                            onCheckedChange={(checked) => handleUpdateConfig({ enablePushNotifications: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Email Notifications</Label>
                          <Switch
                            checked={config.enableEmailNotifications}
                            onCheckedChange={(checked) => handleUpdateConfig({ enableEmailNotifications: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>SMS Notifications</Label>
                          <Switch
                            checked={config.enableSmsNotifications}
                            onCheckedChange={(checked) => handleUpdateConfig({ enableSmsNotifications: checked })}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>مستلمو الإشعارات</Label>
                      <div className="space-y-2">
                        {config.notificationRecipients.map((recipient, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{recipient}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveRecipient(recipient)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Input
                            placeholder="email@example.com"
                            value={newRecipients}
                            onChange={(e) => setNewRecipients(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddRecipient()}
                          />
                          <Button size="sm" onClick={handleAddRecipient}>إضافة</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في التنبيهات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="مستوى الخطورة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المستويات</SelectItem>
                <SelectItem value="low">منخفض</SelectItem>
                <SelectItem value="medium">متوسط</SelectItem>
                <SelectItem value="high">عالي</SelectItem>
                <SelectItem value="critical">حرج</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>التنبيهات النشطة</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <p className="text-gray-600">لا توجد تنبيهات تطابق معايير البحث</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 border rounded-lg ${alert.isRead ? 'bg-gray-50' : 'bg-white'} ${alert.severity === 'critical' ? 'border-red-200 bg-red-50' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getSeverityIcon(alert.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                          {getSeverityBadge(alert.severity)}
                          {!alert.isRead && (
                            <Badge className="bg-blue-100 text-blue-800">جديد</Badge>
                          )}
                        </div>
                        <p className="text-gray-700 mb-2">{alert.message}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>المنتج: {alert.productName}</span>
                          <span>الكمية: {alert.currentQuantity}</span>
                          <span>المخزن: {alert.warehouse}</span>
                          <span>{new Date(alert.timestamp).toLocaleString('ar')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!alert.isRead && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsRead(alert.id)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDismissAlert(alert.id)}
                        className="text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryAlertsDashboard;
