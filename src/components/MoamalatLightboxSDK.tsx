import React, { useEffect, useCallback } from 'react';

interface MoamalatLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderData: any;
  onPaymentSuccess: (transactionData: any) => void;
  onPaymentError: (error: string) => void;
}

// Official Moamalat Lightbox SDK Configuration
const MOAMALAT_CONFIG = {
  // Test credentials from official docs
  merchantId: '10081014649',
  terminalId: '99179395',
  secureKey: '3a488a89b3f7993476c252f017c488bb',
  production: false, // Set to true for production
  showLogs: true
};

const MoamalatLightboxSDK: React.FC<MoamalatLightboxProps> = ({
  isOpen,
  onClose,
  amount,
  orderData,
  onPaymentSuccess,
  onPaymentError
}) => {

  const initiatePay = useCallback(() => {
    const w = window as any;
    const api = w._moamalatPay || w.MoamalatPay;

    if (api && typeof api.pay === 'function') {
      try {
        const reference = `ESHRO_${Date.now()}_${orderData?.id || Math.random().toString(36).substr(2, 9)}`;
        const amountInDirhams = Math.round(amount * 1000);

        api.pay(amountInDirhams, reference);
      } catch (error) {
        onPaymentError('خطأ في بدء عملية الدفع');
      }
    } else {
      onPaymentError('نظام الدفع غير متاح حالياً');
    }
  }, [amount, orderData, onPaymentError]);

  const loadMoamalatSDK = useCallback(() => {
    // Check if SDK is already loaded
    const w = window as any;
    if (w._moamalatPay || w.MoamalatPay) {
      try {
        if (w.MoamalatPay?.init) {
          w.MoamalatPay.init({
            merchantId: MOAMALAT_CONFIG.merchantId,
            terminalId: MOAMALAT_CONFIG.terminalId,
            secureKey: MOAMALAT_CONFIG.secureKey,
            production: MOAMALAT_CONFIG.production,
            showLogs: MOAMALAT_CONFIG.showLogs
          });
        }
      } catch (e) {
        void e;
      }
      initiatePay();
      return;
    }

    // Create script element for official Moamalat SDK
    const script = document.createElement('script');
    script.src = MOAMALAT_CONFIG.production
      ? 'https://npg.moamalat.net/lightbox/moamalat.lightbox.js'
      : 'https://test.moamalat.net/lightbox/moamalat.lightbox.js';

    script.onload = () => {
      // Initialize Moamalat with official configuration (support both globals)
      const w2 = window as any;
      try {
        if (w2.MoamalatPay?.init) {
          w2.MoamalatPay.init({
            merchantId: MOAMALAT_CONFIG.merchantId,
            terminalId: MOAMALAT_CONFIG.terminalId,
            secureKey: MOAMALAT_CONFIG.secureKey,
            production: MOAMALAT_CONFIG.production,
            showLogs: MOAMALAT_CONFIG.showLogs
          });
        }
      } catch (e) {
        void e;
      }

      if (w2._moamalatPay || w2.MoamalatPay) {
        initiatePay();
      } else {

        onPaymentError('نظام الدفع غير متاح حالياً');
      }
    };

    script.onerror = () => {

      onPaymentError('فشل في تحميل نظام الدفع. يرجى المحاولة لاحقاً.');
    };

    document.head.appendChild(script);
  }, [initiatePay, onPaymentError]);

  useEffect(() => {
    if (isOpen) {
      // Load official Moamalat Lightbox SDK
      loadMoamalatSDK();
    }
  }, [isOpen, loadMoamalatSDK]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Official Moamalat Events as per documentation
      const handleCompleted = (e: any) => {


        const transactionData = {
          transactionId: e.detail.SystemReference || 'MOAMALAT_' + Date.now(),
          amount: e.detail.Amount || amount,
          status: 'completed',
          timestamp: new Date().toISOString(),
          gateway: 'moamalat',
          systemReference: e.detail.SystemReference,
          networkReference: e.detail.NetworkReference,
          merchantReference: e.detail.MerchantReference,
          cardNumber: e.detail.PayerAccount,
          payerName: e.detail.PayerName,
          currency: e.detail.Currency || '434', // Libyan Dinar
          paidThrough: e.detail.PaidThrough,
          secureHash: e.detail.SecureHash,
          cardToken: e.detail.CardToken,
          actionCode: '00', // Success
          message: 'Approved'
        };

        onPaymentSuccess(transactionData);
        onClose();
      };

      const handleError = (e: any) => {

        const errorMessage = e.detail?.error || 'حدث خطأ في عملية الدفع';
        onPaymentError(errorMessage);
      };

      const handleCancel = () => {

        onClose();
      };

      // Add official event listeners
      window.addEventListener('moamalatCompleted', handleCompleted);
      window.addEventListener('moamalatError', handleError);
      window.addEventListener('moamalatCancel', handleCancel);

      return () => {
        window.removeEventListener('moamalatCompleted', handleCompleted);
        window.removeEventListener('moamalatError', handleError);
        window.removeEventListener('moamalatCancel', handleCancel);
      };
    }
  }, [amount, onPaymentSuccess, onPaymentError, onClose]);

  // This component doesn't render any UI - the official SDK handles the lightbox
  return null;
};

export default MoamalatLightboxSDK;
