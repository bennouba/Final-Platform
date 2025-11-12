import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, AlertTriangle, CheckCircle, Package, RefreshCw, Truck } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, Line, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

const formatNumber = (value: number) => value.toLocaleString("en-US");

const summaryCards = [
  {
    id: "skus",
    label: "الأصناف المسجلة",
    value: 24580,
    delta: "+4.2%",
    deltaClass: "text-emerald-600",
    icon: Package,
    hint: "تمت إضافة 1,032 صنف خلال الشهر"
  },
  {
    id: "low-stock",
    label: "أصناف منخفضة المخزون",
    value: 186,
    delta: "-12%",
    deltaClass: "text-amber-600",
    icon: AlertTriangle,
    hint: "تم حل 24 إنذار خلال 48 ساعة"
  },
  {
    id: "critical-holds",
    label: "الطلبات المعلقة",
    value: 32,
    delta: "-3.5%",
    deltaClass: "text-rose-600",
    icon: AlertCircle,
    hint: "6 حالات تحتاج تدخل فورى"
  }
];

const warehouses = [
  {
    name: "مستودع طرابلس المركزي",
    utilization: 82,
    capacity: "12,400 وحدة",
    climate: "مراقب",
    leadTime: "8 ساعات",
    status: "ممتاز"
  },
  {
    name: "مركز تجهيز بنغازي",
    utilization: 68,
    capacity: "9,180 وحدة",
    climate: "جاف",
    leadTime: "16 ساعة",
    status: "مستقر"
  },
  {
    name: "مستودع مصراتة",
    utilization: 54,
    capacity: "6,420 وحدة",
    climate: "مبرد",
    leadTime: "24 ساعة",
    status: "تحت التحسين"
  }
];

const lowStockAlerts = [
  {
    sku: "ESH-NA-2458",
    name: "مجموعة عناية بالبشرة",
    store: "متجر نواعم",
    remaining: 34,
    turnover: "مرتفع",
    action: "إعادة الطلب",
    eta: "5 ساعات"
  },
  {
    sku: "ESH-SH-1147",
    name: "فستان سهرة مخمل",
    store: "متجر شيرين",
    remaining: 18,
    turnover: "متوسط",
    action: "مراجعة المخزون",
    eta: "12 ساعة"
  },
  {
    sku: "ESH-DL-3321",
    name: "سماعات لاسلكية",
    store: "دالتا ستور",
    remaining: 9,
    turnover: "عالٍ",
    action: "توريد عاجل",
    eta: "3 ساعات"
  }
];

const inboundShipments = [
  {
    id: "SH-98214",
    vendor: "شركة فاست لوجستيك",
    eta: "اليوم 16:30",
    items: 312,
    status: "قيد التوصيل",
    route: "طرابلس → بنغازي"
  },
  {
    id: "SH-98203",
    vendor: "Skynet Express",
    eta: "اليوم 20:45",
    items: 186,
    status: "تم الشحن",
    route: "إسطنبول → طرابلس"
  },
  {
    id: "SH-98192",
    vendor: "Eishro Fleet",
    eta: "غداً 09:10",
    items: 248,
    status: "جار التجهيز",
    route: "مصراتة → سبها"
  }
];

const holdOrders = [
  {
    id: "ORD-H982",
    store: "متجر نواعم",
    reason: "بانتظار تسوية الدفع البنكي",
    sla: "40 دقيقة"
  },
  {
    id: "ORD-H977",
    store: "متجر شيرين",
    reason: "تخصيص شحنة جزئية للمخزون",
    sla: "65 دقيقة"
  },
  {
    id: "ORD-H963",
    store: "متجر ميجنا",
    reason: "مراجعة جودة للمنتج البديل",
    sla: "90 دقيقة"
  }
];

