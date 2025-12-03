// AddToCartPopup component: Modal for adding products to cart with size, color, and quantity selection
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import AddToCartSuccessModal from './AddToCartSuccessModal';
import { 
  X, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Star, 
  Heart,
  Share2,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Tag
} from 'lucide-react';
import {
  PRODUCT_IMAGE_FALLBACK_SRC,
  advanceImageOnError,
  buildProductMediaConfig,
  getImageMimeType
} from '@/lib/utils';

interface ProductColorOption {
  name: string;
  value: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  images?: string[];
  rating: number;
  reviews: number;
  sizes?: string[];
  colors?: string[] | ProductColorOption[]; // accept either simple names or objects with name/value
  category: string;
  description?: string;
  discount?: number;
}

interface AddToCartPopupProps {
  isOpen: boolean;
  product: Product;
  onClose: () => void;
  onAddToCart?: (product: Product, size: string, color: string, quantity: number) => void;
  onViewCart: () => void;
  onContinueShopping: () => void;
  selectedSize?: string;
  selectedColor?: string;
  quantity?: number;
  onCheckout?: () => void;
}

const AddToCartPopup: React.FC<AddToCartPopupProps> = ({
  isOpen,
  product,
  onClose,
  onAddToCart,
  onViewCart,
  onContinueShopping,
  selectedSize: initialSelectedSize, // optional, not required
  selectedColor: initialSelectedColor, // optional, not required
  quantity: initialQuantity, // optional, not required
  onCheckout, // optional, reserved for future use
}) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const availableSizes = useMemo(() => product.sizes || ['S', 'M', 'L', 'XL'], [product.sizes]);
  
  // Normalize colors to an array of color names
  const availableColors = useMemo(() => {
    if (Array.isArray(product.colors)) {
      if (product.colors.length > 0 && typeof (product.colors as any)[0] === 'object') {
        return (product.colors as ProductColorOption[]).map((c) => c.name);
      }
      return product.colors as string[];
    }
    return ['أسود', 'أبيض', 'أخضر داكن'];
  }, [product.colors]);

  const mediaConfig = useMemo(
    () => buildProductMediaConfig(product, PRODUCT_IMAGE_FALLBACK_SRC),
    [product]
  );

  // إعادة تعيين الحالة عند فتح النافذة
  useEffect(() => {
    if (isOpen) {
      setSelectedSize(initialSelectedSize || availableSizes[0] || '');
      setSelectedColor(initialSelectedColor || availableColors[0] || '');
      setQuantity(initialQuantity || 1);
      setIsAdded(false);
      setShowSuccessModal(false);
    }
  }, [isOpen, availableSizes, availableColors, initialSelectedSize, initialSelectedColor, initialQuantity]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('يرجى اختيار المقاس واللون');
      return;
    }

    if (onAddToCart) {
      onAddToCart(product, selectedSize, selectedColor, quantity);
    }
    setIsAdded(true);
    setShowSuccessModal(true);
    onClose(); // إغلاق بوب أب الإضافة لإظهار بوب أب النجاح
  };

  const renderStarRating = (rating: number) => {
    const stars: React.ReactElement[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`h-3 w-3 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
        />
      );
    }
    return <div className="flex items-center gap-1">{stars}</div>;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">


        {/* الهيدر */}
        <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-cyan-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <ShoppingCart className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-lg">إضافة للسلة</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="w-8 h-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* معلومات المنتج */}
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <picture>
                    {mediaConfig.pictureSources.map((src) => {
                      const type = getImageMimeType(src);
                      return <source key={src} srcSet={src} {...(type ? { type } : {})} />;
                    })}
                    <img
                      src={mediaConfig.primary}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      data-image-sources={JSON.stringify(mediaConfig.datasetSources)}
                      data-image-index="0"
                      data-fallback-src={PRODUCT_IMAGE_FALLBACK_SRC}
                      onError={advanceImageOnError}
                    />
                  </picture>
                </div>
                
                <div className="flex-1 space-y-2">
                  <h4 className="font-semibold text-slate-800 leading-tight">{product.name}</h4>
                  
                  <div className="flex items-center gap-2">
                    {renderStarRating(product.rating)}
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">{product.price} د.ل</span>
                    {product.originalPrice && (
                      <>
                        <span className="text-sm text-gray-500 line-through">{product.originalPrice} د.ل</span>
                        {product.discount && (
                          <Badge variant="destructive" className="text-xs">
                            -{product.discount}%
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* اختيار المقاس */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">المقاس:</label>
            <div className="flex gap-2 flex-wrap">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    selectedSize === size
                      ? 'border-primary bg-primary text-white shadow-md'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-primary hover:bg-primary/10'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* اختيار اللون */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">اللون:</label>
            <div className="flex gap-2 flex-wrap">
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    selectedColor === color
                      ? 'border-primary bg-primary text-white shadow-md'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-primary hover:bg-primary/10'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* اختيار الكمية */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">الكمية:</label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 p-0"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="text-sm text-gray-600">
                الإجمالي: <span className="font-bold text-primary">{(product.price * quantity).toFixed(2)} د.ل</span>
              </div>
            </div>
          </div>

          {/* قسم التخفيضات والكوبونات */}
          {product.discount && (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    وفر {((product.originalPrice || 0) - product.price).toFixed(2)} د.ل مع هذا العرض!
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* أزرار الإجراءات */}
        <div className="p-4 border-t bg-gray-50 space-y-3">
          {!isAdded ? (
            <Button
              onClick={handleAddToCart}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 font-medium"
              size="lg"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              أضف للسلة
            </Button>
          ) : (
            <div className="space-y-2">
              <Button
                onClick={onViewCart}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 font-medium"
                size="lg"
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
                className="w-full py-2"
                size="lg"
              >
                استمرار التسوق
              </Button>
            </div>
          )}

          {/* أزرار إضافية */}
          <div className="flex justify-center gap-4 pt-2">
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs text-gray-500">
              <Heart className="h-3 w-3" />
              إضافة للمفضلة
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs text-gray-500">
              <Share2 className="h-3 w-3" />
              مشاركة
            </Button>
          </div>
        </div>
      </div>
      
      {/* بوب أب نجاح الإضافة */}
      <AddToCartSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        productName={product.name}
        quantity={quantity}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        onViewCart={() => {
          setShowSuccessModal(false);
          onViewCart();
        }}
        onContinueShopping={() => {
          setShowSuccessModal(false);
          onContinueShopping();
        }}
      />
    </div>
  );
};

export default AddToCartPopup;
