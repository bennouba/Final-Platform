import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface StoreInterfaceViewProps {
  storeData: any;
  setStoreData: (data: any) => void;
  onSave: () => void;
}

export const StoreInterfaceView: React.FC<StoreInterfaceViewProps> = ({
  storeData,
  setStoreData,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState('القوالب');
  const [selectedTemplate, setSelectedTemplate] = useState('محترف');

  // Store templates
  const templates = [
    {
      id: 'professional',
      name: 'محترف',
      image: '/assets/real-stores/interface nawaem.png',
      features: [
        'تصميم عصري احترافي',
        'سرعة تحميل عالية',
        'متجاوب مع جميع الأجهزة',
        'خيارات تخصيص متقدمة',
        'دعم اللغات المتعددة'
      ],
      status: 'مفعل'
    },
    {
      id: 'simple',
      name: 'بسيط',
      image: '/assets/real-stores/interface delta store.png',
      features: [
        'تصميم بسيط وأنيق',
        'سهولة في الاستخدام',
        'وقت تحميل سريع',
        'مناسب للمبتدئين'
      ],
      status: 'قريبا'
    }
  ];

  // Store settings
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'متجر نواعم',
    tagline: 'اتصل بنا 24/7',
    phone: '0942161516',
    address: 'طرابلس - سوق الجمعة',
    email: 'Contact@ishro.ly',
    about: 'منصة إشرو للتجارة الإلكترونية نقدم مجموعة من الخدمات و الأدوات العملية لإفتتاح متجرك الإلكتروني والدخول الى عالم التجارة الإلكترونية بشكل سهل وسريع ، في منصة إشرو نعمل على تمكين التجار من تطوير وتنمية تجارتهم و تسهل الوصول والتواصل مع العملاء.',
    copyright: '© 2025منصة إشرو للتجارة الإلكترونية',
    seoTitle: 'منصة إشرو للتجارة الإلكتونية - تمكين وإنتشار -',
    seoDescription: 'بوابة التجارة الإلكترونية في ليبيا ، تجارة الكترونية'
  });

  // Featured sections
  const featuredSections = [
    { id: 'featured_categories', name: 'التصنيفات المميزة', enabled: true },
    { id: 'featured_brands', name: 'العلامات المميزة', enabled: true },
    { id: 'featured_products', name: 'المنتجات المميزة', enabled: true },
    { id: 'discount_offers', name: 'عروض التخفيضات', enabled: true },
    { id: 'product_categories', name: 'عرض فئات المنتج', enabled: true },
    { id: 'selected_categories', name: 'تصنيفات مختارة', enabled: false },
    { id: 'banners', name: 'بنرات الدعاية', enabled: true },
    { id: 'app_download', name: 'تحميل تطبيق المتجر', enabled: false },
    { id: 'newsletter', name: 'نشرة البريد الإلكروني', enabled: true }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">واجهة المتجر</h2>
          <p className="text-gray-600">تخصيص مظهر وإعدادات متجرك الإلكتروني</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="القوالب">القوالب</TabsTrigger>
          <TabsTrigger value="المحتوى">المحتوى</TabsTrigger>
          <TabsTrigger value="المميزات">المميزات</TabsTrigger>
          <TabsTrigger value="الإعدادات">الإعدادات</TabsTrigger>
        </TabsList>

        <TabsContent value="القوالب" className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">قوالب المتجر</h3>
            <p className="text-gray-600">اختر القالب المناسب لمتجرك</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className={`cursor-pointer transition-all ${
                selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
              }`}>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">{template.name}</CardTitle>
                    <Badge className={
                      template.status === 'مفعل' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {template.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <img
                      src={template.image}
                      alt={template.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                        const fallback = (e.target as HTMLElement).nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                      <span className="text-gray-600">معاينة القالب</span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {template.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={selectedTemplate === template.id ? 'default' : 'outline'}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    {template.status === 'قريبا' ? 'قريباً' : 'تعديل'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="المحتوى" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>المحتوى المميز</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredSections.map((section) => (
                  <div key={section.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <span className="font-medium text-gray-900">{section.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${section.enabled ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      <Button size="sm" variant="outline">
                        {section.enabled ? 'مفعل' : 'معطل'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="الإعدادات" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>الـعـنـاويـن والـوصـف</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="storeName">إسم المتجر</Label>
                  <Input
                    id="storeName"
                    value={storeSettings.storeName}
                    onChange={(e) => setStoreSettings({...storeSettings, storeName: e.target.value})}
                    className="text-right"
                  />
                </div>

                <div>
                  <Label htmlFor="tagline">ساعات التواصل</Label>
                  <Input
                    id="tagline"
                    value={storeSettings.tagline}
                    onChange={(e) => setStoreSettings({...storeSettings, tagline: e.target.value})}
                    className="text-right"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">الهاتف</Label>
                  <Input
                    id="phone"
                    value={storeSettings.phone}
                    onChange={(e) => setStoreSettings({...storeSettings, phone: e.target.value})}
                    className="text-right"
                  />
                </div>

                <div>
                  <Label htmlFor="address">العناوين</Label>
                  <Input
                    id="address"
                    value={storeSettings.address}
                    onChange={(e) => setStoreSettings({...storeSettings, address: e.target.value})}
                    className="text-right"
                  />
                </div>

                <div>
                  <Label htmlFor="email">البريد الإلكتروني (إختياري)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={storeSettings.email}
                    onChange={(e) => setStoreSettings({...storeSettings, email: e.target.value})}
                    className="text-right"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="about">من نحن</Label>
                <Textarea
                  id="about"
                  rows={4}
                  value={storeSettings.about}
                  onChange={(e) => setStoreSettings({...storeSettings, about: e.target.value})}
                  className="text-right"
                />
              </div>

              <div>
                <Label htmlFor="copyright">حقوق النشر</Label>
                <Input
                  id="copyright"
                  value={storeSettings.copyright}
                  onChange={(e) => setStoreSettings({...storeSettings, copyright: e.target.value})}
                  className="text-right"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="seoTitle">عنوان الـ SEO</Label>
                  <Input
                    id="seoTitle"
                    value={storeSettings.seoTitle}
                    onChange={(e) => setStoreSettings({...storeSettings, seoTitle: e.target.value})}
                    className="text-right"
                  />
                </div>

                <div>
                  <Label htmlFor="seoDescription">الوصف الخاص بالـ SEO</Label>
                  <Input
                    id="seoDescription"
                    value={storeSettings.seoDescription}
                    onChange={(e) => setStoreSettings({...storeSettings, seoDescription: e.target.value})}
                    className="text-right"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images Section */}
          <Card>
            <CardHeader>
              <CardTitle>الـصـور</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">الشعار</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-gray-500">معاينة الصورة</span>
                    </div>
                    <Button variant="outline" size="sm">
                      إختيار صورة
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">أيقونة المتصفح</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-gray-500">معاينة الصورة</span>
                    </div>
                    <Button variant="outline" size="sm">
                      إختيار صورة
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">SEO صورة خاصة بنشر روابط المتجر</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-gray-500">معاينة الصورة</span>
                    </div>
                    <Button variant="outline" size="sm">
                      إختيار صورة
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods Section */}
          <Card>
            <CardHeader>
              <CardTitle>طـرق الـدفـع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="paymentTitle">العنوان</Label>
                <Input
                  id="paymentTitle"
                  value="نقبل الدفع عبر :"
                  className="text-right"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-3">طرق الدفع المتاحة</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {['سداد', 'موبي كاش', 'ادفعلي', 'تحويل بنكي', 'كاش'].map((method, index) => (
                    <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                        <span className="text-gray-500 text-xs">معاينة الصورة</span>
                      </div>
                      <Button variant="outline" size="sm">
                        إضافة صورة
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popup Banner Section */}
          <Card>
            <CardHeader>
              <CardTitle>النافدة الإعلانية المنبثقة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">تمكين من العرض ؟</Label>
                  <p className="text-sm text-gray-600">تفعيل النافذة الإعلانية عند دخول الزائر للمتجر</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">لا</span>
                  <Button variant="outline" size="sm">نعم</Button>
                </div>
              </div>

              <div>
                <Label htmlFor="popupDelay">زمن تأخر عرض النافذة (ثواني)</Label>
                <Input
                  id="popupDelay"
                  type="number"
                  value="10"
                  className="text-right"
                />
              </div>

              <div>
                <Label htmlFor="welcomeMessage">رسالة الترحيب</Label>
                <Input
                  id="welcomeMessage"
                  value="أهلا بك في متجر نواعم التجريبي"
                  className="text-right"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">الصورة الدعائية المستخدمة</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-gray-500">معاينة الصورة</span>
                  </div>
                  <Button variant="outline">
                    إختيار صورة
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button>حفظ</Button>
                <Button variant="outline">إلغاء</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="المميزات" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>مميزات المتجر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredSections.map((section) => (
                  <div key={section.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{section.name}</h4>
                      <div className={`w-3 h-3 rounded-full ${section.enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      {section.enabled ? 'تعديل' : 'تفعيل'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
