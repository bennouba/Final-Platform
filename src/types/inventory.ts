// أنواع البيانات المتعلقة بالمخزون

export interface ProductInventory {
  productId: string;
  productName: string;
  sku: string;
  currentQuantity: number;
  minQuantity: number;
  maxQuantity: number;
  category: string;
  manufacturingDate?: string;
  expiryDate?: string;
  price: number;
  warehouse: string;
  alertLevel?: AlertLevel;
  lastUpdated?: string;
}

export type AlertLevel = 'available' | 'warning' | 'critical' | 'expiring_soon' | 'expired';

export interface AlertConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
  description: string;
  priority: number;
}

export interface InventoryStats {
  total: number;
  available: number;
  warning: number;
  critical: number;
  expiringSoon: number;
  expired: number;
  totalValue: number;
  lowStockValue: number;
  averageStockDays: number;
  turnoverRate: number;
}

export interface InventoryChange {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: 'in' | 'out';
  quantity: number;
  quantityBefore: number;
  quantityAfter: number;
  reason: 'sale' | 'return' | 'adjustment' | 'damage' | 'restock' | 'transfer' | 'expiry';
  warehouse: string;
  date: string;
  time: string;
  notes?: string;
  user?: string;
  reference?: string;
}

export interface StockNotification {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  requestedQuantity: number;
  notificationTypes: ('email' | 'sms' | 'whatsapp')[];
  status: 'active' | 'notified' | 'cancelled';
  dateRequested: string;
  notifiedAt?: string;
  storeSlug?: string;
  storeName?: string;
}

export interface InventorySettings {
  alertThreshold: number; // الحد الأدنى للتنبيه
  autoRestock: boolean;
  notificationDelay: number; // بالدقائق
  discountOffer: boolean;
  discountCode?: string;
  discountValue?: number;
  enableExpiryTracking: boolean;
  lowStockPercentage: number; // نسبة المخزون المنخفض
  notificationMethods: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    push: boolean;
  };
}

export interface Warehouse {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  area: string;
  isActive: boolean;
  priority: number;
  productsCount: number;
  totalValue: number;
  monthlyOrders: number;
  status: 'active' | 'inactive' | 'maintenance';
  manager?: string;
  establishedDate?: string;
  lastActivity: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface InventoryAlert {
  id: string;
  productId: string;
  productName: string;
  alertType: AlertLevel;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  currentQuantity: number;
  threshold: number;
  warehouse: string;
  dateCreated: string;
  isRead: boolean;
  isResolved: boolean;
  actionTaken?: string;
}

export interface InventoryReport {
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  expiringItems: number;
  changes: InventoryChange[];
  alerts: InventoryAlert[];
  recommendations: string[];
}
