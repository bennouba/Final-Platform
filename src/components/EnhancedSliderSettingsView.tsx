import React from 'react';
import MerchantSliderManagement from './MerchantSliderManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Settings,
  Store,
  Palette,
  Eye,
  BarChart3,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

interface EnhancedSliderSettingsViewProps {
  currentMerchant?: any;
  storeSlug?: string;
}

const EnhancedSliderSettingsView: React.FC<EnhancedSliderSettingsViewProps> = ({
  currentMerchant,
  storeSlug = 'nawaem'
}) => {
  const handleSliderUpdate = (sliders: any[]) => {

    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
    notification.innerHTML = `
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
      </svg>
      تم تحديث السلايدرز بنجاح! سيتم تحديث متجرك خلال ثوانٍ.
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 5000);
    
    // Trigger store refresh event
    window.dispatchEvent(new CustomEvent('storeDataUpdated', {
      detail: { 
        type: 'sliders',
        storeSlug,
        sliders,
        timestamp: new Date().toISOString()
      }
    }));
  };

  const currentStore = currentMerchant || {
    name: 'متجر نمو',
    ownerName: 'أحمد محمد',
    subdomain: storeSlug
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                إعدادات السلايدرز المتقدمة
              </h1>
              <p className="text-gray-600">
                إدارة شاملة لصور السلايدر الرئيسية لمتجر <strong>{currentStore.name}</strong>
              </p>
            </div>
          </div>
          <Badge variant="outline" className="bg-white">
            <Store className="h-4 w-4 mr-1" />
            {currentStore.subdomain}
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/80 rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">المتجر</p>
                <p className="font-semibold">{currentStore.name}</p>
              </div>
              <Store className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white/80 rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">صاحب المتجر</p>
                <p className="font-semibold">{currentStore.ownerName}</p>
              </div>
              <Palette className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white/80 rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الحالة</p>
                <p className="font-semibold text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  مفعل
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white/80 rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">آخر تحديث</p>
                <p className="font-semibold">{new Date().toLocaleDateString('ar-LY')}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Lightbulb className="h-5 w-5" />
            نصائح مهمة لإدارة السلايدرز
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-900">📸 أفضل الممارسات للصور:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• استخدم صور بدقة عالية (1920x600 على الأقل)</li>
                <li>• تأكد من وضوح النصوص في الصور</li>
                <li>• استخدم ألوان متناسقة مع هوية متجرك</li>
                <li>• تجنب النصوص الطويلة في الصور</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-900">⚡ تحديثات فورية:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• سيتم تحديث متجرك تلقائياً خلال ثوانٍ</li>
                <li>• يمكنك معاينة التغييرات قبل الحفظ</li>
                <li>• سيتم إرسال إشعار عند اكتمال التحديث</li>
                <li>• يمكنك التراجع عن أي تغيير</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Slider Management Component */}
      <Card className="shadow-lg">
        <CardContent className="p-0">
          <MerchantSliderManagement
            storeSlug={storeSlug}
            onSliderUpdate={handleSliderUpdate}
          />
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <BarChart3 className="h-5 w-5" />
            حالة التكامل مع المتجر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">حفظ البيانات</p>
                <p className="text-sm text-green-700">يتم حفظ كل تغيير تلقائياً</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">مزامنة فورية</p>
                <p className="text-sm text-green-700">تحديث المتجر خلال ثوانٍ</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">نسخ احتياطي</p>
                <p className="text-sm text-green-700">حماية البيانات من فقدان</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Info */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <HelpCircle className="h-5 w-5" />
            معلومات تقنية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>معرف المتجر:</strong> {storeSlug}</p>
                <p><strong>نوع التخزين:</strong> localStorage</p>
                <p><strong>تكرار الحفظ:</strong> فوري</p>
              </div>
              <div>
                <p><strong>أقصى حجم للصورة:</strong> 5 ميجابايت</p>
                <p><strong>الصيغ المدعومة:</strong> JPG, PNG, WEBP</p>
                <p><strong>الدقة الموصى بها:</strong> 1920x600</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                💡 <strong>ملاحظة:</strong> جميع التغييرات التي تجريها هنا ستنعكس فوراً على متجرك. 
                يمكنك مراجعة المتجر في أي وقت للتأكد من التطبيق الصحيح للتغييرات.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedSliderSettingsView;
