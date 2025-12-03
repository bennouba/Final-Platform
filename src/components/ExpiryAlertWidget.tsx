import React from 'react';
import { AlertTriangle, TrendingDown } from 'lucide-react';
import { ExpiryAlertProduct, calculateDaysRemaining, formatDateDisplay } from '@/utils/expiryUtils';

interface ExpiryAlertWidgetProps {
  products: ExpiryAlertProduct[];
  onViewAll?: () => void;
}

const ExpiryAlertWidget: React.FC<ExpiryAlertWidgetProps> = ({ products, onViewAll }) => {
  if (products.length === 0) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-500 p-2 rounded-lg">
            <TrendingDown className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-green-900">حالة الصلاحية</h3>
        </div>
        <p className="text-green-800">✅ جميع منتجاتك سارية الصلاحية. لا توجد تنبيهات</p>
      </div>
    );
  }

  const criticalProducts = products.filter(p => calculateDaysRemaining(p.endDate) <= 14);
  const warningProducts = products.filter(p => {
    const days = calculateDaysRemaining(p.endDate);
    return days > 14 && days <= 60;
  });

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border-2 border-orange-400 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-red-500 p-2 rounded-lg animate-pulse">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-900">تنبيهات الصلاحية</h3>
            <p className="text-sm text-red-700">{products.length} منتج يحتاج انتباه</p>
          </div>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm"
          >
            عرض التفاصيل
          </button>
        )}
      </div>

      {criticalProducts.length > 0 && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 rounded-lg">
          <h4 className="font-bold text-red-900 mb-3">⚠️ طارئ - يجب التصرف فوراً ({criticalProducts.length}):</h4>
          <div className="space-y-2">
            {criticalProducts.slice(0, 3).map((product) => (
              <div key={product.id} className="bg-white p-3 rounded border-l-4 border-red-600">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{product.name}</span>
                  <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                    {calculateDaysRemaining(product.endDate)} يوم
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">الكمية: {product.quantity} وحدة | ينتهي: {formatDateDisplay(product.endDate)}</p>
              </div>
            ))}
            {criticalProducts.length > 3 && (
              <p className="text-xs text-red-900 font-semibold">+{criticalProducts.length - 3} منتج آخر</p>
            )}
          </div>
        </div>
      )}

      {warningProducts.length > 0 && (
        <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
          <h4 className="font-bold text-yellow-900 mb-3">⏰ تحذير - قريب من الانتهاء ({warningProducts.length}):</h4>
          <div className="space-y-2">
            {warningProducts.slice(0, 2).map((product) => (
              <div key={product.id} className="bg-white p-3 rounded border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{product.name}</span>
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                    {calculateDaysRemaining(product.endDate)} يوم
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">الكمية: {product.quantity} وحدة | ينتهي: {formatDateDisplay(product.endDate)}</p>
              </div>
            ))}
            {warningProducts.length > 2 && (
              <p className="text-xs text-yellow-900 font-semibold">+{warningProducts.length - 2} منتج آخر</p>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-100 rounded text-sm text-blue-900 border border-blue-300">
        💡 <strong>نصيحة:</strong> استخدم عروض خاصة وخصومات لتسريع بيع المخزون قبل انتهاء الصلاحية
      </div>
    </div>
  );
};

export default ExpiryAlertWidget;
