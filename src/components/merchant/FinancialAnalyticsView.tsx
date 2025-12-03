import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  PiggyBank,
  Calculator,
  Receipt,
  Download,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';

interface FinancialData {
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
  profitMargin: number;
  monthlyRevenue: { month: string; revenue: number; costs: number; profit: number }[];
  expenseBreakdown: { category: string; amount: number; percentage: number; color: string }[];
  paymentMethods: { method: string; amount: number; transactions: number; percentage: number }[];
  cashFlow: { period: string; inflow: number; outflow: number; balance: number }[];
  financialRatios: {
    currentRatio: number;
    debtRatio: number;
    returnOnAssets: number;
    returnOnEquity: number;
  };
  projections: {
    nextMonth: number;
    nextQuarter: number;
    nextYear: number;
    confidence: number;
  };
}

const FinancialAnalyticsView: React.FC = () => {
  const [selectedChart, setSelectedChart] = useState<'bar' | 'line' | 'pie'>('line');
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  const financialData: FinancialData = {
    totalRevenue: 2847593.50,
    totalCosts: 1892345.75,
    netProfit: 955247.75,
    profitMargin: 33.6,
    monthlyRevenue: [
      { month: 'يناير', revenue: 185000, costs: 125000, profit: 60000 },
      { month: 'فبراير', revenue: 210000, costs: 140000, profit: 70000 },
      { month: 'مارس', revenue: 195000, costs: 130000, profit: 65000 },
      { month: 'أبريل', revenue: 235000, costs: 155000, profit: 80000 },
      { month: 'مايو', revenue: 220000, costs: 145000, profit: 75000 },
      { month: 'يونيو', revenue: 250000, costs: 165000, profit: 85000 },
      { month: 'يوليو', revenue: 265000, costs: 175000, profit: 90000 },
      { month: 'أغسطس', revenue: 255000, costs: 168000, profit: 87000 },
      { month: 'سبتمبر', revenue: 280000, costs: 185000, profit: 95000 },
      { month: 'أكتوبر', revenue: 295000, costs: 195000, profit: 100000 },
      { month: 'نوفمبر', revenue: 310000, costs: 205000, profit: 105000 },
      { month: 'ديسمبر', revenue: 325000, costs: 215000, profit: 110000 }
    ],
    expenseBreakdown: [
      { category: 'تكلفة المنتجات', amount: 950000, percentage: 50.2, color: 'bg-blue-500' },
      { category: 'الشحن والتوصيل', amount: 380000, percentage: 20.1, color: 'bg-green-500' },
      { category: 'التسويق والإعلان', amount: 285000, percentage: 15.1, color: 'bg-purple-500' },
      { category: 'الرواتب والأجور', amount: 190000, percentage: 10.0, color: 'bg-orange-500' },
      { category: 'أخرى', amount: 87500, percentage: 4.6, color: 'bg-red-500' }
    ],
    paymentMethods: [
      { method: 'سداد', amount: 1250000, transactions: 4500, percentage: 43.9 },
      { method: 'موبي كاش', amount: 850000, transactions: 3200, percentage: 29.9 },
      { method: 'ادفعلي', amount: 425000, transactions: 1800, percentage: 14.9 },
      { method: 'تحويل بنكي', amount: 285000, transactions: 950, percentage: 10.0 },
      { method: 'كاش', amount: 38000, transactions: 230, percentage: 1.3 }
    ],
    cashFlow: [
      { period: 'أسبوع 1', inflow: 85000, outflow: 65000, balance: 20000 },
      { period: 'أسبوع 2', inflow: 92000, outflow: 58000, balance: 34000 },
      { period: 'أسبوع 3', inflow: 78000, outflow: 71000, balance: 7000 },
      { period: 'أسبوع 4', inflow: 105000, outflow: 62000, balance: 43000 }
    ],
    financialRatios: {
      currentRatio: 1.85,
      debtRatio: 0.32,
      returnOnAssets: 0.156,
      returnOnEquity: 0.284
    },
    projections: {
      nextMonth: 340000,
      nextQuarter: 1020000,
      nextYear: 4080000,
      confidence: 87.5
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

  const RevenueChart: React.FC = () => {
    const maxRevenue = Math.max(...financialData.monthlyRevenue.map(m => m.revenue));

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              الإيرادات والتكاليف الشهرية
            </CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={selectedChart === 'line' ? 'default' : 'outline'}
                onClick={() => setSelectedChart('line')}
              >
                خطي
              </Button>
              <Button
                size="sm"
                variant={selectedChart === 'bar' ? 'default' : 'outline'}
                onClick={() => setSelectedChart('bar')}
              >
                عمودي
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financialData.monthlyRevenue.map((data, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{data.month}</span>
                  <div className="flex gap-4 text-xs">
                    <span className="text-green-600">إيرادات: {data.revenue.toLocaleString()}</span>
                    <span className="text-red-600">تكاليف: {data.costs.toLocaleString()}</span>
                    <span className="text-blue-600">صافي: {data.profit.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-center mt-1 text-green-600">
                      {data.revenue.toLocaleString()} د.ل
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${(data.costs / maxRevenue) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-center mt-1 text-red-600">
                      {data.costs.toLocaleString()} د.ل
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

  const ExpenseBreakdownCard: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          توزيع المصروفات
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {financialData.expenseBreakdown.map((expense, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{expense.category}</span>
                <div className="text-right">
                  <p className="font-bold">{expense.amount.toLocaleString()} د.ل</p>
                  <p className="text-sm text-muted-foreground">{expense.percentage}%</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${expense.color}`}
                  style={{ width: `${expense.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const PaymentMethodsCard: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          طرق الدفع المستخدمة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {financialData.paymentMethods.map((method, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{method.method}</h4>
                <Badge variant="outline">{method.percentage}%</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">إجمالي المبلغ</p>
                  <p className="font-bold text-green-600">{method.amount.toLocaleString()} د.ل</p>
                </div>
                <div>
                  <p className="text-muted-foreground">عدد المعاملات</p>
                  <p className="font-bold text-blue-600">{method.transactions}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const CashFlowCard: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          التدفق النقدي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {financialData.cashFlow.map((flow, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">{flow.period}</h4>
                <Badge variant={flow.balance >= 0 ? 'default' : 'destructive'}>
                  {flow.balance >= 0 ? '+' : ''}{flow.balance.toLocaleString()} د.ل
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">التدفق الداخل</p>
                  <p className="font-bold text-green-600">+{flow.inflow.toLocaleString()} د.ل</p>
                </div>
                <div>
                  <p className="text-muted-foreground">التدفق الخارج</p>
                  <p className="font-bold text-red-600">-{flow.outflow.toLocaleString()} د.ل</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const FinancialRatiosCard: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          المؤشرات المالية
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{financialData.financialRatios.currentRatio}</p>
            <p className="text-sm text-muted-foreground">نسبة التداول</p>
            <p className="text-xs text-green-600">✓ ممتاز</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{(financialData.financialRatios.debtRatio * 100).toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground">نسبة الديون</p>
            <p className="text-xs text-green-600">✓ منخفضة</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{(financialData.financialRatios.returnOnAssets * 100).toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground">العائد على الأصول</p>
            <p className="text-xs text-green-600">✓ جيد</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{(financialData.financialRatios.returnOnEquity * 100).toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground">العائد على الملكية</p>
            <p className="text-xs text-green-600">✓ ممتاز</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProjectionsCard: React.FC = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          التوقعات المالية
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">الشهر القادم</h4>
              <Badge variant="outline">{financialData.projections.confidence}% دقة</Badge>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {financialData.projections.nextMonth.toLocaleString()} د.ل
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">الربع القادم</h4>
              <Badge variant="outline">{financialData.projections.confidence}% دقة</Badge>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {financialData.projections.nextQuarter.toLocaleString()} د.ل
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">السنة القادمة</h4>
              <Badge variant="outline">{financialData.projections.confidence}% دقة</Badge>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {financialData.projections.nextYear.toLocaleString()} د.ل
            </p>
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
          <h2 className="text-2xl font-bold">التحليلات المالية</h2>
          <p className="text-muted-foreground">
            تحليل شامل للأداء المالي والتوقعات
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

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي الإيرادات"
          value={`${financialData.totalRevenue.toLocaleString()} د.ل`}
          icon={DollarSign}
          color="bg-green-500"
          trend={{ value: 15.7, isPositive: true }}
        />
        <StatCard
          title="إجمالي التكاليف"
          value={`${financialData.totalCosts.toLocaleString()} د.ل`}
          icon={Receipt}
          color="bg-red-500"
          trend={{ value: 8.3, isPositive: false }}
        />
        <StatCard
          title="صافي الربح"
          value={`${financialData.netProfit.toLocaleString()} د.ل`}
          icon={PiggyBank}
          color="bg-blue-500"
          trend={{ value: 22.1, isPositive: true }}
        />
        <StatCard
          title="هامش الربح"
          value={`${financialData.profitMargin}%`}
          icon={Target}
          color="bg-purple-500"
          trend={{ value: 5.4, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <ExpenseBreakdownCard />
      </div>

      {/* Payment Methods and Cash Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentMethodsCard />
        <CashFlowCard />
      </div>

      {/* Financial Ratios and Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinancialRatiosCard />
        <ProjectionsCard />
      </div>
    </div>
  );
};

export default FinancialAnalyticsView;
