import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType, type ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Shield, Sparkles, Zap } from "lucide-react";
import { MERCHANT_PERMISSIONS_EVENT, MERCHANT_PERMISSIONS_KEY, merchantSections, merchants } from "./merchantConfig";
import type { SectionNode } from "./merchantConfig";

interface SectionMaps {
  nodes: Map<string, SectionNode>;
  descendants: Map<string, string[]>;
  parents: Map<string, string | null>;
}

type StoreMatrix = Record<string, Record<string, boolean>>;

const matricesEqual = (first: StoreMatrix = {}, second: StoreMatrix = {}) => {
  const storeIds = new Set([...Object.keys(first), ...Object.keys(second)]);
  for (const storeId of storeIds) {
    const firstStore = first[storeId] ?? {};
    const secondStore = second[storeId] ?? {};
    const sectionIds = new Set([...Object.keys(firstStore), ...Object.keys(secondStore)]);
    for (const sectionId of sectionIds) {
      if ((firstStore[sectionId] ?? false) !== (secondStore[sectionId] ?? false)) {
        return false;
      }
    }
  }
  return true;
};

const buildSectionMaps = (nodes: SectionNode[]): SectionMaps => {
  const mapNodes = new Map<string, SectionNode>();
  const descendants = new Map<string, string[]>();
  const parents = new Map<string, string | null>();

  const traverse = (node: SectionNode, parent: string | null): string[] => {
    mapNodes.set(node.id, node);
    parents.set(node.id, parent);
    const childIds: string[] = [];
    node.children?.forEach((child) => {
      childIds.push(child.id);
      childIds.push(...traverse(child, node.id));
    });
    descendants.set(node.id, childIds);
    return childIds;
  };

  nodes.forEach((node) => {
    traverse(node, null);
  });

  return { nodes: mapNodes, descendants, parents };
};