const InventoryManagement = () => {
  const [activeSummary, setActiveSummary] = useState<string>("skus");

  const formattedSummaryCards = useMemo(
    () =>
      summaryCards.map((card) => ({
        ...card,
        formattedValue: formatNumber(card.value)
      })),
    []
  );

  const summaryDetailMap = useMemo(
    () => ({
      skus: {
        title: "مؤشر نمو الكتالوج",
        description: "رصد توسع الأصناف وتنوع التصنيفات عبر جميع المتاجر",
        badge: "نمو شهري 4.2%",
        areaColor: "#6366f1",
        lineColor: "#22c55e",
        timeline: [
          { period: "أسبوع 1", primary: 812, secondary: 68 },
          { period: "أسبوع 2", primary: 864, secondary: 71 },
          { period: "أسبوع 3", primary: 902, secondary: 73 },
          { period: "أسبوع 4", primary: 948, secondary: 75 },
          { period: "أسبوع 5", primary: 986, secondary: 78 },
          { period: "أسبوع 6", primary: 1032, secondary: 80 }
        ],
        timelineLabels: {
          primary: "أصناف جديدة",
          secondary: "إدراج مؤتمت",
          formatPrimary: (value: number) => formatNumber(Math.round(value)),
          formatSecondary: (value: number) => `${Math.round(value)}%`
        },
        metrics: [
          { label: "تصنيفات فريدة", value: formatNumber(184), change: "+18 فئة", positive: true },
          { label: "متوسط تحديث لكل متجر", value: formatNumber(214), change: "+6%", positive: true },
          { label: "معدل الاعتماد", value: "98%", change: "+1.2%", positive: true }
        ],
        listTitle: "أكثر المتاجر تحديثاً",
        listItems: [
          { label: "متجر نواعم", value: `${formatNumber(612)} صنف محدث` },
          { label: "متجر شيرين", value: `${formatNumber(534)} صنف محدث` },
          { label: "متجر بيريتي", value: `${formatNumber(486)} صنف محدث` },
          { label: "متجر ميجنا", value: `${formatNumber(448)} صنف محدث` }
        ]
      },
      "low-stock": {
        title: "تنبيهات انخفاض المخزون",
        description: "متابعة الحالات الحرجة وإعادة التوريد المبكر",
        badge: "تم حل 24 إنذار خلال 48 ساعة",
        areaColor: "#f97316",
        lineColor: "#14b8a6",
        timeline: [
          { period: "اليوم -5", primary: 58, secondary: 36 },
          { period: "اليوم -4", primary: 52, secondary: 34 },
          { period: "اليوم -3", primary: 48, secondary: 33 },
          { period: "اليوم -2", primary: 44, secondary: 31 },
          { period: "الأمس", primary: 42, secondary: 30 },
          { period: "اليوم", primary: 39, secondary: 28 }
        ],
        timelineLabels: {
          primary: "تنبيهات جديدة",
          secondary: "تمت معالجتها",
          formatPrimary: (value: number) => formatNumber(Math.round(value)),
          formatSecondary: (value: number) => formatNumber(Math.round(value))
        },
        metrics: [
          { label: "عمليات إعادة التوريد", value: formatNumber(58), change: "+12 عملية", positive: true },
          { label: "أتمتة التنبيهات", value: "64%", change: "+5%", positive: true },
          { label: "متوسط زمن الحل", value: "6.4 ساعة", change: "-1.2 ساعة", positive: true }
        ],
        listTitle: "أعلى الأصناف حساسية",
        listItems: lowStockAlerts.map((alert) => ({
          label: `${alert.name} • ${alert.store}`,
          value: `${formatNumber(alert.remaining)} وحدة`
        }))
      },
      "critical-holds": {
        title: "الطلبات المعلقة",
        description: "إدارة الطلبات التي تنتظر تدخلات خاصة لضمان استمرارية العمل",
        badge: "6 حالات تحتاج تدخل فورى",
        areaColor: "#f43f5e",
        lineColor: "#6366f1",
        timeline: [
          { period: "اليوم -5", primary: 42, secondary: 68 },
          { period: "اليوم -4", primary: 39, secondary: 70 },
          { period: "اليوم -3", primary: 36, secondary: 72 },
          { period: "اليوم -2", primary: 34, secondary: 74 },
          { period: "الأمس", primary: 31, secondary: 76 },
          { period: "اليوم", primary: 29, secondary: 78 }
        ],
        timelineLabels: {
          primary: "طلبات معلقة",
          secondary: "تم حلها ضمن SLA",
          formatPrimary: (value: number) => formatNumber(Math.round(value)),
          formatSecondary: (value: number) => `${Math.round(value)}%`
        },
        metrics: [
          { label: "إجراءات مكتملة", value: formatNumber(128), change: "+14 إجراء", positive: true },
          { label: "أوامر بحاجة لتصعيد", value: formatNumber(9), change: "+2 أمر", positive: false },
          { label: "متوسط زمن التعليق", value: "58 دقيقة", change: "-6 دقائق", positive: true }
        ],
        listTitle: "طلبات بحاجة للمتابعة",
        listItems: holdOrders.map((order) => ({
          label: `${order.id} • ${order.store}`,
          value: `${order.reason} (${order.sla})`
        }))
      }
    }),
    []
  );

  const activeSummaryDetail = summaryDetailMap[activeSummary];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
              <CardContent className="flex items-center justify-between gap-4 p-6">
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{card.formattedValue}</p>
                  <p className="text-xs text-muted-foreground">{card.hint}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className={`text-sm font-semibold ${card.deltaClass}`}>{card.delta}</div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isActive ? "bg-indigo-500 text-white" : "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
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
                    <linearGradient id={`inventory-${activeSummary}-area`} x1="0" y1="0" x2="0" y2="1">
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
                  <Area type="monotone" dataKey="primary" stroke={activeSummaryDetail.areaColor} fill={`url(#inventory-${activeSummary}-area)`} strokeWidth={3} yAxisId="primary" />
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
              <CardTitle>مراكز التخزين المتقدمة</CardTitle>
              <p className="text-sm text-muted-foreground">متابعة فورية لحالة المخازن ونسبة الإشغال</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              مزامنة فورية
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {warehouses.map((warehouse) => (
              <div
                key={warehouse.name}
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/50 p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{warehouse.name}</p>
                    <p className="text-xs text-muted-foreground">سعة التخزين القصوى: {warehouse.capacity}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Badge variant="outline" className="rounded-full border-slate-200 text-slate-600 dark:text-slate-300">
                      زمن التجهيز {warehouse.leadTime}
                    </Badge>
                    <Badge variant="outline" className="rounded-full border-emerald-200 text-emerald-600 dark:border-emerald-500/30 dark:text-emerald-300">
                      {warehouse.status}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>نسبة الإشغال</span>
                    <span>{warehouse.utilization}%</span>
                  </div>
                  <Progress value={warehouse.utilization} className="h-2.5" />
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-3 py-1 text-indigo-600 dark:text-indigo-300">
                      <Truck className="h-3.5 w-3.5" />
                      مسار {warehouse.climate}
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-600">
                      <CheckCircle className="h-3.5 w-3.5" />
                      جاهزية مرتفعه
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-none bg-white/80 dark:bg-slate-900/50 shadow-lg">
          <CardHeader>
            <CardTitle>تنبيهات المخزون الحرجة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lowStockAlerts.map((alert) => (
              <div key={alert.sku} className="rounded-3xl border border-amber-200/80 dark:border-amber-500/30 bg-amber-50/70 dark:bg-amber-500/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">{alert.name}</p>
                    <p className="text-xs text-muted-foreground">كود المنتج: {alert.sku}</p>
                  </div>
                  <Badge className="bg-white/70 text-amber-700 dark:bg-amber-500/20">{alert.action}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>المتبقي: {alert.remaining} وحدة</span>
                  <span>المتجر: {alert.store}</span>
                  <span>معدل السحب: {alert.turnover}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">أقصى وقت للمعالجة</span>
                  <span className="font-semibold text-rose-600">{alert.eta}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-none bg-white/80 dark:bg-slate-900/50 shadow-lg">
          <CardHeader>
            <CardTitle>شحنات قيد الوصول</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {inboundShipments.map((shipment) => (
              <div key={shipment.id} className="flex flex-col gap-3 rounded-3xl border border-slate-200/80 dark:border-slate-800/60 bg-white/90 dark:bg-slate-900/40 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{shipment.id}</p>
                    <p className="text-xs text-muted-foreground">المورد: {shipment.vendor}</p>
                  </div>
                  <Badge variant="outline" className="rounded-full border-indigo-200 text-indigo-600 dark:text-indigo-300">
                    {shipment.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-3 py-1 text-indigo-600 dark:text-indigo-300">
                    <Truck className="h-3.5 w-3.5" />
                    {shipment.route}
                  </span>
                  <span>عدد القطع: {shipment.items}</span>
                  <span>الوصول المتوقع: {shipment.eta}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-none bg-white/80 dark:bg-slate-900/50 shadow-lg">
          <CardHeader>
            <CardTitle>صحة سلسلة الإمداد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl border border-emerald-200/80 dark:border-emerald-500/30 bg-emerald-500/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">نسبة الالتزام بالتوريد</p>
                  <p className="text-xs text-muted-foreground">متوسط آخر 30 يومًا</p>
                </div>
                <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">96%</span>
              </div>
              <Progress value={96} className="mt-4 h-2.5" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
              <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/60 bg-white/90 dark:bg-slate-900/40 p-4">
                <p>متوسط زمن التجهيز</p>
                <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">11.4 ساعة</p>
              </div>
              <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/60 bg-white/90 dark:bg-slate-900/40 p-4">
                <p>نسبة التطابق مع الفواتير</p>
                <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">99.2%</p>
              </div>
              <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/60 bg-white/90 dark:bg-slate-900/40 p-4">
                <p>كفاءة التخزين المبرد</p>
                <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">92%</p>
              </div>
              <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/60 bg-white/90 dark:bg-slate-900/40 p-4">
                <p>معدلات التلف</p>
                <p className="mt-2 text-lg font-semibold text-emerald-600 dark:text-emerald-300">0.7%</p>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/60 bg-white/90 dark:bg-slate-900/40 p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-900 dark:text-white">إجراءات وقائية</span>
                <Badge className="bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">3 مهام حرجة</Badge>
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>تدقيق سلامة مستودع طرابلس</span>
                  <span className="text-emerald-600">منفذ</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>معايرة حساسات الرطوبة بمصراتة</span>
                  <span className="text-amber-600">خلال 6 ساعات</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>تحديث شهادات النقل المبرد</span>
                  <span className="text-rose-600">مستحق اليوم</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryManagement;
