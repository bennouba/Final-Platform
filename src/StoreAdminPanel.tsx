import React, { useEffect, useMemo, useState } from 'react';

// Store Admin Panel — advanced, extensible control panel to manage stores (local + permanent)
// Drop this file into your project and render it from App when needed.

interface AnyStore {
  slug: string;
  name?: string;
  logo?: string;
  description?: string;
  source: 'local' | 'permanent' | 'both';
}

const canonicalSlug = (v: any) => {
  const n = String(v ?? '').trim().toLowerCase().replace(/\s+/g, '-');
  const alias: Record<string, string> = {
    sherine: 'sheirine',
    sheirin: 'sheirine',
    delta: 'delta-store',
    details: 'delta-store',
    detail: 'delta-store',
    megna: 'magna-beauty',
    magna: 'magna-beauty',
    magna_beauty: 'magna-beauty',
  };
  return alias[n] || n;
};

const fallbackLogo = '/default-store.png';

async function fetchPermanentIndex(): Promise<AnyStore[]> {
  try {
    const res = await fetch('/assets/stores/index.json', { cache: 'no-store' });
    if (!res.ok) return [];
    const json: any = await res.json().catch(() => ([]));
    const list = Array.isArray(json) ? json : (Array.isArray(json?.stores) ? json.stores : []);
    if (!Array.isArray(list)) return [];
    return list.map((s: any) => ({
      slug: canonicalSlug(s.slug || s.subdomain || s.name),
      name: s.name || s.nameAr || s.slug,
      description: s.description || '',
      logo: s.logo || fallbackLogo,
      source: 'permanent',
    }));
  } catch {
    return [];
  }
}

function getLocalStores(): AnyStore[] {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return [];
  const out: Record<string, AnyStore> = {};
  try {
    const reg = JSON.parse(localStorage.getItem('eshro_stores') || '[]');
    if (Array.isArray(reg)) {
      for (const s of reg) {
        const slug = canonicalSlug(s?.subdomain || s?.id);
        if (!slug) continue;
        out[slug] = {
          slug,
          name: s?.nameAr || s?.name || slug,
          logo: s?.logo || fallbackLogo,
          description: s?.description || '',
          source: 'local',
        };
      }
    }
  } catch {
    // Silently ignore parsing errors
  }

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('eshro_store_files_')) {
      try {
        const raw = localStorage.getItem(key);
        const data = raw ? JSON.parse(raw) : null;
        const st = data?.storeData;
        const slug = canonicalSlug(st?.storeSlug || st?.subdomain);
        if (!slug) continue;
        if (!out[slug]) out[slug] = { slug, source: 'local' } as AnyStore;
        out[slug].name = out[slug].name || st?.nameAr || st?.storeName || slug;
        out[slug].logo = out[slug].logo || st?.logo || fallbackLogo;
        out[slug].description = out[slug].description || st?.description || '';
      } catch {
        // Silently ignore parsing errors
      }
    }
  }
  return Object.values(out);
}

function fixLocalStore(slug: string) {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  const key = `eshro_store_files_${slug}`;
  const raw = localStorage.getItem(key);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    if (!data.storeData) return;
    data.storeData.logo = data.storeData.logo || fallbackLogo;
    data.storeData.products = (data.storeData.products || []).map((p: any) => ({
      ...p,
      images: Array.isArray(p.images) && p.images.length ? p.images : ['/default-product.png'],
    }));
    data.storeData.sliderImages = (data.storeData.sliderImages || []).map((s: any) => ({
      ...s, image: s.image || '/default-slider.png',
    }));
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(`store_products_${slug}`, JSON.stringify(data.storeData.products));
    localStorage.setItem(`store_sliders_${slug}`, JSON.stringify(data.storeData.sliderImages));

    // also update eshro_stores logo
    try {
      const reg = JSON.parse(localStorage.getItem('eshro_stores') || '[]');
      if (Array.isArray(reg)) {
        const idx = reg.findIndex((s: any) => canonicalSlug(s?.subdomain || s?.id) === slug);
        if (idx >= 0) {
          reg[idx].logo = reg[idx].logo || fallbackLogo;
          localStorage.setItem('eshro_stores', JSON.stringify(reg));
        }
      }
    } catch {
      // Silently ignore nested parsing errors
    }
  } catch {
    // Silently ignore parsing errors
  }
}

