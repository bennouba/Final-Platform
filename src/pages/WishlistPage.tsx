import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SharedWishlists from '@/components/SharedWishlists';

interface WishlistPageProps {
  onBack: () => void;
  onAddToCart: (product: any) => void;
  onViewProduct: (product: any) => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({
  onBack,
  onAddToCart,
  onViewProduct
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* رأس الصفحة */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                العودة
              </Button>
              <h1 className="text-xl font-bold text-gray-900">قوائم المفضلة</h1>
            </div>
          </div>
        </div>
      </div>

      {/* محتوى الصفحة */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SharedWishlists
          onAddToCart={onAddToCart}
        />
      </div>
    </div>
  );
};

export default WishlistPage;
