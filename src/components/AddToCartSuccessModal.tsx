import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ShoppingCart, ArrowRight, Sparkles } from 'lucide-react';

interface AddToCartSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  onViewCart: () => void;
  onContinueShopping: () => void;
}

const AddToCartSuccessModal: React.FC<AddToCartSuccessModalProps> = ({
  isOpen,
  onClose,
  productName,
  quantity,
  selectedSize,
  selectedColor,
  onViewCart,
  onContinueShopping
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            تمت الإضافة بنجاح!
          </h2>
          
          <p className="text-green-600 mb-6 flex items-center justify-center gap-1">
            <Sparkles className="h-4 w-4" />
            تم إضافة المنتج إلى السلة
            <Sparkles className="h-4 w-4" />
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-right">
            <div className="text-sm text-gray-600 mb-2">تفاصيل المنتج المضاف</div>
            <div className="space-y-1 text-sm">
              <div><strong>المنتج:</strong> {productName}</div>
              <div><strong>الكمية:</strong> {quantity}</div>
              <div><strong>المقاس:</strong> {selectedSize}</div>
              <div><strong>اللون:</strong> {selectedColor}</div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => {
                onViewCart();
                onClose();
              }} 
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              عرض السلة
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => {
                onContinueShopping();
                onClose();
              }} 
              className="w-full"
            >
              استمرار التسوق
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddToCartSuccessModal;