function deleteLocalStore(slug: string) {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    const reg = JSON.parse(localStorage.getItem('eshro_stores') || '[]');
    const filtered = Array.isArray(reg) ? reg.filter((s: any) => canonicalSlug(s?.subdomain || s?.id) !== slug) : [];
    localStorage.setItem('eshro_stores', JSON.stringify(filtered));
  } catch {
    // Silently ignore parsing errors
  }
  localStorage.removeItem(`eshro_store_files_${slug}`);
  localStorage.removeItem(`store_products_${slug}`);
  localStorage.removeItem(`store_sliders_${slug}`);
}

async function requestPermanentDelete(slug: string): Promise<{ ok: boolean; message: string }>{
  // Try a few conventional endpoints; degrade gracefully if unavailable
  const candidates = [
    `/api/stores/cleanup?slug=${encodeURIComponent(slug)}`,
    `/api/stores/delete?slug=${encodeURIComponent(slug)}`,
    `/api/stores/remove/${encodeURIComponent(slug)}`,
  ];
  for (const url of candidates) {
    try {
      const res = await fetch(url, { method: 'POST' });
      if (res.ok) {
        const j = await res.json().catch(() => ({}));
        return { ok: true, message: j?.message || 'Deleted' };
      }
    } catch {
      // Silently ignore request errors
    }
  }
  return { ok: false, message: 'No server delete endpoint available. Use tools/store-cleaner.mjs from project root.' };
}

