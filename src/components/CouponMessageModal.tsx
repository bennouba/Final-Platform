import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, X, Tag } from 'lucide-react';

interface CouponMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  message: string;
  couponCode?: string;
  discountPercentage?: number;
}

const CouponMessageModal: React.FC<CouponMessageModalProps> = ({
  isOpen,
  onClose,
  type,
  message,
  couponCode,
  discountPercentage
}) => {
  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className={`w-20 h-20 ${isSuccess ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center mx-auto mb-6`}>
            {isSuccess ? (
              <CheckCircle className="h-12 w-12 text-green-600" />
            ) : (
              <X className="h-12 w-12 text-red-600" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isSuccess ? 'تم تطبيق الكوبون بنجاح!' : 'فشل تطبيق الكوبون'}
          </h2>
          
          <p className={`${isSuccess ? 'text-green-600' : 'text-red-600'} mb-6`}>
            {message}
          </p>
          
          {isSuccess && couponCode && discountPercentage && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="text-sm text-gray-600 mb-2">تفاصيل الكوبون</div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-primary" />
                <span className="font-mono text-lg font-bold text-primary">
                  {couponCode}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                نسبة الخصم: {discountPercentage}%
              </div>
            </div>
          )}

          <Button onClick={onClose} className="w-full">
            موافق
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CouponMessageModal;
