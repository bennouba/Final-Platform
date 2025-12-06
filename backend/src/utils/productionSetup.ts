import logger from '@utils/logger';
import storageManagementService from '@services/storageManagementService';
import memoryMonitoringService from '@services/memoryMonitoringService';
import dependencyManagementService from '@services/dependencyManagementService';

interface ProductionSetupConfig {
  enableStorageManagement: boolean;
  enableMemoryMonitoring: boolean;
  enableSecurityChecks: boolean;
  storageCleanupIntervalHours: number;
  memoryMonitoringIntervalSeconds: number;
}

const defaultConfig: ProductionSetupConfig = {
  enableStorageManagement: true,
  enableMemoryMonitoring: true,
  enableSecurityChecks: true,
  storageCleanupIntervalHours: 12,
  memoryMonitoringIntervalSeconds: 30
};

class ProductionSetup {
  private config: ProductionSetupConfig;
  private cleanupHandlers: Array<() => Promise<void>> = [];

  constructor(config: Partial<ProductionSetupConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  async initialize(): Promise<void> {
    logger.info('🚀 Initializing Production Environment...');

    try {
      if (this.config.enableStorageManagement) {
        await this.setupStorageManagement();
      }

      if (this.config.enableMemoryMonitoring) {
        await this.setupMemoryMonitoring();
      }

      if (this.config.enableSecurityChecks) {
        await this.setupSecurityChecks();
      }

      this.setupGracefulShutdown();

      logger.info('✅ Production environment initialized successfully');
    } catch (error) {
      logger.error('❌ Failed to initialize production environment:', error);
      throw error;
    }
  }

  private async setupStorageManagement(): Promise<void> {
    try {
      logger.info('📁 Setting up Storage Management...');

      await storageManagementService.startPeriodicCleanup(
        this.config.storageCleanupIntervalHours
      );

      const stats = await storageManagementService.getStorageStats();
      const health = await storageManagementService.getStorageHealth();

      logger.info(`   Storage: ${(stats.totalSize / 1024 / 1024 / 1024).toFixed(2)}GB`);
      logger.info(`   Status: ${health.status} (${health.percentage.toFixed(1)}%)`);

      this.cleanupHandlers.push(async () => {
        await storageManagementService.stopPeriodicCleanup();
      });
    } catch (error) {
      logger.error('Error setting up storage management:', error);
      throw error;
    }
  }

  private async setupMemoryMonitoring(): Promise<void> {
    try {
      logger.info('💾 Setting up Memory Monitoring...');

      memoryMonitoringService.startMonitoring(
        this.config.memoryMonitoringIntervalSeconds
      );

      logger.info('   Memory monitoring started');

      this.cleanupHandlers.push(async () => {
        memoryMonitoringService.stopMonitoring();
      });
    } catch (error) {
      logger.error('Error setting up memory monitoring:', error);
      throw error;
    }
  }

  private async setupSecurityChecks(): Promise<void> {
    try {
      logger.info('🔒 Running Security Checks...');

      // فحص الثغرات الأمنية
      const security = await dependencyManagementService.checkForSecurityVulnerabilities();

      if (security.vulnerabilities.length > 0) {
        logger.warn(`   ⚠️ Found vulnerabilities (${security.severity})`);
        if (security.severity === 'critical' || security.severity === 'high') {
          logger.error('   🚨 CRITICAL: High-severity vulnerabilities detected!');
          logger.error('   Please run: npm audit fix');
        }
      } else {
        logger.info('   ✅ No vulnerabilities detected');
      }

      // فحص المكتبات المتقادمة
      const outdated = await dependencyManagementService.checkForOutdatedPackages();
      if (outdated.length > 0) {
        logger.warn(`   ⚠️ ${outdated.length} packages are outdated`);
      }
    } catch (error) {
      logger.warn('Error during security checks:', error);
    }
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      logger.info(`\n${signal} received, shutting down gracefully...`);

      try {
        for (const handler of this.cleanupHandlers) {
          await handler();
        }

        logger.info('✅ All cleanup handlers completed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during cleanup:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }

  getConfig(): ProductionSetupConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<ProductionSetupConfig>): void {
    this.config = { ...this.config, ...config };
  }

  async getHealthReport(): Promise<{
    storage: {
      status: 'healthy' | 'warning' | 'critical';
      usage: string;
    };
    memory: {
      current: string;
      threshold: string;
      status: 'healthy' | 'warning' | 'critical';
    };
    security: {
      vulnerabilities: number;
      severity: string;
    };
  }> {
    try {
      const storageHealth = await storageManagementService.getStorageHealth();
      const storageStats = await storageManagementService.getStorageStats();
      const memoryReport = memoryMonitoringService.getMemoryReport();
      const security = await dependencyManagementService.checkForSecurityVulnerabilities();

      return {
        storage: {
          status: storageHealth.status,
          usage: `${(storageStats.totalSize / 1024 / 1024 / 1024).toFixed(2)}GB`
        },
        memory: {
          current: `${(memoryReport.current.heapUsed / 1024 / 1024).toFixed(2)}MB`,
          threshold: `${(memoryReport.current.heapTotal / 1024 / 1024).toFixed(2)}MB`,
          status: memoryReport.current.heapUsedPercent > 80 ? 'warning' : 'healthy'
        },
        security: {
          vulnerabilities: security.vulnerabilities.length,
          severity: security.severity
        }
      };
    } catch (error) {
      logger.error('Error getting health report:', error);
      throw error;
    }
  }
}

export default ProductionSetup;
