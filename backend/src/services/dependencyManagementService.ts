import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import logger from '@utils/logger';

interface DependencyInfo {
  name: string;
  currentVersion: string;
  latestVersion: string;
  type: 'dependencies' | 'devDependencies';
  updateAvailable: boolean;
}

interface UpdateReport {
  timestamp: Date;
  packagesUpdated: string[];
  packagesSkipped: string[];
  criticalSecurityUpdates: string[];
  breakingChanges: Map<string, string>;
  errors: string[];
}

class DependencyManagementService {
  private projectRoot: string;
  private lockFilePath: string;
  private backupDir: string;

  constructor() {
    this.projectRoot = process.cwd().endsWith('backend') 
      ? path.join(process.cwd(), '..') 
      : process.cwd();
    
    this.lockFilePath = path.join(this.projectRoot, 'package-lock.json');
    this.backupDir = path.join(this.projectRoot, '.dependency-backups');
    
    this.ensureBackupDir();
  }

  private ensureBackupDir(): void {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async checkForOutdatedPackages(): Promise<DependencyInfo[]> {
    try {
      logger.info('🔍 Checking for outdated packages...');
      
      const output = execSync('npm outdated --json', { 
        cwd: this.projectRoot,
        encoding: 'utf-8'
      }).catch(() => '{}');

      const outdated = JSON.parse(output);
      const packages: DependencyInfo[] = [];

      for (const [name, info] of Object.entries(outdated)) {
        packages.push({
          name,
          currentVersion: (info as any).current,
          latestVersion: (info as any).latest,
          type: (info as any).type || 'dependencies',
          updateAvailable: true
        });
      }

      return packages;
    } catch (error) {
      logger.error('Error checking for outdated packages:', error);
      return [];
    }
  }

  async checkForSecurityVulnerabilities(): Promise<{ vulnerabilities: any[]; severity: 'critical' | 'high' | 'moderate' | 'low' }> {
    try {
      logger.info('🔒 Checking for security vulnerabilities...');
      
      const output = execSync('npm audit --json', { 
        cwd: this.projectRoot,
        encoding: 'utf-8'
      }).catch(() => '{"metadata": {"vulnerabilities": {}}}');

      const audit = JSON.parse(output);
      const vulnerabilities = audit.vulnerabilities || {};

      let maxSeverity = 'low' as const;
      const severityLevels = { critical: 4, high: 3, moderate: 2, low: 1 };

      for (const [, vuln] of Object.entries(vulnerabilities)) {
        const severity = (vuln as any).severity;
        if (severityLevels[severity] > severityLevels[maxSeverity]) {
          maxSeverity = severity;
        }
      }

      return {
        vulnerabilities: Object.entries(vulnerabilities),
        severity: maxSeverity
      };
    } catch (error) {
      logger.error('Error checking for vulnerabilities:', error);
      return { vulnerabilities: [], severity: 'low' };
    }
  }

  async backupLockFile(): Promise<boolean> {
    try {
      if (!fs.existsSync(this.lockFilePath)) {
        logger.warn('package-lock.json not found');
        return false;
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(this.backupDir, `package-lock-${timestamp}.json`);

      fs.copyFileSync(this.lockFilePath, backupPath);
      logger.info(`✅ Backed up lock file to ${backupPath}`);
      return true;
    } catch (error) {
      logger.error('Error backing up lock file:', error);
      return false;
    }
  }

  async restoreLockFile(backupPath: string): Promise<boolean> {
    try {
      if (!fs.existsSync(backupPath)) {
        logger.error(`Backup file not found: ${backupPath}`);
        return false;
      }

      fs.copyFileSync(backupPath, this.lockFilePath);
      logger.info(`✅ Restored lock file from ${backupPath}`);
      return true;
    } catch (error) {
      logger.error('Error restoring lock file:', error);
      return false;
    }
  }

  async updateSinglePackage(
    packageName: string,
    version?: string,
    isDev: boolean = false
  ): Promise<{ success: boolean; message: string }> {
    try {
      logger.info(`📦 Updating ${packageName}...`);
      
      const backupSuccess = await this.backupLockFile();
      if (!backupSuccess) {
        return { success: false, message: 'Failed to backup lock file' };
      }

      const versionSpec = version ? `@${version}` : '';
      const saveFlag = isDev ? '--save-dev' : '--save';

      execSync(`npm install ${packageName}${versionSpec} ${saveFlag}`, {
        cwd: this.projectRoot,
        stdio: 'inherit'
      });

      logger.info(`✅ Successfully updated ${packageName}`);
      return { success: true, message: `Updated ${packageName}` };
    } catch (error) {
      logger.error(`Error updating ${packageName}:`, error);
      
      const latestBackup = this.getLatestBackup();
      if (latestBackup) {
        await this.restoreLockFile(latestBackup);
        return { success: false, message: `Update failed and lock file restored from backup` };
      }

      return { success: false, message: 'Update failed' };
    }
  }

  async updateNonBreakingPackages(): Promise<UpdateReport> {
    const report: UpdateReport = {
      timestamp: new Date(),
      packagesUpdated: [],
      packagesSkipped: [],
      criticalSecurityUpdates: [],
      breakingChanges: new Map(),
      errors: []
    };

    try {
      const backupSuccess = await this.backupLockFile();
      if (!backupSuccess) {
        report.errors.push('Failed to backup lock file');
        return report;
      }

      const outdated = await this.checkForOutdatedPackages();
      
      for (const pkg of outdated) {
        try {
          const isMajorUpdate = this.isMajorVersionUpdate(pkg.currentVersion, pkg.latestVersion);

          if (isMajorUpdate) {
            report.packagesSkipped.push(`${pkg.name} (major version update)`);
            report.breakingChanges.set(pkg.name, `${pkg.currentVersion} → ${pkg.latestVersion}`);
          } else {
            await this.updateSinglePackage(pkg.name, pkg.latestVersion, pkg.type === 'devDependencies');
            report.packagesUpdated.push(`${pkg.name}@${pkg.latestVersion}`);
          }
        } catch (error) {
          report.errors.push(`${pkg.name}: ${(error as Error).message}`);
        }
      }

      const security = await this.checkForSecurityVulnerabilities();
      if (security.severity === 'critical' || security.severity === 'high') {
        report.criticalSecurityUpdates = security.vulnerabilities.map(v => v[0]);
      }

    } catch (error) {
      report.errors.push((error as Error).message);
    }

    return report;
  }

  async installWithCI(): Promise<boolean> {
    try {
      logger.info('📥 Installing dependencies with npm ci...');
      
      execSync('npm ci', {
        cwd: this.projectRoot,
        stdio: 'inherit'
      });

      logger.info('✅ Dependencies installed successfully');
      return true;
    } catch (error) {
      logger.error('Error installing dependencies:', error);
      return false;
    }
  }

  private isMajorVersionUpdate(current: string, latest: string): boolean {
    try {
      const currentMajor = parseInt(current.split('.')[0], 10);
      const latestMajor = parseInt(latest.split('.')[0], 10);
      return latestMajor > currentMajor;
    } catch {
      return false;
    }
  }

  private getLatestBackup(): string | null {
    try {
      if (!fs.existsSync(this.backupDir)) {
        return null;
      }

      const files = fs.readdirSync(this.backupDir)
        .filter(f => f.startsWith('package-lock-'))
        .sort()
        .reverse();

      return files.length > 0 ? path.join(this.backupDir, files[0]) : null;
    } catch (error) {
      logger.error('Error getting latest backup:', error);
      return null;
    }
  }

  listBackups(): string[] {
    try {
      if (!fs.existsSync(this.backupDir)) {
        return [];
      }

      return fs.readdirSync(this.backupDir)
        .filter(f => f.startsWith('package-lock-'))
        .sort()
        .reverse();
    } catch (error) {
      logger.error('Error listing backups:', error);
      return [];
    }
  }

  async auditFix(): Promise<{ fixed: number; errors: string[] }> {
    try {
      logger.info('🔧 Running npm audit fix...');
      
      await this.backupLockFile();

      execSync('npm audit fix', {
        cwd: this.projectRoot,
        stdio: 'inherit'
      });

      logger.info('✅ Audit fixes applied');
      return { fixed: 1, errors: [] };
    } catch (error) {
      logger.error('Error running audit fix:', error);
      return { fixed: 0, errors: [(error as Error).message] };
    }
  }

  generateHealthReport(): {
    outdatedCount: number;
    vulnerabilityLevel: string;
    backupCount: number;
    recommendation: string;
  } {
    const outdated = execSync('npm outdated --json', { 
      cwd: this.projectRoot,
      encoding: 'utf-8'
    }).catch(() => '{}');

    const outdatedCount = Object.keys(JSON.parse(outdated)).length;
    const backups = this.listBackups();

    let recommendation = 'System is healthy. Regular updates recommended.';
    if (outdatedCount > 10) {
      recommendation = 'Multiple outdated packages. Consider scheduling an update.';
    }

    return {
      outdatedCount,
      vulnerabilityLevel: 'low',
      backupCount: backups.length,
      recommendation
    };
  }
}

export default new DependencyManagementService();
