import type { ProductInventory, InventoryAlert } from '../types/inventory';
import { getInventoryAlertLevel, getAlertConfig, isEmergency } from '../utils/inventoryAlertUtils';

export interface AlertNotification {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'expiry_warning' | 'emergency';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  productId: string;
  productName: string;
  currentQuantity: number;
  threshold: number;
  timestamp: string;
  isRead: boolean;
  warehouse: string;
  actionRequired: boolean;
}

export interface MonitoringConfig {
  enabled: boolean;
  checkInterval: number; // in minutes
  lowStockThreshold: number;
  criticalStockThreshold: number;
  expiryWarningDays: number;
  enablePushNotifications: boolean;
  enableEmailNotifications: boolean;
  enableSmsNotifications: boolean;
  autoRestockSuggestions: boolean;
  notificationRecipients: string[];
}

class InventoryMonitoringService {
  private config: MonitoringConfig;
  private alerts: AlertNotification[] = [];
  private monitoringInterval: NodeJS.Timeout | null = null;
  private listeners: ((alerts: AlertNotification[]) => void)[] = [];

  constructor() {
    this.config = this.loadConfig();
    this.alerts = this.loadAlerts();
  }

  private loadConfig(): MonitoringConfig {
    try {
      const stored = localStorage.getItem('eshro_inventory_monitoring_config');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {

    }

    // Default configuration
    return {
      enabled: true,
      checkInterval: 30, // Check every 30 minutes
      lowStockThreshold: 5,
      criticalStockThreshold: 0,
      expiryWarningDays: 30,
      enablePushNotifications: true,
      enableEmailNotifications: false,
      enableSmsNotifications: false,
      autoRestockSuggestions: true,
      notificationRecipients: []
    };
  }

  private loadAlerts(): AlertNotification[] {
    try {
      const stored = localStorage.getItem('eshro_inventory_alerts_history');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {

    }
    return [];
  }

  private saveConfig(): void {
    try {
      localStorage.setItem('eshro_inventory_monitoring_config', JSON.stringify(this.config));
    } catch (error) {

    }
  }

  private saveAlerts(): void {
    try {
      localStorage.setItem('eshro_inventory_alerts_history', JSON.stringify(this.alerts));
    } catch (error) {

    }
  }

  /**
   * Start monitoring inventory levels
   */
  public startMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    if (!this.config.enabled) {

      return;
    }


    
    // Check immediately
    this.checkInventoryLevels();
    
    // Set up periodic checks
    this.monitoringInterval = setInterval(() => {
      this.checkInventoryLevels();
    }, this.config.checkInterval * 60 * 1000); // Convert minutes to milliseconds

    // Listen for storage changes (real-time updates)
    window.addEventListener('storage', this.handleStorageChange.bind(this));
  }

  /**
   * Stop monitoring inventory levels
   */
  public stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

  }

  /**
   * Check inventory levels and generate alerts
   */
  private async checkInventoryLevels(): Promise<void> {
    try {
      const products = this.getCurrentInventory();
      const newAlerts: AlertNotification[] = [];

      for (const product of products) {
        const alertLevel = getInventoryAlertLevel(product);
        const shouldCheckAlert = this.shouldCreateAlert(product, alertLevel);

        if (shouldCheckAlert) {
          const alert = this.createAlert(product, alertLevel);
          if (alert && !this.isDuplicateAlert(alert)) {
            newAlerts.push(alert);
          }
        }
      }

      if (newAlerts.length > 0) {
        this.alerts = [...this.alerts, ...newAlerts];
        this.saveAlerts();
        this.notifyListeners();
        
        // Send notifications
        await this.sendNotifications(newAlerts);
        

      }

      // Clean up old resolved alerts
      this.cleanupOldAlerts();

    } catch (error) {

    }
  }

