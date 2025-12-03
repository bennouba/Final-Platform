import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, Download, ExternalLink } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
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
      const response = await fetch('/Policies&Terms/سياسة الخصوصية.docx');
      if (response.ok) {
        const blob = await response.blob();
        // هنا يمكن إضافة منطق لقراءة محتوى ملف Word
        setDocumentContent('تم تحميل مستند سياسة الخصوصية بنجاح. هذا نموذج لعرض المحتوى.');
      } else {
        // في حالة عدم وجود الملف، عرض المحتوى الافتراضي
        setDocumentContent(`# سياسة الخصوصية وحماية البيانات الشخصية

## مقدمة
في منصة إشرو، نحن ملتزمون بحماية خصوصيتك وبناء الثقة معك. تُعد خصوصيتك أولوية قصوى بالنسبة لنا، ونحن نحرص على حماية معلوماتك الشخصية بأعلى معايير الأمان والسرية.

## البيانات التي نجمعها
### البيانات الشخصية:
- الاسم الكامل وتاريخ الميلاد والجنس
- البريد الإلكتروني ورقم الهاتف
- العنوان والمدينة والمنطقة
- معلومات الحساب البنكي (مشفرة بالكامل)

### بيانات الاستخدام:
- سجل النشاطات والتفاعلات مع المنصة
- معلومات الجهاز ونوع المتصفح
- عنوان IP وسجل التصفح
- ملفات تعريف الارتباط (Cookies)

## كيفية حماية بياناتك
نستخدم أحدث تقنيات التشفير والأمان لحماية بياناتك:
- تشفير SSL 256-bit لجميع البيانات المرسلة
- تخزين آمن في خوادم محمية ومراقبة
- نظام مراقبة 24/7 للكشف عن التهديدات
- نسخ احتياطية دورية مشفرة

## مشاركة البيانات مع الأطراف الأخرى
لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أطراف ثالثة لأغراض تسويقية دون موافقتك الصريحة.

### ما نشاركه:
- معلومات الشحن مع شركات التوصيل
- بيانات الدفع مع البنوك ومعالجات الدفع
- إحصائيات عامة مع شركاء الأعمال
- البيانات المطلوبة قانوناً للجهات المختصة

### ما لا نشاركه:
- معلوماتك الشخصية لأغراض تسويقية
- بياناتك المالية مع أطراف ثالثة
- سجل تصفحك أو نشاطك الشخصي
- بياناتك مع الشركات الإعلانية

## حقوقك في التحكم ببياناتك
يحق لك:
- الوصول لبياناتك الشخصية وطلب نسخة منها
- تصحيح أو تحديث معلوماتك في أي وقت
- طلب حذف حسابك وبياناتك نهائياً
- الاعتراض على معالجة بياناتك لأغراض معينة
- طلب نقل بياناتك لمنصة أخرى
- سحب الموافقة في أي وقت

## ملفات تعريف الارتباط (Cookies)
نستخدم ملفات تعريف الارتباط لتحسين تجربتك على المنصة وتقديم محتوى مخصص.

### أنواع الكوكيز المستخدمة:
- ملفات أساسية لتشغيل الموقع بشكل صحيح
- ملفات التحليل لفهم سلوك المستخدمين
- ملفات التسويق لعرض إعلانات مناسبة
- ملفات التفضيلات لتخصيص التجربة

## فترة الاحتفاظ بالبيانات
نحتفظ ببياناتك للمدة اللازمة فقط:
- بيانات الحساب: طول فترة استخدام المنصة
- سجل الطلبات: 5 سنوات لأغراض المحاسبة
- بيانات الدفع: 3 سنوات لأغراض الامتثال
- سجل التواصل: سنتان لتحسين الخدمة

## خصوصية الأطفال
منصة إشرو مخصصة للاستخدام من قبل الأشخاص فوق سن 18 عاماً. نحن لا نجمع عمداً معلومات شخصية من الأطفال دون سن 18 عاماً دون موافقة الوالدين.

## التواصل بشأن الخصوصية
إذا كان لديك أي أسئلة أو مخاوف بشأن سياسة الخصوصية، يرجى التواصل معنا:
- مسؤول حماية البيانات: privacy@eshro.ly
- رقم الهاتف: +218 94 406 2927
- العنوان: طرابلس، ليبيا

## تحديث سياسة الخصوصية
قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سيتم إشعارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار داخلي في المنصة.

**تاريخ آخر تحديث:** ${new Date().toLocaleDateString('ar-LY')}
**الإصدار:** 4.3 - منصة إشرو للتجارة الإلكترونية`);
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
          <p className="text-gray-600">جاري تحميل مستند سياسة الخصوصية...</p>
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
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-primary">سياسة الخصوصية</h1>
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
                <Shield className="h-8 w-8 text-red-600" />
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
            <CardHeader className="text-center bg-gradient-to-r from-green-50 to-blue-50">
              <CardTitle className="text-3xl text-primary mb-2">
                سياسة الخصوصية وحماية البيانات الشخصية
              </CardTitle>
              <p className="text-gray-600">منصة إشرو للتجارة الإلكترونية - آخر تحديث: {new Date().toLocaleDateString('ar-LY')}</p>
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
          <p className="mt-1">للاستفسارات حول الخصوصية: privacy@eshro.ly | 00218928829999</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
