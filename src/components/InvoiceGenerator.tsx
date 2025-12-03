import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Printer, 
  Store,
  CheckCircle,
  ShoppingCart 
} from 'lucide-react';

interface InvoiceItem {
  id: number;
  name: string;
  image: string;
  specifications: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Customer {
  name: string;
  phone: string;
  email: string;
  address: string;
  city?: string;
}

interface Invoice {
  id: string;
  date: string;
  time: string;
  customer: Customer;
  items: InvoiceItem[];
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  discountPercentage: number;
  finalTotal: number;
}

interface InvoiceGeneratorProps {
  invoice: Invoice;
  onPrint: () => void;
  onDownload: () => void;
  onClose?: () => void;
}

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({
  invoice,
  onPrint,
  onDownload,
  onClose
}) => {
  
  // دالة لتنسيق التاريخ والوقت بشكل صحيح
  const formatDateTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'م' : 'ص';
      
      hours = hours % 12;
      hours = hours ? hours : 12; // الساعة 0 يجب أن تكون 12
      const formattedHours = String(hours).padStart(2, '0');
      
      return `${day}/${month}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
    } catch (error) {
      return new Date().toLocaleDateString('ar-LY') + ' ' + new Date().toLocaleTimeString('ar-LY');
    }
  };
  
  const handlePrint = () => {
    // إنشاء نافذة طباعة منفصلة مع تصميم مطابق لملف PDF المرجعي
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>فاتورة ${invoice.id}</title>
        <style>
          @font-face {
            font-family: 'Cairo';
            src: url('/fonts/Cairo-Regular.ttf') format('truetype');
            font-weight: 400;
          }
          @font-face {
            font-family: 'Cairo';
            src: url('/fonts/Cairo-Bold.ttf') format('truetype');
            font-weight: 700;
          }
          @font-face {
            font-family: 'Cairo';
            src: url('/fonts/Cairo-Medium.ttf') format('truetype');
            font-weight: 500;
          }
          
          * {
            font-family: 'Cairo', sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            background: white;
            color: #333;
            line-height: 1.6;
            padding: 20px;
            direction: rtl;
            font-size: 14px;
          }
          
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border: 1px solid #ddd;
          }
          
          .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 2px solid #dc2626;
          }
          
          .logo-section {
            display: flex;
            align-items: center;
          }
          
          .logo {
            height: 50px;
            width: auto;
            max-width: 200px;
          }
          
          .logo-fallback {
            width: 50px;
            height: 50px;
            background: #0ea5e9;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            border-radius: 8px;
            font-size: 16px;
          }
          
          .date-section {
            text-align: left;
            font-size: 14px;
            font-weight: 500;
          }
          
          .date-section div:first-child {
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .invoice-title {
            text-align: center;
            padding: 20px;
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .invoice-title h1 {
            color: #dc2626;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          
          .reference-number {
            font-size: 16px;
            font-weight: bold;
            color: #374151;
          }
          
          .customer-section {
            padding: 20px;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .customer-title {
            background: #f3f4f6;
            padding: 15px;
            border-right: 4px solid #dc2626;
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 15px;
            text-align: center;
          }
          
          .customer-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          
          .customer-row {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .customer-label {
            font-weight: bold;
            color: #374151;
            min-width: 100px;
          }
          
          .customer-value {
            color: #6b7280;
          }
          
          .products-section {
            overflow-x: auto;
          }
          
          .products-table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .products-table th {
            background: #dc2626;
            color: white;
            padding: 15px 10px;
            text-align: center;
            font-weight: bold;
            border: 1px solid #b91c1c;
          }
          
          .products-table td {
            padding: 12px 10px;
            text-align: center;
            border: 1px solid #e2e8f0;
            vertical-align: middle;
          }
          
          .products-table tbody tr:nth-child(even) {
            background: #f8fafc;
          }
          
          .product-image {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 5px;
          }
          
          .totals-section {
            background: #f8fafc;
            padding: 20px;
          }
          
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 15px;
            margin-bottom: 5px;
            border-radius: 5px;
          }
          
          .subtotal {
            background: #dc2626;
            color: white;
            font-weight: bold;
          }
          
          .shipping {
            background: #f97316;
            color: white;
            font-weight: bold;
          }
          
          .discount {
            background: #10b981;
            color: white;
            font-weight: bold;
          }
          
          .final-total {
            background: #1e40af;
            color: white;
            font-weight: bold;
            font-size: 16px;
            margin-top: 10px;
          }
          
          .terms-section {
            background: #f0f9ff;
            padding: 15px 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
            line-height: 1.5;
          }
          
          .signatures-section {
            display: flex;
            justify-content: space-between;
            padding: 40px 20px;
            border-top: 1px solid #e2e8f0;
          }
          
          .signature {
            text-align: center;
            width: 45%;
          }
          
          .signature-title {
            font-weight: bold;
            margin-bottom: 30px;
            color: #374151;
          }
          
          .signature-line {
            width: 100%;
            height: 2px;
            border-bottom: 2px solid #374151;
          }
          
          @media print {
            body { margin: 0; padding: 10px; }
            .invoice-container { border: none; box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <!-- رأس الفاتورة -->
          <div class="invoice-header">
            <div class="logo-section">
              <img src="/eshro-new-logo.png" alt="إشرو" class="logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
              <div class="logo-fallback" style="display:none;">إشرو</div>
            </div>
            <div class="date-section">
              <div>التاريخ/الوقت:</div>
              <div>${formatDateTime(invoice.date)}</div>
            </div>
          </div>
          
          <!-- عنوان الفاتورة -->
          <div class="invoice-title">
            <h1>الفاتورة النهائية</h1>
            <div class="reference-number">الرقم المرجعي: ${invoice.id}</div>
          </div>
          
          <!-- معلومات العميل -->
          <div class="customer-section">
            <div class="customer-title">معلومات العميل</div>
            <div class="customer-info">
              <div class="customer-row">
                <span class="customer-label">الاسم:</span>
                <span class="customer-value">${invoice.customer.name}</span>
              </div>
              <div class="customer-row">
                <span class="customer-label">رقم الهاتف:</span>
                <span class="customer-value">${invoice.customer.phone}</span>
              </div>
              <div class="customer-row">
                <span class="customer-label">البريد الإلكتروني:</span>
                <span class="customer-value">${invoice.customer.email}</span>
              </div>
              <div class="customer-row">
                <span class="customer-label">العنوان:</span>
                <span class="customer-value">${invoice.customer.address}${invoice.customer.city ? ', ' + invoice.customer.city : ''}</span>
              </div>
            </div>
          </div>
          
          <!-- جدول المنتجات -->
          <div class="products-section">
            <table class="products-table">
              <thead>
                <tr>
                  <th>رقم</th>
                  <th>صورة المنتج</th>
                  <th>المواصفات</th>
                  <th>الكمية</th>
                  <th>سعر الوحدة</th>
                  <th>السعر الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map((item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td><img src="${item.image}" alt="${item.name}" class="product-image" /></td>
                    <td>
                      <div style="font-weight: bold; margin-bottom: 5px;">${item.name}</div>
                      <div style="font-size: 12px; color: #6b7280;">${item.specifications}</div>
                    </td>
                    <td>${item.quantity}</td>
                    <td>${item.unitPrice} د.ل</td>
                    <td>${item.totalPrice} د.ل</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <!-- المبالغ الإجمالية -->
          <div class="totals-section">
            <div class="total-row subtotal">
              <span>إجمالي المنتجات</span>
              <span>${invoice.subtotal} د.ل</span>
            </div>
            <div class="total-row shipping">
              <span>قيمة الشحن والتوصيل</span>
              <span>${invoice.shippingCost || 0} د.ل</span>
            </div>
            <div class="total-row discount">
              <span>قيمة كوبون الخصم (${invoice.discountPercentage || 50}%)</span>
              <span>- ${invoice.discountAmount || 0} د.ل</span>
            </div>
            <div class="total-row final-total">
              <span>المجموع النهائي للفاتورة</span>
              <span>${invoice.finalTotal || (invoice.subtotal + (invoice.shippingCost || 0) - (invoice.discountAmount || 0))} د.ل</span>
            </div>
          </div>
          
          <!-- الشروط والأحكام -->
          <div class="terms-section">
            هذه الفاتورة خاضعة لشروط سياسات الإرجاع والاستبدال وفق الشروط والسياسات المعتمدة لمنصة إشرو خلال 14 يوم للمنتجات الغير مفتوحة
          </div>
          
          <!-- قسم التواقيع -->
          <div class="signatures-section">
            <div class="signature">
              <div class="signature-title">توقيع إستلام الفاتورة</div>
              <div class="signature-line"></div>
            </div>
            <div class="signature">
              <div class="signature-title">توقيع خدمة التوصيل</div>
              <div class="signature-line"></div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    if (onPrint) onPrint();
  };

  const handleDownload = () => {
    // فتح الفاتورة في نافذة جديدة للمعاينة والتحميل
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;

    // استخدام نفس المحتوى من handlePrint
    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>فاتورة ${invoice.id}</title>
        <style>
          @font-face {
            font-family: 'Cairo';
            src: url('/fonts/Cairo-Regular.ttf') format('truetype');
            font-weight: 400;
          }
          @font-face {
            font-family: 'Cairo';
            src: url('/fonts/Cairo-Bold.ttf') format('truetype');
            font-weight: 700;
          }
          @font-face {
            font-family: 'Cairo';
            src: url('/fonts/Cairo-Medium.ttf') format('truetype');
            font-weight: 500;
          }
          
          * {
            font-family: 'Cairo', sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            background: white;
            color: #333;
            line-height: 1.6;
            padding: 20px;
            direction: rtl;
            font-size: 14px;
          }
          
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border: 1px solid #ddd;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          
          .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 2px solid #dc2626;
          }
          
          .logo-section {
            display: flex;
            align-items: center;
          }
          
          .logo {
            height: 50px;
            width: auto;
            max-width: 200px;
          }
          
          .logo-fallback {
            width: 50px;
            height: 50px;
            background: #0ea5e9;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            border-radius: 8px;
            font-size: 16px;
          }
          
          .date-section {
            text-align: left;
            font-size: 14px;
            font-weight: 500;
          }
          
          .date-section div:first-child {
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .invoice-title {
            text-align: center;
            padding: 20px;
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .invoice-title h1 {
            color: #dc2626;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          
          .reference-number {
            font-size: 16px;
            font-weight: bold;
            color: #374151;
          }
          
          .customer-section {
            padding: 20px;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .customer-title {
            background: #f3f4f6;
            padding: 15px;
            border-right: 4px solid #dc2626;
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 15px;
            text-align: center;
          }
          
          .customer-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          
          .customer-row {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .customer-label {
            font-weight: bold;
            color: #374151;
            min-width: 100px;
          }
          
          .customer-value {
            color: #6b7280;
          }
          
          .products-section {
            overflow-x: auto;
          }
          
          .products-table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .products-table th {
            background: #dc2626;
            color: white;
            padding: 15px 10px;
            text-align: center;
            font-weight: bold;
            border: 1px solid #b91c1c;
          }
          
          .products-table td {
            padding: 12px 10px;
            text-align: center;
            border: 1px solid #e2e8f0;
            vertical-align: middle;
          }
          
          .products-table tbody tr:nth-child(even) {
            background: #f8fafc;
          }
          
          .product-image {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 5px;
          }
          
          .totals-section {
            background: #f8fafc;
            padding: 20px;
          }
          
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 15px;
            margin-bottom: 5px;
            border-radius: 5px;
          }
          
          .subtotal {
            background: #dc2626;
            color: white;
            font-weight: bold;
          }
          
          .shipping {
            background: #f97316;
            color: white;
            font-weight: bold;
          }
          
          .discount {
            background: #10b981;
            color: white;
            font-weight: bold;
          }
          
          .final-total {
            background: #1e40af;
            color: white;
            font-weight: bold;
            font-size: 16px;
            margin-top: 10px;
          }
          
          .terms-section {
            background: #f0f9ff;
            padding: 15px 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
            line-height: 1.5;
          }
          
          .signatures-section {
            display: flex;
            justify-content: space-between;
            padding: 40px 20px;
            border-top: 1px solid #e2e8f0;
          }
          
          .signature {
            text-align: center;
            width: 45%;
          }
          
          .signature-title {
            font-weight: bold;
            margin-bottom: 30px;
            color: #374151;
          }
          
          .signature-line {
            width: 100%;
            height: 2px;
            border-bottom: 2px solid #374151;
          }
          
          .download-buttons {
            text-align: center;
            padding: 20px;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
          }
          
          .download-btn {
            background: #dc2626;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            margin: 0 10px;
            cursor: pointer;
            font-family: 'Cairo', sans-serif;
            font-weight: bold;
          }
          
          .download-btn:hover {
            background: #b91c1c;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <!-- رأس الفاتورة -->
          <div class="invoice-header">
            <div class="logo-section">
              <img src="/eshro-new-logo.png" alt="إشرو" class="logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
              <div class="logo-fallback" style="display:none;">إشرو</div>
            </div>
            <div class="date-section">
              <div>التاريخ/الوقت:</div>
              <div>${formatDateTime(invoice.date)}</div>
            </div>
          </div>
          
          <!-- عنوان الفاتورة -->
          <div class="invoice-title">
            <h1>الفاتورة النهائية</h1>
            <div class="reference-number">الرقم المرجعي: ${invoice.id}</div>
          </div>
          
          <!-- معلومات العميل -->
          <div class="customer-section">
            <div class="customer-title">معلومات العميل</div>
            <div class="customer-info">
              <div class="customer-row">
                <span class="customer-label">الاسم:</span>
                <span class="customer-value">${invoice.customer.name}</span>
              </div>
              <div class="customer-row">
                <span class="customer-label">رقم الهاتف:</span>
                <span class="customer-value">${invoice.customer.phone}</span>
              </div>
              <div class="customer-row">
                <span class="customer-label">البريد الإلكتروني:</span>
                <span class="customer-value">${invoice.customer.email}</span>
              </div>
              <div class="customer-row">
                <span class="customer-label">العنوان:</span>
                <span class="customer-value">${invoice.customer.address}${invoice.customer.city ? ', ' + invoice.customer.city : ''}</span>
              </div>
            </div>
          </div>
          
          <!-- جدول المنتجات -->
          <div class="products-section">
            <table class="products-table">
              <thead>
                <tr>
                  <th>رقم</th>
                  <th>صورة المنتج</th>
                  <th>المواصفات</th>
                  <th>الكمية</th>
                  <th>سعر الوحدة</th>
                  <th>السعر الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map((item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td><img src="${item.image}" alt="${item.name}" class="product-image" /></td>
                    <td>
                      <div style="font-weight: bold; margin-bottom: 5px;">${item.name}</div>
                      <div style="font-size: 12px; color: #6b7280;">${item.specifications}</div>
                    </td>
                    <td>${item.quantity}</td>
                    <td>${item.unitPrice} د.ل</td>
                    <td>${item.totalPrice} د.ل</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <!-- المبالغ الإجمالية -->
          <div class="totals-section">
            <div class="total-row subtotal">
              <span>إجمالي المنتجات</span>
              <span>${invoice.subtotal} د.ل</span>
            </div>
            <div class="total-row shipping">
              <span>قيمة الشحن والتوصيل</span>
              <span>${invoice.shippingCost || 0} د.ل</span>
            </div>
            <div class="total-row discount">
              <span>قيمة كوبون الخصم (${invoice.discountPercentage || 50}%)</span>
              <span>- ${invoice.discountAmount || 0} د.ل</span>
            </div>
            <div class="total-row final-total">
              <span>المجموع النهائي للفاتورة</span>
              <span>${invoice.finalTotal || (invoice.subtotal + (invoice.shippingCost || 0) - (invoice.discountAmount || 0))} د.ل</span>
            </div>
          </div>
          
          <!-- الشروط والأحكام -->
          <div class="terms-section">
            هذه الفاتورة خاضعة لشروط سياسات الإرجاع والاستبدال وفق الشروط والسياسات المعتمدة لمنصة إشرو خلال 14 يوم للمنتجات الغير مفتوحة
          </div>
          
          <!-- أزرار التحميل -->
          <div class="download-buttons">
            <button class="download-btn" onclick="window.print()">طباعة الفاتورة</button>
            <button class="download-btn" onclick="window.close()">إغلاق</button>
          </div>
          
          <!-- قسم التواقيع -->
          <div class="signatures-section">
            <div class="signature">
              <div class="signature-title">توقيع إستلام الفاتورة</div>
              <div class="signature-line"></div>
            </div>
            <div class="signature">
              <div class="signature-title">توقيع خدمة التوصيل</div>
              <div class="signature-line"></div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    if (onDownload) onDownload();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <CardTitle className="text-2xl text-green-600">
            تم إنشاء الفاتورة بنجاح
          </CardTitle>
        </div>
        <p className="text-muted-foreground">
          رقم الفاتورة: <Badge variant="outline">{invoice.id}</Badge>
        </p>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={handlePrint}
            className="flex items-center gap-2"
            size="lg"
          >
            <Printer className="h-5 w-5" />
            طباعة الفاتورة
          </Button>
          
          <Button 
            onClick={handleDownload}
            variant="outline"
            className="flex items-center gap-2"
            size="lg"
          >
            <Download className="h-5 w-5" />
            معاينة وتحميل
          </Button>

          {onClose && (
            <Button 
              onClick={onClose}
              variant="ghost"
              className="flex items-center gap-2"
              size="lg"
            >
              إغلاق
            </Button>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-sm text-blue-800 font-medium mb-2">معلومات مهمة:</p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• يمكنك طباعة الفاتورة مباشرة أو حفظها كملف PDF</li>
                <li>• الفاتورة تحتوي على جميع تفاصيل الطلب والدفع</li>
                <li>• احتفظ بنسخة من الفاتورة للمراجع المستقبلية</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceGenerator;
