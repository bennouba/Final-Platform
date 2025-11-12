import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Layers, PackageCheck, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

const formatNumber = (value: number) => value.toLocaleString("en-US");
const formatCurrency = (value: number) => `${value.toLocaleString("en-US")} د.ل`;

type ProductSummaryKey = "active" | "bundles" | "new" | "under-review";

const productSummaryCards = [
  {
    id: "active" as ProductSummaryKey,
    label: "منتجات فعالة",
    value: 18462,
    delta: "+5.6%",
    positive: true,
    icon: PackageCheck,
    hint: "تم تحسين 1,148 بطاقة خلال الأسبوع"
  },
  {
    id: "bundles" as ProductSummaryKey,
    label: "حزم ذكية",
    value: 842,
    delta: "+3.1%",
    positive: true,
    icon: Layers,
    hint: "متوسط زيادة الطلب 18% لكل حزمة"
  },
  {
    id: "new" as ProductSummaryKey,
    label: "منتجات جديدة",
    value: 318,
    delta: "+18 منتج",
    positive: true,
    icon: Sparkles,
    hint: "86% منها تحتوى على محتوى متكامل"
  },
  {
    id: "under-review" as ProductSummaryKey,
    label: "طلبات التدقيق",
    value: 74,
    delta: "-9 حالات",
    positive: true,
    icon: ShieldCheck,
    hint: "الوقت المتوسط للتدقيق 6 ساعات"
  }
];

const categoryPerformance = [
  { category: "الجمال والعناية", share: 28, growth: "+6%", conversion: "4.3%", color: "#6366f1" },
  { category: "الأزياء النسائية", share: 22, growth: "+4%", conversion: "3.8%", color: "#ec4899" },
  { category: "الإلكترونيات", share: 18, growth: "+3%", conversion: "3.2%", color: "#22c55e" },
  { category: "المنزل والمعيشة", share: 16, growth: "+5%", conversion: "2.9%", color: "#f97316" },
  { category: "الأغذية المميزة", share: 9, growth: "+8%", conversion: "3.5%", color: "#14b8a6" }
];

const pricingTiers = [
  { range: "0 - 100 د.ل", share: 38, margin: "22%", change: "+2%" },
  { range: "100 - 250 د.ل", share: 32, margin: "27%", change: "+1%" },
  { range: "250 - 500 د.ل", share: 18, margin: "31%", change: "ثابت" },
  { range: "> 500 د.ل", share: 12, margin: "35%", change: "-1%" }
];

const lifecycleTasks = [
  {
    id: "PRJ-114",
    title: "تحديث صور منتجات نواعم",
    status: "قيد التنفيذ",
    owner: "فريق المحتوى",
    due: "اليوم"
  },
  {
    id: "PRJ-109",
    title: "مراجعة مطابقة الأسعار للإلكترونيات",
    status: "بإنتظار المراجعة",
    owner: "الفريق المالي",
    due: "غداً"
  },
  {
    id: "PRJ-103",
    title: "إطلاق توصيات الحزم الذكية",
    status: "منجز",
    owner: "المنتج الرقمي",
    due: "منذ 3 أيام"
  }
];

const qualityAlerts = [
  {
    id: "QA-782",
    product: "مجموعة العناية الليلية",
    store: "متجر نواعم",
    issue: "وصف المنتج يحتاج مواءمة مع التغليف",
    action: "جاري التحديث",
    updated: "قبل ساعة"
  },
  {
    id: "QA-775",
    product: "حزمة الأجهزة الذكية",
    store: "دالتا ستور",
    issue: "ضمان المنتج غير مرفق",
    action: "التصعيد للحوكمة",
    updated: "قبل ساعتين"
  },
  {
    id: "QA-769",
    product: "طقم السهرة المخملي",
    store: "متجر شيرين",
    issue: "صور المنتج بحاجة إعادة تحرير",
    action: "تم الإرسال للفريق الإبداعي",
    updated: "قبل 3 ساعات"
  }
];

