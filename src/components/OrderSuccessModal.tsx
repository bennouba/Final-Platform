import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Copy, 
  Check, 
  CreditCard,
  ArrowLeft,
  Clock,
  DollarSign
} from 'lucide-react';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    id: string;
    date: string;
    time: string;
    total: number;
    paymentMethod: 'onDelivery' | 'immediate';
    paymentType: string;
  };
  onPaymentSubmit?: (cardNumber: string) => void;
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  orderData,
  onPaymentSubmit
}) => {
  const [currentStep, setCurrentStep] = useState<'card' | 'confirm' | 'success'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [refCopied, setRefCopied] = useState(false);

  if (!isOpen) return null;

  // للدفع عند الاستلام - عرض النجاح مباشرة
  if (orderData.paymentMethod === 'onDelivery') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              تم الطلب بنجاح!
            </h2>
            
            <p className="text-gray-600 mb-6">
              شكراً لك، تم استقبال الطلب وسيتم التواصل معكم في أسرع وقت ممكن
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="text-sm text-gray-600 mb-2">الرقم المرجعي للطلب</div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg font-bold text-primary">
                  {orderData.id}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(orderData.id);
                    setRefCopied(true);
                    setTimeout(() => setRefCopied(false), 2000);
                  }}
                >
                  {refCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {orderData.date} {orderData.time}
              </div>
            </div>

            <Button onClick={onClose} className="w-full">
              موافق
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // للدفع الفوري - عرض خطوات الدفع
  if (currentStep === 'card') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">معاملات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-2xl mb-2">💳</div>
              <p className="text-gray-600">
                يرجى إدخال رقم البطاقة لإتمام عملية الدفع
              </p>
            </div>

            <div>
              <Label htmlFor="cardNumber">رقم البطاقة</Label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1987986986986986"
                maxLength={16}
                className="font-mono text-center text-lg"
              />
            </div>

            {/* ملخص الدفع */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">ملخص الدفع</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>إجمالي الفاتورة</span>
                  <span>{orderData.total} د.ل</span>
                </div>
                <div className="flex justify-between">
                  <span>المبلغ المدفوع</span>
                  <span>0 د.ل</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>المبلغ المتبقي</span>
                  <span>{orderData.total} د.ل</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                إلغاء
              </Button>
              <Button 
                onClick={() => setCurrentStep('confirm')} 
                className="flex-1"
                disabled={cardNumber.length < 16}
              >
                استمرار
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 'confirm') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-6 space-y-6">
            <div className="text-center">
              <div className="text-2xl mb-2">💰</div>
              <h3 className="text-lg font-semibold">تأكيد الدفع</h3>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span>القيمة</span>
                <span>{orderData.total} د.ل</span>
              </div>
              <div className="flex justify-between">
                <span>عمولة المصرف</span>
                <span>0 د.ل</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold">
                <span>الإجمالي المدفوع</span>
                <span>{orderData.total} د.ل</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCurrentStep('card')} className="flex-1">
                تراجع
              </Button>
              <Button 
                onClick={async () => {
                  setIsProcessing(true);
                  await new Promise(resolve => setTimeout(resolve, 2000));
                  setIsProcessing(false);
                  setCurrentStep('success');
                }} 
                className="flex-1"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    جاري المعالجة...
                  </div>
                ) : (
                  'استمرار'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // نجاح العملية
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            تمت عملية الشراء بنجاح
          </h2>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="text-sm text-gray-600 mb-2">رقم مرجعي للطلب</div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg font-bold text-primary">
                {orderData.id}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(orderData.id);
                  setRefCopied(true);
                  setTimeout(() => setRefCopied(false), 2000);
                }}
              >
                {refCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {orderData.date} {orderData.time}
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-6">
            رقم مرجعي لا يتكرر، يولد لمرة واحدة فقط لكل عملية شراء ناجحة
          </div>

          <Button onClick={onClose} className="w-full">
            موافق
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccessModal;
