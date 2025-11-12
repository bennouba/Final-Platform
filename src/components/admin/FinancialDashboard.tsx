import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowDownLeft, ArrowUpRight, CreditCard, DollarSign, FileText, TrendingUp } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, Line, CartesianGrid, Tooltip, XAxis, YAxis, BarChart, Bar, Cell } from "recharts";

const financialHighlights = [
  {
    id: "monthly-revenue",
    label: "إيرادات الشهر",
    value: "2,847,593 د.ل",
    delta: "+15.7%",
    positive: true,
    icon: DollarSign,
    hint: "زيادة 386,452 د.ل عن الشهر السابق"
  },
  {
    id: "net-profit",
    label: "صافي أرباح المنصة",
    value: "684,120 د.ل",
    delta: "+9.4%",
    positive: true,
    icon: TrendingUp,
    hint: "هامش ربح 24% بعد التسويات"
  },
  {
    id: "payouts",
    label: "مدفوعات التجار المعلقة",
    value: "417,860 د.ل",
    delta: "-6.1%",
    positive: false,
    icon: CreditCard,
    hint: "42 دفعة ستتم خلال 48 ساعة"
  }
];

const cashflowSeries = [
  { month: "يناير", revenue: 184760, payouts: 132480, net: 52280 },
  { month: "فبراير", revenue: 198340, payouts: 139260, net: 59080 },
  { month: "مارس", revenue: 214980, payouts: 151320, net: 63660 },
  { month: "أبريل", revenue: 238120, payouts: 168740, net: 69400 },
  { month: "مايو", revenue: 257430, payouts: 175890, net: 81540 },
  { month: "يونيو", revenue: 268900, payouts: 183240, net: 85660 },
  { month: "يوليو", revenue: 289310, payouts: 194680, net: 94630 },
  { month: "أغسطس", revenue: 305640, payouts: 202130, net: 103510 },
  { month: "سبتمبر", revenue: 322480, payouts: 210540, net: 111940 },
  { month: "أكتوبر", revenue: 348200, payouts: 223460, net: 124740 },
  { month: "نوفمبر", revenue: 366820, payouts: 229720, net: 137100 },
  { month: "ديسمبر", revenue: 389500, payouts: 239880, net: 149620 }
];

const payoutSchedule = [
  {
    id: "P-2025-0147",
    merchant: "متجر نواعم",
    amount: "182,500 د.ل",
    method: "تحويل مصرفي",
    status: "قيد التسوية",
    eta: "اليوم 15:00"
  },
  {
    id: "P-2025-0142",
    merchant: "متجر شيرين",
    amount: "124,380 د.ل",
    method: "موأمالات",
    status: "مكتمل",
    eta: "أمس 18:20"
  },
  {
    id: "P-2025-0136",
    merchant: "دالتا ستور",
    amount: "96,420 د.ل",
    method: "تحويل مصرفي",
    status: "قيد المراجعة",
    eta: "غداً 09:30"
  },
  {
    id: "P-2025-0131",
    merchant: "ميجنا",
    amount: "74,890 د.ل",
    method: "نقدي",
    status: "في الطريق",
    eta: "اليوم 20:45"
  }
];

const subscriptionBreakdown = [
  { tier: "Enterprise", merchants: 38, arr: "1.24 مليون د.ل", retention: "99%", color: "#6366f1" },
  { tier: "Pro", merchants: 112, arr: "980 ألف د.ل", retention: "96%", color: "#22c55e" },
  { tier: "Starter", merchants: 64, arr: "312 ألف د.ل", retention: "91%", color: "#f97316" }
];

const complianceChecks = [
  { id: "C-481", title: "تسوية موأمالات اليومية", result: "متطابق", timestamp: "اليوم 09:20" },
  { id: "C-476", title: "مطابقة ضريبة القيمة المضافة", result: "مستكملة", timestamp: "أمس 21:10" },
  { id: "C-469", title: "تدقيق قيود دفتر الأستاذ العام", result: "تحت المراجعة", timestamp: "أمس 15:05" }
];

