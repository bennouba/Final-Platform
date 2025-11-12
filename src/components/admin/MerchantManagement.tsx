import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, EyeOff, Save, RotateCcw, Store, AlertCircle, Eye } from "lucide-react";
import { MERCHANT_PERMISSIONS_EVENT, MERCHANT_PERMISSIONS_KEY, merchantSections, merchants } from "./merchantConfig";
import type { SectionNode } from "./merchantConfig";

type StoreMatrix = Record<string, Record<string, boolean>>;

interface SectionNodeFlat {
  id: string;
  label: string;
  description?: string;
  required: boolean;
  parentId: string | null;
  children: string[];
  level: number;
}

const flattenSections = (sections: SectionNode[], parentId: string | null = null, level: number = 0): SectionNodeFlat[] => {
  const result: SectionNodeFlat[] = [];
  sections.forEach((section) => {
    const item: SectionNodeFlat = {
      id: section.id,
      label: section.label,
      required: Boolean(section.required),
      parentId,
      children: (section.children || []).map(c => c.id),
      level,
      ...(section.description !== undefined ? { description: section.description } : {})
    };
    result.push(item);
    if (section.children && section.children.length > 0) {
      result.push(...flattenSections(section.children, section.id, level + 1));
    }
  });
  return result;
};

const SectionRow = ({ 
  section, 
  storeId, 
  enabled, 
  onToggle 
}: { 
  section: SectionNodeFlat; 
  storeId: string; 
  enabled: boolean; 
  onToggle: (storeId: string, sectionId: string, newValue: boolean) => void;
}) => {
  const indentPx = section.level * 32;
  
  return (
    <div
      className="w-full transition-none"
      style={{
        paddingRight: `${indentPx}px`,
        marginBottom: '8px',
        minHeight: '70px',
        maxHeight: '70px',
        height: '70px'
      }}
    >
      <div 
        className="rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
        style={{
          padding: '16px',
          minHeight: '70px',
          maxHeight: '70px',
          height: '70px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {section.label}
                </h4>
                {section.required && (
                  <Badge variant="outline" className="rounded-full bg-emerald-50 text-emerald-700 border-emerald-200 text-xs shrink-0">
                    إلزامي
                  </Badge>
                )}
                {section.children.length > 0 && (
                  <Badge variant="outline" className="rounded-full bg-blue-50 text-blue-700 border-blue-200 text-xs shrink-0">
                    {section.children.length}
                  </Badge>
                )}
              </div>
              {section.description && (
                <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-1">
                  {section.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <Badge
              variant={enabled ? "default" : "outline"}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                enabled
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 text-slate-600 border-slate-300"
              }`}
            >
              {enabled ? (
                <><Eye className="w-3 h-3 ml-1 inline" /> مفعّل</>
              ) : (
                <><EyeOff className="w-3 h-3 ml-1 inline" /> معطّل</>
              )}
            </Badge>
            
            <Switch
              checked={enabled}
              disabled={section.required}
              onCheckedChange={(value) => onToggle(storeId, section.id, value)}
              className={section.required ? "opacity-50 cursor-not-allowed" : ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const MerchantManagement = () => {
  const flatSections = useMemo(() => flattenSections(merchantSections), []);
  const sectionMap = useMemo(() => {
    const map = new Map<string, SectionNodeFlat>();
    flatSections.forEach(section => map.set(section.id, section));
    return map;
  }, [flatSections]);

  const initializePermissions = useCallback((): StoreMatrix => {
    const initial: StoreMatrix = {};
    
    merchants.forEach(merchant => {
      const config: Record<string, boolean> = {};
      flatSections.forEach(section => {
        if (section.required) {
          config[section.id] = true;
        } else {
          const disabled = merchant.disabled || [];
          config[section.id] = !disabled.includes(section.id);
        }
      });
      initial[merchant.id] = config;
    });
    
    if (typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem(MERCHANT_PERMISSIONS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as StoreMatrix;
          Object.keys(parsed).forEach(storeId => {
            const storeConfig = parsed[storeId];
            const existingConfig = initial[storeId];
            if (storeConfig && existingConfig) {
              Object.keys(storeConfig).forEach(sectionId => {
                const section = sectionMap.get(sectionId);
                const value = storeConfig[sectionId];
                if (section && !section.required && typeof value === "boolean") {
                  existingConfig[sectionId] = value;
                }
              });
            }
          });
        }
      } catch (error) {
        console.error("❌ Failed to load permissions:", error);
      }
    }
    
    return initial;
  }, [flatSections, sectionMap]);

  const [activeStoreId, setActiveStoreId] = useState<string>(merchants[0]?.id || "");
  const [permissions, setPermissions] = useState<StoreMatrix>(initializePermissions);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);

  useEffect(() => {
    setPermissions(initializePermissions());
  }, [initializePermissions]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const saveToLocalStorage = useCallback((data: StoreMatrix) => {
    if (typeof window === 'undefined') return false;
    
    try {
      setSaveStatus('saving');
      const jsonData = JSON.stringify(data);
      
      window.localStorage.setItem(MERCHANT_PERMISSIONS_KEY, jsonData);
      
      window.dispatchEvent(new Event(MERCHANT_PERMISSIONS_EVENT));
      
      window.dispatchEvent(new StorageEvent('storage', {
        key: MERCHANT_PERMISSIONS_KEY,
        newValue: jsonData,
        oldValue: null,
        storageArea: window.localStorage,
        url: window.location.href
      }));
      
      setLastSavedTime(new Date());
      setSaveStatus('saved');
      
      console.log('✅ Permissions saved successfully');
      console.log('📦 Data:', data);
      
      setTimeout(() => setSaveStatus('idle'), 2000);
      
      return true;
    } catch (error) {
      console.error("❌ Save failed:", error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
      return false;
    }
  }, []);

  const toggleSection = useCallback((storeId: string, sectionId: string, newValue: boolean) => {
    const section = sectionMap.get(sectionId);
    if (!section || section.required) return;

    console.log(`🔄 Toggle: ${section.label} → ${newValue}`);

    setPermissions(prev => {
      const next: StoreMatrix = JSON.parse(JSON.stringify(prev));
      const storeConfig = next[storeId];
      if (!storeConfig) return prev;

      storeConfig[sectionId] = newValue;

      section.children.forEach(childId => {
        const child = sectionMap.get(childId);
        if (child && !child.required) {
          storeConfig[childId] = newValue;
        }
      });

      if (newValue && section.parentId) {
        let currentParentId: string | null = section.parentId;
        while (currentParentId) {
          const parent = sectionMap.get(currentParentId);
          if (parent && !parent.required) {
            storeConfig[currentParentId] = true;
          }
          currentParentId = parent?.parentId || null;
        }
      }

      if (!newValue && section.parentId) {
        let currentParentId: string | null = section.parentId;
        while (currentParentId) {
          const parent = sectionMap.get(currentParentId);
          if (parent && !parent.required) {
            const hasActiveChild = parent.children.some(childId => {
              if (childId === sectionId) return false;
              return storeConfig[childId];
            });
            if (!hasActiveChild) {
              storeConfig[currentParentId] = false;
            }
          }
          currentParentId = parent?.parentId || null;
        }
      }

      saveToLocalStorage(next);
      return next;
    });
  }, [sectionMap, saveToLocalStorage]);

  const bulkToggle = useCallback((storeId: string, enable: boolean) => {
    setPermissions(prev => {
      const next: StoreMatrix = JSON.parse(JSON.stringify(prev));
      const storeConfig: Record<string, boolean> = {};
      
      flatSections.forEach(section => {
        storeConfig[section.id] = section.required ? true : enable;
      });

      next[storeId] = storeConfig;
      saveToLocalStorage(next);
      return next;
    });
  }, [flatSections, saveToLocalStorage]);

  const resetStore = useCallback((storeId: string) => {
    const merchant = merchants.find(m => m.id === storeId);
    if (!merchant) return;

    setPermissions(prev => {
      const next: StoreMatrix = JSON.parse(JSON.stringify(prev));
      const config: Record<string, boolean> = {};
      const disabled = merchant.disabled || [];
      
      flatSections.forEach(section => {
        config[section.id] = section.required ? true : !disabled.includes(section.id);
      });

      next[storeId] = config;
      saveToLocalStorage(next);
      return next;
    });
  }, [flatSections, saveToLocalStorage]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleStorageChange = (event: StorageEvent | Event) => {
      if ('key' in event && event.key && event.key !== MERCHANT_PERMISSIONS_KEY) return;
      
      try {
        const stored = window.localStorage.getItem(MERCHANT_PERMISSIONS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as StoreMatrix;
          setPermissions(parsed);
        }
      } catch (error) {
        console.error("❌ Sync failed:", error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(MERCHANT_PERMISSIONS_EVENT, handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(MERCHANT_PERMISSIONS_EVENT, handleStorageChange);
    };
  }, []);

  return (
    <div 
      className="w-full overflow-y-auto bg-slate-50 dark:bg-slate-900" 
      style={{ 
        minHeight: '100vh', 
        height: '100vh',
        padding: '24px',
        position: 'relative'
      }}
      dir="rtl"
    >
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <Card className="border-none shadow-xl bg-white dark:bg-slate-800">
          <CardHeader className="border-b border-slate-200 dark:border-slate-700" style={{ padding: '24px', minHeight: '120px' }}>
            <div className="flex items-center gap-4">
              <div 
                className="flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg"
                style={{ height: '56px', width: '56px' }}
              >
                <Store className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  إدارة صلاحيات المتاجر
                  {saveStatus === 'saved' && (
                    <Badge className="bg-emerald-500 text-white">
                      <CheckCircle className="w-3 h-3 ml-1" />
                      تم الحفظ
                    </Badge>
                  )}
                  {saveStatus === 'saving' && (
                    <Badge className="bg-blue-500 text-white">
                      <Save className="w-3 h-3 ml-1" />
                      جاري الحفظ
                    </Badge>
                  )}
                  {saveStatus === 'error' && (
                    <Badge className="bg-red-500 text-white">
                      <AlertCircle className="w-3 h-3 ml-1" />
                      خطأ
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  التغييرات تُحفظ فوراً وتطبق على واجهة التاجر بعد إعادة التحميل
                  {lastSavedTime && (
                    <span className="mr-2 text-emerald-600">
                      • {lastSavedTime.toLocaleTimeString('ar-LY')}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent style={{ padding: '24px' }}>
            <Tabs value={activeStoreId} onValueChange={setActiveStoreId} className="w-full">
              <div className="overflow-x-auto pb-2">
                <TabsList className="inline-flex w-full min-w-max gap-3 bg-transparent p-0 h-auto">
                  {merchants.map(merchant => {
                    const Icon = merchant.icon;
                    const config = permissions[merchant.id] || {};
                    const activeCount = Object.values(config).filter(Boolean).length;
                    const totalCount = flatSections.length;
                    const percentage = Math.round((activeCount / totalCount) * 100);
                    
                    return (
                      <TabsTrigger
                        key={merchant.id}
                        value={merchant.id}
                        className="flex-col items-start p-4 h-auto rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 data-[state=active]:border-indigo-500 data-[state=active]:bg-indigo-50 dark:data-[state=active]:bg-indigo-950/30 transition-all"
                        style={{ minWidth: '180px' }}
                      >
                        <div className="w-full space-y-3">
                          <div className="flex items-center justify-between w-full gap-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${merchant.color} flex items-center justify-center shadow-md relative shrink-0`}>
                                <Icon className="w-5 h-5 text-white/90" />
                                <span className="absolute text-lg">{merchant.emblem}</span>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-sm text-slate-900 dark:text-white">
                                  {merchant.name}
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                  {merchant.owner}
                                </p>
                              </div>
                            </div>
                            <Badge className="rounded-full text-xs shrink-0">
                              {merchant.plan}
                            </Badge>
                          </div>
                          <div className="w-full space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-600 dark:text-slate-400">المفعّلة</span>
                              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                {activeCount}/{totalCount}
                              </span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        </div>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              {merchants.map(merchant => {
                const config = permissions[merchant.id] || {};
                const activeCount = Object.values(config).filter(Boolean).length;
                const totalCount = flatSections.length;
                const inactiveCount = totalCount - activeCount;
                const disabledSections = flatSections
                  .filter(s => !s.required && !config[s.id])
                  .map(s => s.label);

                return (
                  <TabsContent key={merchant.id} value={merchant.id} style={{ marginTop: '24px' }}>
                    <div style={{ marginBottom: '24px' }}>
                      <Card className="border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                        <CardContent style={{ padding: '24px' }}>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">المفعّلة</p>
                              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                {activeCount}
                              </p>
                              <p className="text-xs text-slate-500">من {totalCount}</p>
                            </div>
                            
                            <div>
                              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">المعطّلة</p>
                              <p className="text-3xl font-bold text-rose-500 dark:text-rose-400">
                                {inactiveCount}
                              </p>
                              <p className="text-xs text-slate-500">قسم</p>
                            </div>
                            
                            <div className="md:col-span-2">
                              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-2">إجراءات سريعة</p>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => bulkToggle(merchant.id, true)}
                                  className="flex-1 border-emerald-300 hover:bg-emerald-50"
                                >
                                  <CheckCircle className="w-4 h-4 ml-2" />
                                  تفعيل الكل
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => bulkToggle(merchant.id, false)}
                                  className="flex-1 border-slate-300 hover:bg-slate-50"
                                >
                                  <EyeOff className="w-4 h-4 ml-2" />
                                  تعطيل الكل
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => resetStore(merchant.id)}
                                  className="border-indigo-300 hover:bg-indigo-50"
                                >
                                  <RotateCcw className="w-4 h-4 ml-2" />
                                  إعادة
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          {disabledSections.length > 0 && (
                            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgb(226 232 240)' }}>
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                                📋 الأقسام المخفية ({disabledSections.length}):
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {disabledSections.map(label => (
                                  <Badge
                                    key={label}
                                    variant="outline"
                                    className="rounded-full text-xs border-rose-200 text-rose-700 bg-rose-50"
                                  >
                                    {label}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      {flatSections.map(section => {
                        const enabled = config[section.id] ?? true;
                        return (
                          <SectionRow
                            key={`${merchant.id}-${section.id}`}
                            section={section}
                            storeId={merchant.id}
                            enabled={enabled}
                            onToggle={toggleSection}
                          />
                        );
                      })}
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>

        <Card className="mt-6 border border-slate-300">
          <CardHeader style={{ paddingBottom: '12px' }}>
            <CardTitle className="text-sm font-semibold">🔍 لوحة الاختبار</CardTitle>
          </CardHeader>
          <CardContent className="text-xs font-mono">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-slate-600">Key:</p>
                <code className="text-indigo-600">{MERCHANT_PERMISSIONS_KEY}</code>
              </div>
              <div>
                <p className="text-slate-600">Event:</p>
                <code className="text-indigo-600">{MERCHANT_PERMISSIONS_EVENT}</code>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const stored = localStorage.getItem(MERCHANT_PERMISSIONS_KEY);
                console.log('📦 localStorage:', stored ? JSON.parse(stored) : 'EMPTY');
                console.log('🔑 Current permissions state:', permissions);
                alert('تم عرض البيانات في Console (F12)');
              }}
            >
              عرض البيانات
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MerchantManagement;
