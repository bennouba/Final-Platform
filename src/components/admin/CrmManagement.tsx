import { useCallback, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  Mail,
  ExternalLink,
  Check,
  AlertCircle,
  Settings,
  Link2,
  Users,
  MessageSquare,
  TrendingUp,
  Zap
} from "lucide-react";

interface CrmIntegration {
  id: string;
  name: string;
  description: string;
  icon: typeof MessageCircle;
  status: "connected" | "disconnected" | "pending";
  url: string;
  apiKey?: string;
  emailConnected?: string;
  features: string[];
  color: string;
  bgColor: string;
}

const CrmManagement = () => {
  const [integrations, setIntegrations] = useState<CrmIntegration[]>([
    {
      id: "whatsapp",
      name: "واتس آب للعملاء",
      description: "التواصل المباشر مع العملاء عبر واتس آب",
      icon: MessageCircle,
      status: "connected",
      url: "https://www.whatsapp.com/business",
      features: [
        "رسائل فورية",
        "دعم 24/7",
        "جماعات العملاء",
        "تحديثات تلقائية"
      ],
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20"
    },
    {
      id: "wasender",
      name: "WASender - التسويق الذكي",
      description: "إرسال رسائل جماعية وردود ذكية مع إدارة علاقات العملاء",
      icon: Zap,
      status: "disconnected",
      url: "https://wasender.com",
      features: [
        "إرسال جماعي",
        "ردود ذكية بالذكاء الاصطناعي",
        "إدارة CRM متكاملة",
        "تحليلات متقدمة",
        "قائمة بيضاء"
      ],
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      id: "streak",
      name: "Streak CRM - للبريد الإلكتروني",
      description: "إدارة علاقات العملاء مباشرة من Gmail",
      icon: Mail,
      status: "pending",
      url: "https://www.streakcRM.com",
      emailConnected: "admin@example.com",
      features: [
        "إدارة العملاء في Gmail",
        "تتبع البريد الإلكتروني",
        "خطوط أنابيب المبيعات",
        "التنبيهات الذكية",
        "التقارير التفصيلية"
      ],
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/20"
    }
  ]);

  const [apiKey, setApiKey] = useState("");
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);

  const handleConnect = useCallback((integrationId: string) => {
    setIntegrations(prev =>
      prev.map(int =>
        int.id === integrationId
          ? { ...int, status: "connected" as const }
          : int
      )
    );
    setSelectedIntegration(null);
    setApiKey("");
  }, []);

  const handleDisconnect = useCallback((integrationId: string) => {
    setIntegrations(prev =>
      prev.map(int =>
        int.id === integrationId
          ? { ...int, status: "disconnected" as const }
          : int
      )
    );
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300">
            <Check className="w-3 h-3 ml-1" /> متصل
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300">
            <AlertCircle className="w-3 h-3 ml-1" /> قيد الانتظار
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-slate-600">
            <AlertCircle className="w-3 h-3 ml-1" /> معطّل
          </Badge>
        );
    }
  };

  return (
    <div className="w-full space-y-8" dir="rtl">
      <div className="grid gap-6">
        <Card className="border-none bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                    إدارة العملاء (CRM)
                  </CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    تكاملات متعددة للتواصل والتحليل
                  </p>
                </div>
              </div>
              <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
                {integrations.filter(i => i.status === "connected").length}/3 متصل
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {integrations.map((integration) => {
            const IconComponent = integration.icon;
            return (
              <Card key={integration.id} className={`border-2 border-slate-200 dark:border-slate-700 ${integration.bgColor}`}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-3 rounded-xl bg-white dark:bg-slate-700 ${integration.color}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold">
                          {integration.name}
                        </CardTitle>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {integration.description}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(integration.status)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      المميزات:
                    </p>
                    <div className="space-y-2">
                      {integration.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {integration.emailConnected && (
                    <div className="rounded-lg bg-white/50 dark:bg-slate-700/50 p-3 border border-slate-200 dark:border-slate-600">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                        البريد المتصل:
                      </p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {integration.emailConnected}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    {integration.status === "connected" ? (
                      <>
                        <Button
                          onClick={() => window.open(integration.url, "_blank")}
                          className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white"
                        >
                          <ExternalLink className="h-4 w-4 ml-2" />
                          فتح
                        </Button>
                        <Button
                          onClick={() => handleDisconnect(integration.id)}
                          variant="outline"
                          className="flex-1"
                        >
                          قطع
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => setSelectedIntegration(integration.id)}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                        >
                          <Link2 className="h-4 w-4 ml-2" />
                          ربط
                        </Button>
                        <Button
                          onClick={() => window.open(integration.url, "_blank")}
                          variant="outline"
                          className="flex-1"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>

                  {selectedIntegration === integration.id && (
                    <div className="rounded-lg border-2 border-indigo-300 bg-indigo-50 dark:bg-indigo-950/30 p-4 space-y-3">
                      <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                        أدخل مفتاح API
                      </p>
                      <Input
                        type="password"
                        placeholder="API Key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="bg-white dark:bg-slate-700"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleConnect(integration.id)}
                          disabled={!apiKey}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50"
                        >
                          <Check className="h-4 w-4 ml-2" />
                          تأكيد الربط
                        </Button>
                        <Button
                          onClick={() => setSelectedIntegration(null)}
                          variant="outline"
                          className="flex-1"
                        >
                          إلغاء
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-2 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-indigo-600" />
              <CardTitle>خيارات إضافية</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer transition-colors">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <MessageSquare className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      رسائل تلقائية
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      إعداد ردود آلية للعملاء
                    </p>
                  </div>
                  <ExternalLink className="h-5 w-5 text-slate-400" />
                </div>

                <div className="flex items-center gap-2 p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer transition-colors">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <Users className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      تجزئة العملاء
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      تقسيم العملاء حسب السلوك
                    </p>
                  </div>
                  <ExternalLink className="h-5 w-5 text-slate-400" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer transition-colors">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <TrendingUp className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      التحليلات المتقدمة
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      تقارير تفصيلية وإحصائيات
                    </p>
                  </div>
                  <ExternalLink className="h-5 w-5 text-slate-400" />
                </div>

                <div className="flex items-center gap-2 p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer transition-colors">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <Zap className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      الأتمتة
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      تسيير العمليات التسويقية
                    </p>
                  </div>
                  <ExternalLink className="h-5 w-5 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <strong>ملاحظة:</strong> تأكد من توفر مفاتيح API الصحيحة من خدمات التكامل قبل الربط. جميع البيانات محمية وآمنة.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrmManagement;
