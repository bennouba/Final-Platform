import { Response, NextFunction } from 'express';
import { AuthRequest, PaymentGateway, PaymentStatus } from '@shared-types/index';
import Order from '@models/Order';
import Payment from '@models/Payment';
import config from '@config/environment';
import {
  generateMoamalatHash as moamalatHashUtil,
  formatAmountForMoamalat,
  formatDateTimeForMoamalat,
  generateMerchantReference,
  validateMoamalatHashRequest,
} from '@utils/moamalat';
import { sendSuccess, sendError, sendBadRequest, sendNotFound, sendUnauthorized } from '@utils/response';
import { generateUUID } from '@utils/helpers';
import logger from '@utils/logger';

export const generateMoamalatHash = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendUnauthorized(res, 'User not authenticated');
      return;
    }

    const { orderId, amount, currency = 'LYD' } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) {
      sendNotFound(res, 'Order not found');
      return;
    }

    if (order.customerId && order.customerId !== req.user.id) {
      sendError(res, 'You do not have permission to access this order', 403, 'FORBIDDEN');
      return;
    }

    if (order.paymentStatus !== PaymentStatus.PENDING) {
      sendError(res, 'Order payment is not in pending status', 400, 'INVALID_PAYMENT_STATUS');
      return;
    }

    const formattedAmount = formatAmountForMoamalat(amount);
    const dateTime = formatDateTimeForMoamalat(new Date());
    const merchantReference = generateMerchantReference(orderId);

    const hashRequest = {
      Amount: formattedAmount,
      DateTimeLocalTrxn: dateTime,
      MerchantId: config.moamalat.mid,
      MerchantReference: merchantReference,
      TerminalId: config.moamalat.tid,
    };

    if (!validateMoamalatHashRequest(hashRequest)) {
      sendBadRequest(res, 'Invalid payment request parameters');
      return;
    }

    const { secureHash } = moamalatHashUtil(hashRequest);

    let payment = await Payment.findOne({ where: { orderId } });

    if (!payment) {
      const paymentId = generateUUID();
      payment = await Payment.create({
        id: paymentId,
        orderId,
        amount,
        currency,
        gateway: PaymentGateway.MOAMALAT,
        status: PaymentStatus.PENDING,
        secureHash,
        merchantReference,
      });
    } else {
      await payment.update({
        amount,
        currency,
        secureHash,
        merchantReference,
        status: PaymentStatus.PENDING,
      });
    }

    logger.info(`Moamalat hash generated for order: ${orderId}, reference: ${merchantReference}`);

    sendSuccess(res, {
      orderId,
      amount,
      currency,
      merchantReference,
      secureHash,
      merchantId: config.moamalat.mid,
      terminalId: config.moamalat.tid,
      dateTime,
    });
  } catch (error) {
    logger.error('Generate Moamalat hash error:', error);
    next(error);
  }
};

export const getPaymentStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendUnauthorized(res, 'User not authenticated');
      return;
    }

    const { orderId } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) {
      sendNotFound(res, 'Order not found');
      return;
    }

    if (order.customerId && order.customerId !== req.user.id) {
      sendError(res, 'You do not have permission to access this order', 403, 'FORBIDDEN');
      return;
    }

    const payment = await Payment.findOne({ where: { orderId } });

    if (!payment) {
      sendNotFound(res, 'Payment not found');
      return;
    }

    sendSuccess(res, {
      orderId,
      paymentStatus: payment.status,
      paymentAmount: payment.amount,
      currency: payment.currency,
      gateway: payment.gateway,
      merchantReference: payment.merchantReference,
      systemReference: payment.systemReference,
      networkReference: payment.networkReference,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      completedAt: payment.completedAt,
    });
  } catch (error) {
    logger.error('Get payment status error:', error);
    next(error);
  }
};

export const handleMoamalatWebhook = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      MerchantReference,
      SystemReference,
      TrnNo,
      ResponseCode,
      ResponseDescription,
      Amount,
      Status,
    } = req.body;

    logger.info(`Moamalat webhook received: ${MerchantReference}`);

    const payment = await Payment.findOne({ where: { merchantReference: MerchantReference } });
    if (!payment) {
      logger.warn(`Payment not found for reference: ${MerchantReference}`);
      sendNotFound(res, 'Payment not found');
      return;
    }

    const paymentStatus =
      Status === '1' || ResponseCode === '0'
        ? PaymentStatus.COMPLETED
        : PaymentStatus.FAILED;

    await payment.update({
      status: paymentStatus,
      systemReference: SystemReference,
      networkReference: TrnNo,
      gatewayResponse: JSON.stringify({
        ResponseCode,
        ResponseDescription,
        Status,
      }),
      ...(paymentStatus === PaymentStatus.COMPLETED && { completedAt: new Date() }),
    });

    const order = await Order.findByPk(payment.orderId);
    if (order) {
      await order.update({
        paymentStatus,
        transactionId: TrnNo,
      });
    }

    logger.info(`Payment updated: ${MerchantReference}, status: ${paymentStatus}`);

    sendSuccess(res, {
      success: true,
      message: 'Webhook processed successfully',
    });
  } catch (error) {
    logger.error('Moamalat webhook error:', error);
    next(error);
  }
};

export const refundPayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendUnauthorized(res, 'User not authenticated');
      return;
    }

    const { paymentId, reason } = req.body;

    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      sendNotFound(res, 'Payment not found');
      return;
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      sendError(res, 'Only completed payments can be refunded', 400, 'INVALID_PAYMENT_STATUS');
      return;
    }

    await payment.update({
      status: PaymentStatus.REFUNDED,
      gatewayResponse: JSON.stringify({
        refundReason: reason,
        refundRequestedAt: new Date(),
      }),
    });

    const order = await Order.findByPk(payment.orderId);
    if (order) {
      await order.update({ paymentStatus: PaymentStatus.REFUNDED });
    }

    logger.info(`Payment refunded: ${paymentId}`);

    sendSuccess(res, {
      paymentId,
      status: PaymentStatus.REFUNDED,
      message: 'Payment refund initiated',
    });
  } catch (error) {
    logger.error('Refund payment error:', error);
    next(error);
  }
};
