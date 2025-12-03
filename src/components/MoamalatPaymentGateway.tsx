import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle,
  CreditCard,
  Loader2,
  Lock,
  Shield,
  X
} from 'lucide-react';

interface MoamalatPaymentGatewayProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderData: any;
  onPaymentSuccess: (transactionData: any) => void;
  onPaymentError: (error: string) => void;
}

const MoamalatPaymentGateway: React.FC<MoamalatPaymentGatewayProps> = ({
  isOpen,
  onClose,
  amount,
  orderData,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [otp, setOtp] = useState('');
  const [showTestData, setShowTestData] = useState(false);

  // المصارف الليبية المربوطة بمعاملات
  const libyanBanks = [
    { id: 'jumhouria', name: 'مصرف الجمهورية', logo: '/assets/banks/jumhouria.png' },
    { id: 'sahara', name: 'مصرف الصحاري', logo: '/assets/banks/sahara-bank.jpg' },
    { id: 'united', name: 'مصرف المتحد', logo: '/assets/banks/united.jpg' },
    { id: 'ijma', name: 'مصرف الاجماع العربي', logo: '/assets/banks/commerce-bank.png' },
    { id: 'yaqeen', name: 'مصرف اليقين', logo: '/assets/banks/yaken.png' },
    { id: 'islami', name: 'المصرف الليبي الاسلامي', logo: '/assets/banks/Libyan-islamic.png' },
    { id: 'wahda', name: 'مصرف الوحدة', logo: '/assets/banks/wahda.png' },
    { id: 'tijari', name: 'مصرف التجاري الوطني', logo: '/assets/banks/national-commercial-bank.png' },
    { id: 'nab', name: 'مصرف شمال أفريقيا', logo: '/assets/banks/north-africa.png' },
    { id: 'andalus', name: 'مصرف الاندلس', logo: '/assets/banks/andalus.png' },
    { id: 'noran', name: 'مصرف النوران', logo: '/assets/banks/nuran.png' },
    { id: 'atib', name: 'مصرف اتيب', logo: '/assets/banks/ATIB.svg' },
    { id: 'aman', name: 'مصرف الامان', logo: '/assets/banks/aman-bank.png' },
    { id: 'tadamon', name: 'مصرف التضامن', logo: '/assets/banks/tadamun-bank.png' },
    { id: 'gulf', name: 'مصرف الخليج الأول', logo: '/assets/banks/libyan-golf.jpg' }
  ];
  
  // الحصول على البنك المختار
  const selectedBankData = libyanBanks.find(bank => bank.id === selectedBank);

  const initiatePayment = () => {
    // التحقق من البيانات المطلوبة
    if (!selectedBank) {
      alert('يرجى اختيار المصرف');
      return;
    }
    
    if (!cardNumber || cardNumber.length !== 16) {
      alert('يرجى إدخال رقم بطاقة صحيح (16 رقم)');
      return;
    }
    
    if (!expiryDate || !expiryDate.match(/^\d{2}\/\d{2}$/)) {
      alert('يرجى إدخال تاريخ انتهاء صحيح (MM/YY)');
      return;
    }
    
    if (!otp || otp.length !== 6) {
      alert('يرجى إدخال رمز التحقق (6 أرقام)');
      return;
    }

    setIsLoading(true);

    try {
      // محاكاة عملية الدفع مع معاملات
      setTimeout(() => {
        // محاكاة استجابة API معاملات
        const transactionData = {
          transactionId: 'MOAMALAT_' + Date.now(),
          amount,
          status: 'completed',
          timestamp: new Date().toISOString(),
          gateway: 'moamalat',
          bank: selectedBank,
          cardNumber: cardNumber.replace(/(.{4})/g, '$1 ').trim(),
          maskedCardNumber: cardNumber.substring(0, 4) + 'XXXX XXXX ' + cardNumber.substring(12),
          expiryDate,
          merchantId: 'ESHRO_001',
          terminalId: 'TERM_001',
          actionCode: '00', // نجاح العملية
          systemReference: 'SYS' + Math.floor(Math.random() * 1000000),
          networkReference: 'NET' + Math.floor(Math.random() * 1000000),
          payerAccount: cardNumber.substring(0, 6) + 'XXXXXX' + cardNumber.substring(12),
          currency: '434', // الدينار الليبي
          message: 'Approved'
        };
        
        onPaymentSuccess(transactionData);
        setIsLoading(false);
      }, 3000); // زيادة وقت المعالجة لمحاكاة عملية حقيقية
      
    } catch (error) {

      setIsLoading(false);
      onPaymentError('فشل في بدء عملية الدفع. يرجى المحاولة مرة أخرى.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto border-8 border-gray-100 animate-fadeIn">
        <Card className="border-0 shadow-none rounded-2xl">
        <CardHeader className="text-center bg-gray-50 border-b">
          <CardTitle className="flex items-center justify-center gap-3 text-xl font-bold text-gray-800">
            {selectedBankData && (
              <img 
                src={selectedBankData.logo} 
                alt={selectedBankData.name}
                className="h-16 w-auto object-contain max-w-[120px]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <span>بوابة المدفوعات الإلكترونية</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {/* رقم الطلب */}
          <div className="text-center mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-sm text-gray-600 mb-1">رقم</div>
              <div className="text-blue-600 font-mono text-lg font-bold">
                {orderData?.id || 'ESHRO-' + Date.now()}
              </div>
            </div>
          </div>

          {/* ملخص الدفع */}
          <div className="space-y-4 mb-6">
            <h4 className="font-semibold text-gray-700 text-center">ملخص الدفع</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span>إجمالي الفاتورة:</span>
                <span className="font-medium text-red-500">
                  {((orderData?.subtotal || 0) + (orderData?.shippingCost || 0)).toFixed(2)} د.ل
                </span>
              </div>
              
              {(orderData?.discountAmount || 0) > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span>التخفيض المطبق:</span>
                  <span className="font-medium text-green-600">
                    -{(orderData?.discountAmount || 0).toFixed(2)} د.ل
                  </span>
                </div>
              )}
              
              <hr className="border-gray-300" />
              
              <div className="flex justify-between items-center font-bold text-lg">
                <span>المبلغ النهائي</span>
                <span className="text-blue-600">{amount.toFixed(2)} د.ل</span>
              </div>
            </div>
          </div>

          {/* اختيار المصرف */}
          <div className="mb-4">
            <Label htmlFor="bank-select" className="block text-sm font-medium text-gray-700 mb-2">
              اختر مصرفك:
            </Label>
            <select 
              id="bank-select"
              value={selectedBank} 
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="اختر مصرفك"
            >
              <option value="">اختر مصرفك...</option>
              {libyanBanks.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* بيانات البطاقة */}
          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-2">
                رقم البطاقة:
              </Label>
              <Input
                id="card-number"
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="6394993077260781"
                className="text-center text-lg font-mono"
                maxLength={16}
              />
            </div>
            
            <div>
              <Label htmlFor="expiry-date" className="block text-sm font-medium text-gray-700 mb-2">
                تاريخ الانتهاء (MM/YY):
              </Label>
              <Input
                id="expiry-date"
                type="text"
                value={expiryDate}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                  }
                  setExpiryDate(value);
                }}
                placeholder="10/23"
                className="text-center text-lg font-mono"
                maxLength={5}
              />
            </div>
            
            <div>
              <Label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                رمز التحقق (OTP):
              </Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="111111"
                className="text-center text-lg font-mono"
                maxLength={6}
              />
            </div>
            
            {/* بيانات الاختبار */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">بيانات الاختبار</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTestData(!showTestData)}
                  className="text-xs border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                >
                  {showTestData ? 'إخفاء' : 'إظهار'}
                </Button>
              </div>
              {showTestData && (
                <div className="text-xs text-yellow-700 space-y-1">
                  <div><strong>رقم البطاقة:</strong> 6394993077260781</div>
                  <div><strong>تاريخ الانتهاء:</strong> 10/23</div>
                  <div><strong>OTP:</strong> 111111</div>
                  <div className="mt-2 text-yellow-600">اضغط على الاستعمال لملء البيانات تلقائياً</div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCardNumber('6394993077260781');
                      setExpiryDate('10/23');
                      setOtp('111111');
                    }}
                    className="w-full mt-2 text-xs border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                  >
                    استعمال بيانات الاختبار
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* معلومات الأمان */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="text-xs">
                <p className="font-medium text-green-800 mb-1">دفع آمن ومضمون</p>
                <p className="text-green-700">
                  جميع المعاملات محمية بتشفير SSL وتتم معالجتها عبر بوابة معاملات المصرفية الآمنة.
                </p>
              </div>
            </div>
          </div>

          {/* أزرار الإجراء */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={isLoading}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              راجع
            </Button>
            
            <Button
              onClick={initiatePayment}
              disabled={isLoading || !selectedBank || !cardNumber || !expiryDate || !otp}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري المعالجة...
                </div>
              ) : (
                <>
                  استمرار
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default MoamalatPaymentGateway;