const StoreAdminPanel: React.FC = () => {
  const [permanent, setPermanent] = useState<AnyStore[]>([]);
  const [local, setLocal] = useState<AnyStore[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  const merged = useMemo(() => {
    const map = new Map<string, AnyStore>();
    permanent.forEach((s) => map.set(s.slug, s));
    local.forEach((s) => {
      const existing = map.get(s.slug);
      if (!existing) map.set(s.slug, s);
      else map.set(s.slug, { ...existing, source: existing ? (existing.source === 'permanent' ? 'both' : existing.source) : s.source });
    });
    return Array.from(map.values()).sort((a, b) => a.slug.localeCompare(b.slug));
  }, [permanent, local]);

  const refresh = async () => {
    setLoading(true);
    setMessage('Loading stores...');
    const p = await fetchPermanentIndex();
    setPermanent(p);
    setLocal(getLocalStores());
    setLoading(false);
    setMessage('');
  };

  useEffect(() => {
    refresh();
  }, []);

  const toggle = (slug: string) => setSelected((prev) => ({ ...prev, [slug]: !prev[slug] }));
  const clearSel = () => setSelected({});

  const selectedSlugs = Object.keys(selected).filter((k) => selected[k]);

  const doFixLocal = () => {
    if (!selectedSlugs.length) return;
    selectedSlugs.forEach(fixLocalStore);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('storeCreated'));
    setMessage('✅ تم إصلاح المتاجر المحددة محليًا');
  };

  const doDeleteLocal = () => {
    if (!selectedSlugs.length) return;
    if (!confirm('سيتم حذف بيانات المتجر محليًا (localStorage). متابعة؟')) return;
    selectedSlugs.forEach(deleteLocalStore);
    window.dispatchEvent(new Event('storage'));
    setLocal(getLocalStores());
    setSelected({});
    setMessage('🗑️ تم حذف المتاجر محليًا');
  };

  const doDeletePermanent = async () => {
    if (!selectedSlugs.length) return;
    if (!confirm('محاولة حذف المتاجر من الخادم/الملفات. متابعة؟')) return;
    setLoading(true);
    const results: string[] = [];
    for (const slug of selectedSlugs) {
      const r = await requestPermanentDelete(slug);
      results.push(`${slug}: ${r.ok ? 'Deleted' : 'Failed'} — ${r.message}`);
    }
    setLoading(false);
    setMessage(results.join('\n'));
  };

  const allChecked = merged.length > 0 && selectedSlugs.length === merged.length;
  const toggleAll = () => {
    if (allChecked) return setSelected({});
    const next: Record<string, boolean> = {};
    merged.forEach((s) => (next[s.slug] = true));
    setSelected(next);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">لوحة إدارة المتاجر</h1>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-md border" onClick={refresh} disabled={loading}>تحديث</button>
          <button className="px-3 py-2 rounded-md border" onClick={clearSel}>مسح التحديد</button>
        </div>
      </div>

      {message && (
        <div className="mb-3 p-3 rounded-md border bg-yellow-50 text-yellow-800 whitespace-pre-wrap">{message}</div>
      )}

      <div className="mb-3 flex items-center gap-2">
        <button className="px-3 py-2 rounded-md bg-emerald-600 text-white" onClick={doFixLocal} disabled={!selectedSlugs.length}>إصلاح المحدد (محلي)</button>
        <button className="px-3 py-2 rounded-md border border-red-400 text-red-600" onClick={doDeleteLocal} disabled={!selectedSlugs.length}>حذف المحدد (محلي)</button>
        <button className="px-3 py-2 rounded-md border" onClick={doDeletePermanent} disabled={!selectedSlugs.length}>حذف دائم (خادم/ملفات)</button>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 w-10 text-center"><input type="checkbox" checked={allChecked} onChange={toggleAll} aria-label="تحديد جميع المتاجر" /></th>
              <th className="p-2">المتجر</th>
              <th className="p-2">السلاج</th>
              <th className="p-2">المصدر</th>
              <th className="p-2">إجراءات سريعة</th>
            </tr>
          </thead>
          <tbody>
            {merged.map((s) => (
              <tr key={s.slug} className="border-t">
                <td className="p-2 text-center">
                  <input type="checkbox" checked={!!selected[s.slug]} onChange={() => toggle(s.slug)} aria-label={`تحديد متجر ${s.name}`} />
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-3">
                    <img src={s.logo || fallbackLogo} alt="" role="presentation" aria-hidden="true" className="w-9 h-9 rounded-md object-contain border" onError={(e) => { (e.target as HTMLImageElement).src = fallbackLogo; }} />
                    <div>
                      <div className="font-medium">{s.name || s.slug}</div>
                      <div className="text-gray-500 text-xs line-clamp-1">{s.description || ''}</div>
                    </div>
                  </div>
                </td>
                <td className="p-2 font-mono text-xs">{s.slug}</td>
                <td className="p-2">
                  {s.source === 'both' ? (
                    <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs">محلي + دائم</span>
                  ) : s.source === 'permanent' ? (
                    <span className="px-2 py-1 rounded bg-violet-50 text-violet-700 text-xs">دائم</span>
                  ) : (
                    <span className="px-2 py-1 rounded bg-amber-50 text-amber-700 text-xs">محلي</span>
                  )}
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 rounded-md border text-xs" onClick={() => { fixLocalStore(s.slug); setMessage('✅ تم إصلاح '+s.slug); }}>إصلاح سريع</button>
                    <button className="px-2 py-1 rounded-md border text-xs" onClick={() => { deleteLocalStore(s.slug); setLocal(getLocalStores()); setMessage('🗑️ حذف محلي '+s.slug); }}>حذف محلي</button>
                    <button className="px-2 py-1 rounded-md border text-xs" onClick={async () => { const r = await requestPermanentDelete(s.slug); setMessage(`${s.slug}: ${r.ok ? 'Deleted' : 'Failed'} — ${r.message}`); }}>حذف دائم</button>
                  </div>
                </td>
              </tr>
            ))}
            {merged.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">لا توجد متاجر</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        ملاحظة: الحذف الدائم يعتمد على وجود واجهة خادم مناسبة. إن فشل، استخدم أداة الطرفية tools/store-cleaner.mjs من جذر المشروع لحذف المجلدات وتحديث index.json.
      </div>
    </div>
  );
};

export default StoreAdminPanel;
