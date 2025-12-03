export interface ExpiryAlertProduct {
  id: number;
  name: string;
  quantity: number;
  endDate: string;
  daysRemaining: number;
  category: string;
  originalPrice: number;
}

export const calculateDaysRemaining = (endDate: string): number => {
  if (!endDate) return -1;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiry = new Date(endDate);
  expiry.setHours(0, 0, 0, 0);
  
  const timeDiff = expiry.getTime() - today.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
  return daysRemaining;
};

export const isProductExpiringSoon = (endDate: string, daysThreshold: number = 60): boolean => {
  if (!endDate) return false;
  const daysRemaining = calculateDaysRemaining(endDate);
  return daysRemaining > 0 && daysRemaining <= daysThreshold;
};

export const isProductExpired = (endDate: string): boolean => {
  if (!endDate) return false;
  return calculateDaysRemaining(endDate) < 0;
};

export const getExpiryStatus = (endDate: string): 'expired' | 'expiring-soon' | 'valid' | 'unknown' => {
  if (!endDate) return 'unknown';
  
  if (isProductExpired(endDate)) return 'expired';
  if (isProductExpiringSoon(endDate, 60)) return 'expiring-soon';
  return 'valid';
};

export const getExpiryStatusColor = (status: string): string => {
  switch (status) {
    case 'expired':
      return 'bg-red-500 text-white';
    case 'expiring-soon':
      return 'bg-orange-500 text-white';
    case 'valid':
      return 'bg-green-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

export const formatDateDisplay = (dateString: string): string => {
  if (!dateString) return 'غير محدد';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return 'تاريخ غير صحيح';
  }
};
