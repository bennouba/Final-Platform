import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, Ban, CheckCircle, ClipboardList, RefreshCw, RotateCcw } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, Line, CartesianGrid, Tooltip, XAxis, YAxis, BarChart, Bar, Cell } from "recharts";

const formatNumber = (value: number) => value.toLocaleString("en-US");
const formatCurrency = (value: number) => `${value.toLocaleString("en-US")} د.ل`;

type OrderStatusKey = "completed" | "processing" | "manual" | "abandoned" | "unavailable";

const orderSummaryCards = [
  {
    id: "completed" as OrderStatusKey,
    label: "طلبات مكتملة",
    value: 10874,
    delta: "+6.1%",
    positive: true,
    icon: CheckCircle,
    hint: "متوسط زمن الإنجاز 2.8 دقيقة"
  },
  {
    id: "processing" as OrderStatusKey,
    label: "طلبات تحت الإجراء",
    value: 2675,
    delta: "+3.4%",
    positive: true,
    icon: Activity,
    hint: "83% ضمن معيار SLA"
  },
  {
    id: "manual" as OrderStatusKey,
    label: "طلبات يدوية",
    value: 948,
    delta: "-1.8%",
    positive: true,
    icon: ClipboardList,
    hint: "اعتماد متوسط خلال 3.2 دقيقة"
  },
  {
    id: "abandoned" as OrderStatusKey,
    label: "طلبات متروكة",
    value: 421,
    delta: "-2.4%",
    positive: true,
    icon: RotateCcw,
    hint: "استرجاع 168 طلب بفضل حملات التفاعل"
  },
  {
    id: "unavailable" as OrderStatusKey,
    label: "طلبات غير متوفرة",
    value: 138,
    delta: "+0.9%",
    positive: false,
    icon: Ban,
    hint: "يتم تحويلها لفرق المخزون خلال 12 دقيقة"
  }
];

