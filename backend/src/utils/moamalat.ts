import crypto from 'crypto';
import config from '@config/environment';
import logger from './logger';

interface MoamalatHashRequest {
  Amount: string;
  DateTimeLocalTrxn: string;
  MerchantId: string;
  MerchantReference: string;
  TerminalId: string;
}

interface MoamalatHashResponse {
  secureHash: string;
}

export const generateMoamalatHash = (
  request: MoamalatHashRequest
): MoamalatHashResponse => {
  try {
    const { Amount, DateTimeLocalTrxn, MerchantId, MerchantReference, TerminalId } =
      request;

    const secretHex = config.moamalat.secret;
    const secretBuffer = Buffer.from(secretHex, 'hex');

    const message = `Amount=${Amount}&DateTimeLocalTrxn=${DateTimeLocalTrxn}&MerchantId=${MerchantId}&MerchantReference=${MerchantReference}&TerminalId=${TerminalId}`;

    const hmac = crypto.createHmac('sha256', secretBuffer);
    hmac.update(message);
    const secureHash = hmac.digest('hex').toUpperCase();

    logger.info(`Moamalat hash generated for reference: ${MerchantReference}`);

    return { secureHash };
  } catch (error) {
    logger.error('Failed to generate Moamalat hash:', error);
    throw new Error('Payment hash generation failed');
  }
};

export const validateMoamalatHashRequest = (request: any): boolean => {
  const requiredFields = ['Amount', 'DateTimeLocalTrxn', 'MerchantId', 'MerchantReference', 'TerminalId'];

  for (const field of requiredFields) {
    if (!request[field] || typeof request[field] !== 'string') {
      logger.warn(`Invalid Moamalat hash request: missing or invalid field ${field}`);
      return false;
    }
  }

  if (!/^\d+$/.test(request.Amount)) {
    logger.warn('Invalid Moamalat Amount: must be numeric');
    return false;
  }

  if (!/^\d{12}$/.test(request.DateTimeLocalTrxn)) {
    logger.warn('Invalid DateTimeLocalTrxn: must be 12 digits (yyyyMMddHHmm)');
    return false;
  }

  return true;
};

export const formatAmountForMoamalat = (amount: number): string => {
  const cents = Math.round(amount * 100);
  return cents.toString();
};

export const formatDateTimeForMoamalat = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}`;
};

export const generateMerchantReference = (orderId: string): string => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${orderId}-${timestamp}-${random}`.substring(0, 50);
};
