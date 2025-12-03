import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Edit, Trash2, X, Check, AlertCircle, Image as ImageIcon, Save, Upload } from 'lucide-react';
import { adTemplates, type AdTemplate, type PublishedAd } from '@/data/adTemplates';

interface AdsManagementViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

interface AdDraft {
  templateId: string;
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl?: string;
}

interface AdWithPlacement extends PublishedAd {
  placement?: 'banner' | 'between_products';
}

const AdsManagementView: React.FC<AdsManagementViewProps> = ({
  storeData,
  setStoreData,
  onSave
}) => {
  const [step, setStep] = useState<'list' | 'create-step1' | 'create-step2'>('list');
  const [selectedTemplate, setSelectedTemplate] = useState<AdTemplate | null>(null);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [adDraft, setAdDraft] = useState<AdDraft>({
    templateId: '',
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
  });
  const [adPlacement, setAdPlacement] = useState<'banner' | 'between_products'>('banner');
  const [publishedAds, setPublishedAds] = useState<AdWithPlacement[]>([]);

  const loadPublishedAds = async () => {
    const storeId = storeData?.slug || storeData?.storeSlug || storeData?.id;
    if (!storeId) return;
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/ads/store/${storeId}`);
      
      if (response.ok) {
        const result = await response.json();
        setPublishedAds(result.data);
        localStorage.setItem(`eshro_store_ads_${storeId}`, JSON.stringify(result.data));
        return;
      }
    } catch (error) {
      console.error('Error loading ads from backend:', error);
    }
    
    const storageKey = `eshro_store_ads_${storeId}`;
    const savedAds = localStorage.getItem(storageKey);
    if (savedAds) {
      try {
        setPublishedAds(JSON.parse(savedAds));
      } catch {
        // Silent error handling
      }
    }
  };

  useEffect(() => {
    loadPublishedAds();
  }, [storeData?.slug, storeData?.storeSlug, storeData?.id]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 5000);
  };

  const handleSelectTemplate = (template: AdTemplate) => {
    setSelectedTemplate(template);
    setUploadedImageFile(null);
    setAdDraft({
      templateId: template.id,
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
    });
    setStep('create-step1');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAdDraft({ ...adDraft, imageUrl: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDraft = () => {
    if (!adDraft.title.trim()) {
      alert('يرجى إدخال عنوان الإعلان');
      return;
    }
    if (!adDraft.description.trim()) {
      alert('يرجى إدخال نص الإعلان');
      return;
    }
    setStep('create-step2');
  };

const handlePublishAd = async () => {
    const storeId = storeData?.slug || storeData?.storeSlug || storeData?.id;
    
    if (!storeId) {
      showNotification('معرف المتجر غير صحيح', 'error');
      return;
    }

    if (typeof storeId !== 'string' && typeof storeId !== 'number') {
      showNotification('معرف المتجر بصيغة غير صحيحة', 'error');
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/ads/store/${storeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: adDraft.templateId,
          title: adDraft.title,
          description: adDraft.description,
          imageUrl: adDraft.imageUrl,
          linkUrl: adDraft.linkUrl,
          placement: adPlacement
        })
      });

      if (response.ok) {
        const result = await response.json();
        const newAd: AdWithPlacement = {
          id: result.data?.id || `ad-${Date.now()}`,
          templateId: adDraft.templateId,
          layout: selectedTemplate?.layout as any,
          title: adDraft.title,
          description: adDraft.description,
          imageUrl: adDraft.imageUrl,
          linkUrl: adDraft.linkUrl,
          isActive: true,
          placement: adPlacement,
          createdAt: result.data?.createdAt || new Date().toISOString(),
          views: 0,
          clicks: 0,
        };

        const updatedAds = [...publishedAds, newAd];
        setPublishedAds(updatedAds);
        const finalStoreId = storeData?.slug || storeData?.storeSlug || storeData?.id;
        localStorage.setItem(`eshro_store_ads_${finalStoreId}`, JSON.stringify(updatedAds));
        
        window.dispatchEvent(new CustomEvent('storeAdsUpdated', {
          detail: { storeId, ads: updatedAds }
        }));
        
        showNotification('تم نشر الإعلان بنجاح!', 'success');
        setStep('list');
        setSelectedTemplate(null);
        setUploadedImageFile(null);
        setAdDraft({ templateId: '', title: '', description: '', imageUrl: '', linkUrl: '' });
        setAdPlacement('banner');
        onSave();
      } else {
        const errorData = await response.json().catch(() => ({}));
        showNotification(`فشل النشر: ${errorData.message || response.statusText}`, 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      showNotification(`حدث خطأ في النشر: ${errorMessage}`, 'error');
    }
  };

  const handleDeleteAd = (adId: string) => {
    const updatedAds = publishedAds.filter(ad => ad.id !== adId);
    setPublishedAds(updatedAds);
    const finalStoreId = storeData?.slug || storeData?.storeSlug || storeData?.id;
    localStorage.setItem(`eshro_store_ads_${finalStoreId}`, JSON.stringify(updatedAds));
  };

  if (step === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">إدارة الإعلانات</h2>
            <p className="text-gray-600 mt-1">إنشاء وإدارة إعلانات متجرك بسهولة</p>
          </div>
          <Button
            onClick={() => setStep('create-step1')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <Plus className="h-4 w-4 ml-2" />
            إعلان جديد
          </Button>
        </div>

        {publishedAds.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="py-12">
              <div className="text-center">
                <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد إعلانات منشورة</h3>
                <p className="text-gray-600 mb-6">ابدأ بإنشاء إعلانك الأول للمتجر</p>
                <Button
                  onClick={() => setStep('create-step1')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 ml-2" />
                  إنشاء إعلان
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {publishedAds.map((ad) => (
              <Card key={ad.id} className="overflow-hidden hover:shadow-lg transition">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
                  {ad.imageUrl ? (
                    <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className={ad.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                      {ad.isActive ? 'مفعل' : 'معطل'}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 truncate">{ad.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ad.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>👁 {ad.views} مشاهدة</span>
                    <span>🔗 {ad.clicks} نقرة</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteAd(ad.id)}
                    >
                      <Trash2 className="h-4 w-4 ml-1" />
                      حذف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (step === 'create-step1') {
    const templatesByLayout = {
      banner: adTemplates.filter(t => t.layout === 'banner'),
      between_products: adTemplates.filter(t => t.layout === 'between_products'),
      popup: adTemplates.filter(t => t.layout === 'popup'),
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">الخطوة 1 من 2: اختيار القالب</h2>
            <p className="text-gray-600 mt-1">اختر قالباً وأضف محتوى إعلانك</p>
          </div>
          <Button variant="outline" onClick={() => setStep('list')}>
            <X className="h-4 w-4 ml-2" />
            إلغاء
          </Button>
        </div>

        {selectedTemplate ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle>القالب المختار</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border">
                    <p className="font-semibold text-gray-900">{selectedTemplate.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{selectedTemplate.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    تغيير القالب
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div>
                  <Label>عنوان الإعلان</Label>
                  <Input
                    value={adDraft.title}
                    onChange={(e) => setAdDraft({ ...adDraft, title: e.target.value })}
                    placeholder="أدخل عنوان جذاب..."
                    maxLength={selectedTemplate.textMaxLength || 100}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {adDraft.title.length} / {selectedTemplate.textMaxLength || 100}
                  </p>
                </div>

                <div>
                  <Label>نص الإعلان</Label>
                  <Textarea
                    value={adDraft.description}
                    onChange={(e) => setAdDraft({ ...adDraft, description: e.target.value })}
                    placeholder="اكتب نص الإعلان..."
                    rows={4}
                    maxLength={selectedTemplate.textMaxLength ? selectedTemplate.textMaxLength * 2 : 300}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {adDraft.description.length} / {selectedTemplate.textMaxLength ? selectedTemplate.textMaxLength * 2 : 300}
                  </p>
                </div>

                <div>
                  <Label>صورة الإعلان (اختيارية)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="ad-image-upload"
                    />
                    <label htmlFor="ad-image-upload" className="cursor-pointer">
                      <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">اضغط لرفع صورة أو اسحبها هنا</p>
                    </label>
                  </div>
                  {uploadedImageFile && (
                    <p className="text-xs text-green-600 mt-1">تم رفع الصورة: {uploadedImageFile.name}</p>
                  )}
                </div>

                <div>
                  <Label>رابط الإعلان (اختياري)</Label>
                  <Input
                    value={adDraft.linkUrl}
                    onChange={(e) => setAdDraft({ ...adDraft, linkUrl: e.target.value })}
                    placeholder="https://example.com أو /products"
                    type="url"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>معاينة الإعلان</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center"
                    style={{
                      width: `${Math.min(selectedTemplate.width / 4, 300)}px`,
                      height: `${Math.min(selectedTemplate.height / 4, 200)}px`,
                      aspectRatio: `${selectedTemplate.width} / ${selectedTemplate.height}`
                    }}
                  >
                    <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 text-center">
                      {selectedTemplate.width} x {selectedTemplate.height}
                    </p>
                    {adDraft.title && (
                      <div className="mt-3 text-center">
                        <p className="text-sm font-semibold text-gray-900">{adDraft.title}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button
                  onClick={handleSaveDraft}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <Check className="h-4 w-4 ml-2" />
                  متابعة
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStep('list')}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(templatesByLayout).map(([layoutType, templates]) => (
              <div key={layoutType}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {layoutType === 'banner' && '🎯 إعلانات خاطفة (أفقية)'}
                  {layoutType === 'between_products' && '📦 إعلانات بين المنتجات'}
                  {layoutType === 'popup' && '💬 نوافذ منبثقة'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer"
                      onClick={() => handleSelectTemplate(template)}
                    >
                      <Card className="hover:shadow-lg transition border-2 hover:border-blue-400">
                        <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900">{template.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                          <p className="text-xs text-gray-500 mt-2">{template.width} × {template.height}px</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (step === 'create-step2') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">الخطوة 2 من 2: اختيار الموضع والنشر</h2>
            <p className="text-gray-600 mt-1">اختر مكان عرض الإعلان في المتجر</p>
          </div>
          <Button variant="outline" onClick={() => setStep('list')}>
            <X className="h-4 w-4 ml-2" />
            إلغاء
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>موضع الإعلان</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>اختر موضع الإعلان</Label>
              <Select value={adPlacement} onValueChange={(value: any) => setAdPlacement(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="banner">🎯 إعلان خاطف (الأعلى)</SelectItem>
                  <SelectItem value="between_products">📦 بين المنتجات</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                {adPlacement === 'banner' && 'سيظهر الإعلان في الأعلى قبل المنتجات'}
                {adPlacement === 'between_products' && 'سيظهر الإعلان بين المنتجات في المتجر'}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handlePublishAd}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <Check className="h-4 w-4 ml-2" />
                نشر الإعلان
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep('create-step1')}
              >
                رجوع
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default AdsManagementView;
