import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, BarChart3, Radio, Sparkles, Users } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, Line, CartesianGrid, Tooltip, XAxis, YAxis, BarChart, Bar, Cell } from "recharts";

const formatNumber = (value: number) => value.toLocaleString("en-US");

interface HighlightModeBadge {
  icon: LucideIcon;
  text: string;
  className: string;
}

interface HighlightModeSummary {
  label: string;
  value: string;
  descriptor: string;
}

interface HighlightModeConfig {
  chartData: { time: string; primary: number; secondary: number }[];
  primaryLabel: string;
  secondaryLabel: string;
  formatPrimary: (value: number) => string;
  formatSecondary: (value: number) => string;
  areaColor: string;
  lineColor: string;
  badges: HighlightModeBadge[];
  summary: HighlightModeSummary[];
}

interface HighlightConfig {
  id: string;
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  icon: LucideIcon;
  hint: string;
  mode: HighlightModeConfig;
}

const AnalyticsDashboard = () => {
  const analyticsHighlightConfigs = useMemo<Record<string, HighlightConfig>>(
    () => ({
      live: {
        id: "live",
        label: "الزوار المتصلون الآن",
        value: formatNumber(508),
        delta: "+28%",
        positive: true,
        icon: Activity,
        hint: "أعلى ذروة منذ 7 أيام",
        mode: {
          chartData: [
            { time: "10:00", primary: 180, secondary: 22 },
            { time: "12:00", primary: 240, secondary: 32 },
            { time: "14:00", primary: 320, secondary: 42 },
            { time: "16:00", primary: 410, secondary: 61 },
            { time: "18:00", primary: 508, secondary: 74 },
            { time: "20:00", primary: 462, secondary: 68 }
          ],
          primaryLabel: "الجلسات",
          secondaryLabel: "التحويلات",
          formatPrimary: (value) => `${formatNumber(Math.round(value))} جلسة`,
          formatSecondary: (value) => `${formatNumber(Math.round(value))} عملية`,
          areaColor: "#6366f1",
          lineColor: "#22c55e",
          badges: [
            {
              icon: Users,
              text: `متوسط الجلسات لكل متجر ${formatNumber(312)} جلسة`,
              className: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"
            },
            {
              icon: Sparkles,
              text: "معدل التفاعل اللحظي 67%",
              className: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15"
            }
          ],
          summary: [
            { label: "ذروة اليوم", value: `${formatNumber(612)} زائر`, descriptor: "الساعة 18:00" },
            { label: "القنوات الأعلى", value: "إعلانات مدفوعة", descriptor: "تمثل 38% من الجلسات" },
            { label: "المتاجر المتصلة", value: formatNumber(148), descriptor: "بث مباشر" }
          ]
        }
      },
      conversion: {
        id: "conversion",
        label: "معدل التحويل اللحظي",
        value: "3.4%",
        delta: "+0.6%",
        positive: true,
        icon: Sparkles,
        hint: "زيادة عبر الحملات الجديدة",
        mode: {
          chartData: [
            { time: "10:00", primary: 2.4, secondary: 58 },
            { time: "12:00", primary: 2.9, secondary: 64 },
            { time: "14:00", primary: 3.1, secondary: 71 },
            { time: "16:00", primary: 3.6, secondary: 86 },
            { time: "18:00", primary: 3.9, secondary: 94 },
            { time: "20:00", primary: 3.4, secondary: 88 }
          ],
          primaryLabel: "نسبة التحويل",
          secondaryLabel: "عمليات ناجحة",
          formatPrimary: (value) => `${value.toFixed(1)}%`,
          formatSecondary: (value) => `${formatNumber(Math.round(value))} طلب`,
          areaColor: "#f97316",
          lineColor: "#6366f1",
          badges: [
            {
              icon: Sparkles,
              text: "تجربة واجهة التاجر عززت التحويل 12%",
              className: "bg-orange-500/10 text-orange-600 dark:bg-orange-500/15"
            },
            {
              icon: BarChart3,
              text: "متوسط قيمة السلة 184 د.ل",
              className: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"
            }
          ],
          summary: [
            { label: "أفضل حملة", value: "رجوع العملاء", descriptor: "معدل تحويل 4.8%" },
            { label: "الأجهزة الأعلى", value: "الهاتف المتنقل", descriptor: "68% من الطلبات" },
            { label: "طلبات ناجحة", value: formatNumber(412), descriptor: "آخر ساعة" }
          ]
        }
      },
      "session-length": {
        id: "session-length",
        label: "متوسط مدة الجلسة",
        value: "6:42 دقيقة",
        delta: "-4%",
        positive: false,
        icon: Users,
        hint: "تحسن متوقع بعد تفعيل صفحات الواجهة",
        mode: {
          chartData: [
            { time: "10:00", primary: 6.1, secondary: 32 },
            { time: "12:00", primary: 6.4, secondary: 30 },
            { time: "14:00", primary: 6.7, secondary: 28 },
            { time: "16:00", primary: 6.3, secondary: 26 },
            { time: "18:00", primary: 6.9, secondary: 24 },
            { time: "20:00", primary: 6.4, secondary: 25 }
          ],
          primaryLabel: "مدة الجلسة",
          secondaryLabel: "معدل الارتداد",
          formatPrimary: (value) => `${value.toFixed(2)} دقيقة`,
          formatSecondary: (value) => `${value.toFixed(1)}%`,
          areaColor: "#14b8a6",
          lineColor: "#f43f5e",
          badges: [
            {
              icon: Users,
              text: "صفحات المقارنات تستحوذ على 38% من الوقت",
              className: "bg-teal-500/10 text-teal-600 dark:bg-teal-500/15"
            },
            {
              icon: Activity,
              text: "تحسين السرعة يقلل الارتداد المتوقع 1.2%",
              className: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/15"
            }
          ],
          summary: [
            { label: "شرائح العملاء", value: "التجار الجدد", descriptor: "متوسط 7:12 دقيقة" },
            { label: "الأجهزة", value: "سطح المكتب", descriptor: "مدة 8:04 دقيقة" },
            { label: "الصفحات الأعلى", value: "التقارير المالية", descriptor: "نسبة 24% من الوقت" }
          ]
        }
      }
    }),
    []
  );

  const highlights = useMemo(() => Object.values(analyticsHighlightConfigs), [analyticsHighlightConfigs]);
  const [activeHighlight, setActiveHighlight] = useState(() => highlights[0]?.id ?? "live");
  const activeConfig = analyticsHighlightConfigs[activeHighlight] ?? highlights[0];
  const activeMode = activeConfig.mode;

  const trafficSources = useMemo(
    () => [
      { channel: "إعلانات مدفوعة", share: 38, quality: "مرتفع", color: "#6366f1" },
      { channel: "السوشيال ميديا", share: 27, quality: "متوسط", color: "#22c55e" },
      { channel: "متاجر الشركاء", share: 19, quality: "مرتفع", color: "#f97316" },
      { channel: "بحث عضوي", share: 11, quality: "متوسط", color: "#14b8a6" },
      { channel: "قنوات أخرى", share: 5, quality: "منخفض", color: "#a855f7" }
    ],
    []
  );

  const regionalHeatmap = useMemo(
    () => [
      { region: "طرابلس", share: 42, response: "سريع" },
      { region: "بنغازي", share: 26, response: "ممتاز" },
      { region: "مصراتة", share: 14, response: "جيد" },
      { region: "سبها", share: 9, response: "متوسط" },
      { region: "الخمس", share: 6, response: "بحاجة تعزيز" }
    ],
    []
  );

  const funnelStages = useMemo(
    () => [
      { stage: "زيارات الواجهة", value: 18450, completion: "100%" },
      { stage: "تصفح المنتجات", value: 9680, completion: "52%" },
      { stage: "إضافة للسلة", value: 4820, completion: "26%" },
      { stage: "إتمام الطلب", value: 2140, completion: "11%" },
      { stage: "دفع ناجح", value: 1890, completion: "10%" }
    ],
    []
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {highlights.map((metric) => {
          const Icon = metric.icon;
          const isActive = metric.id === activeHighlight;
          return (
            <Card
              key={metric.id}
              className={`border-none bg-white/80 dark:bg-slate-900/50 shadow-lg transition-all duration-200 ${isActive ? "ring-2 ring-indigo-500 shadow-xl" : "hover:-translate-y-1 hover:shadow-xl"}`}
              role="button"
              tabIndex={0}
              onClick={() => setActiveHighlight(metric.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveHighlight(metric.id);
                }
              }}
            >
              <CardContent className="flex items-center justify-between gap-4 p-6">
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.hint}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className={`text-sm font-semibold ${metric.positive ? "text-emerald-600" : "text-rose-600"}`}>{metric.delta}</span>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isActive ? "bg-indigo-500 text-white" : "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 border-none bg-white/80 dark:bg-slate-900/50 shadow-lg">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>تحليلات الجلسات اللحظية</CardTitle>
              <p className="text-sm text-muted-foreground">{activeConfig.label} بتركيز فوري لكل متغير مؤثر</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              عرض تفصيلي
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={activeMode.chartData}>
                <defs>
                  <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeMode.areaColor} stopOpacity={0.85} />
                    <stop offset="95%" stopColor={activeMode.areaColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="time" tickMargin={12} />
                <YAxis yAxisId="primary" tickFormatter={(value) => activeMode.formatPrimary(Number(value))} width={100} />
                <YAxis yAxisId="secondary" orientation="right" tickFormatter={(value) => activeMode.formatSecondary(Number(value))} width={100} />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === "primary") {
                      return [activeMode.formatPrimary(value), activeMode.primaryLabel];
                    }
                    return [activeMode.formatSecondary(value), activeMode.secondaryLabel];
                  }}
                  labelFormatter={(label) => `الوقت ${label}`}
                />
                <Area type="monotone" dataKey="primary" stroke={activeMode.areaColor} fill="url(#primaryGradient)" strokeWidth={3} yAxisId="primary" name="primary" />
                <Line type="monotone" dataKey="secondary" stroke={activeMode.lineColor} strokeWidth={3} dot={false} yAxisId="secondary" name="secondary" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="grid gap-3 sm:grid-cols-2 text-xs text-muted-foreground">
              {activeMode.badges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.text} className={`inline-flex items-center gap-2 rounded-full px-3 py-2 ${badge.className}`}>
                    <Icon className="h-3.5 w-3.5" />
                    {badge.text}
                  </div>
                );
              })}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {activeMode.summary.map((item) => (
                <div key={item.label} className="rounded-3xl border border-slate-200/70 dark:border-slate-800/50 bg-white/90 dark:bg-slate-900/40 px-4 py-3 space-y-2">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.descriptor}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/80 dark:bg-slate-900/50 shadow-lg">
          <CardHeader>
            <CardTitle>حصة القنوات الرقمية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={trafficSources}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="channel" tickMargin={12} />
                <YAxis hide />
                <Tooltip formatter={(value: number) => [`${value}%`, "الحصة"]} />
                <Bar dataKey="share" radius={[12, 12, 0, 0]}>
                  {trafficSources.map((source) => (
                    <Cell key={source.channel} fill={source.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="space-y-2 text-xs text-muted-foreground">
              {trafficSources.map((source) => (
                <div key={source.channel} className="flex items-center justify-between rounded-2xl border border-slate-200/70 dark:border-slate-800/50 bg-white/90 dark:bg-slate-900/40 px-3 py-2">
                  <span className="font-semibold text-slate-900 dark:text-white">{source.channel}</span>
                  <Badge variant="outline" className="rounded-full border-emerald-200 text-emerald-600 dark:text-emerald-300">
                    جودة {source.quality}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-none bg-white/80 dark:bg-slate-900/50 shadow-lg">
          <CardHeader>
            <CardTitle>خريطة التفاعل الإقليمية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {regionalHeatmap.map((region) => (
              <div key={region.region} className="rounded-3xl border border-slate-200/70 dark:border-slate-800/50 bg-white/90 dark:bg-slate-900/40 p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-900 dark:text-white">{region.region}</span>
                  <Badge variant="outline" className="rounded-full border-indigo-200 text-indigo-600 dark:text-indigo-300">
                    تفاعل {region.response}
                  </Badge>
                </div>
                <Progress value={region.share} className="h-2.5" />
                <div className="text-xs text-muted-foreground">حصة الزيارات: {region.share}%</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-none bg-white/80 dark:bg-slate-900/50 shadow-lg">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>تحليل مسار التحويل</CardTitle>
              <p className="text-sm text-muted-foreground">رصد نقاط الانخفاض في رحلة العميل</p>
            </div>
            <Badge className="bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">معدل اكتمال 32%</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {funnelStages.map((stage) => (
              <div key={stage.stage} className="rounded-3xl border border-slate-200/70 dark:border-slate-800/50 bg-white/90 dark:bg-slate-900/40 px-4 py-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-900 dark:text-white">{stage.stage}</span>
                  <span className="text-xs text-muted-foreground">{stage.completion}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatNumber(stage.value)} زيارة</span>
                  <span className="text-emerald-600">معدل الاحتفاظ {stage.completion}</span>
                </div>
                <Progress value={(stage.value / funnelStages[0].value) * 100} className="mt-2 h-2.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-none bg-white/80 dark:bg-slate-900/50 shadow-lg">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>بث تحليلي فوري</CardTitle>
            <p className="text-sm text-muted-foreground">استجابة المنصة في الزمن الحقيقي لكل حركة يقوم بها المستخدمون</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Radio className="h-4 w-4 text-rose-500" />
            بث مباشر
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3 text-xs text-muted-foreground">
          <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800/50 bg-white/90 dark:bg-slate-900/40 px-4 py-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-white">قناة الدفع</span>
              <Badge className="bg-emerald-500/10 text-emerald-600">مستقرة</Badge>
            </div>
            <p>زمن معالجة العمليات <strong>2.4 ثانية</strong></p>
            <p>معدل النجاح <strong>99.2%</strong></p>
          </div>
          <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800/50 bg-white/90 dark:bg-slate-900/40 px-4 py-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-white">واجهة التاجر</span>
              <Badge className="bg-emerald-500/10 text-emerald-600">مستقرة</Badge>
            </div>
            <p>معدل استجابة API <strong>180 مللي ثانية</strong></p>
            <p>عدد التحديثات اللحظية <strong>{formatNumber(642)} حدث</strong></p>
          </div>
          <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800/50 bg-white/90 dark:bg-slate-900/40 px-4 py-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-white">تحليلات الزوار</span>
              <Badge className="bg-indigo-500/10 text-indigo-600">قيد الارتفاع</Badge>
            </div>
            <p>معدل التفاعل الفوري <strong>67%</strong></p>
            <p>جلسات المتابعة <strong>{formatNumber(18420)} جلسة/يوم</strong></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