const MerchantManagement = () => {
  const { nodes: sectionNodes, descendants: sectionDescendants, parents: sectionParents } = useMemo(
    () => buildSectionMaps(merchantSections),
    []
  );

  const totalSections = sectionNodes.size;

  const defaultStoreId = merchants[0]?.id ?? "";
  const [activeStore, setActiveStore] = useState<string>(defaultStoreId);

  const createDefaultPermissions = useCallback(() => {
    const initial: StoreMatrix = {};
    merchants.forEach((merchant) => {
      const storeConfig: Record<string, boolean> = {};
      sectionNodes.forEach((node, sectionId) => {
        if (node.required) {
          storeConfig[sectionId] = true;
          return;
        }
        const disabled = merchant.disabled ?? [];
        storeConfig[sectionId] = !disabled.includes(sectionId);
      });
      initial[merchant.id] = storeConfig;
    });
    return initial;
  }, [merchants, sectionNodes]);

  const mergeStoredPermissions = useCallback(
    (stored?: StoreMatrix) => {
      const defaults = createDefaultPermissions();
      if (!stored) {
        return defaults;
      }
      const hydrated: StoreMatrix = {};
      merchants.forEach((merchant) => {
        const defaultConfig = defaults[merchant.id] ?? {};
        const storedConfig = stored[merchant.id] ?? {};
        const merged: Record<string, boolean> = {};
        sectionNodes.forEach((node, sectionId) => {
          if (node.required) {
            merged[sectionId] = true;
            return;
          }
          if (typeof storedConfig[sectionId] === "boolean") {
            merged[sectionId] = storedConfig[sectionId];
            return;
          }
          merged[sectionId] = defaultConfig[sectionId] ?? false;
        });
        hydrated[merchant.id] = merged;
      });
      return hydrated;
    },
    [createDefaultPermissions, merchants, sectionNodes]
  );

  const clonePermissions = useCallback((source: StoreMatrix) => {
    const snapshot: StoreMatrix = {};
    Object.entries(source).forEach(([storeId, config]) => {
      snapshot[storeId] = { ...config };
    });
    return snapshot;
  }, []);

  const loadStoredPermissions = useCallback(() => {
    if (typeof window === "undefined") {
      return createDefaultPermissions();
    }
    try {
      const raw = window.localStorage.getItem(MERCHANT_PERMISSIONS_KEY);
      if (!raw) {
        return createDefaultPermissions();
      }
      const parsed = JSON.parse(raw) as StoreMatrix;
      return mergeStoredPermissions(parsed);
    } catch {
      return createDefaultPermissions();
    }
  }, [createDefaultPermissions, mergeStoredPermissions]);

  const [permissions, setPermissions] = useState<StoreMatrix>(() => loadStoredPermissions());
  const [draftPermissions, setDraftPermissions] = useState<StoreMatrix>(() => clonePermissions(loadStoredPermissions()));
  const previousPermissionsRef = useRef<StoreMatrix | undefined>(undefined);
  const syncingRef = useRef(false);

  const storeHasDraftChanges = useCallback(
    (storeId: string, draftSource: StoreMatrix, baseSource: StoreMatrix) => {
      const draftConfig = draftSource[storeId] ?? {};
      const baseConfig = baseSource[storeId] ?? {};
      const sectionIds = new Set([...Object.keys(draftConfig), ...Object.keys(baseConfig)]);
      for (const sectionId of sectionIds) {
        if (draftConfig[sectionId] !== baseConfig[sectionId]) {
          return true;
        }
      }
      return false;
    },
    []
  );

  const toggleSection = (storeId: string, sectionId: string, value: boolean) => {
    const node = sectionNodes.get(sectionId);
    if (!node || node.required) {
      return;
    }
    setDraftPermissions((previous) => {
      const next: StoreMatrix = {};
      Object.entries(previous).forEach(([id, config]) => {
        next[id] = { ...config };
      });
      
      if (!next[storeId]) {
        next[storeId] = {};
      }
      const storeConfig = { ...next[storeId] };
      storeConfig[sectionId] = value;

      const nested = sectionDescendants.get(sectionId) ?? [];
      nested.forEach((childId) => {
        const childNode = sectionNodes.get(childId);
        if (!childNode?.required) {
          storeConfig[childId] = value;
        }
      });

      if (value) {
        let parentId = sectionParents.get(sectionId);
        while (parentId) {
          const parentNode = sectionNodes.get(parentId);
          if (parentNode && !parentNode.required) {
            storeConfig[parentId] = true;
          }
          parentId = sectionParents.get(parentId) ?? null;
        }
      } else {
        let parentId = sectionParents.get(sectionId);
        while (parentId) {
          const parentNode = sectionNodes.get(parentId);
          if (parentNode && !parentNode.required) {
            const siblings = parentNode.children?.map((child) => child.id) ?? [];
            const hasActiveSibling = siblings.some((siblingId) => {
              if (siblingId === sectionId) return false;
              return Boolean(storeConfig[siblingId]);
            });
            if (!hasActiveSibling) {
              storeConfig[parentId] = false;
            }
          }
          parentId = sectionParents.get(parentId) ?? null;
        }
      }

      next[storeId] = storeConfig;
      return next;
    });
  };

  const bulkToggle = (storeId: string, value: boolean) => {
    setDraftPermissions((previous) => {
      const next: StoreMatrix = {};
      Object.entries(previous).forEach(([id, config]) => {
        next[id] = { ...config };
      });
      const storeConfig: Record<string, boolean> = {};
      sectionNodes.forEach((node, sectionId) => {
        storeConfig[sectionId] = node.required ? true : value;
      });
      next[storeId] = storeConfig;
      return next;
    });
  };

  const handleSaveChanges = useCallback(() => {
    const saved = clonePermissions(draftPermissions);
    setPermissions(saved);
    previousPermissionsRef.current = saved;
  }, [clonePermissions, draftPermissions]);

  const handleResetChanges = useCallback(() => {
    setDraftPermissions(clonePermissions(permissions));
  }, [clonePermissions, permissions]);

  const handleSaveStore = useCallback((storeId: string) => {
    setPermissions((previous) => {
      const next: StoreMatrix = {};
      Object.entries(previous).forEach(([id, config]) => {
        next[id] = { ...config };
      });
      next[storeId] = { ...(draftPermissions[storeId] ?? {}) };
      return next;
    });
  }, [draftPermissions]);

  const handleResetStore = useCallback((storeId: string) => {
    setDraftPermissions((previous) => {
      const next: StoreMatrix = {};
      Object.entries(previous).forEach(([id, config]) => {
        next[id] = { ...config };
      });
      next[storeId] = { ...(permissions[storeId] ?? {}) };
      return next;
    });
  }, [permissions]);

  const hasUnsavedChanges = useMemo(() => {
    const storeIds = new Set([...Object.keys(permissions), ...Object.keys(draftPermissions)]);
    for (const storeId of storeIds) {
      const baseConfig = permissions[storeId] ?? {};
      const draftConfig = draftPermissions[storeId] ?? {};
      const sectionIds = new Set([...Object.keys(baseConfig), ...Object.keys(draftConfig)]);
      for (const sectionId of sectionIds) {
        if (baseConfig[sectionId] !== draftConfig[sectionId]) {
          return true;
        }
      }
    }
    return false;
  }, [draftPermissions, permissions]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      window.localStorage.setItem(MERCHANT_PERMISSIONS_KEY, JSON.stringify(permissions));
      if (syncingRef.current) {
        syncingRef.current = false;
        return;
      }
      window.dispatchEvent(new Event(MERCHANT_PERMISSIONS_EVENT));
    } catch (error) {
      console.error("Failed to save permissions to localStorage:", error);
    }
  }, [permissions]);

  useEffect(() => {
    const previous = previousPermissionsRef.current;
    if (previous && matricesEqual(previous, permissions)) {
      return;
    }
    previousPermissionsRef.current = clonePermissions(permissions);
    setDraftPermissions((currentDraft) => {
      const nextDraft: StoreMatrix = {};
      const storeIds = new Set([...Object.keys(permissions), ...Object.keys(currentDraft)]);
      storeIds.forEach((storeId) => {
        if (previous && storeHasDraftChanges(storeId, currentDraft, previous)) {
          nextDraft[storeId] = { ...(currentDraft[storeId] ?? {}) };
        } else {
          nextDraft[storeId] = { ...(permissions[storeId] ?? {}) };
        }
      });
      return nextDraft;
    });
  }, [permissions, storeHasDraftChanges, clonePermissions]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const synchronizePermissions = () => {
      const stored = loadStoredPermissions();
      setPermissions((current) => {
        if (matricesEqual(current, stored)) {
          return current;
        }
        syncingRef.current = true;
        return stored;
      });
    };
    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === MERCHANT_PERMISSIONS_KEY) {
        synchronizePermissions();
      }
    };
    const handleCustom = () => synchronizePermissions();
    window.addEventListener("storage", handleStorage);
    window.addEventListener(MERCHANT_PERMISSIONS_EVENT, handleCustom as EventListener);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(MERCHANT_PERMISSIONS_EVENT, handleCustom as EventListener);
    };
  }, [loadStoredPermissions]);

  const renderSections = (sections: SectionNode[], storeId: string, level = 0): ReactElement[] => {
    const storeConfig: Record<string, boolean> = draftPermissions[storeId] ?? {};
    return sections.map((section) => {
      const enabled = Boolean(storeConfig[section.id]);
      const isRequired = Boolean(section.required);
      const nested = (section.children?.length ?? 0) > 0;
      return (
        <div
          key={`${storeId}-${section.id}`}
          className={`w-full rounded-3xl border border-slate-200/70 dark:border-slate-800/50 bg-white/75 dark:bg-slate-900/40 p-4 space-y-4 ${
            level > 0 ? "mr-5" : ""
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{section.label}</p>
              {section.description && <p className="text-xs text-muted-foreground">{section.description}</p>}
              {isRequired && <p className="text-xs text-emerald-600">مطلوب لكل التجار</p>}
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={`rounded-full px-3 ${
                  enabled
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800/70 border-transparent"
                }`}
              >
                {enabled ? "مفعل" : "غير مفعّل"}
              </Badge>
              <Switch
                checked={enabled}
                disabled={isRequired}
                onCheckedChange={(value) => {
                  if (typeof value === 'boolean') {
                    toggleSection(storeId, section.id, value);
                  }
                }}
              />
            </div>
          </div>
          {nested && (
            <div className="space-y-3 border-r-2 border-dashed border-indigo-200 dark:border-indigo-800 pr-4 mr-2">
              {renderSections(section.children ?? [], storeId, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="w-full" dir="rtl">
      <Card className="border-none bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <CardHeader className="pb-6">
          <div className="flex flex-col gap-2 text-right">
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" />
              تحكم خارق بواجهات التجار
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">إدارة مرونة واجهات المتاجر</CardTitle>
            <p className="text-sm text-muted-foreground">
              اختر المتجر وحدد الأقسام المفعلة أو المخفية لكل تاجر مع الحفاظ على نظرة عامة وتسجيل خروج دائمين
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 w-full">
        <div className="w-full flex flex-col gap-4 rounded-3xl border border-slate-200/60 bg-white/85 p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/40 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1 text-right flex-1">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">تطبيق إعدادات الأقسام</p>
            <p className="text-xs text-muted-foreground">
              عدّل الأقسام المفعلة لكل متجر ثم احفظ التغييرات لتنعكس فوراً على لوحة تحكم التاجر.
            </p>
            {hasUnsavedChanges && (
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2 mt-2">
                <AlertCircle className="h-3.5 w-3.5" />
                لديك تغييرات غير محفوظة
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleResetChanges} disabled={!hasUnsavedChanges}>
              إلغاء التغييرات
            </Button>
            <Button size="sm" onClick={handleSaveChanges} disabled={!hasUnsavedChanges} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <CheckCircle className="ml-2 h-4 w-4" />
              حفظ التغييرات
            </Button>
          </div>
        </div>
        <Tabs value={activeStore} onValueChange={setActiveStore} className="space-y-6 w-full">
          <TabsList className="grid grid-cols-1 gap-3 rounded-none bg-transparent p-0 w-full md:grid-cols-2 xl:grid-cols-5">
            {merchants.map((merchant) => {
              const draftConfig: Record<string, boolean> = draftPermissions[merchant.id] ?? {};
              const MerchantIcon = merchant.icon;
              const storeHasChanges = storeHasDraftChanges(merchant.id, draftPermissions, permissions);
              const activeCount = Object.values(draftConfig).filter(Boolean).length;
              const activePercent = Math.round((activeCount / totalSections) * 100);
              return (
                <TabsTrigger
                  key={merchant.id}
                  value={merchant.id}
                  className="rounded-3xl border border-slate-200/70 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/40 px-4 py-3 text-right shadow-sm transition-all data-[state=active]:bg-gradient-to-l data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-row-reverse items-center gap-2 text-sm font-semibold">
                        <span>{merchant.name}</span>
                        <span className="flex h-6 w-6 items-center justify-center rounded-xl bg-white/25 text-base">
                          {merchant.emblem}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {storeHasChanges && (
                          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
                            تغييرات غير محفوظة
                          </span>
                        )}
                        <Badge className="rounded-full bg-white/20 text-xs text-white" variant="secondary">
                          {merchant.plan}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground data-[state=active]:text-white/80">{merchant.tagline}</p>
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-emerald-600 dark:text-emerald-300">{activePercent}% فعال</span>
                      <span className="text-slate-500 dark:text-slate-300">{activeCount}/{totalSections}</span>
                    </div>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {merchants.map((merchant) => {
            const draftConfig: Record<string, boolean> = draftPermissions[merchant.id] ?? {};
            const storeHasChanges = storeHasDraftChanges(merchant.id, draftPermissions, permissions);
            const MerchantIcon = merchant.icon;
            const activeCount = Object.values(draftConfig).filter(Boolean).length;
            const inactiveCount = totalSections - activeCount;
            const activePercent = Math.round((activeCount / totalSections) * 100);
            const disabledSections = Object.entries(draftConfig)
              .filter(([sectionId, enabled]) => !enabled && !sectionNodes.get(sectionId)?.required)
              .map(([sectionId]) => sectionNodes.get(sectionId)?.label)
              .filter((label): label is string => Boolean(label));

            return (
              <TabsContent key={merchant.id} value={merchant.id} className="space-y-6 w-full min-w-0">
                <Card className="border-none bg-white/80 dark:bg-slate-900/60 shadow-lg w-full">
                  <CardContent className="flex flex-col gap-6 p-6 w-full">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className={`relative h-11 w-11 rounded-2xl bg-gradient-to-br ${merchant.color} flex items-center justify-center text-white shadow-lg`}>
                          <MerchantIcon className="h-5 w-5 opacity-40" />
                          <span className="absolute text-xl leading-none">{merchant.emblem}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-slate-900 dark:text-white">{merchant.name}</p>
                          <p className="text-xs text-muted-foreground">مالك المتجر: {merchant.owner}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="outline" className="rounded-full border-indigo-200 text-indigo-600 dark:text-indigo-300">
                          فئة {merchant.tier}
                        </Badge>
                        <div className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-600">
                          <CheckCircle className="h-3.5 w-3.5" />
                          رضا {merchant.stats.satisfaction}%
                        </div>
                        <div className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-3 py-1 text-rose-600">
                          <Zap className="h-3.5 w-3.5" />
                          نمو {merchant.stats.growth}
                        </div>
                        {storeHasChanges && (
                          <div className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1 text-amber-600">
                            <AlertCircle className="h-3.5 w-3.5" />
                            تغييرات غير محفوظة
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">الأقسام المفعلة</p>
                        <span className="text-2xl font-semibold text-emerald-600 dark:text-emerald-300">{activeCount}</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">الأقسام المعطلة</p>
                        <span className="text-2xl font-semibold text-rose-500 dark:text-rose-300">{inactiveCount}</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">نسبة التغطية</p>
                        <div className="space-y-1">
                          <Progress value={activePercent} className="h-2.5" />
                          <span className="text-sm font-semibold text-indigo-600">{activePercent}%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">إجراءات سريعة</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => bulkToggle(merchant.id, false)}>
                            <AlertCircle className="ml-2 h-4 w-4" />
                            تعطيل الكل
                          </Button>
                          <Button size="sm" onClick={() => bulkToggle(merchant.id, true)}>
                            <CheckCircle className="ml-2 h-4 w-4" />
                            تفعيل الكل
                          </Button>
                        </div>
                      </div>
                      <div className="col-span-full flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleResetStore(merchant.id)} disabled={!storeHasChanges}>
                          إعادة تعيين المتجر
                        </Button>
                        <Button size="sm" onClick={() => handleSaveStore(merchant.id)} disabled={!storeHasChanges}>
                          حفظ إعدادات المتجر
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {disabledSections.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-muted-foreground">الأقسام المخفية حالياً:</span>
                    {disabledSections.map((label) => (
                      <Badge key={label} variant="outline" className="rounded-full border-rose-200 text-rose-600 dark:border-rose-500/40">
                        {label as string}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-600">
                    <Shield className="h-4 w-4" />
                    جميع الأقسام مفعلة لهذا المتجر
                  </div>
                )}
                <div className="space-y-4 w-full">
                  {renderSections(merchantSections, merchant.id)}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantManagement;
