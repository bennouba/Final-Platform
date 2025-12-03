import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  UserPlus,
  UserCheck,
  Star,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart,
  Heart,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  Target
} from 'lucide-react';

interface CustomerData {
  totalCustomers: number;
  newCustomers: number;
  activeCustomers: number;
  vipCustomers: number;
  totalOrders: number;
  averageOrderValue: number;
  customerRetention: number;
  satisfactionScore: number;
  demographics: {
    age: { range: string; count: number; percentage: number }[];
    gender: { type: string; count: number; percentage: number }[];
    location: { city: string; count: number; percentage: number }[];
  };
  behavior: {
    frequentBuyers: { name: string; orders: number; totalSpent: number; lastOrder: string }[];
    topCategories: { category: string; customers: number; percentage: number }[];
    communication: { method: string; count: number; percentage: number }[];
  };
  feedback: {
    totalReviews: number;
    averageRating: number;
    positivePercentage: number;
    recentReviews: { customer: string; rating: number; comment: string; date: string }[];
  };
}

const CustomerReportsView: React.FC = () => {
  const [selectedChart, setSelectedChart] = useState<'bar' | 'pie' | 'line'>('pie');

  const customerData: CustomerData = {
    totalCustomers: 8934,
    newCustomers: 234,
    activeCustomers: 6789,
    vipCustomers: 156,
    totalOrders: 15678,
    averageOrderValue: 187.50,
    customerRetention: 78.3,
    satisfactionScore: 4.6,
    demographics: {
      age: [
        { range: '18-25', count: 2134, percentage: 23.9 },
        { range: '26-35', count: 3456, percentage: 38.7 },
        { range: '36-45', count: 2234, percentage: 25.0 },
        { range: '46-55', count: 789, percentage: 8.8 },
        { range: '55+', count: 321, percentage: 3.6 }
      ],
      gender: [
        { type: 'ذكر', count: 5234, percentage: 58.6 },
        { type: 'أنثى', count: 3700, percentage: 41.4 }
      ],
      location: [
        { city: 'طرابلس', count: 4567, percentage: 51.1 },
        { city: 'بنغازي', count: 1890, percentage: 21.2 },
        { city: 'مصراتة', count: 1234, percentage: 13.8 },
        { city: 'الزاوية', count: 567, percentage: 6.3 },
        { city: 'أخرى', count: 676, percentage: 7.6 }
      ]
    },
    behavior: {
      frequentBuyers: [
        { name: 'أحمد محمد', orders: 45, totalSpent: 12500, lastOrder: '2024-01-15' },
        { name: 'فاطمة علي', orders: 38, totalSpent: 9800, lastOrder: '2024-01-14' },
        { name: 'محمد أحمد', orders: 32, totalSpent: 8700, lastOrder: '2024-01-13' },
        { name: 'خديجة سالم', orders: 29, totalSpent: 7600, lastOrder: '2024-01-12' },
        { name: 'عمر خالد', orders: 26, totalSpent: 6900, lastOrder: '2024-01-11' }
      ],
      topCategories: [
        { category: 'إلكترونيات', customers: 3456, percentage: 38.7 },
        { category: 'ملابس', customers: 2890, percentage: 32.3 },
        { category: 'منتجات منزلية', customers: 1987, percentage: 22.2 },
        { category: 'كتب ومكتبات', customers: 1234, percentage: 13.8 },
        { category: 'أخرى', customers: 967, percentage: 10.8 }
      ],
      communication: [
        { method: 'واتساب', count: 5678, percentage: 63.5 },
        { method: 'الهاتف', count: 2341, percentage: 26.2 },
        { method: 'البريد الإلكتروني', count: 1890, percentage: 21.1 },
        { method: 'الرسائل النصية', count: 1456, percentage: 16.3 }
      ]
    },
    feedback: {
      totalReviews: 2341,
      averageRating: 4.6,
      positivePercentage: 89.5,
      recentReviews: [
        { customer: 'أحمد محمد', rating: 5, comment: 'خدمة ممتازة وسرعة في التوصيل', date: '2024-01-15' },
        { customer: 'فاطمة علي', rating: 4, comment: 'منتجات ذات جودة عالية', date: '2024-01-14' },
        { customer: 'محمد أحمد', rating: 5, comment: 'تجربة تسوق رائعة', date: '2024-01-13' },
        { customer: 'خديجة سالم', rating: 4, comment: 'أسعار تنافسية وجودة جيدة', date: '2024-01-12' }
      ]
    }
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

  const DemographicsCard: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          التركيبة السكانية للعملاء
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Age Distribution */}
          <div>
            <h4 className="font-medium mb-3">توزيع الأعمار</h4>
            <div className="space-y-2">
              {customerData.demographics.age.map((age, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{age.range} سنة</span>
                    <span>{age.count} عميل ({age.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${age.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gender Distribution */}
          <div>
            <h4 className="font-medium mb-3">توزيع الجنس</h4>
            <div className="grid grid-cols-2 gap-4">
              {customerData.demographics.gender.map((gender, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{gender.count}</p>
                  <p className="text-sm text-muted-foreground">{gender.type}</p>
                  <p className="text-xs text-muted-foreground">{gender.percentage}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Location Distribution */}
          <div>
            <h4 className="font-medium mb-3">التوزيع الجغرافي</h4>
            <div className="space-y-2">
              {customerData.demographics.location.map((location, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{location.city}</span>
                  </div>
                  <div className="text-left">
                    <p className="font-bold">{location.count}</p>
                    <p className="text-xs text-muted-foreground">{location.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const BehaviorCard: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          سلوك العملاء
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Top Categories */}
          <div>
            <h4 className="font-medium mb-3">الفئات الأكثر تفضيلاً</h4>
            <div className="space-y-2">
              {customerData.behavior.topCategories.map((category, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{category.category}</span>
                    <span>{category.customers} عميل</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Communication Preferences */}
          <div>
            <h4 className="font-medium mb-3">وسائل التواصل المفضلة</h4>
            <div className="space-y-2">
              {customerData.behavior.communication.map((comm, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    {comm.method === 'واتساب' && <MessageSquare className="h-4 w-4 text-green-500" />}
                    {comm.method === 'الهاتف' && <Phone className="h-4 w-4 text-blue-500" />}
                    {comm.method === 'البريد الإلكتروني' && <Mail className="h-4 w-4 text-purple-500" />}
                    {comm.method === 'الرسائل النصية' && <MessageSquare className="h-4 w-4 text-orange-500" />}
                    <span className="font-medium">{comm.method}</span>
                  </div>
                  <div className="text-left">
                    <p className="font-bold">{comm.count}</p>
                    <p className="text-xs text-muted-foreground">{comm.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const FrequentBuyersCard: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          أكثر العملاء شراءً
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {customerData.behavior.frequentBuyers.map((customer, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{customer.name}</h4>
                <Badge variant="outline">عميل VIP</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">عدد الطلبات</p>
                  <p className="font-bold text-green-600">{customer.orders}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">إجمالي الإنفاق</p>
                  <p className="font-bold text-blue-600">{customer.totalSpent.toLocaleString()} د.ل</p>
                </div>
                <div>
                  <p className="text-muted-foreground">آخر طلب</p>
                  <p className="font-bold text-purple-600">{customer.lastOrder}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const FeedbackCard: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          تقييمات وآراء العملاء
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{customerData.feedback.totalReviews}</p>
              <p className="text-sm text-muted-foreground">إجمالي التقييمات</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{customerData.feedback.averageRating}/5</p>
              <p className="text-sm text-muted-foreground">متوسط التقييم</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{customerData.feedback.positivePercentage}%</p>
              <p className="text-sm text-muted-foreground">نسبة الرضا</p>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="space-y-3">
            <h4 className="font-medium">أحدث التقييمات</h4>
            {customerData.feedback.recentReviews.map((review, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{review.customer}</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{review.comment}</p>
                <p className="text-xs text-muted-foreground">{review.date}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">تقارير العملاء</h2>
          <p className="text-muted-foreground">
            تحليل شامل لسلوك وتفضيلات العملاء
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
          title="إجمالي العملاء"
          value={customerData.totalCustomers}
          subtitle="عميل مسجل"
          icon={Users}
          color="bg-blue-500"
          trend={{ value: 8.3, isPositive: true }}
        />
        <StatCard
          title="عملاء جدد"
          value={customerData.newCustomers}
          subtitle="هذا الشهر"
          icon={UserPlus}
          color="bg-green-500"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="عملاء نشطون"
          value={customerData.activeCustomers}
          subtitle="في آخر 30 يوم"
          icon={UserCheck}
          color="bg-purple-500"
          trend={{ value: 5.7, isPositive: true }}
        />
        <StatCard
          title="عملاء VIP"
          value={customerData.vipCustomers}
          subtitle="عملاء مميزون"
          icon={Award}
          color="bg-orange-500"
          trend={{ value: 15.2, isPositive: true }}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="متوسط قيمة الطلب"
          value={`${customerData.averageOrderValue} د.ل`}
          icon={ShoppingBag}
          color="bg-indigo-500"
        />
        <StatCard
          title="معدل الاحتفاظ بالعملاء"
          value={`${customerData.customerRetention}%`}
          icon={Target}
          color="bg-green-500"
          trend={{ value: 3.1, isPositive: true }}
        />
        <StatCard
          title="مؤشر الرضا"
          value={`${customerData.satisfactionScore}/5`}
          icon={Star}
          color="bg-yellow-500"
          trend={{ value: 0.2, isPositive: true }}
        />
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DemographicsCard />
        <BehaviorCard />
      </div>

      {/* Frequent Buyers and Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FrequentBuyersCard />
        <FeedbackCard />
      </div>
    </div>
  );
};

export default CustomerReportsView;
