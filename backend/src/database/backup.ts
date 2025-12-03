import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import logger from '@utils/logger';

const execAsync = promisify(exec);

interface BackupOptions {
  host?: string;
  port?: string;
  user?: string;
  password?: string;
  database?: string;
  outputDir?: string;
}

class DatabaseBackup {
  private options: BackupOptions;

  constructor(options: BackupOptions = {}) {
    this.options = {
      host: options.host || process.env.DB_HOST || 'localhost',
      port: options.port || process.env.DB_PORT || '3306',
      user: options.user || process.env.DB_USER || 'root',
      password: options.password || process.env.DB_PASSWORD || '',
      database: options.database || process.env.DB_NAME || 'eishro_db',
      outputDir: options.outputDir || path.join(process.cwd(), 'backups')
    };
  }

  /**
   * Create backup directory if it doesn't exist
   */
  private ensureBackupDir(): void {
    if (!fs.existsSync(this.options.outputDir!)) {
      fs.mkdirSync(this.options.outputDir!, { recursive: true });
      logger.info(`📁 Created backup directory: ${this.options.outputDir}`);
    }
  }

  /**
   * Generate backup filename with timestamp
   */
  private generateBackupFilename(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    return `eishro_backup_${timestamp}.sql`;
  }

  /**
   * Create full database backup
   */
  async createBackup(): Promise<string> {
    try {
      this.ensureBackupDir();

      const filename = this.generateBackupFilename();
      const filepath = path.join(this.options.outputDir!, filename);

      // MySQL dump command
      const dumpCommand = `mysqldump --host=${this.options.host} --port=${this.options.port} --user=${this.options.user} --password=${this.options.password} --databases ${this.options.database} --routines --triggers --single-transaction --quick --lock-tables=false > "${filepath}"`;

      logger.info(`🔄 Starting database backup: ${this.options.database}`);

      await execAsync(dumpCommand);

      // Verify backup file
      const stats = fs.statSync(filepath);
      logger.info(`✅ Database backup completed: ${filename} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

      return filepath;
    } catch (error) {
      logger.error('❌ Database backup failed:', error);
      throw error;
    }
  }

  /**
   * Restore database from backup file
   */
  async restoreBackup(backupFile: string): Promise<void> {
    try {
      if (!fs.existsSync(backupFile)) {
        throw new Error(`Backup file not found: ${backupFile}`);
      }

      logger.info(`🔄 Starting database restore from: ${backupFile}`);

      // MySQL restore command
      const restoreCommand = `mysql --host=${this.options.host} --port=${this.options.port} --user=${this.options.user} --password=${this.options.password} ${this.options.database} < "${backupFile}"`;

      await execAsync(restoreCommand);

      logger.info('✅ Database restore completed successfully');
    } catch (error) {
      logger.error('❌ Database restore failed:', error);
      throw error;
    }
  }

  /**
   * List available backup files
   */
  listBackups(): string[] {
    try {
      if (!fs.existsSync(this.options.outputDir!)) {
        return [];
      }

      return fs.readdirSync(this.options.outputDir!)
        .filter(file => file.startsWith('eishro_backup_') && file.endsWith('.sql'))
        .sort()
        .reverse(); // Most recent first
    } catch (error) {
      logger.error('❌ Error listing backup files:', error);
      return [];
    }
  }

  /**
   * Clean old backup files (keep last N backups)
   */
  async cleanOldBackups(keepCount: number = 10): Promise<void> {
    try {
      const backups = this.listBackups();

      if (backups.length <= keepCount) {
        return;
      }

      const toDelete = backups.slice(keepCount);
      let deletedCount = 0;

      for (const backup of toDelete) {
        const filepath = path.join(this.options.outputDir!, backup);
        fs.unlinkSync(filepath);
        deletedCount++;
      }

      logger.info(`🧹 Cleaned up ${deletedCount} old backup files`);
    } catch (error) {
      logger.error('❌ Error cleaning old backups:', error);
      throw error;
    }
  }

  /**
   * Get backup file info
   */
  getBackupInfo(filename: string): { exists: boolean; size?: number; created?: Date } {
    try {
      const filepath = path.join(this.options.outputDir!, filename);

      if (!fs.existsSync(filepath)) {
        return { exists: false };
      }

      const stats = fs.statSync(filepath);
      return {
        exists: true,
        size: stats.size,
        created: stats.birthtime
      };
    } catch (error) {
      logger.error('❌ Error getting backup info:', error);
      return { exists: false };
    }
  }
}

// Export singleton instance
const backupManager = new DatabaseBackup();

export default backupManager;

// CLI interface
if (require.main === module) {
  const command = process.argv[2];

  switch (command) {
    case 'backup':
      backupManager.createBackup()
        .then((filepath) => {

          process.exit(0);
        })
        .catch((error) => {

          process.exit(1);
        });
      break;

    case 'restore': {
      const backupFile = process.argv[3];
      if (!backupFile) {


        process.exit(1);
      }
      backupManager.restoreBackup(backupFile)
        .then(() => {

          process.exit(0);
        })
        .catch((error) => {

          process.exit(1);
        });
      break;
    }

    case 'list': {
      const backups = backupManager.listBackups();
      if (backups.length === 0) {
        void 0;
      } else {
        backups.forEach((backup, index) => {
          const info = backupManager.getBackupInfo(backup);
          const size = info.size ? `${(info.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown';
          const date = info.created ? info.created.toLocaleString() : 'Unknown';

        });
      }
      break;
    }

    case 'clean': {
      const keepCount = parseInt(process.argv[3]) || 10;
      backupManager.cleanOldBackups(keepCount)
        .then(() => {

          process.exit(0);
        })
        .catch((error) => {

          process.exit(1);
        });
      break;
    }

    default:







      break;
  }
}
