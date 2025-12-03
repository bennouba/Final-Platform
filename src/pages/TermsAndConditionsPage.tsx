import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Download, ExternalLink } from 'lucide-react';

interface TermsAndConditionsPageProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

const TermsAndConditionsPage: React.FC<TermsAndConditionsPageProps> = ({ onBack }) => {
  const [documentContent, setDocumentContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadDocument();
  }, []);

  const loadDocument = async () => {
    try {
      setLoading(true);
      // محاولة قراءة الملف من المجلد المحلي
      const response = await fetch('/Policies&Terms/إتفاقية وشروط إستخدام منصة إشروا.docx');
      if (response.ok) {
        const blob = await response.blob();
        // هنا يمكن إضافة منطق لقراءة محتوى ملف Word
        // للآن سنعرض رسالة توضيحية
        setDocumentContent('تم تحميل مستند الشروط والأحكام بنجاح. هذا نموذج لعرض المحتوى.');
      } else {
        // في حالة عدم وجود الملف، عرض المحتوى الافتراضي
        setDocumentContent(`# إتفاقية وشروط إستخدام منصة إشرو

## مقدمة
مرحباً بك في منصة إشرو للتجارة الإلكترونية، المنصة الرائدة في ليبيا لإنشاء وإدارة المتاجر الإلكترونية.

## الشروط والأحكام
هذه الشروط والأحكام تحدد القواعد واللوائح لاستخدام موقع إشرو الإلكتروني وتطبيقاته المحمولة. باستخدامك لخدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام.

## تعريف المصطلحات
- **المنصة:** موقع إشرو الإلكتروني وتطبيقاته المحمولة
- **المستخدم:** أي شخص يستخدم خدمات المنصة سواء كتاجر أو زائر
- **التاجر:** الشخص أو الشركة المسجلة لبيع المنتجات عبر المنصة
- **الزائر:** المستخدم الذي يتصفح أو يشتري المنتجات دون بيع

## شروط التسجيل والحسابات
يجب على المستخدمين تقديم معلومات دقيقة وحديثة عند التسجيل والحفاظ على سرية كلمة المرور وعدم مشاركتها مع الآخرين.

## سياسة البيع والشراء
يجب على التجار تقديم وصف دقيق وصادق للمنتجات المعروضة وتحديد الأسعار بوضوح شاملة جميع الرسوم والضرائب.

## سياسة الشحن والتوصيل
نوفر خدمات شحن متعددة بالتعاون مع أفضل شركات الشحن في ليبيا مع ضمان سلامة المنتجات أثناء الشحن.

## سياسة الإرجاع والاستبدال
يحق للعميل إرجاع المنتج خلال 7 أيام من الاستلام مع الحفاظ على حالة المنتج الأصلية.

## حماية البيانات والخصوصية
نلتزم بحماية خصوصية مستخدمينا وفقاً لأعلى المعايير ولا نشارك البيانات الشخصية مع أطراف ثالثة دون موافقة صريحة.

## الرسوم والعمولات
تختلف العمولات حسب الباقة المختارة من التاجر ويتم خصم العمولة تلقائياً من مبيعات التاجر.

## المحتوى والملكية الفكرية
يحتفظ التاجر بحقوق الملكية الفكرية لمنتجاته وصوره ويمنح المنصة ترخيصاً محدوداً لعرض المنتجات.

## إنهاء الخدمة
يحق للمنصة إنهاء الخدمة في حالة انتهاك الشروط مع تسوية جميع المستحقات قبل إنهاء الخدمة.

## تحديث الشروط
نحتفظ بالحق في تحديث هذه الشروط في أي وقت مع إشعار المستخدمين بالتحديثات المهمة.

## القانون المعمول به
تخضع هذه الشروط للقوانين الليبية المعمول بها وأي نزاع ينشأ عن استخدام المنصة يخضع للاختصاص القضائي الليبي.

## التواصل
للتواصل معنا: support@eshro.ly | +218 94 406 2927 | طرابلس، ليبيا`);
      }
    } catch (error) {
      setError('حدث خطأ في تحميل المستند');
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = () => {
    // فتح رابط جوجل درايف لتحميل المستند
    window.open('https://drive.google.com/drive/folders/1jaD3r90U2yRIn8NOmY0kVkSh6jfS0fm1?usp=sharing', '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل مستند الشروط والأحكام...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* الهيدر */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="w-full px-4 mx-auto max-w-7xl py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              العودة
            </Button>

            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-primary">الشروط والأحكام</h1>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={downloadDocument}>
                <Download className="h-4 w-4 mr-2" />
                تحميل PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.open('https://drive.google.com/drive/folders/1jaD3r90U2yRIn8NOmY0kVkSh6jfS0fm1?usp=sharing', '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                عرض في Google Drive
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 mx-auto max-w-7xl py-8">
        {error ? (
          <Card className="shadow-lg border-red-200">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-red-800 mb-2">خطأ في تحميل المستند</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={downloadDocument} variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                عرض المستند في Google Drive
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg">
            <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-green-50">
              <CardTitle className="text-3xl text-primary mb-2">
                إتفاقية وشروط إستخدام منصة إشرو
              </CardTitle>
              <p className="text-gray-600">الإصدار 4.3 - آخر تحديث: {new Date().toLocaleDateString('ar-LY')}</p>
            </CardHeader>

            <CardContent className="prose prose-lg max-w-none">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed font-sans text-sm">
                  {documentContent}
                </pre>
              </div>

              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">للحصول على النسخة الكاملة:</h3>
                <div className="flex gap-3">
                  <Button onClick={downloadDocument} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    تحميل المستند الكامل (PDF)
                  </Button>
                  <Button variant="outline" onClick={() => window.open('https://drive.google.com/drive/folders/1jaD3r90U2yRIn8NOmY0kVkSh6jfS0fm1?usp=sharing', '_blank')} className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    عرض في Google Drive
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* فوتر الصفحة */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2024 منصة إشرو للتجارة الإلكترونية. جميع الحقوق محفوظة.</p>
          <p className="mt-1">للاستفسارات: hi@eshro.ly | 00218928829999</p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