  /**
   * Get current inventory from localStorage
   */
  private getCurrentInventory(): ProductInventory[] {
    try {
      const stored = localStorage.getItem('eshro_inventory_alerts');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {

    }
    return [];
  }

  /**
   * Determine if an alert should be created for a product
   */
  private shouldCreateAlert(product: ProductInventory, alertLevel: string): boolean {
    const { currentQuantity, minQuantity } = product;

    // Don't create alerts for products with sufficient stock
    if (alertLevel === 'available') {
      return false;
    }

    // Check if we should create an alert based on thresholds
    if (currentQuantity <= this.config.lowStockThreshold && alertLevel === 'warning') {
      return true;
    }

    if (currentQuantity <= this.config.criticalStockThreshold && alertLevel === 'critical') {
      return true;
    }

    // Check for expiry warnings
    if (alertLevel === 'expiring_soon' || alertLevel === 'expired') {
      return true;
    }

    return false;
  }

  /**
   * Create an alert notification
   */
  private createAlert(product: ProductInventory, alertLevel: string): AlertNotification | null {
    const alertConfig = getAlertConfig(alertLevel as any);
    const now = new Date().toISOString();
    
    let type: AlertNotification['type'];
    let severity: AlertNotification['severity'] = 'medium';
    let title: string;
    let message: string;

    switch (alertLevel) {
      case 'warning':
        type = 'low_stock';
        severity = 'high';
        title = 'تنبيه: مخزون منخفض';
        message = `المنتج "${product.productName}" وصل للحد الأدنى. الكمية الحالية: ${product.currentQuantity}`;
        break;
      
      case 'critical':
        type = 'out_of_stock';
        severity = 'critical';
        title = 'تنبيه عاجل: نفاد المخزون';
        message = `المنتج "${product.productName}" نفد من المخزون! يرجى إعادة التخزين فوراً.`;
        break;
      
      case 'expiring_soon':
        type = 'expiry_warning';
        severity = 'medium';
        title = 'تنبيه: اقتراب انتهاء الصلاحية';
        message = `المنتج "${product.productName}" سينتهي خلال فترة قصيرة.`;
        break;
      
      case 'expired':
        type = 'expiry_warning';
        severity = 'critical';
        title = 'تنبيه عاجل: منتج منتهي الصلاحية';
        message = `المنتج "${product.productName}" منتهي الصلاحية ويجب إزالته فوراً!`;
        break;
      
      default:
        return null;
    }

    return {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      severity,
      productId: product.productId,
      productName: product.productName,
      currentQuantity: product.currentQuantity,
      threshold: product.minQuantity,
      timestamp: now,
      isRead: false,
      warehouse: product.warehouse,
      actionRequired: alertLevel === 'critical' || alertLevel === 'expired'
    };
  }

  /**
   * Check if an alert already exists for this product and condition
   */
  private isDuplicateAlert(newAlert: AlertNotification): boolean {
    return this.alerts.some(alert => 
      alert.productId === newAlert.productId &&
      alert.type === newAlert.type &&
      alert.timestamp === newAlert.timestamp
    );
  }

  /**
   * Send notifications for new alerts
   */
  private async sendNotifications(alerts: AlertNotification[]): Promise<void> {
    for (const alert of alerts) {
      try {
        // Send push notification if enabled
        if (this.config.enablePushNotifications) {
          await this.sendPushNotification(alert);
        }

        // Send email notification if enabled and recipients are configured
        if (this.config.enableEmailNotifications && this.config.notificationRecipients.length > 0) {
          await this.sendEmailNotification(alert);
        }

        // Send SMS notification if enabled and recipients are configured
        if (this.config.enableSmsNotifications && this.config.notificationRecipients.length > 0) {
          await this.sendSmsNotification(alert);
        }

        // Emit browser notification
        this.showBrowserNotification(alert);

      } catch (error) {

      }
    }
  }

  /**
   * Send push notification
   */
  private async sendPushNotification(alert: AlertNotification): Promise<void> {
    // In a real application, this would integrate with a push notification service

    
    // For now, we'll just log it
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(alert.title, {
        body: alert.message,
        icon: '/favicon.ico',
        tag: alert.id
      });
    }
  }

  /**
   * Send email notification
   */
  private async sendEmailNotification(alert: AlertNotification): Promise<void> {
    // In a real application, this would integrate with an email service

  }

  /**
   * Send SMS notification
   */
  private async sendSmsNotification(alert: AlertNotification): Promise<void> {
    // In a real application, this would integrate with an SMS service

  }

  /**
   * Show browser notification
   */
  private showBrowserNotification(alert: AlertNotification): void {
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      } else if (Notification.permission === 'granted') {
        new Notification(alert.title, {
          body: alert.message,
          icon: '/favicon.ico'
        });
      }
    }
  }

  /**
   * Handle storage changes (real-time updates)
   */
  private handleStorageChange(event: StorageEvent): void {
    if (event.key === 'eshro_inventory_alerts') {

      this.checkInventoryLevels();
    }
  }

  /**
   * Clean up old resolved alerts
   */
  private cleanupOldAlerts(): void {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    this.alerts = this.alerts.filter(alert => 
      new Date(alert.timestamp) > thirtyDaysAgo
    );
  }

  /**
   * Get all active alerts
   */
  public getAlerts(): AlertNotification[] {
    return [...this.alerts];
  }

  /**
   * Mark alert as read
   */
  public markAlertAsRead(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.isRead = true;
      this.saveAlerts();
      this.notifyListeners();
    }
  }

  /**
   * Dismiss alert
   */
  public dismissAlert(alertId: string): void {
    this.alerts = this.alerts.filter(alert => alert.id !== alertId);
    this.saveAlerts();
    this.notifyListeners();
  }

  /**
   * Get unread alert count
   */
  public getUnreadCount(): number {
    return this.alerts.filter(alert => !alert.isRead).length;
  }

  /**
   * Get alerts by severity
   */
  public getAlertsBySeverity(severity: AlertNotification['severity']): AlertNotification[] {
    return this.alerts.filter(alert => alert.severity === severity);
  }

  /**
   * Get critical alerts that require immediate action
   */
  public getCriticalAlerts(): AlertNotification[] {
    return this.alerts.filter(alert => 
      alert.severity === 'critical' && !alert.isRead
    );
  }

  /**
   * Update monitoring configuration
   */
  public updateConfig(newConfig: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
    
    // Restart monitoring if enabled
    if (this.config.enabled) {
      this.stopMonitoring();
      this.startMonitoring();
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): MonitoringConfig {
    return { ...this.config };
  }

  /**
   * Add listener for alert updates
   */
  public addListener(listener: (alerts: AlertNotification[]) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Remove listener
   */
  public removeListener(listener: (alerts: AlertNotification[]) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Notify all listeners of alert updates
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.alerts);
      } catch (error) {

      }
    });
  }

  /**
   * Request notification permission
   */
  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      return await Notification.requestPermission();
    }
    return 'denied';
  }

  /**
   * Get monitoring status
   */
  public getStatus(): { 
    isMonitoring: boolean; 
    alertCount: number; 
    unreadCount: number; 
    criticalCount: number;
  } {
    return {
      isMonitoring: this.monitoringInterval !== null,
      alertCount: this.alerts.length,
      unreadCount: this.getUnreadCount(),
      criticalCount: this.getCriticalAlerts().length
    };
  }
}

// Create singleton instance
export const inventoryMonitoringService = new InventoryMonitoringService();

// Auto-start monitoring when the service is imported
if (typeof window !== 'undefined') {
  inventoryMonitoringService.startMonitoring();
}
