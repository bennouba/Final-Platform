import { useCallback, useEffect, useMemo, useState, type ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import MerchantManagement from "@/components/admin/MerchantManagement";
import InventoryManagement from "@/components/admin/InventoryManagement";
import FinancialDashboard from "@/components/admin/FinancialDashboard";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import OrdersManagement from "@/components/admin/OrdersManagement";
import ProductsManagement from "@/components/admin/ProductsManagement";
import CrmManagement from "@/components/admin/CrmManagement";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCircle,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Globe,
  Headphones,
  Home,
  Layers,
  LineChart as LineChartIcon,
  LogOut,
  Menu,
  MessageSquare,
  PieChart,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Shield,
  ShoppingCart,
  Store,
  Sun,
  Truck,
  Users,
  X,
  Moon
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, Line, CartesianGrid, Tooltip, XAxis, YAxis, BarChart, Bar, Cell, RadialBarChart, RadialBar, PolarAngleAxis, LineChart } from "recharts";
import type { RadialBarProps } from "recharts";

interface SystemAlert {
  id: string;
  type: "error" | "warning" | "info" | "success";
  title: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  group: string;
  badge?: string;
  action?: "logout";
}

interface ModuleOption {
  id: string;
  label: string;
  description: string;
}

type TimelineTone = "emerald" | "sky" | "amber" | "rose";

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  time: string;
  tone: TimelineTone;
  icon: LucideIcon;
}

