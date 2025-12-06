import logger from '@utils/logger';

interface MemorySnapshot {
  timestamp: Date;
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
  heapUsedPercent: number;
}

interface MemoryAlert {
  level: 'warning' | 'critical';
  message: string;
  timestamp: Date;
  snapshot: MemorySnapshot;
}

class MemoryMonitoringService {
  private snapshots: MemorySnapshot[] = [];
  private maxSnapshots: number = 100;
  private alerts: MemoryAlert[] = [];
  private monitoringInterval: NodeJS.Timeout | null = null;
  private leakDetectionThreshold: number = 0.85; // 85% of heap
  private activeConnections: Map<string, { created: Date; operation: string }> = new Map();

  takeSnapshot(): MemorySnapshot {
    const memUsage = process.memoryUsage();
    const heapUsedPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;

    const snapshot: MemorySnapshot = {
      timestamp: new Date(),
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
      rss: memUsage.rss,
      heapUsedPercent
    };

    this.snapshots.push(snapshot);
    
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.shift();
    }

    this.checkForLeaks(snapshot);

    return snapshot;
  }

  private checkForLeaks(snapshot: MemorySnapshot): void {
    if (snapshot.heapUsedPercent > this.leakDetectionThreshold * 100) {
      const alert: MemoryAlert = {
        level: 'critical',
        message: `⚠️ CRITICAL: Heap usage at ${snapshot.heapUsedPercent.toFixed(2)}%`,
        timestamp: snapshot.timestamp,
        snapshot
      };

      this.alerts.push(alert);
      logger.error(alert.message);

      if (this.snapshots.length >= 5) {
        const recentSnapshots = this.snapshots.slice(-5);
        const isIncreasing = recentSnapshots.every((s, i) => 
          i === 0 || s.heapUsed > recentSnapshots[i - 1].heapUsed
        );

        if (isIncreasing) {
          logger.error('🔥 MEMORY LEAK DETECTED: Heap usage continuously increasing!');
          this.suggestMemoryFix();
        }
      }
    } else if (snapshot.heapUsedPercent > this.leakDetectionThreshold * 70) {
      const alert: MemoryAlert = {
        level: 'warning',
        message: `⚠️ WARNING: Heap usage at ${snapshot.heapUsedPercent.toFixed(2)}%`,
        timestamp: snapshot.timestamp,
        snapshot
      };

      this.alerts.push(alert);
      logger.warn(alert.message);
    }
  }

  startMonitoring(intervalSeconds: number = 30): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    logger.info(`📊 Memory monitoring started every ${intervalSeconds} seconds`);

    this.monitoringInterval = setInterval(() => {
      const snapshot = this.takeSnapshot();
      logger.info(
        `💾 Memory: ${(snapshot.heapUsed / 1024 / 1024).toFixed(2)}MB / ` +
        `${(snapshot.heapTotal / 1024 / 1024).toFixed(2)}MB ` +
        `(${snapshot.heapUsedPercent.toFixed(1)}%) | ` +
        `Active connections: ${this.activeConnections.size}`
      );
    }, intervalSeconds * 1000);
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      logger.info('Memory monitoring stopped');
    }
  }

  trackConnection(id: string, operation: string): void {
    this.activeConnections.set(id, { created: new Date(), operation });
  }

  releaseConnection(id: string): void {
    this.activeConnections.delete(id);
  }

  getActiveConnections(): Array<{ id: string; created: Date; operation: string; age: number }> {
    const now = Date.now();
    return Array.from(this.activeConnections.entries()).map(([id, data]) => ({
      id,
      created: data.created,
      operation: data.operation,
      age: now - data.created.getTime()
    }));
  }

  cleanupStaleConnections(maxAgeMs: number = 60000): void {
    const now = Date.now();
    const staleConnections: string[] = [];

    this.activeConnections.forEach((data, id) => {
      if (now - data.created.getTime() > maxAgeMs) {
        staleConnections.push(id);
      }
    });

    staleConnections.forEach(id => {
      const conn = this.activeConnections.get(id);
      logger.warn(`Cleaning up stale connection: ${id} (${conn?.operation})`);
      this.activeConnections.delete(id);
    });
  }

  private suggestMemoryFix(): void {
    logger.error('Suggested fixes:');
    logger.error('1. Check for circular references in models');
    logger.error('2. Ensure database connections are properly closed');
    logger.error('3. Review event listeners for cleanup');
    logger.error('4. Check for large object accumulation in memory');
    logger.error('5. Consider implementing garbage collection hints');
  }

  forceGarbageCollection(): void {
    if (global.gc) {
      const before = process.memoryUsage();
      global.gc();
      const after = process.memoryUsage();
      
      const freed = (before.heapUsed - after.heapUsed) / 1024 / 1024;
      logger.info(`🧹 Garbage collection completed. Freed ${freed.toFixed(2)}MB`);
    } else {
      logger.warn('Garbage collection not available. Run with --expose-gc flag');
    }
  }

  getMemoryReport(): {
    current: MemorySnapshot;
    trends: { avgHeapUsed: number; maxHeapUsed: number; minHeapUsed: number };
    alerts: MemoryAlert[];
    connections: Array<{ id: string; created: Date; operation: string; age: number }>;
  } {
    const current = this.snapshots[this.snapshots.length - 1] || this.takeSnapshot();
    
    const heapUsedValues = this.snapshots.map(s => s.heapUsed);
    const avgHeapUsed = heapUsedValues.reduce((a, b) => a + b, 0) / heapUsedValues.length;
    const maxHeapUsed = Math.max(...heapUsedValues);
    const minHeapUsed = Math.min(...heapUsedValues);

    return {
      current,
      trends: { avgHeapUsed, maxHeapUsed, minHeapUsed },
      alerts: this.alerts.slice(-10),
      connections: this.getActiveConnections()
    };
  }

  clearAlerts(): void {
    this.alerts = [];
  }

  setLeakDetectionThreshold(percent: number): void {
    if (percent > 0 && percent < 100) {
      this.leakDetectionThreshold = percent / 100;
      logger.info(`Memory leak detection threshold set to ${percent}%`);
    }
  }
}

export default new MemoryMonitoringService();
