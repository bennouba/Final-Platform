import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Wallet,
  CreditCard,
  Receipt,
  Settings,
  Download,
  RefreshCw,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Bell,
  LogOut,
  Moon,
  Sun,
  Plus,
  Minus,
  Check,
  X as XIcon,
  Calendar,
  DollarSign,
  PiggyBank,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Smartphone,
  Building,
  Globe,
  Filter
} from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
  current?: boolean;
}

interface WalletData {
  totalBalance: number;
  availableBalance: number;
  pendingBalance: number;
  transactions: {
    id: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: string;
    status: 'completed' | 'pending';
    method: string;
  }[];
  paymentMethods: {
    name: string;
    transactions: number;
    amount: number;
    status: 'active' | 'inactive';
  }[];
}

const MerchantFinance: React.FC = () => {
  const [activeTab, setActiveTab] = useState('subscription');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showPlans, setShowPlans] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'bank'>('card');

  const navigationItems = [
    { id: 'subscription', label: 'إدارة الاشتراك', icon: Settings },
    { id: 'wallet', label: 'المحفظة', icon: Wallet }
  ];

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'light',
      name: 'إشرو لايت',
      price: 400,
      period: 'monthly',
      features: [
        'متجر إلكتروني كامل',
        'حتى 100 منتج',
        'واجهات متجر قابلة للتخصيص',
        'خيارات دفع أساسية',
        'دعم فني أساسي'
      ]
    },
    {
      id: 'growth',
      name: 'النمو',
      price: 700,
      period: 'monthly',
      features: [
        'جميع مميزات إشرو لايت',
        'منتجات غير محدودة',
        'تكامل مع شركات الشحن',
        'تحليلات متقدمة',
        'دعم فني متقدم',
        'تطبيق الجوال'
      ],
      popular: true,
      current: true
    },
    {
      id: 'professional',
      name: 'الإحترافية',
      price: 1200,
      period: 'monthly',
      features: [
        'جميع مميزات النمو',
        'متاجر متعددة',
        'API متقدم',
        'تخصيص كامل',
        'تقارير مخصصة',
        'مدير حساب مخصص'
      ]
    },
    {
      id: 'enterprise',
      name: 'الأعمال',
      price: 0,
      period: 'monthly',
      features: [
        'جميع مميزات الإحترافية',
        'حلول مؤسسية',
        'تكامل مخصص',
        'دعم على مدار 24/7',
        'تدريب شخصي',
        'استشارات تقنية'
      ]
    }
  ];

  const walletData: WalletData = {
    totalBalance: 45750.50,
    availableBalance: 42300.25,
    pendingBalance: 3450.25,
    transactions: [
      {
        id: '1',
        type: 'credit',
        amount: 1200,
        description: 'دفعة من طلب #1234',
        date: '2024-12-15',
        status: 'completed',
        method: 'تحويل بنكي'
      },
      {
        id: '2',
        type: 'debit',
        amount: 45.50,
        description: 'رسوم الشحن - أرامكس',
        date: '2024-12-15',
        status: 'completed',
        method: 'محفظة'
      },
      {
        id: '3',
        type: 'credit',
        amount: 850.25,
        description: 'دفعة من طلب #1235',
        date: '2024-12-14',
        status: 'pending',
        method: 'سداد'
      },
      {
        id: '4',
        type: 'debit',
        amount: 142.50,
        description: 'عمولة منصة إشرو',
        date: '2024-12-14',
        status: 'completed',
        method: 'محفظة'
      },
      {
        id: '5',
        type: 'credit',
        amount: 2150,
        description: 'دفعة من طلب #1236',
        date: '2024-12-13',
        status: 'completed',
        method: 'موبي كاش'
      }
    ],
    paymentMethods: [
      {
        name: 'سداد',
        transactions: 142,
        amount: 18500.50,
        status: 'active'
      },
      {
        name: 'موبي كاش',
        transactions: 89,
        amount: 12750.25,
        status: 'active'
      },
      {
        name: 'ادفعلي',
        transactions: 67,
        amount: 9890.75,
        status: 'active'
      },
      {
        name: 'تحويل بنكي',
        transactions: 201,
        amount: 28650,
        status: 'active'
      }
    ]
  };

  const SubscriptionManagement: React.FC = () => (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            إدارة الاشتراك
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            إدارة اشتراكك والباقات والإشعارات
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Subscription Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="font-semibold">تاريخ الاشتراك</p>
              <p className="text-lg">20/01/2024</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Calendar className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="font-semibold">تاريخ الانتهاء</p>
              <p className="text-lg">17/01/2025</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-semibold">الباقة الحالية</span>
              </div>
              <p className="text-lg font-bold text-green-600">النمو</p>
              <p className="text-sm text-muted-foreground">نشط</p>
            </div>
          </div>

          {/* Days Remaining */}
          <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">متبقي</p>
            <p className="text-3xl font-bold text-orange-600">45 يوم</p>
          </div>

          {/* Notifications */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Bell className="h-4 w-4" />
              إشعارات / تنبيهات
            </h4>
            <p className="text-sm text-muted-foreground">
              تنبيهات بإعادة التجديد أو اختيار الباقة المناسبة لمتابعة العمل عبر منصة إشرو
            </p>

            <div className="space-y-3">
              {[
                { method: 'واتساب', active: true },
                { method: 'رسالة SMS', active: false },
                { method: 'البريد الإلكتروني', active: true }
              ].map((notification, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{notification.method}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {notification.active ? 'مفعل' : 'غير مفعل'}
                    </span>
                    <Button
                      size="sm"
                      variant={notification.active ? 'default' : 'outline'}
                    >
                      {notification.active ? 'إلغاء تفعيل' : 'تفعيل'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade Section */}
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h4 className="font-semibold mb-2">هل تريد ترقية باقتك؟</h4>
            <p className="text-sm text-muted-foreground mb-4">
              استكشف باقاتنا المختلفة واختر الباقة التي تناسب احتياجات متجرك وتساعدك على النمو والتطور
            </p>
            <Button onClick={() => setShowPlans(true)}>
              عرض الباقات
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const WalletManagement: React.FC = () => (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            المحفظة الرقمية
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            إدارة الأموال والمعاملات المالية
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <PiggyBank className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="font-semibold">إجمالي الرصيد</p>
              <p className="text-2xl font-bold text-green-600">
                {walletData.totalBalance.toLocaleString()} د.ل
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="font-semibold">المبلغ المتاح</p>
              <p className="text-2xl font-bold text-blue-600">
                {walletData.availableBalance.toLocaleString()} د.ل
              </p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="font-semibold">قيد الانتظار</p>
              <p className="text-2xl font-bold text-orange-600">
                {walletData.pendingBalance.toLocaleString()} د.ل
              </p>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button onClick={() => setShowAddMoney(true)}>
              <Plus className="h-4 w-4 mr-2" />
              إضافة أموال
            </Button>
            <Button variant="outline">
              <Minus className="h-4 w-4 mr-2" />
              سحب أموال
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>طرق الدفع المربوطة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {walletData.paymentMethods.map((method, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${method.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <div>
                    <h4 className="font-medium">{method.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {method.transactions} معاملة هذا الشهر
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-bold">{method.amount.toLocaleString()} د.ل</p>
                  <Badge variant={method.status === 'active' ? 'default' : 'secondary'}>
                    {method.status === 'active' ? 'نشط' : 'غير نشط'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>المعاملات الأخيرة</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                تصفية
              </Button>
              <Button variant="outline" size="sm">
                عرض الكل
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {walletData.transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.method} • {transaction.date}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className={`font-bold ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}{transaction.amount.toLocaleString()} د.ل
                  </p>
                  <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                    {transaction.status === 'completed' ? 'مكتمل' : 'قيد الانتظار'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const PlansModal: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">الباقات</h2>
          <Button variant="ghost" size="icon" onClick={() => setShowPlans(false)}>
            <XIcon className="h-5 w-5" />
          </Button>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold mb-2">يتم إختيار الباقة المناسبة لك</h3>
          <div className="flex justify-center gap-4">
            <Button variant="outline">خطة دفع شهرية</Button>
            <Button variant="default">خطة دفع سنوية وفر 10%</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subscriptionPlans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.popular ? 'border-2 border-blue-500' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500">✨ الأكثر شعبية - موصى به ✨</Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-green-600">
                  {plan.price}
                  <span className="text-sm text-muted-foreground">د.ل</span>
                </div>
                <div className="text-sm text-muted-foreground">/شهر</div>
                <Button className="w-full" variant={plan.current ? 'outline' : 'default'}>
                  {plan.current ? 'تمديد الإشتراك' : 'أختر الباقة'}
                </Button>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => setShowPlans(false)}>
            إغلاق
          </Button>
        </div>
      </div>
    </div>
  );

  const AddMoneyModal: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">إضافة أموال إلى المحفظة</h2>
          <Button variant="ghost" size="icon" onClick={() => setShowAddMoney(false)}>
            <XIcon className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={selectedPaymentMethod === 'card' ? 'default' : 'outline'}
              onClick={() => setSelectedPaymentMethod('card')}
              className="flex-1"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              بطاقات إئتمانية
            </Button>
            <Button
              variant={selectedPaymentMethod === 'bank' ? 'default' : 'outline'}
              onClick={() => setSelectedPaymentMethod('bank')}
              className="flex-1"
            >
              <Building className="h-4 w-4 mr-2" />
              تحويل مصرفي
            </Button>
          </div>

          {selectedPaymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">المبلغ</label>
                <div className="grid grid-cols-2 gap-2">
                  {[50, 100, 200, 500, 1000].map((amount) => (
                    <Button key={amount} variant="outline" className="h-12">
                      {amount} د.ل
                    </Button>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  رصيد محفظتك الجديد سيكون: <span className="font-bold">100 د.ل</span>
                </p>
              </div>
            </div>
          )}

          {selectedPaymentMethod === 'bank' && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">بيانات حساب المحفظة</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  سيتم إعلامك عند استلام التحويل
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>اسم صاحب الحساب:</span>
                    <span className="font-medium">Demo Store</span>
                  </div>
                  <div className="flex justify-between">
                    <span>اسم المصرف:</span>
                    <span className="font-medium">مصرف الجمهورية</span>
                  </div>
                  <div className="flex justify-between">
                    <span>رقم الآيبان:</span>
                    <span className="font-medium">LY2030100819000001276041</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">بيانات حساب صاحب المتجر</h4>
                <p className="text-sm text-blue-800 mb-2">
                  في حالة التحويل إلى حساب موثّق، سيتم إيداع مبلغ التحويل في المحفظة تلقائياً.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>اسم صاحب الحساب:</span>
                    <span className="font-medium">Demo Store</span>
                  </div>
                  <div className="flex justify-between">
                    <span>اسم المصرف:</span>
                    <span className="font-medium">مصرف الجمهورية</span>
                  </div>
                  <div className="flex justify-between">
                    <span>رقم الآيبان:</span>
                    <span className="font-medium">LY4380000296608010756115</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button className="flex-1">
              تأكيد الطلب
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setShowAddMoney(false)}>
              إلغاء
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
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
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  المالية
                </h1>
                <p className="text-sm text-muted-foreground">إدارة الاشتراكات والمحفظة المالية</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white/80 backdrop-blur-lg border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0`}>
          <div className="flex flex-col h-full">
            <div className="p-6">
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? 'default' : 'ghost'}
                    className={`w-full justify-start h-12 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                        : 'hover:bg-slate-100'
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
          {activeTab === 'subscription' && <SubscriptionManagement />}
          {activeTab === 'wallet' && <WalletManagement />}
        </main>
      </div>

      {/* Modals */}
      {showPlans && <PlansModal />}
      {showAddMoney && <AddMoneyModal />}
    </div>
  );
};

export default MerchantFinance;
