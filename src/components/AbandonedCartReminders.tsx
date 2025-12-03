import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Bell,
  Clock,
  Mail,
  MessageCircle,
  Smartphone,
  Settings,
  Send,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface AbandonedCart {
  id: string;
  customerEmail: string;
  customerName: string;
  items: any[];
  totalValue: number;
  abandonedAt: string;
  lastReminder?: string;
  reminderCount: number;
  status: 'pending' | 'sent' | 'recovered' | 'expired';
}

interface ReminderTemplate {
  id: string;
  name: string;
  subject: string;
  message: string;
  delayHours: number;
}

const AbandonedCartReminders: React.FC = () => {
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>([
    {
      id: '1',
      customerEmail: 'customer1@example.com',
      customerName: 'أحمد محمد',
      items: [
        { name: 'منتج 1', price: 45.99, quantity: 2 },
        { name: 'منتج 2', price: 32.50, quantity: 1 }
      ],
      totalValue: 124.48,
      abandonedAt: '2025-01-15T10:30:00Z',
      reminderCount: 1,
      status: 'pending'
    },
    {
      id: '2',
      customerEmail: 'customer2@example.com',
      customerName: 'فاطمة علي',
      items: [
        { name: 'منتج 3', price: 89.99, quantity: 1 }
      ],
      totalValue: 89.99,
      abandonedAt: '2025-01-14T15:45:00Z',
      lastReminder: '2025-01-15T09:00:00Z',
      reminderCount: 2,
      status: 'sent'
    }
  ]);

  const [reminderTemplates, setReminderTemplates] = useState<ReminderTemplate[]>([
    {
      id: '1',
      name: 'تذكير أول (بعد 2 ساعات)',
      subject: 'لم تنسَ مشترياتك في سلة التسوق؟',
      message: 'عزيزي العميل، لاحظنا أن لديك منتجات في سلة التسوق لم تكمل شراءها. نحن نحتفظ بها لك لمدة 24 ساعة.',
      delayHours: 2
    },
    {
      id: '2',
      name: 'تذكير ثاني (بعد 24 ساعة)',
      subject: 'عرض خاص: خصم إضافي على سلة تسوقك',
      message: 'مرحباً! لم نراك منذ أمس. احصل على خصم 10% إضافي إذا أكملت طلبك الآن.',
      delayHours: 24
    },
    {
      id: '3',
      name: 'تذكير نهائي (بعد 72 ساعة)',
      subject: 'آخر فرصة: سلة تسوقك تنتهي قريباً',
      message: 'هذا آخر تذكير لك. سلة التسوق الخاصة بك ستنتهي خلال 24 ساعة.',
      delayHours: 72
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [autoRemindersEnabled, setAutoRemindersEnabled] = useState(true);
  const [reminderDelay, setReminderDelay] = useState(2);

  const handleSendReminder = (cartId: string, templateId: string) => {
    setAbandonedCarts(prev =>
      prev.map(cart =>
        cart.id === cartId
          ? {
              ...cart,
              status: 'sent' as const,
              lastReminder: new Date().toISOString(),
              reminderCount: cart.reminderCount + 1
            }
          : cart
      )
    );
  };

  const handleBulkSendReminders = () => {
    const pendingCarts = abandonedCarts.filter(cart => cart.status === 'pending');
    pendingCarts.forEach(cart => {
      if (selectedTemplate) {
        handleSendReminder(cart.id, selectedTemplate);
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">في انتظار</Badge>;
      case 'sent':
        return <Badge variant="default" className="bg-blue-600">تم الإرسال</Badge>;
      case 'recovered':
        return <Badge variant="default" className="bg-green-600">تم الاسترداد</Badge>;
      case 'expired':
        return <Badge variant="destructive">منتهي الصلاحية</Badge>;
      default:
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };

  const getTimeSinceAbandoned = (abandonedAt: string) => {
    const now = new Date();
    const abandoned = new Date(abandonedAt);
    const diffHours = Math.floor((now.getTime() - abandoned.getTime()) / (1000 * 60 * 60));
    return `${diffHours} ساعة`;
  };

  const pendingCount = abandonedCarts.filter(cart => cart.status === 'pending').length;
  const recoveredCount = abandonedCarts.filter(cart => cart.status === 'recovered').length;
  const totalValue = abandonedCarts.reduce((sum, cart) => sum + cart.totalValue, 0);

  return (
    <div className="space-y-6">
      {/* رأس الصفحة مع الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-sm text-gray-600">سلات متروكة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{recoveredCount}</p>
                <p className="text-sm text-gray-600">تم استردادها</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Mail className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {abandonedCarts.reduce((sum, cart) => sum + cart.reminderCount, 0)}
                </p>
                <p className="text-sm text-gray-600">تذكيرات مرسلة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{totalValue.toFixed(0)}</p>
                <p className="text-sm text-gray-600">قيمة محتملة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* إعدادات التذكيرات التلقائية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            إعدادات التذكيرات التلقائية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-reminders">تفعيل التذكيرات التلقائية</Label>
              <p className="text-sm text-gray-600">
                إرسال تذكيرات تلقائية للسلات المتروكة
              </p>
            </div>
            <label htmlFor="auto-reminders" className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                id="auto-reminders"
                checked={autoRemindersEnabled}
                onChange={(e) => setAutoRemindersEnabled(e.target.checked)}
                className="rounded"
              />
              <span>تفعيل التذكيرات التلقائية</span>
            </label>
          </div>

          {autoRemindersEnabled && (
            <div>
              <Label htmlFor="reminder-delay">تأخير التذكير الأول (ساعات)</Label>
              <Select value={reminderDelay.toString()} onValueChange={(value) => setReminderDelay(Number(value))}>
                <SelectTrigger className="w-full" title="تأخير التذكير الأول" aria-label="تأخير التذكير الأول">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">ساعة واحدة</SelectItem>
                  <SelectItem value="2">ساعتان</SelectItem>
                  <SelectItem value="4">4 ساعات</SelectItem>
                  <SelectItem value="6">6 ساعات</SelectItem>
                  <SelectItem value="12">12 ساعة</SelectItem>
                  <SelectItem value="24">24 ساعة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* قوالب التذكيرات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            قوالب التذكيرات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reminderTemplates.map(template => (
              <div key={template.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-sm text-gray-600">تأخير: {template.delayHours} ساعة</p>
                  </div>
                  <Badge variant="outline">{template.delayHours} ساعة</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">الموضوع: {template.subject}</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    {template.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* إرسال تذكيرات جماعية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            إرسال تذكيرات جماعية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>اختر قالب التذكير</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger title="اختر قالب التذكير" aria-label="اختر قالب التذكير">
                  <SelectValue placeholder="اختر قالب..." />
                </SelectTrigger>
                <SelectContent>
                  {reminderTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                سيتم إرسال التذكير لـ {pendingCount} سلة متروكة
              </p>
              <Button
                type="button"
                onClick={handleBulkSendReminders}
                disabled={!selectedTemplate || pendingCount === 0}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                إرسال التذكيرات
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* قائمة السلات المتروكة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            السلات المتروكة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {abandonedCarts.map(cart => (
              <div key={cart.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{cart.customerName}</h4>
                    <p className="text-sm text-gray-600">{cart.customerEmail}</p>
                    <div className="flex items-center gap-4 mt-2">
                      {getStatusBadge(cart.status)}
                      <span className="text-sm text-gray-600">
                        متروك منذ: {getTimeSinceAbandoned(cart.abandonedAt)}
                      </span>
                      <span className="text-sm text-gray-600">
                        تذكيرات: {cart.reminderCount}
                      </span>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold">{cart.totalValue.toFixed(2)} ريال</p>
                    <p className="text-sm text-gray-600">{cart.items.length} منتج</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleSendReminder(cart.id, '1')}
                    disabled={cart.status !== 'pending'}
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    إرسال تذكير
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    واتساب
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Smartphone className="h-4 w-4" />
                    SMS
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AbandonedCartReminders;