const libyanNumberFormatter = new Intl.NumberFormat("en-LY", { maximumFractionDigits: 0 });
const libyanCurrencyFormatter = new Intl.NumberFormat("en-LY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatCurrency = (value: number) => `${libyanCurrencyFormatter.format(value)} د.ل`;
const formatNumber = (value: number) => libyanNumberFormatter.format(value);
const SECTION_MODULES_KEY = "eishro-admin-section-modules";
const RadialBarWithMinAngle = RadialBar as unknown as ComponentType<RadialBarProps & { minAngle?: number }>;

const timelineToneStyles: Record<TimelineTone, { container: string; icon: string; badge: string }> = {
  emerald: {
    container: "border-emerald-200/60 dark:border-emerald-500/30 bg-emerald-500/5",
    icon: "text-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-600"
  },
  sky: {
    container: "border-sky-200/60 dark:border-sky-500/30 bg-sky-500/5",
    icon: "text-sky-500",
    badge: "bg-sky-500/10 text-sky-600"
  },
  amber: {
    container: "border-amber-200/60 dark:border-amber-500/30 bg-amber-500/5",
    icon: "text-amber-500",
    badge: "bg-amber-500/15 text-amber-600"
  },
  rose: {
    container: "border-rose-200/60 dark:border-rose-500/30 bg-rose-500/5",
    icon: "text-rose-500",
    badge: "bg-rose-500/15 text-rose-600"
  }
};

const alertToneStyles: Record<SystemAlert["type"], { container: string; icon: string; badge: string }> = {
  error: {
    container: "border-red-200/60 dark:border-red-500/30 bg-red-500/5",
    icon: "bg-red-500/15 text-red-600",
    badge: "bg-red-500/10 text-red-600"
  },
  warning: {
    container: "border-amber-200/60 dark:border-amber-500/30 bg-amber-500/5",
    icon: "bg-amber-500/15 text-amber-600",
    badge: "bg-amber-500/10 text-amber-700"
  },
  info: {
    container: "border-sky-200/60 dark:border-sky-500/30 bg-sky-500/5",
    icon: "bg-sky-500/15 text-sky-600",
    badge: "bg-sky-500/10 text-sky-600"
  },
  success: {
    container: "border-emerald-200/60 dark:border-emerald-500/30 bg-emerald-500/5",
    icon: "bg-emerald-500/15 text-emerald-600",
    badge: "bg-emerald-500/10 text-emerald-600"
  }
};

const StatCard = ({
  title,
  value,
  delta,
  icon: Icon,
  accent,
  active = false,
  onSelect
}: {
  title: string;
  value: string;
  delta?: number;
  icon: LucideIcon;
  accent: string;
  active?: boolean;
  onSelect?: () => void;
}) => {
  const isPositive = delta === undefined || delta >= 0;
  return (
    <Card
      className={`relative overflow-hidden border-none shadow-[0_20px_45px_-20px_rgba(15,23,42,0.25)] backdrop-blur transition-all duration-200 ${
        onSelect ? "cursor-pointer hover:-translate-y-1 hover:shadow-xl" : ""
      } ${active ? "ring-2 ring-indigo-500 shadow-xl" : ""}`}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (!onSelect) {
          return;
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
          </div>
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${accent}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        {delta !== undefined && (
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className={`px-2 py-1 rounded-full ${isPositive ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}`}>
              {isPositive ? `+${delta}%` : `${delta}%`}
            </span>
            <span className="text-muted-foreground">عن الشهر الماضي</span>
          </div>
        )}
      </CardContent>
      <div className="absolute -right-24 -top-24 w-56 h-56 rounded-full bg-white/10 dark:bg-white/5 blur-2xl" />
    </Card>
  );
};

const SectionPlaceholder = ({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) => (
  <Card className="border-dashed border-2 border-slate-200 dark:border-slate-700">
    <CardContent className="py-16 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 mx-auto flex items-center justify-center shadow-lg">
        <Icon className="h-8 w-8 text-white" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-full">
        <RefreshCw className="h-4 w-4" />
        تحت التطوير بدقة متناهية
      </div>
    </CardContent>
  </Card>
);

const PaymentsDashboard = () => {
  const summary = [
    { id: "volume", label: "حجم المدفوعات اليومي", value: formatCurrency(542_860), delta: "+7.8%", positive: true, icon: CreditCard, caption: "4,286 عملية موثقة" },
    { id: "settlements", label: "تسويات قيد المعالجة", value: formatCurrency(184_200), delta: "-12.4%", positive: true, icon: DollarSign, caption: "تسويات 18 تاجر" },
    { id: "chargebacks", label: "نسبة الاعتراضات", value: "0.42%", delta: "ثابت", positive: true, icon: Shield, caption: "3 حالات تتم معالجتها" }
  ];

  const gateways = [
    { name: "موأمالات", success: "99.2%", volume: formatCurrency(248_600), settlement: "12 ساعة" },
    { name: "مصرف الجمهورية", success: "97.6%", volume: formatCurrency(186_420), settlement: "18 ساعة" },
    { name: "LibPay", success: "96.8%", volume: formatCurrency(128_340), settlement: "4 ساعات" }
  ];

  const reconciliation = [
    { label: "تسويات مكتملة", value: formatCurrency(312_480), status: "تم الإنجاز" },
    { label: "طلبات استرداد", value: formatCurrency(18_240), status: "قيد المتابعة" },
    { label: "مبالغ تحت المراجعة", value: formatCurrency(9_860), status: "بانتظار التدقيق" }
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {summary.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.id} className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{item.value}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className={item.positive ? "text-emerald-600" : "text-rose-600"}>{item.delta}</span>
                  <span>{item.caption}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>بوابات الدفع النشطة</CardTitle>
              <p className="text-sm text-muted-foreground">مراقبة دقيقة لنسب النجاح ومواعيد التسوية</p>
            </div>
            <Badge className="bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">متابعة لحظية</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {gateways.map((gateway) => (
              <div key={gateway.name} className="rounded-3xl border border-slate-200/70 dark:border-slate-500/30 bg-white/95 dark:bg-slate-500/45 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-900 dark:text-white">{gateway.name}</span>
                  <span className="text-emerald-600">نجاح {gateway.success}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>حجم العمليات: {gateway.volume}</span>
                  <span>زمن التسوية: {gateway.settlement}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
          <CardHeader>
            <CardTitle>التسويات والمطابقات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reconciliation.map((item) => (
              <div key={item.label} className="rounded-3xl border border-slate-200/70 dark:border-slate-500/30 bg-white/95 dark:bg-slate-500/45 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-900 dark:text-white">{item.label}</span>
                  <span className="text-indigo-600 dark:text-indigo-300">{item.status}</span>
                </div>
                <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
          <CardHeader>
            <CardTitle>مؤشرات المخاطر المالية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs text-muted-foreground">
            <div className="rounded-3xl border border-rose-200/70 dark:border-rose-500/30 bg-rose-50/70 dark:bg-rose-500/10 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-rose-700 dark:text-rose-300">مراقبة الاحتيال المباشر</span>
                <Badge className="bg-white/80 text-rose-700 dark:bg-rose-500/20">5 تنبيهات</Badge>
              </div>
              <p className="mt-2">تم إيقاف 98.6% من المحاولات خلال أول 3 ثوانٍ</p>
            </div>
            <div className="rounded-3xl border border-slate-200/70 dark:border-slate-500/30 bg-white/95 dark:bg-slate-500/45 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span>مطابقة التسويات مع المصارف</span>
                <span className="text-emerald-600">مكتملة 99.4%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>طلبات السحب الآجلة</span>
                <span>{formatCurrency(74_500)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>طلبات تحتاج تأكيد إضافي</span>
                <span className="text-amber-600">6 طلبات</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
          <CardHeader>
            <CardTitle>قنوات الدفع البديلة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs text-muted-foreground">
            <div className="rounded-3xl border border-slate-200/70 dark:border-slate-500/30 bg-white/95 dark:bg-slate-500/45 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-900 dark:text-white">محافظ العملاء</span>
                <span className="text-emerald-600">نمو 14%</span>
              </div>
              <p className="mt-2">رصيد نشط {formatCurrency(128_600)}</p>
            </div>
            <div className="rounded-3xl border border-slate-200/70 dark:border-slate-500/30 bg-white/95 dark:bg-slate-500/45 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-900 dark:text-white">الدفع عند الاستلام</span>
                <span className="text-emerald-600">تسوية 89%</span>
              </div>
              <p className="mt-2">قيمة قيد التوصيل {formatCurrency(62_340)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const LogisticsDashboard = () => {
  const summary = [
    { id: "carriers", label: "شركات الشحن النشطة", value: formatNumber(18), detail: "تم إضافة 2 شريك هذا الشهر" },
    { id: "sla", label: "الالتزام بالوقت", value: "94%", detail: "أكثر من 12 ألف شحنة خلال 30 يوماً" },
    { id: "pending", label: "شحنات قيد التنفيذ", value: formatNumber(642), detail: "83% منها ضمن نطاق SLA" }
  ];

  const lanes = [
    { route: "طرابلس → بنغازي", loads: 184, eta: "12 ساعة", carrier: "Eishro Fleet" },
    { route: "بنغازي → سبها", loads: 98, eta: "20 ساعة", carrier: "Fast Logistics" },
    { route: "مصراتة → طرابلس", loads: 142, eta: "8 ساعات", carrier: "Skynet Express" }
  ];

  const metrics = [
    { label: "معدل التسليم في اليوم", value: formatNumber(872), tone: "text-emerald-600" },
    { label: "شحنات تحتاج تحقق", value: formatNumber(24), tone: "text-amber-600" },
    { label: "طلبات إعادة الجدولة", value: formatNumber(16), tone: "text-rose-600" }
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {summary.map((item) => (
          <Card key={item.id} className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
            <CardContent className="space-y-3 p-6">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>الممرات اللوجستية الحرجة</CardTitle>
              <p className="text-sm text-muted-foreground">قراءة مباشرة لأهم الممرات التشغيلية</p>
            </div>
            <Badge className="bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">مراقبة 24/7</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {lanes.map((lane) => (
              <div key={lane.route} className="rounded-3xl border border-slate-200/70 dark:border-slate-500/30 bg-white/95 dark:bg-slate-500/45 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-900 dark:text-white">{lane.route}</span>
                  <span className="text-emerald-600">{lane.loads} شحنة</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>شركة الشحن: {lane.carrier}</span>
                  <span>الوقت المتوقع: {lane.eta}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
          <CardHeader>
            <CardTitle>مؤشرات التنفيذ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-3xl border border-slate-200/70 dark:border-slate-500/30 bg-white/95 dark:bg-slate-500/45 px-4 py-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-900 dark:text-white">{metric.label}</span>
                  <span className={`${metric.tone} font-semibold`}>{metric.value}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const FleetDashboard = () => {
  const vehicles = [
    { id: "VH-214", type: "شاحنة تبريد", status: "نشطة", location: "طرابلس", nextService: "بعد 6 أيام" },
    { id: "VH-187", type: "فان توصيل", status: "في صيانة", location: "مصراتة", nextService: "قيد التنفيذ" },
    { id: "VH-172", type: "دراجة سريعة", status: "نشطة", location: "بنغازي", nextService: "بعد 12 يوماً" }
  ];

  const utilization = [
    { label: "تغطية المدن", value: "12 مدينة" },
    { label: "رحلات اليوم", value: formatNumber(184) },
    { label: "طلبات عاجلة", value: formatNumber(28) }
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {utilization.map((item) => (
          <Card key={item.label} className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
            <CardContent className="space-y-2 p-6">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>نظرة على الأسطول</CardTitle>
            <p className="text-sm text-muted-foreground">تتبع المركبات وخطط الصيانة</p>
          </div>
          <Badge className="bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">جاهزية 92%</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="rounded-3xl border border-slate-200/70 dark:border-slate-500/30 bg-white/95 dark:bg-slate-500/45 p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-900 dark:text-white">{vehicle.id} • {vehicle.type}</span>
                <span className={vehicle.status === "نشطة" ? "text-emerald-600" : "text-amber-600"}>{vehicle.status}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>الموقع الحالي: {vehicle.location}</span>
                <span>الصيانة القادمة: {vehicle.nextService}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const RiskDashboard = () => {
  const metrics = [
    { label: "تقييم المخاطر العام", value: "منخفض", tone: "text-emerald-600" },
    { label: "حالات الامتثال المفتوحة", value: formatNumber(3), tone: "text-amber-600" },
    { label: "تقارير التدقيق المغلقة", value: formatNumber(12), tone: "text-emerald-600" }
  ];

  const compliance = [
    { id: "CMP-214", title: "تدقيق تكامل المزودين", owner: "فريق الحوكمة", due: "اليوم", status: "قيد التنفيذ" },
    { id: "CMP-207", title: "تحديث سياسات بيانات العملاء", owner: "الأمن السيبراني", due: "غداً", status: "مستحق" },
    { id: "CMP-198", title: "مراجعة سقف المعاملات", owner: "الفريق المالي", due: "بعد 3 أيام", status: "مكتمل" }
  ];

  const alerts = [
    { title: "تحذير حدود التحويل", description: "متجر شيرين اقترب من حد التحويل اليومي", tone: "text-amber-600" },
    { title: "تنبيه سياسات KYC", description: "3 تجار بحاجة لاستكمال مستندات التحقق", tone: "text-rose-600" }
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
            <CardContent className="space-y-2 p-6">
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className={`text-2xl font-bold ${metric.tone}`}>{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
          <CardHeader>
            <CardTitle>جداول الامتثال</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-muted-foreground">
            {compliance.map((item) => (
              <div key={item.id} className="rounded-3xl border border-slate-200/70 dark:border-slate-500/30 bg-white/95 dark:bg-slate-500/45 p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-900 dark:text-white">{item.title}</span>
                  <Badge className="bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">{item.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>المسؤول: {item.owner}</span>
                  <span>الاستحقاق: {item.due}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
          <CardHeader>
            <CardTitle>تنبيهات المخاطر</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.title} className="rounded-3xl border border-slate-200/70 dark:border-slate-500/30 bg-white/95 dark:bg-slate-500/45 p-4">
                <p className={`text-sm font-semibold ${alert.tone}`}>{alert.title}</p>
                <p className="mt-2 text-xs text-muted-foreground leading-5">{alert.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const SettingsDashboard = () => {
  const configs = [
    { label: "تحديث العلامة التجارية", status: "مفعل", detail: "آخر تحديث قبل 3 أيام" },
    { label: "مزامنة القنوات", status: "قيد التنفيذ", detail: "جار الربط مع قناة السوق" },
    { label: "سياسات الوصول", status: "مكتمل", detail: "تم اعتماد مصفوفة الصلاحيات" }
  ];

  const integrations = [
    { name: "Salesforce", status: "متصل", usage: "تقارير CRM" },
    { name: "PowerBI", status: "متصل", usage: "لوحات مالية" },
    { name: "Segment", status: "بانتظار", usage: "تدفق بيانات اللحظة" }
  ];

  return (
    <div className="space-y-8">
      <Card className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
        <CardHeader>
          <CardTitle>إعدادات النظام</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3 text-xs text-muted-foreground">
          {configs.map((config) => (
            <div key={config.label} className="rounded-3xl border border-slate-200/70 dark:border-slate-500/30 bg-white/95 dark:bg-slate-500/45 p-4">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{config.label}</p>
              <p className="mt-2 text-emerald-600">{config.status}</p>
              <p className="mt-1">{config.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>تكاملات رئيسية</CardTitle>
            <p className="text-sm text-muted-foreground">مراقبة حالة الربط مع الأنظمة الخارجية</p>
          </div>
          <Badge className="bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">جاهزية 95%</Badge>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-muted-foreground">
          {integrations.map((integration) => (
            <div key={integration.name} className="rounded-3xl border border-slate-200/70 dark:border-slate-500/30 bg-white/95 dark:bg-slate-500/45 px-4 py-3 flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-white">{integration.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-emerald-600">{integration.status}</span>
                <span>{integration.usage}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const NotificationsDashboard = () => {
  const summary = [
    { label: "إشعارات فورية", value: formatNumber(4821), detail: "تم الإرسال خلال آخر 24 ساعة" },
    { label: "حملات مجدولة", value: formatNumber(36), detail: "موزعة على 4 شرائح" },
    { label: "معدل التفاعل", value: "32%", detail: "زيادة 5 نقاط عن الأسبوع" }
  ];

  const channels = [
    { channel: "تطبيق الجوال", share: 42, status: "فعال" },
    { channel: "البريد الإلكتروني", share: 33, status: "فعال" },
    { channel: "رسائل SMS", share: 17, status: "تدريجي" },
    { channel: "تنبيهات داخل الواجهة", share: 8, status: "تجريبي" }
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {summary.map((item) => (
          <Card key={item.label} className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
            <CardContent className="space-y-2 p-6">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
        <CardHeader>
          <CardTitle>قنوات الإرسال</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-muted-foreground">
          {channels.map((channel) => (
            <div key={channel.channel} className="rounded-3xl border border-slate-200/70 dark:border-slate-500/30 bg-white/95 dark:bg-slate-500/45 px-4 py-3 flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-white">{channel.channel}</span>
              <div className="flex items-center gap-3">
                <span>{channel.share}%</span>
                <span className="text-emerald-600">{channel.status}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const CrmDashboard = () => {
  const segments = [
    { name: "عملاء الولاء", count: formatNumber(1842), trend: "+6%" },
    { name: "عملاء مرتجعي", count: formatNumber(972), trend: "+4%" },
    { name: "عملاء جدد", count: formatNumber(648), trend: "+12%" }
  ];

  const pipeline = [
    { stage: "اكتساب", conversion: "42%", actions: "حملة إعلانات تدفق" },
    { stage: "تفعيل", conversion: "36%", actions: "سلسلة رسائل ترحيب" },
    { stage: "ولاء", conversion: "28%", actions: "عروض خاصة" }
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-3">
        {segments.map((segment) => (
          <Card key={segment.name} className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
            <CardContent className="space-y-2 p-6">
              <p className="text-xs text-muted-foreground">{segment.name}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{segment.count}</p>
              <p className="text-xs text-emerald-600">{segment.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
        <CardHeader>
          <CardTitle>مراحل التفاعل</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-muted-foreground">
          {pipeline.map((stage) => (
            <div key={stage.stage} className="rounded-3xl border border-slate-200/70 dark:border-slate-500/30 bg-white/95 dark:bg-slate-500/45 px-4 py-3 flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-white">{stage.stage}</span>
              <div className="flex items-center gap-3">
                <span className="text-emerald-600">التحويل {stage.conversion}</span>
                <span>{stage.actions}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const TicketsDashboard = () => {
  const queues = [
    { label: "طلبات حرجة", count: formatNumber(18), sla: "متوسط 22 دقيقة", tone: "text-rose-600" },
    { label: "دعم منصات", count: formatNumber(64), sla: "متوسط 38 دقيقة", tone: "text-amber-600" },
    { label: "أسئلة عامة", count: formatNumber(142), sla: "متوسط 18 دقيقة", tone: "text-emerald-600" }
  ];

  const agents = [
    { name: "إيناس البوعيشي", handled: formatNumber(42), satisfaction: "98%" },
    { name: "علي الشريف", handled: formatNumber(38), satisfaction: "95%" },
    { name: "سارة القماطي", handled: formatNumber(34), satisfaction: "97%" }
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-3">
        {queues.map((queue) => (
          <Card key={queue.label} className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
            <CardContent className="space-y-2 p-6">
              <p className="text-xs text-muted-foreground">{queue.label}</p>
              <p className={`text-2xl font-bold ${queue.tone}`}>{queue.count}</p>
              <p className="text-xs text-muted-foreground">{queue.sla}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
        <CardHeader>
          <CardTitle>أفضل ممثلي الدعم</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-muted-foreground">
          {agents.map((agent) => (
            <div key={agent.name} className="rounded-3xl border border-slate-200/70 dark:border-slate-500/30 bg-white/95 dark:bg-slate-500/45 px-4 py-3 flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-white">{agent.name}</span>
              <div className="flex items-center gap-3">
                <span>{agent.handled} تذكرة</span>
                <span className="text-emerald-600">رضا {agent.satisfaction}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const SupportDashboard = () => {
  const quickActions = [
    { id: "action-control", label: "مركز العمليات", icon: Activity, color: "bg-sky-500" },
    { id: "action-merchant", label: "تاجر جديد", icon: Store, color: "bg-emerald-500" },
    { id: "action-report", label: "تقرير مالي", icon: FileText, color: "bg-indigo-500" },
    { id: "action-backup", label: "نسخ احتياطي", icon: RefreshCw, color: "bg-amber-500" }
  ];

  const knowledge = [
    { label: "مقالات محدثة", value: formatNumber(128) },
    { label: "فيديوهات تدريب", value: formatNumber(42) },
    { label: "نماذج تشغيل", value: formatNumber(36) }
  ];

  return (
    <div className="space-y-8">
      <Card className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>الإجراءات السريعة</CardTitle>
            <p className="text-sm text-muted-foreground">تنفيذ أسرع لمهام الإدارة</p>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button key={action.id} className={`${action.color} text-white rounded-xl hover:opacity-90`}>
                <Icon className="h-4 w-4 ml-1" />
                {action.label}
              </Button>
            );
          })}
        </CardContent>
      </Card>
      <Card className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
        <CardHeader>
          <CardTitle>مركز المعرفة</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3 text-xs text-muted-foreground">
          {knowledge.map((item) => (
            <div key={item.label} className="rounded-3xl border border-slate-200/70 dark:border-slate-500/30 bg-white/95 dark:bg-slate-500/45 p-4">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.label}</p>
              <p className="mt-2 text-lg font-bold text-indigo-600 dark:text-indigo-300">{item.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const AdminPortal = ({ onLogout }: { onLogout?: () => void }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedRange, setSelectedRange] = useState("30");
  const [selectedRegion, setSelectedRegion] = useState("all");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      return;
    }
    window.location.href = "/";
  };
  const [alerts, setAlerts] = useState<SystemAlert[]>([
    {
      id: "1",
      type: "warning",
      title: "ارتفاع في طلبات الدعم الفني",
      message: "تم تلقي 45 طلب دعم فني في الساعة الماضية",
      timestamp: new Date(),
      resolved: false
    },
    {
      id: "2",
      type: "error",
      title: "خطأ في تكامل بنك الصحراء",
      message: "فشل في الاتصال بـ API بنك الصحراء منذ 12 دقيقة",
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      resolved: false
    },
    {
      id: "3",
      type: "success",
      title: "تحديث ناجح لنظام المخزون",
      message: "تمت مزامنة 842 منتج مع مخازن التجار",
      timestamp: new Date(Date.now() - 28 * 60 * 1000),
      resolved: true
    }
  ]);
  const unresolvedAlerts = useMemo(() => alerts.filter((alert) => !alert.resolved), [alerts]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const markAllAlertsResolved = useCallback(() => {
    setAlerts((previous) => previous.map((alert) => ({ ...alert, resolved: true })));
  }, []);
  const [stats] = useState({
    totalMerchants: 1247,
    totalCustomers: 8934,
    totalOrders: 15678,
    totalRevenue: 2847593.5,
    activeStores: 892,
    pendingApprovals: 23,
    systemHealth: 98.7,
    todayOrders: 156,
    todayRevenue: 45230.75,
    conversionRate: 3.2,
    liveVisitors: 508,
    netPromoterScore: 72,
    uptime: 99.82,
    supportTickets: 45
  });

  const [selectedOverviewStat, setSelectedOverviewStat] = useState("merchants");

  const overviewStats = useMemo(
    () => [
      {
        id: "merchants",
        title: "إجمالي التجار",
        value: formatNumber(stats.totalMerchants),
        delta: 12.5,
        icon: Store,
        accent: "from-sky-500 to-indigo-500",
        detail: {
          description: "نمو شبكة التجار يعتمد على توسع الأسواق والشراكات النشطة",
          headline: `${formatNumber(42)} تاجر جديد هذا الأسبوع`,
          trendLabel: "تطور عدد التجار النشطين",
          formatValue: (value: number) => formatNumber(Math.round(value)),
          trend: [
            { label: "أسبوع 1", value: 1184 },
            { label: "أسبوع 2", value: 1206 },
            { label: "أسبوع 3", value: 1219 },
            { label: "أسبوع 4", value: 1236 },
            { label: "أسبوع 5", value: 1241 },
            { label: "أسبوع 6", value: 1247 }
          ],
          insights: [
            { label: "متاجر نشطة يومياً", value: formatNumber(672), changeLabel: "نمو 5.4%", positive: true },
            { label: "طلبات التفعيل", value: formatNumber(stats.pendingApprovals), changeLabel: "انخفاض 8%", positive: true },
            { label: "معدل الإبقاء", value: "92%", changeLabel: "تحسن 2.3%", positive: true }
          ]
        }
      },
      {
        id: "orders",
        title: "إجمالي الطلبات",
        value: formatNumber(stats.totalOrders),
        delta: 8.2,
        icon: ShoppingCart,
        accent: "from-purple-500 to-violet-500",
        detail: {
          description: "المراقبة اللحظية لدورة حياة الطلب تحافظ على استقرار الأداء",
          headline: `${formatNumber(stats.todayOrders)} طلب موثق اليوم`,
          trendLabel: "حجم الطلبات المكتملة يومياً",
          formatValue: (value: number) => formatNumber(Math.round(value)),
          trend: [
            { label: "اليوم -5", value: 1384 },
            { label: "اليوم -4", value: 1422 },
            { label: "اليوم -3", value: 1468 },
            { label: "اليوم -2", value: 1512 },
            { label: "الأمس", value: 1549 },
            { label: "اليوم", value: 1568 }
          ],
          insights: [
            { label: "الطلبات المكتملة", value: formatNumber(10874), changeLabel: "ارتفاع 6.1%", positive: true },
            { label: "الطلبات المتروكة", value: formatNumber(421), changeLabel: "انخفاض 2.4%", positive: true },
            { label: "زمن المعالجة", value: "2.8 دقيقة", changeLabel: "+0.4 دقيقة", positive: false }
          ]
        }
      },
      {
        id: "revenue",
        title: "إجمالي الإيرادات",
        value: formatCurrency(stats.totalRevenue),
        delta: 15.7,
        icon: DollarSign,
        accent: "from-amber-500 to-orange-500",
        detail: {
          description: "مسارات الإيرادات المتقدمة تمنح رؤية واضحة على السيولة",
          headline: `${formatCurrency(stats.todayRevenue)} تم تحصيلها اليوم`,
          trendLabel: "الإيرادات الأسبوعية",
          formatValue: (value: number) => formatCurrency(value),
          trend: [
            { label: "أسبوع 1", value: 236500 },
            { label: "أسبوع 2", value: 248200 },
            { label: "أسبوع 3", value: 257400 },
            { label: "أسبوع 4", value: 268900 },
            { label: "أسبوع 5", value: 278600 },
            { label: "أسبوع 6", value: 284759.35 }
          ],
          insights: [
            { label: "متوسط السلة", value: `${formatNumber(181)} د.ل`, changeLabel: "ارتفاع 4.1%", positive: true },
            { label: "صافي الهامش", value: "18.6%", changeLabel: "تحسن 1.2%", positive: true },
            { label: "معدل المرتجعات", value: "2.3%", changeLabel: "انخفاض 0.4%", positive: true }
          ]
        }
      },
      {
        id: "customers",
        title: "العملاء النشطون",
        value: formatNumber(stats.totalCustomers),
        delta: 6.4,
        icon: Users,
        accent: "from-emerald-500 to-green-600",
        detail: {
          description: "تحليلات الولاء تضمن ارتفاع جودة رحلة العميل",
          headline: `${formatNumber(894)} عميل انتقل لبرامج الولاء`,
          trendLabel: "العملاء النشطون شهرياً",
          formatValue: (value: number) => formatNumber(Math.round(value)),
          trend: [
            { label: "شهر 1", value: 7380 },
            { label: "شهر 2", value: 7620 },
            { label: "شهر 3", value: 7895 },
            { label: "شهر 4", value: 8240 },
            { label: "شهر 5", value: 8562 },
            { label: "شهر 6", value: 8934 }
          ],
          insights: [
            { label: "عملاء نشطون يومياً", value: formatNumber(3587), changeLabel: "نمو 7.6%", positive: true },
            { label: "برامج الولاء", value: "68%", changeLabel: "تحسن 3.1%", positive: true },
            { label: "معدل الشكاوى", value: "0.8%", changeLabel: "انخفاض 0.2%", positive: true }
          ]
        }
      }
    ],
    [stats]
  );

  const activeOverviewDetail = useMemo(() => {
    if (overviewStats.length === 0) {
      return undefined;
    }
    return overviewStats.find((stat) => stat.id === selectedOverviewStat) ?? overviewStats[0];
  }, [overviewStats, selectedOverviewStat]);

  const overviewGradientId = useMemo(() => `overview-${activeOverviewDetail?.id ?? "stat"}-gradient`, [activeOverviewDetail?.id]);

  const advancedOverviewSeries = useMemo(
    () => [
      { label: "الإثنين", income: 920, expense: 610 },
      { label: "الثلاثاء", income: 980, expense: 645 },
      { label: "الأربعاء", income: 1040, expense: 672 },
      { label: "الخميس", income: 1115, expense: 698 },
      { label: "الجمعة", income: 1190, expense: 732 },
      { label: "السبت", income: 1260, expense: 758 },
      { label: "الأحد", income: 1315, expense: 784 }
    ],
    []
  );

  const advancedChannelMix = useMemo(
    () => [
      { name: "قنوات رقمية", value: 42, fill: "#6366f1" },
      { name: "مبيعات المتجر", value: 28, fill: "#22c55e" },
      { name: "القنوات الميدانية", value: 18, fill: "#0ea5e9" },
      { name: "الشركاء", value: 12, fill: "#f97316" }
    ],
    []
  );

  const advancedConversionSnapshot = useMemo(
    () => ({
      completion: 84,
      repeat: 62,
      customerLifetime: 46
    }),
    []
  );

  const performanceSeriesOptions = useMemo(
    () => ({
      "7": [
        { label: "اليوم -6", revenue: 45200, orders: 312, cancellations: 6 },
        { label: "اليوم -5", revenue: 46850, orders: 326, cancellations: 5 },
        { label: "اليوم -4", revenue: 48720, orders: 334, cancellations: 5 },
        { label: "اليوم -3", revenue: 50360, orders: 348, cancellations: 4 },
        { label: "اليوم -2", revenue: 52840, orders: 362, cancellations: 4 },
        { label: "أمس", revenue: 54520, orders: 374, cancellations: 3 },
        { label: "اليوم", revenue: 56280, orders: 386, cancellations: 3 }
      ],
      "30": [
        { label: "أسبوع 1", revenue: 186400, orders: 1342, cancellations: 22 },
        { label: "أسبوع 2", revenue: 198200, orders: 1396, cancellations: 19 },
        { label: "أسبوع 3", revenue: 206840, orders: 1458, cancellations: 17 },
        { label: "أسبوع 4", revenue: 214960, orders: 1516, cancellations: 15 },
        { label: "أسبوع 5", revenue: 223480, orders: 1584, cancellations: 14 },
        { label: "أسبوع 6", revenue: 231760, orders: 1642, cancellations: 13 }
      ],
      "90": [
        { label: "يناير", revenue: 185000, orders: 1287, cancellations: 16 },
        { label: "فبراير", revenue: 198400, orders: 1321, cancellations: 14 },
        { label: "مارس", revenue: 214200, orders: 1418, cancellations: 12 },
        { label: "أبريل", revenue: 236500, orders: 1544, cancellations: 11 },
        { label: "مايو", revenue: 254700, orders: 1612, cancellations: 9 },
        { label: "يونيو", revenue: 268900, orders: 1675, cancellations: 8 },
        { label: "يوليو", revenue: 289300, orders: 1792, cancellations: 10 },
        { label: "أغسطس", revenue: 305600, orders: 1867, cancellations: 9 },
        { label: "سبتمبر", revenue: 322400, orders: 1941, cancellations: 7 },
        { label: "أكتوبر", revenue: 348200, orders: 2054, cancellations: 6 },
        { label: "نوفمبر", revenue: 366800, orders: 2123, cancellations: 5 },
        { label: "ديسمبر", revenue: 389500, orders: 2235, cancellations: 5 }
      ]
    }),
    []
  );

  const performanceSeries = useMemo(() => {
    if (selectedRange in performanceSeriesOptions) {
      return performanceSeriesOptions[selectedRange as "7" | "30" | "90"];
    }
    return performanceSeriesOptions["30"];
  }, [performanceSeriesOptions, selectedRange]);

  const orderPerformance = useMemo(
    () => [
      { label: "الطلبات المكتملة", value: 10874, color: "#6366f1" },
      { label: "الطلبات قيد المعالجة", value: 2675, color: "#22c55e" },
      { label: "الطلبات اليدوية", value: 948, color: "#f97316" },
      { label: "الطلبات المتروكة", value: 421, color: "#f43f5e" }
    ],
    []
  );

  const liveActivitySeries = useMemo(
    () => [
      { label: "الإثنين", visitors: 520, payments: 465, orders: 318 },
      { label: "الثلاثاء", visitors: 612, payments: 502, orders: 356 },
      { label: "الأربعاء", visitors: 684, payments: 546, orders: 392 },
      { label: "الخميس", visitors: 758, payments: 588, orders: 418 },
      { label: "الجمعة", visitors: 804, payments: 612, orders: 431 },
      { label: "السبت", visitors: 742, payments: 574, orders: 396 },
      { label: "الأحد", visitors: 698, payments: 548, orders: 372 }
    ],
    []
  );

  const serviceHealthMetrics = useMemo(
    () => [
      { name: "عمليات الدفع", value: 96 },
      { name: "التحليلات اللحظية", value: 94 },
      { name: "اللوجستيات", value: 92 },
      { name: "الدعم المباشر", value: 94 }
    ],
    []
  );

  const serviceHealthScore = useMemo(() => {
    if (serviceHealthMetrics.length === 0) {
      return 0;
    }
    const total = serviceHealthMetrics.reduce((sum, metric) => sum + metric.value, 0);
    return Math.round((total / serviceHealthMetrics.length) * 10);
  }, [serviceHealthMetrics]);

  const expenseEfficiencySeries = useMemo(
    () => [
      { label: "يناير", fulfillment: 24500, logistics: 18200, support: 11200 },
      { label: "فبراير", fulfillment: 23200, logistics: 17650, support: 10840 },
      { label: "مارس", fulfillment: 22150, logistics: 16840, support: 10560 },
      { label: "أبريل", fulfillment: 21680, logistics: 16220, support: 10080 },
      { label: "مايو", fulfillment: 20940, logistics: 15860, support: 9720 },
      { label: "يونيو", fulfillment: 20320, logistics: 15140, support: 9240 }
    ],
    []
  );

  const automationSnapshot = useMemo(
    () => [
      { id: "automation-rate", label: "نسبة الأتمتة", value: "78%", accent: "from-indigo-500/20 to-purple-500/10", tone: "text-indigo-600" },
      { id: "sla-uptime", label: "التزام SLA", value: "96%", accent: "from-emerald-500/20 to-teal-500/10", tone: "text-emerald-600" },
      { id: "response-time", label: "متوسط الاستجابة", value: "3.8 دقيقة", accent: "from-sky-500/20 to-cyan-500/10", tone: "text-sky-600" },
      { id: "critical-escalations", label: "تصعيدات حرجة", value: formatNumber(12), accent: "from-rose-500/20 to-pink-500/10", tone: "text-rose-600" }
    ],
    []
  );

  const operationsPulse = useMemo<TimelineItem[]>(
    () => [
      {
        id: "pulse-1",
        title: "مصادقة متجر نواعم",
        description: "تم تفعيل 24 فئة وتخصيص قائمة التاجر حسب الاتفاق",
        time: "قبل دقيقة",
        tone: "emerald",
        icon: CheckCircle
      },
      {
        id: "pulse-2",
        title: "تحديث تكامل موأمالات",
        description: "اكتمل تحديث شهادات الأمان واعادة مزامنة مفاتيح الدفع",
        time: "قبل 6 دقائق",
        tone: "sky",
        icon: Globe
      },
      {
        id: "pulse-3",
        title: "تنبيه تراجع مخزون",
        description: "12 منتج يحتاج لإعادة التعبئة في متجر شيرين خلال 4 ساعات",
        time: "قبل 12 دقيقة",
        tone: "amber",
        icon: AlertTriangle
      },
      {
        id: "pulse-4",
        title: "مراجعة أمنية حرجة",
        description: "تم إيقاف محاولة دخول غير مصرح بها لواجهة المدير",
        time: "قبل 18 دقيقة",
        tone: "rose",
        icon: Shield
      }
    ],
    []
  );

  const regionDistribution = useMemo(
    () => [
      { id: "tripoli", label: "طرابلس", orders: 5870, percentage: 38 },
      { id: "benghazi", label: "بنغازي", orders: 3240, percentage: 21 },
      { id: "misrata", label: "مصراتة", orders: 2420, percentage: 16 },
      { id: "zawiya", label: "الزاوية", orders: 1740, percentage: 11 },
      { id: "sebha", label: "سبها", orders: 920, percentage: 6 },
      { id: "others", label: "مناطق أخرى", orders: 1488, percentage: 8 }
    ],
    []
  );

  const regionSummary = useMemo(() => {
    if (selectedRegion === "all") {
      return { label: "كافة المناطق", growth: 11.2, satisfaction: 92, sla: "98%", focusStores: 42 };
    }
    const region = regionDistribution.find((item) => item.id === selectedRegion);
    if (!region) {
      return { label: "كافة المناطق", growth: 11.2, satisfaction: 92, sla: "98%", focusStores: 42 };
    }
    if (region.id === "tripoli") {
      return { label: "طرابلس", growth: 14.8, satisfaction: 95, sla: "99%", focusStores: 18 };
    }
    if (region.id === "benghazi") {
      return { label: "بنغازي", growth: 12.4, satisfaction: 90, sla: "97%", focusStores: 11 };
    }
    if (region.id === "misrata") {
      return { label: "مصراتة", growth: 9.7, satisfaction: 89, sla: "96%", focusStores: 7 };
    }
    if (region.id === "zawiya") {
      return { label: "الزاوية", growth: 7.5, satisfaction: 85, sla: "95%", focusStores: 4 };
    }
    if (region.id === "sebha") {
      return { label: "سبها", growth: 6.8, satisfaction: 83, sla: "94%", focusStores: 2 };
    }
    return { label: "مناطق أخرى", growth: 5.4, satisfaction: 81, sla: "93%", focusStores: 0 };
  }, [regionDistribution, selectedRegion]);

  const strategicPrograms = useMemo(
    () => [
      {
        id: "program-1",
        name: "برنامج الولاء للتجار",
        owner: "التسويق",
        progress: 82,
        status: "نشط",
        nextMilestone: "إطلاق المرحلة الثانية 18 مارس"
      },
      {
        id: "program-2",
        name: "منصة التتبع الفوري للوجستيات",
        owner: "الخدمات",
        progress: 64,
        status: "قيد التنفيذ",
        nextMilestone: "تكامل تتبع المندوبين نهاية الأسبوع"
      },
      {
        id: "program-3",
        name: "حوكمة صلاحيات المتاجر",
        owner: "الحوكمة",
        progress: 48,
        status: "مخطط",
        nextMilestone: "اعتماد مصفوفة الأذونات 5 أبريل"
      }
    ],
    []
  );

  const quickActions = useMemo(
    () => [
      { id: "action-control", label: "مركز العمليات", icon: Activity, color: "bg-sky-500" },
      { id: "action-merchant", label: "تاجر جديد", icon: Store, color: "bg-emerald-500" },
      { id: "action-report", label: "تقرير مالي", icon: FileText, color: "bg-indigo-500" },
      { id: "action-backup", label: "نسخ احتياطي", icon: RefreshCw, color: "bg-amber-500" }
    ],
    []
  );

  const moduleOptions = useMemo<Record<string, ModuleOption[]>>(
    () => ({
      payments: [
        { id: "gateways", label: "بوابات الدفع", description: "التحكم في بوابات الدفع ومتطلبات المصادقة" },
        { id: "settlements", label: "التسويات", description: "جدولة التحويلات وتتبع المطابقات البنكية" },
        { id: "chargebacks", label: "إدارة الاعتراضات", description: "إدارة حالات الاعتراض وتصعيدها" }
      ],
      logistics: [
        { id: "carriers", label: "شركاء الشحن", description: "تفعيل أو إيقاف شركاء الشحن المعتمدين" },
        { id: "lanes", label: "الممرات", description: "تحديد الممرات الحيوية ومراقبة الأداء" },
        { id: "alerts", label: "إنذارات الشحن", description: "تنبيهات SLA والتنبيهات الحرجة" }
      ],
      vehicles: [
        { id: "fleet-tracking", label: "تتبع الأسطول", description: "مراقبة المركبات والرحلات النشطة" },
        { id: "maintenance", label: "الصيانة الوقائية", description: "جدولة الصيانة وتعقب السجلات" },
        { id: "routing", label: "إدارة المسارات", description: "تحكم في توزيع الرحلات" }
      ],
      risk: [
        { id: "compliance", label: "قوائم الامتثال", description: "إدارة تدقيق الامتثال وسياسات KYC" },
        { id: "fraud", label: "الكشف عن الاحتيال", description: "مراقبة حدود التحويل والتنبيهات" },
        { id: "audit", label: "تقارير التدقيق", description: "مراجعة وتوثيق إجراءات الحوكمة" }
      ],
      settings: [
        { id: "branding", label: "تهيئة العلامة", description: "تخصيص الهوية البصرية" },
        { id: "access", label: "صلاحيات الوصول", description: "إدارة الأدوار والصلاحيات" },
        { id: "integrations", label: "التكاملات", description: "التحكم في ربط الأنظمة الخارجية" }
      ],
      notifications: [
        { id: "push", label: "إشعارات التطبيق", description: "القنوات الفورية داخل التطبيق" },
        { id: "email", label: "رسائل البريد", description: "الحملات البريدية المجدولة" },
        { id: "sms", label: "رسائل SMS", description: "التحكم في الحملات القصيرة" }
      ],
      crm: [
        { id: "segments", label: "شرائح العملاء", description: "تفعيل الشرائح والتحليلات" },
        { id: "automations", label: "الأتمتة", description: "سيناريوهات الولاء والتواصل" },
        { id: "feedback", label: "قياس الرضا", description: "برامج استطلاع الرأي" }
      ],
      tickets: [
        { id: "queues", label: "طوابير الخدمة", description: "توزيع المهام على الطوابير" },
        { id: "sla", label: "اتفاقيات SLA", description: "مراقبة مؤشرات الزمن المستهدف" },
        { id: "knowledge", label: "مركز المعرفة", description: "التمكين بالمقالات والنماذج" }
      ],
      support: [
        { id: "live-support", label: "الدعم المباشر", description: "الردود الفورية وقنوات التفاعل" },
        { id: "playbooks", label: "أدلة التشغيل", description: "الوصول إلى إجراءات الحل" },
        { id: "reporting", label: "تقرير الأداء", description: "مؤشرات الفريق وجودة الخدمة" }
      ]
    }),
    []
  );

  const [moduleActivation, setModuleActivation] = useState<Record<string, Record<string, boolean>>>(() => {
    if (typeof window === "undefined") {
      return {};
    }
    try {
      const raw = window.localStorage.getItem(SECTION_MODULES_KEY);
      if (raw) {
        return JSON.parse(raw) as Record<string, Record<string, boolean>>;
      }
    } catch {
      return {};
    }
    return {};
  });

  const toggleModule = (sectionId: string, moduleId: string, value: boolean) => {
    setModuleActivation((previous) => {
      const nextSection = { ...(previous[sectionId] ?? {}), [moduleId]: value };
      const next = { ...previous, [sectionId]: nextSection };
      if (typeof window !== "undefined") {
        window.localStorage.setItem(SECTION_MODULES_KEY, JSON.stringify(next));
      }
      return next;
    });
  };

  const navigationItems = useMemo<NavigationItem[]>(
    () => [
      { id: "overview", label: "نظرة عامة", icon: Home, group: "الرئيسية" },
      { id: "analytics", label: "التحليلات المباشرة", icon: Activity, group: "الرئيسية", badge: "Live" },
      { id: "merchants", label: "إدارة المتاجر", icon: Store, group: "عمليات التجارة", badge: formatNumber(stats.totalMerchants) },
      { id: "orders", label: "إدارة الطلبات", icon: ShoppingCart, group: "عمليات التجارة", badge: formatNumber(stats.totalOrders) },
      { id: "inventory", label: "إدارة المخزون", icon: Layers, group: "عمليات التجارة" },
      { id: "products", label: "إدارة المنتجات", icon: PieChart, group: "عمليات التجارة" },
      { id: "financial", label: "الإدارة المالية", icon: DollarSign, group: "المعاملات" },
      { id: "payments", label: "إدارة المدفوعات الإلكترونية", icon: CreditCard, group: "المعاملات" },
      { id: "logistics", label: "إدارة شركات الشحن والتوصيل", icon: Truck, group: "الخدمات" },
      { id: "vehicles", label: "إدارة المركبات", icon: Globe, group: "الخدمات" },
      { id: "risk", label: "إدارة المخاطر", icon: AlertTriangle, group: "الحوكمة" },
      { id: "settings", label: "إدارة الإعدادات", icon: Settings, group: "الحوكمة" },
      { id: "notifications", label: "إدارة الإشعارات", icon: Bell, group: "التواصل" },
      { id: "crm", label: "إدارة العملاء CRM", icon: Users, group: "التواصل", badge: formatNumber(stats.totalCustomers) },
      { id: "tickets", label: "إدارة التذاكر", icon: MessageSquare, group: "التواصل", badge: stats.supportTickets.toString() },
      { id: "support", label: "الدعم الفني", icon: Headphones, group: "التواصل" },
      { id: "logout", label: "تسجيل الخروج", icon: LogOut, group: "التواصل", action: "logout" }
    ],
    [stats]
  );

  const filteredNavigation = useMemo(() => {
    const normalized = searchValue.trim();
    if (!normalized) {
      return navigationItems;
    }
    return navigationItems.filter((item) => item.label.includes(normalized) || item.id.includes(normalized.toLowerCase()));
  }, [navigationItems, searchValue]);

  const groupedNavigation = useMemo(() => {
    const groups = new Map<string, NavigationItem[]>();
    filteredNavigation.forEach((item) => {
      if (!groups.has(item.group)) {
        groups.set(item.group, []);
      }
      groups.get(item.group)!.push(item);
    });
    return Array.from(groups.entries());
  }, [filteredNavigation]);

  const handleResolveAlert = (id: string) => {
    setAlerts((previous) => previous.map((alert) => (alert.id === id ? { ...alert, resolved: true } : alert)));
  };

  const currentModules = moduleOptions[activeTab] ?? [];

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen flex flex-col overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-950/85 dark:to-slate-950" dir="rtl">
        <header className="bg-white/85 dark:bg-slate-500/65 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-400/25 sticky top-0 z-50">
          <div className="flex flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-4">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen((value) => !value)}>
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-2xl bg-white/80 p-2 shadow-lg ring-1 ring-indigo-200 dark:bg-slate-900/70 dark:ring-indigo-500/40">
                  <img src="/eshro-new-logo.png" alt="شعار منصة إشرو" className="h-9 w-auto" />
                </div>
                <div className="space-y-1">
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">منصة إشرو الرئيسية</h1>
                  <p className="text-xs text-muted-foreground">إدارة متكاملة لكل تفاصيل المنصة</p>
                </div>
              </div>
              <div className="flex items-center gap-2 lg:hidden">
                <Input
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="بحث سريع داخل لوحة التحكم"
                  className="w-52"
                />
                <Button variant="ghost" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="hidden flex-1 items-center justify-between gap-6 lg:flex">
              <div className="relative w-96">
                <Input
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="ابحث عن تاجر، تقرير، أو عملية"
                  className="pr-10"
                />
                <Search className="h-4 w-4 absolute right-3 top-3 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden xl:flex items-center gap-3">
                  <div className="rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 dark:bg-indigo-500/15 px-4 py-2 flex items-center gap-2 text-sm font-medium">
                    <LineChartIcon className="h-4 w-4" />
                    {stats.uptime}% جاهزية النظام
                  </div>
                  <div className="rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 dark:bg-emerald-500/15 px-4 py-2 flex items-center gap-2 text-sm font-medium">
                    <Activity className="h-4 w-4" />
                    {stats.liveVisitors} زائر الآن
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDarkMode((value) => !value)}
                  className={`transition-colors duration-200 ${darkMode ? 'bg-gradient-to-br from-amber-500 via-rose-500 to-fuchsia-500 text-white shadow-lg hover:from-amber-600 hover:to-fuchsia-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <DropdownMenu
                  onOpenChange={(open) => {
                    setNotificationsOpen(open);
                  }}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`relative transition-colors ${
                        notificationsOpen ? "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300" : ""
                      } ${unresolvedAlerts.length > 0 ? "text-amber-500" : ""}`}
                    >
                      <Bell className="h-5 w-5" />
                      {unresolvedAlerts.length > 0 && (
                        <span className="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
                          {unresolvedAlerts.length}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 p-0">
                    <DropdownMenuLabel className="px-4 py-3 flex items-center justify-between text-right">
                      <span className="text-sm font-semibold">تنبيهات النظام</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs px-2 py-1">
                          {unresolvedAlerts.length > 0 ? `${unresolvedAlerts.length} غير مقروء` : "لا إشعارات"}
                        </Badge>
                        {unresolvedAlerts.length > 0 && (
                          <Button variant="ghost" size="sm" className="h-7 px-3 text-xs" onClick={markAllAlertsResolved}>
                            تعليم الكل
                          </Button>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-64 overflow-y-auto">
                      {alerts.length === 0 ? (
                        <div className="px-4 py-6 text-center text-sm text-muted-foreground">لا توجد تنبيهات حالياً</div>
                      ) : (
                        alerts.map((alert) => (
                          <DropdownMenuItem
                            key={alert.id}
                            className="flex flex-col items-start gap-2 px-4 py-3 text-right whitespace-normal"
                            onSelect={(event) => event.preventDefault()}
                          >
                            <div className="flex w-full items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-slate-900 dark:text-white">{alert.title}</span>
                              <span
                                className={`text-xs font-medium ${
                                  alert.resolved
                                    ? "text-emerald-600"
                                    : alert.type === "error"
                                    ? "text-rose-600"
                                    : alert.type === "warning"
                                    ? "text-amber-600"
                                    : "text-sky-600"
                                }`}
                              >
                                {alert.resolved ? "تم الحل" : alert.type === "error" ? "طارئ" : alert.type === "warning" ? "تنبيه" : "معلومة"}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-5">{alert.message}</p>
                            <div className="flex w-full items-center justify-between">
                              <span className="text-[11px] text-muted-foreground">
                                {alert.timestamp.toLocaleTimeString("ar-LY", { hour: "2-digit", minute: "2-digit" })}
                              </span>
                              {!alert.resolved && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-3 text-xs"
                                  onClick={() => handleResolveAlert(alert.id)}
                                >
                                  تعليم كمقروء
                                </Button>
                              )}
                            </div>
                          </DropdownMenuItem>
                        ))
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="تسجيل الخروج">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>
        <div className="flex flex-1 min-h-0 min-w-0">
          <aside
            className={`${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } fixed lg:static inset-y-0 right-0 z-40 w-80 h-full max-h-screen overflow-y-auto overscroll-contain bg-white/90 dark:bg-slate-500/55 backdrop-blur-xl border-l border-slate-200/70 dark:border-slate-400/20 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:h-screen lg:max-h-screen lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain`}
          >
            <div className="flex h-full flex-col">
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="px-3 py-1 rounded-full">
                      الإصدار 7.0
                    </Badge>
                    <span className="text-xs text-muted-foreground">جاهزية {stats.systemHealth}%</span>
                  </div>
                  <div className="lg:hidden">
                    <Input
                      value={searchValue}
                      onChange={(event) => setSearchValue(event.target.value)}
                      placeholder="ابحث داخل اللوحة"
                    />
                  </div>
                </div>
                <nav className="space-y-6">
                  {groupedNavigation.map(([group, items]) => {
                    const visibleItems = items.filter((item) => item.action !== "logout");
                    if (visibleItems.length === 0) {
                      return null;
                    }
                    return (
                      <div key={group} className="space-y-2">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-2">{group}</p>
                        <div className="space-y-2">
                          {visibleItems.map((item) => {
                            const isActive = activeTab === item.id;
                            return (
                              <Button
                                key={item.id}
                                variant={isActive ? "default" : "ghost"}
                                className={`w-full justify-between h-12 rounded-2xl border text-sm font-semibold ${
                                  isActive
                                    ? "bg-gradient-to-l from-indigo-600 to-sky-500 text-white shadow-lg border-transparent"
                                    : "border-transparent hover:bg-slate-100 dark:hover:bg-slate-500/30"
                                }`}
                                onClick={() => setActiveTab(item.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <item.icon
                                    className={`h-5 w-5 ${
                                      isActive
                                        ? "text-white"
                                        : "text-slate-500 dark:text-slate-300"
                                    }`}
                                  />
                                  <span>{item.label}</span>
                                </div>
                                {item.badge && (
                                  <Badge
                                    variant={isActive ? "secondary" : "outline"}
                                    className={isActive ? "bg-white/20 border-transparent" : ""}
                                  >
                                    {item.badge}
                                  </Badge>
                                )}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </nav>
                <div className="pt-6 border-t border-slate-200/60 dark:border-slate-500/25">
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-between h-12 rounded-2xl text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10"
                  >
                    <span className="flex items-center gap-3">
                      <LogOut className="h-5 w-5" />
                      تسجيل الخروج
                    </span>
                    <span className="text-xs text-red-500 dark:text-red-300">خروج</span>
                  </Button>
                </div>
              </div>
            </div>
          </aside>
          <main className="flex-1 min-h-0 min-w-0 max-h-screen w-full px-6 py-8 lg:px-10 space-y-8 text-right overflow-y-auto overscroll-contain overflow-x-hidden">
            {currentModules.length > 0 ? (
              <Card className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
                <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>تهيئة الوحدات</CardTitle>
                    <p className="text-sm text-muted-foreground">تحكم مباشر في المكونات المفعلة لكل قسم</p>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  {currentModules.map((module) => {
                    const isEnabled = moduleActivation[activeTab]?.[module.id] ?? true;
                    return (
                      <div key={module.id} className="flex items-center justify-between rounded-3xl border border-slate-200/70 dark:border-slate-500/30 bg-white/95 dark:bg-slate-500/45 px-4 py-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{module.label}</p>
                          <p className="text-xs text-muted-foreground">{module.description}</p>
                        </div>
                        <Switch checked={isEnabled} onCheckedChange={(value) => toggleModule(activeTab, module.id, value)} />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ) : null}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <Card className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
                    <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle>تحليل الإيراد والمصروف</CardTitle>
                        <p className="text-sm text-muted-foreground">مراقبة الاتجاه الأسبوعي لصافي الأداء</p>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">+6.8%</Badge>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={advancedOverviewSeries}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                          <XAxis dataKey="label" tickMargin={12} />
                          <YAxis tickFormatter={(value) => `${Math.round(Number(value))} د.ل`} width={100} />
                          <Tooltip
                            formatter={(value: number, name: string) => [`${formatNumber(Number(value))} د.ل`, name === "income" ? "الإيراد" : "المصروف"]}
                            labelFormatter={(label) => `اليوم ${label}`}
                          />
                          <Line type="monotone" dataKey="income" stroke="#4f46e5" strokeWidth={3} dot={false} />
                          <Line type="monotone" dataKey="expense" stroke="#f97316" strokeWidth={3} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  <Card className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
                    <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle>قنوات النشاط الحالية</CardTitle>
                        <p className="text-sm text-muted-foreground">توزيع مساهمة القنوات في إجمالي الإيراد</p>
                      </div>
                      <Badge className="bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">محدّث لحظياً</Badge>
                    </CardHeader>
                    <CardContent className="relative pt-0">
                      <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadialBarChart innerRadius="35%" outerRadius="90%" data={advancedChannelMix} startAngle={90} endAngle={-270}>
                            <PolarAngleAxis type="number" tick={false} domain={[0, 100]} />
                            <RadialBarWithMinAngle minAngle={15} dataKey="value" background cornerRadius={12} />
                            <Tooltip formatter={(value: number, name: string) => [`${value}%`, name]} />
                          </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-2xl font-bold text-slate-900 dark:text-white">{formatNumber(stats.todayOrders)}</span>
                          <span className="text-xs text-muted-foreground">طلبات اليوم</span>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                        {advancedChannelMix.map((channel) => (
                          <div key={channel.name} className="flex items-center justify-between rounded-2xl border border-slate-200/70 px-3 py-2 dark:border-slate-500/30">
                            <span>{channel.name}</span>
                            <span className="font-semibold text-slate-900 dark:text-white">{channel.value}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
                    <CardHeader className="flex flex-col gap-2">
                      <CardTitle>مؤشرات التحويل الذكية</CardTitle>
                      <p className="text-sm text-muted-foreground">قراءة سريعة لصحة مسار الطلب</p>
                    </CardHeader>
                    <CardContent className="pt-1 space-y-4">
                      <div className="rounded-3xl bg-gradient-to-br from-indigo-500/10 via-sky-500/10 to-emerald-500/10 p-4 text-center">
                        <p className="text-xs text-muted-foreground">إتمام المسار</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{advancedConversionSnapshot.completion}%</p>
                        <p className="text-xs text-emerald-600">+3.2% هذا الأسبوع</p>
                      </div>
                      <div className="space-y-3 text-xs text-muted-foreground">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span>العملاء المتكررين</span>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">{advancedConversionSnapshot.repeat}%</span>
                          </div>
                          <Progress value={advancedConversionSnapshot.repeat} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span>قيمة عمر العميل</span>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">{advancedConversionSnapshot.customerLifetime}%</span>
                          </div>
                          <Progress value={advancedConversionSnapshot.customerLifetime} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span>تفاعل الحملات</span>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">68%</span>
                          </div>
                          <Progress value={68} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {overviewStats.map((stat) => (
                    <StatCard
                      key={stat.id}
                      title={stat.title}
                      value={stat.value}
                      delta={stat.delta}
                      icon={stat.icon}
                      accent={stat.accent}
                      active={activeOverviewDetail?.id === stat.id}
                      onSelect={() => setSelectedOverviewStat(stat.id)}
                    />
                  ))}
                </div>
                {activeOverviewDetail && (
                  <Card className="border-none bg-white/90 dark:bg-slate-500/55 shadow-lg">
                    <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle>{activeOverviewDetail.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{activeOverviewDetail.detail.description}</p>
                      </div>
                      <Badge className="bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                        {activeOverviewDetail.detail.headline}
                      </Badge>
                    </CardHeader>
                    <CardContent className="grid gap-6 lg:grid-cols-5">
                      <div className="lg:col-span-3 space-y-4">
                        <p className="text-xs text-muted-foreground">{activeOverviewDetail.detail.trendLabel}</p>
                        <ResponsiveContainer width="100%" height={240}>
                          <AreaChart data={activeOverviewDetail.detail.trend}>
                            <defs>
                              <linearGradient id={overviewGradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.85} />
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="label" tickMargin={12} />
                            <YAxis tickFormatter={(value) => activeOverviewDetail.detail.formatValue(Number(value))} width={100} />
                            <Tooltip
                              formatter={(value: number) => [activeOverviewDetail.detail.formatValue(value), "القيمة"]}
                              labelFormatter={(label) => `الفترة ${label}`}
                            />
                            <Area type="monotone" dataKey="value" stroke="#4f46e5" fill={`url(#${overviewGradientId})`} strokeWidth={3} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="lg:col-span-2 space-y-3">
                        {activeOverviewDetail.detail.insights.map((insight) => (
                          <div key={insight.label} className="rounded-3xl border border-slate-200/70 dark:border-slate-500/30 bg-white/95 dark:bg-slate-500/45 px-4 py-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">{insight.label}</p>
                              <span className={`text-xs font-semibold ${insight.positive ? "text-emerald-600" : "text-rose-600"}`}>
                                {insight.changeLabel}
                              </span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{insight.value}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <Card className="xl:col-span-2">
                    <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-1">
                        <CardTitle>الأداء المالي والاستحواذ</CardTitle>
                        <p className="text-sm text-muted-foreground">تحليل الإيرادات والطلبات حسب الأشهر</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <Select value={selectedRange} onValueChange={setSelectedRange}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="30 يوم" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7">7 أيام</SelectItem>
                            <SelectItem value="30">30 يوم</SelectItem>
                            <SelectItem value="90">90 يوم</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          تصدير التقرير
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ResponsiveContainer width="100%" height={320}>
                        <AreaChart data={performanceSeries}>
                          <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                          <XAxis dataKey="label" tickMargin={12} />
                          <YAxis yAxisId="left" tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
                          <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => formatNumber(Number(value))} />
                          <Tooltip
                            wrapperClassName="rtl"
                            formatter={(value: number, name: string) => {
                              if (name === "revenue") {
                                return [formatCurrency(Number(value)), "الإيرادات"];
                              }
                              if (name === "orders") {
                                return [formatNumber(Number(value)), "الطلبات"];
                              }
                              return [value, name];
                            }}
                            labelFormatter={(label) => `الفترة ${label}`}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fill="url(#revenueGradient)" strokeWidth={3} yAxisId="left" />
                          <Line type="natural" dataKey="orders" stroke="#22c55e" strokeWidth={3} dot={false} yAxisId="right" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-col gap-4">
                      <div>
                        <CardTitle>توزيع الطلبات حسب الحالة</CardTitle>
                        <p className="text-sm text-muted-foreground">رصد تفصيلي لكل ما يحدث في المنصة</p>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={orderPerformance}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                          <XAxis dataKey="label" tickMargin={16} tick={{ fontSize: 12 }} />
                          <YAxis tickFormatter={(value) => formatNumber(Number(value))} />
                          <Tooltip formatter={(value: number) => formatNumber(Number(value))} />
                          <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                            {orderPerformance.map((item) => (
                              <Cell key={item.label} fill={item.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
                  <Card className="2xl:col-span-2">
                    <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle>النشاط اللحظي للمنصة</CardTitle>
                        <p className="text-sm text-muted-foreground">تحليل تفاعل الزوار، المدفوعات، والطلبات على مدار الأسبوع</p>
                      </div>
                      <Badge className="bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300">مراقبة حية</Badge>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={liveActivitySeries}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                          <XAxis dataKey="label" tickMargin={12} />
                          <YAxis tickFormatter={(value) => formatNumber(Number(value))} width={80} />
                          <Tooltip
                            formatter={(value: number, name: string) => {
                              const labelMap: Record<string, string> = {
                                visitors: "الزوار",
                                payments: "عمليات الدفع",
                                orders: "الطلبات"
                              };
                              return [formatNumber(Number(value)), labelMap[name] ?? name];
                            }}
                            labelFormatter={(label) => `اليوم ${label}`}
                          />
                          <Line type="monotone" dataKey="visitors" stroke="#6366f1" strokeWidth={3} dot={false} />
                          <Line type="monotone" dataKey="payments" stroke="#0ea5e9" strokeWidth={3} dot={false} />
                          <Line type="monotone" dataKey="orders" stroke="#22c55e" strokeWidth={3} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-col gap-2">
                      <CardTitle>جودة الخدمات الفورية</CardTitle>
                      <p className="text-sm text-muted-foreground">مراقبة جاهزية أهم الوحدات التشغيلية</p>
                    </CardHeader>
                    <CardContent className="relative pt-0 space-y-4">
                      <div className="relative h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadialBarChart
                            data={serviceHealthMetrics}
                            innerRadius="35%"
                            outerRadius="100%"
                            startAngle={90}
                            endAngle={-270}
                          >
                            <PolarAngleAxis type="number" tick={false} domain={[0, 100]} />
                            <RadialBarWithMinAngle dataKey="value" background cornerRadius={16} fill="#6366f1" />
                            <Tooltip formatter={(value: number) => [`${value}%`, "المؤشر"]} />
                          </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-2xl font-bold text-slate-900 dark:text-white">{formatNumber(serviceHealthScore)}</span>
                          <span className="text-xs text-muted-foreground">مؤشر الصحة العامة</span>
                        </div>
                      </div>
                      <div className="grid gap-2 text-xs text-muted-foreground">
                        {serviceHealthMetrics.map((metric) => (
                          <div key={metric.name} className="flex items-center justify-between rounded-2xl border border-slate-200/70 px-3 py-2 dark:border-slate-500/30">
                            <span>{metric.name}</span>
                            <span className="font-semibold text-slate-900 dark:text-white">{metric.value}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6">
                  <Card className="lg:col-span-2 2xl:col-span-2">
                    <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle>تحليل مصروفات التشغيل</CardTitle>
                        <p className="text-sm text-muted-foreground"> مقارنة تكاليف التنفيذ، اللوجستيات، والدعم خلال النصف الأخير</p>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">تحت المراجعة</Badge>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={expenseEfficiencySeries}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                          <XAxis dataKey="label" tickMargin={12} />
                          <YAxis tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`} />
                          <Tooltip
                            formatter={(value: number, name: string) => {
                              const labelMap: Record<string, string> = {
                                fulfillment: "تنفيذ الطلبات",
                                logistics: "اللوجستيات",
                                support: "الدعم" };
                              return [formatCurrency(Number(value)), labelMap[name] ?? name];
                            }}
                          />
                          <Bar dataKey="fulfillment" stackId="expenses" fill="#6366f1" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="logistics" stackId="expenses" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="support" stackId="expenses" fill="#22c55e" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  <Card className="space-y-3">
                    <CardHeader>
                      <CardTitle>مؤشرات الأتمتة</CardTitle>
                      <p className="text-sm text-muted-foreground">قياسات تسهم في تحسين دقة التشغيل</p>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                      {automationSnapshot.map((item) => (
                        <div key={item.id} className={`rounded-3xl border border-slate-200/70 bg-gradient-to-br ${item.accent} px-4 py-3 dark:border-slate-600/40`}>
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                          <p className={`text-lg font-semibold ${item.tone}`}>{item.value}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <Card className="space-y-3">
                    <CardHeader>
                      <CardTitle>ملخص اليوم</CardTitle>
                      <p className="text-sm text-muted-foreground">انطباعات لحظية عن أداء المنصة</p>
                    </CardHeader>
                    <CardContent className="grid gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center justify-between rounded-3xl border border-slate-200/70 px-4 py-3 dark:border-slate-500/30">
                        <span>الطلبات الموثقة</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{formatNumber(stats.todayOrders)}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-3xl border border-slate-200/70 px-4 py-3 dark:border-slate-500/30">
                        <span>عائد اليوم</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(stats.todayRevenue)}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-3xl border border-slate-200/70 px-4 py-3 dark:border-slate-500/30">
                        <span>الزوار الحاليون</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{formatNumber(stats.liveVisitors)}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-3xl border border-slate-200/70 px-4 py-3 dark:border-slate-500/30">
                        <span>نسبة التحويل</span>
                        <span className="font-semibold text-emerald-600">{stats.conversionRate}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>التوزيع الجغرافي</CardTitle>
                          <p className="text-sm text-muted-foreground">تتبع الأداء عبر مناطق ليبيا</p>
                        </div>
                        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                          <SelectTrigger className="w-36">
                            <SelectValue placeholder="كافة المناطق" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">كافة المناطق</SelectItem>
                            {regionDistribution.map((region) => (
                              <SelectItem key={region.id} value={region.id}>
                                {region.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-5">
                        {regionDistribution.map((region) => (
                          <div key={region.id} className="space-y-2">
                            <div className="flex items-center justify-between text-sm font-medium">
                              <span>{region.label}</span>
                              <span className="text-muted-foreground">{formatNumber(region.orders)} طلب</span>
                            </div>
                            <Progress value={region.percentage} className="h-2.5" />
                          </div>
                        ))}
                      </div>
                      <div className="rounded-3xl bg-gradient-to-l from-indigo-500/10 to-sky-500/10 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">المنطقة المختارة</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{regionSummary.label}</p>
                          </div>
                          <Badge variant="outline" className="rounded-full border-indigo-200 text-indigo-600 dark:text-indigo-300">
                            نمو {regionSummary.growth}%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-200">
                          <div className="rounded-2xl bg-white/80 dark:bg-slate-600/35 border border-white/60 dark:border-white/10 px-3 py-2">
                            <p className="text-xs text-muted-foreground">رضا المتاجر</p>
                            <p className="text-sm font-semibold">{regionSummary.satisfaction}%</p>
                          </div>
                          <div className="rounded-2xl bg-white/80 dark:bg-slate-600/35 border border-white/60 dark:border-white/10 px-3 py-2">
                            <p className="text-xs text-muted-foreground">اتفاقيات الخدمة</p>
                            <p className="text-sm font-semibold">{regionSummary.sla}</p>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">عدد المتاجر ذات الأولوية: {regionSummary.focusStores}</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="xl:col-span-2">
                    <CardHeader className="flex flex-col gap-1">
                      <CardTitle>مركز القيادة المباشر</CardTitle>
                      <p className="text-sm text-muted-foreground">كل الأحداث الحية عبر المنصة في بث واحد</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {operationsPulse.map((item) => {
                        const tone = timelineToneStyles[item.tone];
                        return (
                          <div
                            key={item.id}
                            className={`rounded-3xl border px-4 py-4 bg-white/85 dark:bg-slate-600/45 flex flex-col gap-3 md:flex-row md:items-center md:justify-between ${tone.container}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-11 h-11 rounded-2xl bg-white/95 dark:bg-slate-600/50 flex items-center justify-center shadow ${tone.icon}`}>
                                <item.icon className="h-5 w-5" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className={`rounded-full border-none ${tone.badge}`}>
                                {item.time}
                              </Badge>
                              <Button variant="ghost" size="sm" className="text-xs">
                                تفاصيل الحدث
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <Card className="xl:col-span-2">
                    <CardHeader>
                      <CardTitle>المبادرات الاستراتيجية</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {strategicPrograms.map((program) => (
                        <div
                          key={program.id}
                          className="rounded-3xl border border-slate-200/80 dark:border-slate-600/40 bg-white/85 dark:bg-slate-600/45 px-5 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{program.name}</p>
                            <p className="text-xs text-muted-foreground">{program.nextMilestone}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="rounded-full border-indigo-200 text-indigo-600 dark:text-indigo-300">
                              {program.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">إشراف {program.owner}</span>
                          </div>
                          <div className="flex w-full items-center gap-3 md:w-auto">
                            <Progress value={program.progress} className="h-2.5 w-full md:w-56" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{program.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>التنبيهات الحرجة</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {alerts.map((alert) => {
                        const tone = alertToneStyles[alert.type];
                        return (
                          <div
                            key={alert.id}
                            className={`rounded-3xl border px-4 py-4 flex flex-col gap-3 bg-white/85 dark:bg-slate-600/45 ${tone.container}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${tone.icon}`}>
                                {alert.type === "error" && <AlertCircle className="h-4 w-4" />}
                                {alert.type === "warning" && <AlertTriangle className="h-4 w-4" />}
                                {alert.type === "success" && <CheckCircle className="h-4 w-4" />}
                                {alert.type === "info" && <Activity className="h-4 w-4" />}
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{alert.title}</p>
                                  <Badge variant="outline" className={`rounded-full border-none ${tone.badge}`}>
                                    {alert.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground leading-5">{alert.message}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {alert.resolved ? "تمت المعالجة" : "بانتظار المعالجة"}
                              </span>
                              {!alert.resolved && (
                                <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleResolveAlert(alert.id)}>
                                  تمييز كمحلول
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </div>
                <AnalyticsDashboard />
              </div>
            )}
            {activeTab === "analytics" && <AnalyticsDashboard />}
            {activeTab === "merchants" && <MerchantManagement />}
            {activeTab === "orders" && <OrdersManagement />}
            {activeTab === "inventory" && <InventoryManagement />}
            {activeTab === "products" && <ProductsManagement />}
            {activeTab === "financial" && <FinancialDashboard />}
            {activeTab === "payments" && <PaymentsDashboard />}
            {activeTab === "logistics" && <LogisticsDashboard />}
            {activeTab === "vehicles" && <FleetDashboard />}
            {activeTab === "risk" && <RiskDashboard />}
            {activeTab === "settings" && <SettingsDashboard />}
            {activeTab === "notifications" && <NotificationsDashboard />}
            {activeTab === "crm" && <CrmManagement />}
            {activeTab === "tickets" && <TicketsDashboard />}
            {activeTab === "support" && <SupportDashboard />}
          </main>
        </div>
        <div className="fixed bottom-6 left-6">
          <Button size="lg" className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl">
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
