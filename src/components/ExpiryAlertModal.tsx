import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { ExpiryAlertProduct, calculateDaysRemaining, formatDateDisplay } from '@/utils/expiryUtils';

interface ExpiryAlertModalProps {
  isOpen: boolean;
  products: ExpiryAlertProduct[];
  onClose: () => void;
}

const ExpiryAlertModal: React.FC<ExpiryAlertModalProps> = ({ isOpen, products, onClose }) => {
  if (!isOpen || products.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">تنبيه الصلاحية</h2>
              <p className="text-sm text-orange-100">منتجات قريبة من انتهاء الصلاحية</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
            aria-label="إغلاق التنبيه"
            title="إغلاق التنبيه"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-700 font-semibold">
            لديك {products.length} منتج قريب من انتهاء الصلاحية. يرجى اتخاذ الإجراءات اللازمة:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => {
              const daysRemaining = calculateDaysRemaining(product.endDate);
              const isExpired = daysRemaining < 0;
              const isUrgent = daysRemaining <= 30;

              return (
                <div
                  key={product.id}
                  className={`p-4 rounded-lg border-2 ${
                    isExpired
                      ? 'bg-red-50 border-red-500'
                      : isUrgent
                      ? 'bg-orange-50 border-orange-500'
                      : 'bg-yellow-50 border-yellow-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 flex-1">{product.name}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ml-2 ${
                        isExpired
                          ? 'bg-red-500 text-white'
                          : isUrgent
                          ? 'bg-orange-500 text-white'
                          : 'bg-yellow-500 text-white'
                      }`}
                    >
                      {isExpired ? 'منتهية الصلاحية' : `${daysRemaining} يوم`}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">
                      <span className="font-semibold">الكمية المتاحة:</span> {product.quantity} وحدة
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">تاريخ الانتهاء:</span> {formatDateDisplay(product.endDate)}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">السعر الأصلي:</span> {product.originalPrice} د.ل
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">الفئة:</span> {product.category}
                    </p>
                  </div>

                  {!isExpired && (
                    <div className="mt-3 p-3 bg-blue-100 rounded text-sm text-blue-900 border border-blue-300">
                      💡 <strong>الإجراء المقترح:</strong> قم بتقليل السعر أو تطبيق عرض خاص لسحب المخزون قبل انتهاء الصلاحية
                    </div>
                  )}

                  {isExpired && (
                    <div className="mt-3 p-3 bg-red-100 rounded text-sm text-red-900 border border-red-300">
                      ⚠️ <strong>تنبيه طارئ:</strong> هذا المنتج انتهت صلاحيته! يجب سحبه من المتجر فوراً
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mt-6">
            <p className="text-sm text-blue-900">
              📋 <strong>ملاحظة:</strong> لتجنب الخسائر والضرر بسمعتك، تأكد من اتخاذ إجراء سريع مع المنتجات القريبة من انتهاء الصلاحية. يمكنك تطبيق خصومات أو عروض خاصة لتسريع بيع المخزون.
            </p>
          </div>
        </div>

        <div className="bg-gray-100 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            تم، سأتخذ إجراء
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpiryAlertModal;
