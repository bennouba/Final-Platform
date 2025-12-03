import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Crown,
  Gift,
  Heart,
  PartyPopper,
  Sparkles,
  Star,
  Trophy,
  X,
  Zap,
} from 'lucide-react';

interface CouponSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CONFETTI_CONFIGS = Array.from({ length: 30 }, (_, index) => ({
  positionClass: `confetti-position-${(index % 10) + 1}`,
  colorClass: `confetti-color-${(index % 6) + 1}`,
  delayClass: `confetti-delay-${index % 5}`,
  durationClass: `confetti-duration-${index % 3}`,
}));

const CouponSuccessModal: React.FC<CouponSuccessModalProps> = ({
  isOpen,
  onClose
}) => {
  const createConfetti = () =>
    CONFETTI_CONFIGS.map((config, index) => (
      <div
        key={index}
        className={`absolute confetti-piece ${config.positionClass} ${config.colorClass} ${config.delayClass} ${config.durationClass}`}
      />
    ));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl relative">
        
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          aria-label="إغلاق النافذة"
          className="absolute top-4 left-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors z-10"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>

        {/* البوب أب الثاني - رسالة المبروك */}
        <div className="relative overflow-hidden bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
          
          {/* مفرقعات احتفالية */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {createConfetti()}
          </div>

          {/* زينة عيد ميلاد */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-4 left-8">
              <PartyPopper className="h-6 w-6 text-yellow-500 celebration-bounce" />
            </div>
            <div className="absolute top-8 right-12">
              <Crown className="h-8 w-8 text-gold-500 celebration-bounce celebration-delay-1" />
            </div>
            <div className="absolute top-6 right-6">
              <Star className="h-5 w-5 text-yellow-600 celebration-bounce celebration-delay-2" />
            </div>
            <div className="absolute bottom-20 left-6">
              <Sparkles className="h-6 w-6 text-pink-500 celebration-bounce celebration-delay-3" />
            </div>
          </div>

          <div className="relative p-8 text-center">
            {/* رسالة المبروك */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 gift-glow">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                مبروك لقد فزت معنا بكوبون خصم !!
              </h2>
              
              <div className="bg-gradient-to-r from-primary to-green-500 p-6 rounded-2xl text-white mb-6 shadow-xl">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Trophy className="h-8 w-8 text-yellow-300" />
                    <span className="text-2xl font-bold">🎉</span>
                    <Gift className="h-8 w-8 text-yellow-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">
                    فزت معنا كوبون خصم
                  </h3>
                  <p className="text-lg font-semibold mb-4">
                    خصم خرافي بقيمة 50% من إجمالي مشترياتك
                  </p>
                  <p className="text-white/90 text-base leading-relaxed">
                    صالح لمدة 24 ساعة على جميع المنتجات + الشحن والتوصيل مجاني!
                  </p>
                </div>
              </div>
            </div>

            {/* زر المتابعة */}
            <Button
              onClick={onClose}
              size="lg"
              className="w-full bg-gradient-to-r from-green-500 to-primary hover:from-green-600 hover:to-primary/90 text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-2xl transition-colors transition-shadow duration-300 text-lg"
            >
              <Gift className="h-5 w-5 mr-2" />
              متابعة التسوق
              <Sparkles className="h-5 w-5 ml-2" />
            </Button>

            {/* رسالة تشجيعية */}
            <p className="text-sm text-gray-600 mt-4 font-medium">
              🛍️ استمتع بالتسوق والمكافآت مع منصة إشرو 🎁
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponSuccessModal;