const ProductsManagement = () => {
  const [activeSummary, setActiveSummary] = useState<ProductSummaryKey>("active");

  const formattedSummaryCards = useMemo(
    () =>
      productSummaryCards.map((card) => ({
        ...card,
        formattedValue: formatNumber(card.value)
      })),
    []
  );

  const summaryDetailMap = useMemo(
    () => ({
      active: {
        title: "نمو المنتجات النشطة",
        description: "متابعة أداء المنتجات المفعلة عبر كافة قنوات المنصة",
        badge: "تغطية المخزون 98%",
        areaColor: "#6366f1",
        lineColor: "#22c55e",
        timeline: [
          { period: "الأحد", primary: 2680, secondary: 92 },
          { period: "الإثنين", primary: 2744, secondary: 93 },
          { period: "الثلاثاء", primary: 2816, secondary: 94 },
          { period: "الأربعاء", primary: 2872, secondary: 95 },
          { period: "الخميس", primary: 2926, secondary: 96 },
          { period: "الجمعة", primary: 2988, secondary: 96 },
          { period: "السبت", primary: 3046, secondary: 97 }
        ],
        timelineLabels: {
          primary: "منتجات نشطة",
          secondary: "توفر القنوات",
          formatPrimary: (value: number) => formatNumber(Math.round(value)),
          formatSecondary: (value: number) => `${Math.round(value)}%`
        },
        metrics: [
          { label: "متاجر تغطي المنتج", value: formatNumber(62), change: "+4 متاجر", positive: true },
          { label: "معدل التحويل", value: "4.1%", change: "+0.3%", positive: true },
          { label: "منتجات بحاجة لتحديث", value: formatNumber(146), change: "-28 منتج", positive: true }
        ],
        listTitle: "أعلى الفئات أداء",
        listItems: categoryPerformance.slice(0, 4).map((item) => ({
          label: item.category,
          value: `حصة ${item.share}% / نمو ${item.growth}`
        }))
      },
      bundles: {
        title: "نجاح الحزم الذكية",
        description: "قياس أثر الحزم والعروض المركبة على المبيعات",
        badge: "زيادة متوسط الإيراد 18%",
        areaColor: "#8b5cf6",
        lineColor: "#f97316",
        timeline: [
          { period: "الأحد", primary: 312, secondary: 24 },
          { period: "الإثنين", primary: 328, secondary: 25 },
          { period: "الثلاثاء", primary: 336, secondary: 26 },
          { period: "الأربعاء", primary: 344, secondary: 27 },
          { period: "الخميس", primary: 358, secondary: 29 },
          { period: "الجمعة", primary: 372, secondary: 30 },
          { period: "السبت", primary: 396, secondary: 32 }
        ],
        timelineLabels: {
          primary: "طلبات الحزم",
          secondary: "نسبة الإضافة",
          formatPrimary: (value: number) => formatNumber(Math.round(value)),
          formatSecondary: (value: number) => `${Math.round(value)}%`
        },
        metrics: [
          { label: "متوسط قيمة الحزمة", value: formatCurrency(384), change: "+7%", positive: true },
          { label: "حزم تتجاوز الهدف", value: formatNumber(128), change: "+18 حزمة", positive: true },
          { label: "حزم تحتاج تحسين", value: formatNumber(34), change: "-6 حزم", positive: true }
        ],
        listTitle: "أفضل الحزم",
        listItems: [
          { label: "طقم العناية الليلية", value: formatCurrency(468) },
          { label: "باقة الأجهزة الذكية", value: formatCurrency(1_240) },
          { label: "حزمة المنزل الذكي", value: formatCurrency(986) }
        ]
      },
      new: {
        title: "تبني المنتجات الجديدة",
        description: "تحليل سرعة تبني المنتجات وإدراجها في الأسواق",
        badge: "86% محتوى متكامل",
        areaColor: "#22c55e",
        lineColor: "#0ea5e9",
        timeline: [
          { period: "الأحد", primary: 238, secondary: 61 },
          { period: "الإثنين", primary: 252, secondary: 63 },
          { period: "الثلاثاء", primary: 264, secondary: 65 },
          { period: "الأربعاء", primary: 276, secondary: 67 },
          { period: "الخميس", primary: 288, secondary: 69 },
          { period: "الجمعة", primary: 304, secondary: 71 },
          { period: "السبت", primary: 318, secondary: 73 }
        ],
        timelineLabels: {
          primary: "منتجات منشورة",
          secondary: "نسبة التحويل",
          formatPrimary: (value: number) => formatNumber(Math.round(value)),
          formatSecondary: (value: number) => `${Math.round(value)}%`
        },
        metrics: [
          { label: "متوسط زمن الإطلاق", value: "2.4 يوم", change: "-0.6 يوم", positive: true },
          { label: "منتجات تحقق 100 طلب", value: formatNumber(42), change: "+9 منتجات", positive: true },
          { label: "تغطية صور 4K", value: "92%", change: "+4%", positive: true }
        ],
        listTitle: "أكثر المنتجات الجديدة نموا",
        listItems: [
          { label: "سيروم فيتامين C", value: formatNumber(164) + " طلب" },
          { label: "سماعات عزل الضوضاء", value: formatNumber(138) + " طلب" },
          { label: "فستان صيفي مطبع", value: formatNumber(126) + " طلب" }
        ]
      },
      "under-review": {
        title: "منصة التدقيق والجودة",
        description: "مراقبة المنتجات التي تحتاج مراجعة محتوى أو مطابقة معايير",
        badge: "خفض حالات التعليق 12%",
        areaColor: "#f43f5e",
        lineColor: "#facc15",
        timeline: [
          { period: "الأحد", primary: 92, secondary: 62 },
          { period: "الإثنين", primary: 88, secondary: 64 },
          { period: "الثلاثاء", primary: 84, secondary: 66 },
          { period: "الأربعاء", primary: 82, secondary: 69 },
          { period: "الخميس", primary: 78, secondary: 71 },
          { period: "الجمعة", primary: 76, secondary: 73 },
          { period: "السبت", primary: 74, secondary: 74 }
        ],
        timelineLabels: {
          primary: "طلبات تدقيق",
          secondary: "تمت معالجتها",
          formatPrimary: (value: number) => formatNumber(Math.round(value)),
          formatSecondary: (value: number) => `${Math.round(value)}%`
        },
        metrics: [
          { label: "متوسط زمن المعالجة", value: "6 ساعات", change: "-1.4 ساعة", positive: true },
          { label: "تصعيدات مفتوحة", value: formatNumber(11), change: "-3 حالات", positive: true },
          { label: "طلبات محتاجة مراجعة", value: formatNumber(22), change: "ثابت", positive: true }
        ],
        listTitle: "تنبيهات الجودة",
        listItems: qualityAlerts.map((alert) => ({
          label: `${alert.product} • ${alert.store}`,
          value: alert.action
        }))
      }
    }),
    []
  );

  const activeSummaryDetail = summaryDetailMap[activeSummary];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {formattedSummaryCards.map((card) => {
          const Icon = card.icon;
          const isActive = activeSummary === card.id;
          return (
            <Card
              key={card.id}
              className={`border-none bg-white/80 dark:bg-slate-900/50 shadow-lg transition-all duration-200 ${isActive ? "ring-2 ring-indigo-500 shadow-xl" : "hover:-translate-y-1 hover:shadow-xl"}`}
              role="button"
              tabIndex={0}
              onClick={() => setActiveSummary(card.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveSummary(card.id);
                }
              }}
            >
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">{card.label}</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{card.formattedValue}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isActive ? "bg-indigo-500 text-white" : "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className={card.positive ? "text-emerald-600" : "text-rose-600"}>{card.delta}</span>
                  <span>{card.hint}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {activeSummaryDetail && (
        <Card className="border-none bg-white/80 dark:bg-slate-900/50 shadow-lg">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>{activeSummaryDetail.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{activeSummaryDetail.description}</p>
            </div>
            <Badge className="bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">{activeSummaryDetail.badge}</Badge>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{activeSummaryDetail.timelineLabels.primary}</span>
                <span>{activeSummaryDetail.timelineLabels.secondary}</span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={activeSummaryDetail.timeline}>
                  <defs>
                    <linearGradient id={`products-${activeSummary}-area`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeSummaryDetail.areaColor} stopOpacity={0.85} />
                      <stop offset="95%" stopColor={activeSummaryDetail.areaColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="period" tickMargin={12} />
                  <YAxis yAxisId="primary" width={90} tickFormatter={(value) => activeSummaryDetail.timelineLabels.formatPrimary(Number(value))} />
                  <YAxis
                    yAxisId="secondary"
                    orientation="right"
                    width={90}
                    tickFormatter={(value) => activeSummaryDetail.timelineLabels.formatSecondary(Number(value))}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === "primary") {
                        return [activeSummaryDetail.timelineLabels.formatPrimary(value), activeSummaryDetail.timelineLabels.primary];
                      }
                      return [activeSummaryDetail.timelineLabels.formatSecondary(value), activeSummaryDetail.timelineLabels.secondary];
                    }}
                  />
                  <Area type="monotone" dataKey="primary" stroke={activeSummaryDetail.areaColor} fill={`url(#products-${activeSummary}-area)`} strokeWidth={3} yAxisId="primary" />
                  <Line type="monotone" dataKey="secondary" stroke={activeSummaryDetail.lineColor} strokeWidth={3} dot={false} yAxisId="secondary" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="lg:col-span-2 space-y-3">
              {activeSummaryDetail.metrics.map((metric) => (
                <div key={metric.label} className="rounded-3xl border border-slate-200/70 dark:border-slate-800/50 bg-white/90 dark:bg-slate-900/40 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{metric.label}</p>
                    <span className={`text-xs font-semibold ${metric.positive ? "text-emerald-600" : "text-rose-600"}`}>{metric.change}</span>
                  </div>
                  <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{metric.value}</p>
                </div>
              ))}
              <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800/50 bg-white/90 dark:bg-slate-900/40 px-4 py-3 space-y-2">
                <p className="text-xs text-muted-foreground">{activeSummaryDetail.listTitle}</p>
                <div className="space-y-2 text-xs text-muted-foreground">
                  {activeSummaryDetail.listItems.map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-white">{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 border-none bg-white/80 dark:bg-slate-900/50 shadow-lg">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>أداء الفئات الرئيسية</CardTitle>
              <p className="text-sm text-muted-foreground">مساهمة كل فئة ونسبة التحويل المرتبطة بها</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              تفاصيل الفئة
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="category" tickMargin={12} />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value: number, name: string) => [`${value}%`, "الحصة"]} />
                <Bar dataKey="share" radius={[12, 12, 0, 0]}>
                  {categoryPerformance.map((item) => (
                    <Cell key={item.category} fill={item.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="grid gap-3 sm:grid-cols-2 text-xs text-muted-foreground">
              {categoryPerformance.map((item) => (
                <div key={item.category} className="flex items-center justify-between rounded-3xl border border-slate-200/70 dark:border-slate-800/50 bg-white/90 dark:bg-slate-900/40 px-4 py-3">
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-900 dark:text-white">{item.category}</span>
                    <span>تحويل {item.conversion}</span>
                  </div>
                  <span className="text-emerald-600">{item.growth}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/80 dark:bg-slate-900/50 shadow-lg">
          <CardHeader>
            <CardTitle>تنبيهات الجودة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {qualityAlerts.map((alert) => (
              <div key={alert.id} className="rounded-3xl border border-amber-200/70 dark:border-amber-500/30 bg-amber-50/70 dark:bg-amber-500/10 p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-amber-700 dark:text-amber-300">{alert.id}</span>
                  <Badge className="bg-white/70 text-amber-700 dark:bg-amber-500/20">{alert.action}</Badge>
                </div>
                <p className="text-sm text-slate-900 dark:text-white">{alert.product}</p>
                <p className="text-xs text-muted-foreground leading-5">{alert.issue}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{alert.store}</span>
                  <span className="text-amber-600">{alert.updated}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-none bg-white/80 dark:bg-slate-900/50 shadow-lg">
          <CardHeader>
            <CardTitle>توزيع الشرائح السعرية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pricingTiers.map((tier) => (
              <div key={tier.range} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{tier.range}</span>
                  <span>{tier.margin} هامش</span>
                </div>
                <div className="flex items-center justify-between">
                  <Progress value={tier.share} className="h-2.5 w-full" />
                  <span className="ml-3 text-sm font-semibold text-slate-900 dark:text-white">{tier.share}%</span>
                </div>
                <span className="text-xs text-emerald-600">{tier.change}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-none bg-white/80 dark:bg-slate-900/50 shadow-lg">
          <CardHeader>
            <CardTitle>مشاريع دورة حياة المنتج</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lifecycleTasks.map((task) => (
              <div key={task.id} className="rounded-3xl border border-slate-200/70 dark:border-slate-800/50 bg-white/90 dark:bg-slate-900/40 p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-900 dark:text-white">{task.title}</span>
                  <Badge className="bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">{task.status}</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>المسؤول: {task.owner}</span>
                  <span>الاستحقاق: {task.due}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductsManagement;