const statusConfigurations: Record< OrderStatusKey, {
  title: string;
  description: string;
  badge: string;
  areaColor: string;
  lineColor: string;
  timeline: { day: string; count: number; resolution: number }[];
  timelineLabels: { primary: string; secondary: string; formatPrimary: (value: number) => string; formatSecondary: (value: number) => string };
  metrics: { label: string; value: string; change: string; positive: boolean }[];
  topStores: { name: string; contribution: string }[];
  recentOrders: { id: string; customer: string; value: string; channel: string; updated: string; status: string; tone: string }[];
}> = {
  completed: {
    title: "الطلبات المكتملة",
    description: "الطلبات التي تم تسليمها بنجاح مع ضمان جودة التجربة ورضا العميل",
    badge: "معدل التنفيذ 96%",
    areaColor: "#22c55e",
    lineColor: "#6366f1",
    timeline: [
      { day: "الأحد", count: 1462, resolution: 94 },
      { day: "الإثنين", count: 1528, resolution: 95 },
      { day: "الثلاثاء", count: 1564, resolution: 96 },
      { day: "الأربعاء", count: 1588, resolution: 96 },
      { day: "الخميس", count: 1624, resolution: 97 },
      { day: "الجمعة", count: 1682, resolution: 97 },
      { day: "السبت", count: 1726, resolution: 98 }
    ],
    timelineLabels: {
      primary: "طلبات مكتملة",
      secondary: "ضمن معيار SLA",
      formatPrimary: (value) => formatNumber(Math.round(value)),
      formatSecondary: (value) => `${Math.round(value)}%`
    },
    metrics: [
      { label: "متوسط زمن الإنجاز", value: "2.8 دقيقة", change: "-14 ثانية", positive: true },
      { label: "تحويل القنوات", value: "91%", change: "+3.2%", positive: true },
      { label: "إعادة فتح الطلبات", value: "0.6%", change: "-0.3%", positive: true }
    ],
    topStores: [
      { name: "متجر نواعم", contribution: "24%" },
      { name: "متجر شيرين", contribution: "18%" },
      { name: "متجر بيريتي", contribution: "16%" },
      { name: "دالتا ستور", contribution: "14%" }
    ],
    recentOrders: [
      { id: "ORD-98214", customer: "عائشة بن رمضان", value: formatCurrency(218), channel: "واجهة المستخدم", updated: "قبل 12 دقيقة", status: "سُلّم", tone: "text-emerald-600" },
      { id: "ORD-98196", customer: "مصطفى الشريف", value: formatCurrency(742), channel: "واجهة التاجر", updated: "قبل 24 دقيقة", status: "سُلّم", tone: "text-emerald-600" },
      { id: "ORD-98172", customer: "ليبيا بيزنس", value: formatCurrency(1290), channel: "التكاملات", updated: "قبل 41 دقيقة", status: "سُلّم", tone: "text-emerald-600" }
    ]
  },
  processing: {
    title: "طلبات تحت الإجراء",
    description: "طلبات في مراحل التنفيذ مع متابعة دقيقة لزمن المعالجة والاعتماد",
    badge: "83% ضمن SLA",
    areaColor: "#2563eb",
    lineColor: "#facc15",
    timeline: [
      { day: "الأحد", count: 348, resolution: 78 },
      { day: "الإثنين", count: 362, resolution: 80 },
      { day: "الثلاثاء", count: 379, resolution: 82 },
      { day: "الأربعاء", count: 384, resolution: 83 },
      { day: "الخميس", count: 396, resolution: 84 },
      { day: "الجمعة", count: 412, resolution: 85 },
      { day: "السبت", count: 394, resolution: 86 }
    ],
    timelineLabels: {
      primary: "طلبات قيد التنفيذ",
      secondary: "إلتزام SLA",
      formatPrimary: (value) => formatNumber(Math.round(value)),
      formatSecondary: (value) => `${Math.round(value)}%`
    },
    metrics: [
      { label: "متوسط زمن المعالجة", value: "7.4 دقيقة", change: "-0.6 دقيقة", positive: true },
      { label: "طلبات تحتاج متابعة", value: formatNumber(186), change: "-12 حالة", positive: true },
      { label: "أولوية حرجة", value: formatNumber(32), change: "+4 حالات", positive: false }
    ],
    topStores: [
      { name: "متجر شيرين", contribution: "21%" },
      { name: "متجر نواعم", contribution: "19%" },
      { name: "متجر ميجنا", contribution: "17%" },
      { name: "دالتا ستور", contribution: "13%" }
    ],
    recentOrders: [
      { id: "ORD-98163", customer: "هدى بن عبد الله", value: formatCurrency(564), channel: "واجهة المستخدم", updated: "قبل 8 دقائق", status: "تجهيز", tone: "text-amber-600" },
      { id: "ORD-98142", customer: "شركة فلاير", value: formatCurrency(1428), channel: "التكاملات", updated: "قبل 19 دقيقة", status: "تحويل", tone: "text-amber-600" },
      { id: "ORD-98131", customer: "محمد فراج", value: formatCurrency(286), channel: "واجهة التاجر", updated: "قبل 27 دقيقة", status: "انتظار دفع", tone: "text-amber-600" }
    ]
  },
  manual: {
    title: "طلبات يدوية",
    description: "طلبات تم إنشاؤها عبر فرق الدعم لضمان تدفق العمليات خارج القنوات المؤتمتة",
    badge: "اعتماد 88% خلال 15 دقيقة",
    areaColor: "#f97316",
    lineColor: "#14b8a6",
    timeline: [
      { day: "الأحد", count: 128, resolution: 82 },
      { day: "الإثنين", count: 134, resolution: 84 },
      { day: "الثلاثاء", count: 138, resolution: 86 },
      { day: "الأربعاء", count: 142, resolution: 87 },
      { day: "الخميس", count: 146, resolution: 88 },
      { day: "الجمعة", count: 132, resolution: 89 },
      { day: "السبت", count: 128, resolution: 90 }
    ],
    timelineLabels: {
      primary: "طلبات يدوية",
      secondary: "اعتماد يدوي",
      formatPrimary: (value) => formatNumber(Math.round(value)),
      formatSecondary: (value) => `${Math.round(value)}%`
    },
    metrics: [
      { label: "اعتماد خلال 10 دقائق", value: "74%", change: "+6%", positive: true },
      { label: "طلبات تم تحويلها رقميًا", value: formatNumber(286), change: "+32 طلب", positive: true },
      { label: "متوسط قيمة الطلب", value: formatCurrency(318), change: "+5.1%", positive: true }
    ],
    topStores: [
      { name: "متجر نواعم", contribution: "26%" },
      { name: "متجر بيريتي", contribution: "22%" },
      { name: "متجر ميجنا", contribution: "19%" },
      { name: "دالتا ستور", contribution: "16%" }
    ],
    recentOrders: [
      { id: "ORD-98118", customer: "مركز ألفا الطبي", value: formatCurrency(1680), channel: "الدعم اليدوي", updated: "قبل 5 دقائق", status: "قيد الاعتماد", tone: "text-sky-600" },
      { id: "ORD-98097", customer: "منى المصراطي", value: formatCurrency(482), channel: "الدعم اليدوي", updated: "قبل 17 دقيقة", status: "تم التنفيذ", tone: "text-emerald-600" },
      { id: "ORD-98084", customer: "شركة لين الدولية", value: formatCurrency(2046), channel: "الدعم اليدوي", updated: "قبل 31 دقيقة", status: "مراجعة محاسبية", tone: "text-sky-600" }
    ]
  },
  abandoned: {
    title: "طلبات متروكة",
    description: "طلبات غادرت مسار الشراء ويتم العمل على استرجاعها بحملات مخصصة",
    badge: "استرجاع 39% خلال اليوم",
    areaColor: "#f43f5e",
    lineColor: "#22c55e",
    timeline: [
      { day: "الأحد", count: 68, resolution: 31 },
      { day: "الإثنين", count: 74, resolution: 33 },
      { day: "الثلاثاء", count: 62, resolution: 35 },
      { day: "الأربعاء", count: 58, resolution: 37 },
      { day: "الخميس", count: 64, resolution: 38 },
      { day: "الجمعة", count: 52, resolution: 39 },
      { day: "السبت", count: 43, resolution: 41 }
    ],
    timelineLabels: {
      primary: "طلبات متروكة",
      secondary: "نسبة الاسترجاع",
      formatPrimary: (value) => formatNumber(Math.round(value)),
      formatSecondary: (value) => `${Math.round(value)}%`
    },
    metrics: [
      { label: "طلبات تمت استعادتها", value: formatNumber(168), change: "+28 طلب", positive: true },
      { label: "عربات تحتاج متابعة", value: formatNumber(94), change: "-12 عربة", positive: true },
      { label: "متوسط قيمة السلة", value: formatCurrency(246), change: "+3.4%", positive: true }
    ],
    topStores: [
      { name: "متجر شيرين", contribution: "22%" },
      { name: "متجر نواعم", contribution: "20%" },
      { name: "متجر ميجنا", contribution: "17%" },
      { name: "متجر بيريتي", contribution: "15%" }
    ],
    recentOrders: [
      { id: "ORD-98072", customer: "جميلة الطرابلسي", value: formatCurrency(362), channel: "واجهة المستخدم", updated: "قبل 9 دقائق", status: "قيد الاسترجاع", tone: "text-rose-600" },
      { id: "ORD-98051", customer: "فراس الديب", value: formatCurrency(514), channel: "واجهة المستخدم", updated: "قبل 21 دقيقة", status: "تذكير مرسل", tone: "text-rose-600" },
      { id: "ORD-98046", customer: "شركة مدار", value: formatCurrency(1870), channel: "التكاملات", updated: "قبل 33 دقيقة", status: "استعاد", tone: "text-emerald-600" }
    ]
  },
  unavailable: {
    title: "طلبات غير متوفرة",
    description: "طلبات تمت إعادتها بسبب نفاد المخزون ويتم تحويلها لفرق الإمداد",
    badge: "تحويل للمخزون خلال 12 دقيقة",
    areaColor: "#a855f7",
    lineColor: "#f97316",
    timeline: [
      { day: "الأحد", count: 24, resolution: 58 },
      { day: "الإثنين", count: 22, resolution: 61 },
      { day: "الثلاثاء", count: 19, resolution: 63 },
      { day: "الأربعاء", count: 18, resolution: 64 },
      { day: "الخميس", count: 21, resolution: 66 },
      { day: "الجمعة", count: 17, resolution: 68 },
      { day: "السبت", count: 17, resolution: 69 }
    ],
    timelineLabels: {
      primary: "طلبات غير متوفرة",
      secondary: "حل المخزون",
      formatPrimary: (value) => formatNumber(Math.round(value)),
      formatSecondary: (value) => `${Math.round(value)}%`
    },
    metrics: [
      { label: "متوسط زمن الحل", value: "74 دقيقة", change: "-11 دقيقة", positive: true },
      { label: "تحويل لمستودعات بديلة", value: formatNumber(62), change: "+18 طلب", positive: true },
      { label: "طلبات بحاجة لتصعيد", value: formatNumber(9), change: "+3 طلب", positive: false }
    ],
    topStores: [
      { name: "متجر دالتا ستور", contribution: "23%" },
      { name: "متجر ميجنا", contribution: "21%" },
      { name: "متجر بيريتي", contribution: "19%" },
      { name: "متجر شيرين", contribution: "16%" }
    ],
    recentOrders: [
      { id: "ORD-98035", customer: "سارة المسماري", value: formatCurrency(428), channel: "واجهة المستخدم", updated: "قبل 7 دقائق", status: "تحويل مخزون", tone: "text-fuchsia-600" },
      { id: "ORD-98018", customer: "مؤسسة قمة الشرق", value: formatCurrency(2380), channel: "التكاملات", updated: "قبل 25 دقيقة", status: "إجراء بديل", tone: "text-fuchsia-600" },
      { id: "ORD-98007", customer: "سلوى الكوافي", value: formatCurrency(318), channel: "واجهة التاجر", updated: "قبل 38 دقيقة", status: "استرداد", tone: "text-rose-600" }
    ]
  }
};

