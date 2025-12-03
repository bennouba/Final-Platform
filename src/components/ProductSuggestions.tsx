import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Plus, Sparkles } from 'lucide-react';
import { CartSuggestion } from '@/services/SmartCartService';
import {
  PRODUCT_IMAGE_FALLBACK_SRC,
  advanceImageOnError,
  buildProductMediaConfig,
  getImageMimeType
} from '@/lib/utils';

interface ProductSuggestionsProps {
  suggestions: CartSuggestion[];
  onAddToCart: (product: any) => void;
  onViewProduct: (product: any) => void;
}

const ProductSuggestions: React.FC<ProductSuggestionsProps> = ({
  suggestions,
  onAddToCart,
  onViewProduct
}) => {
  const getReasonText = (reason: string): { text: string; color: string } => {
    switch (reason) {
      case 'complementary':
        return { text: 'مكمل لمنتجاتك', color: 'bg-blue-100 text-blue-800' };
      case 'similar':
        return { text: 'منتجات مشابهة', color: 'bg-green-100 text-green-800' };
      case 'popular':
        return { text: 'شائع الآن', color: 'bg-purple-100 text-purple-800' };
      case 'frequently_bought':
        return { text: 'يشتري معاً', color: 'bg-orange-100 text-orange-800' };
      default:
        return { text: 'مقترح لك', color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (suggestions.length === 0) return null;

  return (
    <Card className="mt-6 border-2 border-blue-100">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg text-blue-800">اقتراحات ذكية لك</CardTitle>
        </div>
        <p className="text-sm text-gray-600">
          منتجات قد تعجبك بناءً على محتويات سلتك
        </p>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.map((suggestion, index) => {
            const reasonInfo = getReasonText(suggestion.reason);
            const media = buildProductMediaConfig(suggestion.product, PRODUCT_IMAGE_FALLBACK_SRC);

            return (
              <div
                key={`${suggestion.product.id}-${index}`}
                className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square relative overflow-hidden">
                  <picture>
                    {media.pictureSources.map((src) => {
                      const type = getImageMimeType(src);
                      return <source key={src} srcSet={src} {...(type ? { type } : {})} />;
                    })}
                    <img
                      src={media.primary}
                      alt={suggestion.product.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      data-image-sources={JSON.stringify(media.datasetSources)}
                      data-image-index="0"
                      data-fallback-src={PRODUCT_IMAGE_FALLBACK_SRC}
                      onError={advanceImageOnError}
                    />
                  </picture>

                  <div className="absolute top-2 left-2">
                    <Badge className={`text-xs ${reasonInfo.color}`}>
                      {reasonInfo.text}
                    </Badge>
                  </div>

                  {suggestion.product.discount && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="destructive" className="text-xs">
                        -{suggestion.product.discount}%
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="font-medium text-sm truncate mb-1" title={suggestion.product.name}>
                    {suggestion.product.name}
                  </h3>

                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(suggestion.product.rating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      ({suggestion.product.rating || 0})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-bold text-blue-600">
                        {suggestion.product.price.toLocaleString()} ل.ل
                      </span>
                      {suggestion.product.originalPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          {suggestion.product.originalPrice.toLocaleString()} ل.ل
                        </span>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewProduct(suggestion.product)}
                        className="h-8 px-2 text-xs"
                      >
                        عرض
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onAddToCart(suggestion.product)}
                        className="h-8 px-2 bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <Sparkles className="h-4 w-4" />
            <span>
              هذه الاقتراحات مبنية على تحليل سلوك التسوق الخاص بك واهتماماتك
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSuggestions;