const FinancialDashboard = () => {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {financialHighlights.map((card) => (
          <Card key={card.id} className="border-none bg-white/80 dark:bg-slate-900/50 shadow-lg">
            <CardContent className="flex items-center justify-between gap-4 p-6">
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.hint}</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className={`text-sm font-semibold ${card.positive ? "text-emerald-600" : "text-rose-600"}`}>{card.delta}</span>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 border-none bg-white/80 dark:bg-slate-900/50 shadow-lg">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>تدفقات النقد وتحويلات التجار</CardTitle>
              <p className="text-sm text-muted-foreground">مقارنة تفصيلية بين الإيرادات والتحويلات المتحققة شهرياً</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <FileText className="h-4 w-4" />
              تصدير تقرير تفصيلي
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={cashflowSeries}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="payoutGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickMargin={12} />
                <YAxis tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`} />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === "revenue") {
                      return [`${value.toLocaleString("en-US")} د.ل`, "الإيرادات"];
                    }
                    if (name === "payouts") {
                      return [`${value.toLocaleString("en-US")} د.ل`, "مدفوعات التجار"];
                    }
                    return [`${value.toLocaleString("en-US")} د.ل`, "صافي الربح"];
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="url(#revenueGradient)" strokeWidth={3} />
                <Area type="monotone" dataKey="payouts" stroke="#6366f1" fill="url(#payoutGradient)" strokeWidth={3} />
                <Line type="monotone" dataKey="net" stroke="#f97316" strokeWidth={3} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="grid gap-3 sm:grid-cols-2 text-xs text-muted-foreground">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-2 text-emerald-600">
                <ArrowUpRight className="h-3.5 w-3.5" />
                متوسط نمو الإيرادات الشهري 12.3%
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-2 text-indigo-600 dark:text-indigo-300">
                <ArrowDownLeft className="h-3.5 w-3.5" />
                التحويلات تتم خلال 11.4 ساعة كمتوسط
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/80 dark:bg-slate-900/50 shadow-lg">
          <CardHeader>
            <CardTitle>جدول تسويات التجار</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {payoutSchedule.map((payout) => (
              <div key={payout.id} className="rounded-3xl border border-slate-200/80 dark:border-slate-800/60 bg-white/90 dark:bg-slate-900/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{payout.merchant}</p>
                    <p className="text-xs text-muted-foreground">رقم التسوية: {payout.id}</p>
                  </div>
                  <Badge variant="outline" className="rounded-full border-indigo-200 text-indigo-600 dark:text-indigo-300">
                    {payout.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>المبلغ: {payout.amount}</span>
                  <span>الطريقة: {payout.method}</span>
                  <span>التنفيذ: {payout.eta}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-none bg-white/80 dark:bg-slate-900/50 shadow-lg">
          <CardHeader>
            <CardTitle>اشتراكات المنصة ARR</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={subscriptionBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="tier" tickMargin={12} />
                <YAxis tickFormatter={(value) => `${value}`} hide />
                <Tooltip
                  formatter={(value: number, name: string, entry: any) => {
                    if (name === "merchants") {
                      return [`${value} تاجر`, "عدد المتاجر"];
                    }
                    if (name === "arr") {
                      return [entry.payload.arr, "القيمة السنوية"];
                    }
                    return [entry.payload.retention, "نسبة الاحتفاظ"];
                  }}
                />
                <Bar dataKey="merchants" radius={[12, 12, 0, 0]}>
                  {subscriptionBreakdown.map((item) => (
                    <Cell key={item.tier} fill={item.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="space-y-2 text-xs text-muted-foreground">
              {subscriptionBreakdown.map((item) => (
                <div key={item.tier} className="flex items-center justify-between rounded-2xl border border-slate-200/70 dark:border-slate-800/50 bg-white/90 dark:bg-slate-900/40 px-3 py-2">
                  <span className="font-semibold text-slate-900 dark:text-white">{item.tier}</span>
                  <div className="flex items-center gap-3">
                    <span>{item.arr}</span>
                    <Badge variant="outline" className="rounded-full border-emerald-200 text-emerald-600 dark:text-emerald-300">
                      احتفاظ {item.retention}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/80 dark:bg-slate-900/50 shadow-lg">
          <CardHeader>
            <CardTitle>مصفوفة الامتثال المالي</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl border border-emerald-200/80 dark:border-emerald-500/30 bg-emerald-500/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">تقارير المطابقة اليومية</p>
                  <p className="text-xs text-muted-foreground">آخر تحديث الساعة 12:10 مساءً</p>
                </div>
                <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">99.4%</span>
              </div>
              <Progress value={99.4} className="mt-4 h-2.5" />
            </div>
            {complianceChecks.map((check) => (
              <div key={check.id} className="rounded-3xl border border-slate-200/80 dark:border-slate-800/60 bg-white/90 dark:bg-slate-900/40 px-4 py-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{check.title}</p>
                  <p className="text-xs text-muted-foreground">{check.timestamp}</p>
                </div>
                <Badge className="bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">{check.result}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialDashboard;