const channelPerformance = [
  { channel: "واجهة التاجر", orders: 7284, completion: 94, color: "#6366f1" },
  { channel: "واجهة المستخدم", orders: 6120, completion: 91, color: "#22c55e" },
  { channel: "الدعم اليدوي", orders: 948, completion: 86, color: "#f97316" },
  { channel: "التكاملات", orders: 782, completion: 88, color: "#14b8a6" }
];

const escalationAlerts = [
  {
    id: "ESC-417",
    store: "متجر شيرين",
    issue: "تجميد 12 طلب بانتظار معالجة المخزون",
    owner: "فريق المخزون",
    eta: "خلال 45 دقيقة",
    severity: "مرتفع"
  },
  {
    id: "ESC-423",
    store: "متجر ميجنا",
    issue: "محاولة دفع مكررة لمبلغ كبير",
    owner: "فريق المالي",
    eta: "خلال 30 دقيقة",
    severity: "حساس"
  },
  {
    id: "ESC-431",
    store: "متجر دالتا ستور",
    issue: "طلبات أجهزة غير متوفرة تحتاج توريد عاجل",
    owner: "فريق الخدمات",
    eta: "قبل نهاية اليوم",
    severity: "مرتفع"
  }
];

const serviceQuality = [
  { id: "sla-15", label: "إغلاق خلال 15 دقيقة", value: 87, caption: "هدف 80%" },
  { id: "sla-30", label: "إغلاق خلال 30 دقيقة", value: 95, caption: "هدف 90%" },
  { id: "satisfaction", label: "مؤشر رضا العملاء", value: 91, caption: "هدف 88%" }
];

