import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, Heart, AlertTriangle } from 'lucide-react';

interface OrdersHeaderProps {
  onBack: () => void;
  activeTab: 'purchases' | 'favorites' | 'unavailable';
  onTabChange: (tab: 'purchases' | 'favorites' | 'unavailable') => void;
  counts: {
    purchases: number;
    favorites: number;
    unavailable: number;
  };
}

const OrdersHeader: React.FC<OrdersHeaderProps> = ({ 
  onBack, 
  activeTab, 
  onTabChange, 
  counts 
}) => {
  return (
    <div className="sticky top-0 z-50 bg-white border-b">
      <div className="container px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 ml-2" />
            العودة للرئيسية
          </Button>
          
          <h1 className="text-2xl font-bold text-primary">طلباتي</h1>
        </div>
        
        {/* التبويبات */}
        <div className="flex space-x-1 space-x-reverse bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onTabChange('purchases')}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md text-sm font-medium transition-colors relative ${
              activeTab === 'purchases'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="h-4 w-4 ml-2" />
            المشتريات
            {counts.purchases > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {counts.purchases}
              </span>
            )}
          </button>
          
          <button
            onClick={() => onTabChange('favorites')}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md text-sm font-medium transition-colors relative ${
              activeTab === 'favorites'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Heart className="h-4 w-4 ml-2" />
            طلبات مفضلة
            {counts.favorites > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {counts.favorites}
              </span>
            )}
          </button>
          
          <button
            onClick={() => onTabChange('unavailable')}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md text-sm font-medium transition-colors relative ${
              activeTab === 'unavailable'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <AlertTriangle className="h-4 w-4 ml-2" />
            طلبات غير متوفرة
            {counts.unavailable > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {counts.unavailable}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersHeader;