const storeSnapshots = [
  {
    name: "متجر نواعم",
    completed: formatNumber(1624),
    processing: formatNumber(186),
    abandoned: formatNumber(52),
    sla: "98%"
  },
  {
    name: "متجر شيرين",
    completed: formatNumber(1482),
    processing: formatNumber(232),
    abandoned: formatNumber(61),
    sla: "95%"
  },
  {
    name: "متجر بيريتي",
    completed: formatNumber(1218),
    processing: formatNumber(198),
    abandoned: formatNumber(47),
    sla: "93%"
  },
  {
    name: "متجر دالتا ستور",
    completed: formatNumber(1086),
    processing: formatNumber(174),
    abandoned: formatNumber(38),
    sla: "91%"
  }
];

const OrdersManagement = () => {
  const [activeStatus, setActiveStatus] = useState<OrderStatusKey>("completed");

  const summaryCards = useMemo(
    () =>
      orderSummaryCards.map((card) => ({
        ...card,
        displayValue: formatNumber(card.value)
      })),
    []
  );

  const activeDetail = statusConfigurations[activeStatus];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          const isActive = activeStatus === card.id;
          return (
            <Card
              key={card.id}
              className={`border-none bg-white/80 dark:bg-slate-900/50 shadow-lg transition-all duration-200 ${isActive ? "ring-2 ring-indigo-500 shadow-xl" : "hover:-translate-y-1 hover:shadow-xl"}`}
              role="button"
              tabIndex={0}
              onClick={() => setActiveStatus(card.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveStatus(card.id);
                }
              }}
            >
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">{card.label}</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{card.displayValue}</p>
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

      <Card className="border-none bg-white/80 dark:bg-slate-900/50 shadow-lg">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>{activeDetail.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{activeDetail.description}</p>
          </div>
          <Badge className="bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">{activeDetail.badge}</Badge>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{activeDetail.timelineLabels.primary}</span>
              <span>{activeDetail.timelineLabels.secondary}</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={activeDetail.timeline}>
                <defs>
                  <linearGradient id={`orders-${activeStatus}-area`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeDetail.areaColor} stopOpacity={0.85} />
                    <stop offset="95%" stopColor={activeDetail.areaColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="day" tickMargin={12} />
                <YAxis yAxisId="primary" width={90} tickFormatter={(value) => activeDetail.timelineLabels.formatPrimary(Number(value))} />
                <YAxis
                  yAxisId="secondary"
                  orientation="right"
                  width={90}
                  tickFormatter={(value) => activeDetail.timelineLabels.formatSecondary(Number(value))}
                />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === "count") {
                      return [activeDetail.timelineLabels.formatPrimary(value), activeDetail.timelineLabels.primary];
                    }
                    return [activeDetail.timelineLabels.formatSecondary(value), activeDetail.timelineLabels.secondary];
                  }}
                />
                <Area type="monotone" dataKey="count" stroke={activeDetail.areaColor} fill={`url(#orders-${activeStatus}-area)`} strokeWidth={3} yAxisId="primary" />
                <Line type="monotone" dataKey="resolution" stroke={activeDetail.lineColor} strokeWidth={3} dot={false} yAxisId="secondary" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="lg:col-span-2 space-y-3">
            {activeDetail.metrics.map((metric) => (
              <div key={metric.label} className="rounded-3xl border border-slate-200/70 dark:border-slate-800/50 bg-white/90 dark:bg-slate-900/40 px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{metric.label}</p>
                  <span className={`text-xs font-semibold ${metric.positive ? "text-emerald-600" : "text-rose-600"}`}>{metric.change}</span>
                </div>
                <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{metric.value}</p>
              </div>
            ))}
            <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800/50 bg-white/90 dark:bg-slate-900/40 px-4 py-3 space-y-3">
              <p className="text-xs text-muted-foreground">المتاجر الأعلى حجماً</p>
              <div className="flex flex-wrap gap-2">
                {activeDetail.topStores.map((store) => (
                  <Badge key={store.name} variant="outline" className="rounded-full border-indigo-200 text-indigo-600 dark:text-indigo-300">
                    {store.name} • {store.contribution}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {activeDetail.recentOrders.map((order) => (
                <div key={order.id} className="rounded-3xl border border-slate-200/70 dark:border-slate-800/50 bg-white/90 dark:bg-slate-900/40 px-4 py-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-900 dark:text-white">{order.id}</span>
                    <span className={`text-xs font-semibold ${order.tone}`}>{order.status}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>{order.customer}</span>
                    <span>{order.channel}</span>
                    <span>{order.updated}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{order.value}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 border-none bg-white/80 dark:bg-slate-900/50 shadow-lg">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>قنوات تنفيذ الطلبات</CardTitle>
              <p className="text-sm text-muted-foreground">مقارنة بين القنوات المؤتمتة واليدوية من حيث الكميات ونسبة الاكتمال</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              تحديث البيانات
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={channelPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="channel" tickMargin={12} />
                <YAxis tickFormatter={(value) => formatNumber(Number(value))} />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === "orders") {
                      return [formatNumber(Number(value)), "الطلبات"];
                    }
                    return [`${value}%`, "نسبة الاكتمال"];
                  }}
                />
                <Bar dataKey="orders" radius={[12, 12, 0, 0]}>
                  {channelPerformance.map((item) => (
                    <Cell key={item.channel} fill={item.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="grid gap-3 sm:grid-cols-2 text-xs text-muted-foreground">
              {channelPerformance.map((item) => (
                <div key={item.channel} className="flex items-center justify-between rounded-3xl border border-slate-200/70 dark:border-slate-800/50 bg-white/90 dark:bg-slate-900/40 px-4 py-3">
                  <span className="font-semibold text-slate-900 dark:text-white">{item.channel}</span>
                  <span className="text-emerald-600">اكتمال {item.completion}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/80 dark:bg-slate-900/50 shadow-lg">
          <CardHeader>
            <CardTitle>تنبيهات التصعيد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {escalationAlerts.map((alert) => (
              <div key={alert.id} className="rounded-3xl border border-rose-200/70 dark:border-rose-500/30 bg-rose-50/70 dark:bg-rose-500/10 p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-rose-700 dark:text-rose-300">{alert.id}</span>
                  <Badge className="bg-white/70 text-rose-700 dark:bg-rose-500/20">{alert.severity}</Badge>
                </div>
                <p className="text-sm text-slate-900 dark:text-white">{alert.store}</p>
                <p className="text-xs text-muted-foreground leading-5">{alert.issue}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>مسؤول: {alert.owner}</span>
                  <span className="text-amber-600">{alert.eta}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-none bg-white/80 dark:bg-slate-900/50 shadow-lg">
          <CardHeader>
            <CardTitle>مؤشرات جودة الخدمة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {serviceQuality.map((metric) => (
              <div key={metric.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{metric.label}</span>
                  <span>{metric.caption}</span>
                </div>
                <div className="flex items-center justify-between">
                  <Progress value={metric.value} className="h-2.5 w-full" />
                  <span className="ml-3 text-sm font-semibold text-slate-900 dark:text-white">{metric.value}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-none bg-white/80 dark:bg-slate-900/50 shadow-lg">
          <CardHeader>
            <CardTitle>أداء المتاجر</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {storeSnapshots.map((store) => (
              <div key={store.name} className="rounded-3xl border border-slate-200/70 dark:border-slate-800/50 bg-white/90 dark:bg-slate-900/40 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-900 dark:text-white">{store.name}</span>
                  <Badge variant="outline" className="rounded-full border-emerald-200 text-emerald-600 dark:text-emerald-300">
                    SLA {store.sla}
                  </Badge>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div className="rounded-2xl bg-indigo-500/10 px-3 py-2 text-indigo-600 dark:text-indigo-300">
                    مكتملة
                    <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{store.completed}</div>
                  </div>
                  <div className="rounded-2xl bg-amber-500/10 px-3 py-2 text-amber-600">
                    قيد التنفيذ
                    <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{store.processing}</div>
                  </div>
                  <div className="rounded-2xl bg-rose-500/10 px-3 py-2 text-rose-600">
                    متروكة
                    <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{store.abandoned}</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrdersManagement;
