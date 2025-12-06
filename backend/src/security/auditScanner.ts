import fs from 'fs';
import path from 'path';
import logger from '@utils/logger';

export interface SecurityIssue {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  type: string;
  file: string;
  line?: number;
  description: string;
  recommendation: string;
  evidence: string;
}

export interface AuditReport {
  timestamp: string;
  duration: number;
  filesScanned: number;
  issuesFound: number;
  issues: SecurityIssue[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  riskScore: number;
}

class SecurityAuditScanner {
  private patterns = {
    hardcodedSecrets: [
      /(['"])(api[_-]?key|secret|password|token|api[_-]?secret|private[_-]?key)(['"])\s*[:=]\s*(['"][^'"]*['"]|[^\s,;)}\]]*)/gi,
      /process\.env\.\w+.*||/g,
    ],
    dangerousFunctions: [
      /eval\s*\(/g,
      /Function\s*\(/g,
      /execSync|exec\(/g,
      /child_process\.exec/g,
      /require\s*\(\s*['"][^'"]*['"\s]*\+/g,
    ],
    insecureRandomness: [
      /Math\.random\s*\(/g,
      /getRandomValues/g,
    ],
    missingValidation: [
      /req\.body\.\w+(?!\s*\||!=|===|!==|&&|\|\||,\s*\{)/g,
      /req\.query\.\w+(?!\s*\||!=|===|!==|&&|\|\||,\s*\{)/g,
      /req\.params\.\w+(?!\s*\||!=|===|!==|&&|\|\||,\s*\{)/g,
    ],
    sqlInjectionRisk: [
      /\.query\s*\(\s*[`'"].*\$\{|query\s*\(\s*template/g,
      /sequelize\.literal/g,
    ],
    xssRisk: [
      /innerHTML\s*=/g,
      /v-html/g,
      /dangerouslySetInnerHTML/g,
      /\.html\s*\(/g,
    ],
    insecureCrypto: [
      /md5|sha1|DES/g,
      /crypto\.createCipher/g,
    ],
    insecureDependencies: [
      /require\s*\(\s*['"]express[^'"]*(0|1|2|3)[^'"]*['"]\)/g,
    ],
    missingAuthCheck: [
      /router\.(get|post|put|delete|patch)\s*\(\s*[^,]+,\s*(?!.*auth).*\)\s*=>/g,
    ],
    openRedirects: [
      /res\.redirect\s*\(\s*req\.(query|body)\./g,
      /res\.redirect\s*\(\s*req\.params\./g,
    ],
  };

  async scanDirectory(
    dirPath: string,
    fileExtensions: string[] = ['.ts', '.js', '.tsx', '.jsx']
  ): Promise<AuditReport> {
    const startTime = Date.now();
    const issues: SecurityIssue[] = [];
    let filesScanned = 0;

    const scanFile = (filePath: string): void => {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        filesScanned++;

        this.checkHardcodedSecrets(filePath, lines, issues);
        this.checkDangerousFunctions(filePath, lines, issues);
        this.checkInsecureRandomness(filePath, lines, issues);
        this.checkMissingValidation(filePath, lines, issues);
        this.checkSQLInjectionRisk(filePath, lines, issues);
        this.checkXSSRisk(filePath, lines, issues);
        this.checkInsecureCrypto(filePath, lines, issues);
        this.checkMissingAuthCheck(filePath, lines, issues);
        this.checkOpenRedirects(filePath, lines, issues);
        this.checkDependencies(filePath, content, issues);
      } catch (error) {
        logger.error(`Error scanning file ${filePath}:`, error);
      }
    };

    const traverseDirectory = (dir: string): void => {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          if (!this.shouldSkipDirectory(file)) {
            traverseDirectory(filePath);
          }
        } else if (
          stat.isFile() &&
          fileExtensions.some(ext => file.endsWith(ext))
        ) {
          scanFile(filePath);
        }
      }
    };

    traverseDirectory(dirPath);

    const duration = Date.now() - startTime;
    const summary = {
      critical: issues.filter(i => i.severity === 'critical').length,
      high: issues.filter(i => i.severity === 'high').length,
      medium: issues.filter(i => i.severity === 'medium').length,
      low: issues.filter(i => i.severity === 'low').length,
      info: issues.filter(i => i.severity === 'info').length,
    };

    const riskScore = this.calculateRiskScore(summary);

    return {
      timestamp: new Date().toISOString(),
      duration,
      filesScanned,
      issuesFound: issues.length,
      issues: issues.sort((a, b) => {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      }),
      summary,
      riskScore,
    };
  }

  private checkHardcodedSecrets(
    filePath: string,
    lines: string[],
    issues: SecurityIssue[]
  ): void {
    lines.forEach((line, index) => {
      if (line.includes('process.env') && !line.includes('=')) {
        return;
      }

      if (
        /['"]?(api[_-]?key|secret|password|token|private[_-]?key)['"]?\s*[:=]/.test(line)
      ) {
        const value = line.match(/[:=]\s*(['"][^'"]*['"])/)?.[1];
        if (value && !value.includes('process.env')) {
          issues.push({
            severity: 'critical',
            type: 'HARDCODED_SECRETS',
            file: filePath,
            line: index + 1,
            description: 'Hardcoded secret or credential detected',
            recommendation: 'Move all secrets to environment variables (.env file)',
            evidence: line.substring(0, 100),
          });
        }
      }
    });
  }

  private checkDangerousFunctions(
    filePath: string,
    lines: string[],
    issues: SecurityIssue[]
  ): void {
    lines.forEach((line, index) => {
      if (/(eval|Function|execSync|exec|child_process\.exec)\s*\(/.test(line)) {
        issues.push({
          severity: 'critical',
          type: 'DANGEROUS_FUNCTION',
          file: filePath,
          line: index + 1,
          description: 'Use of dangerous function that executes arbitrary code',
          recommendation:
            'Avoid eval, Function, execSync. Use safer alternatives or input validation',
          evidence: line.trim(),
        });
      }
    });
  }

  private checkInsecureRandomness(
    filePath: string,
    lines: string[],
    issues: SecurityIssue[]
  ): void {
    lines.forEach((line, index) => {
      if (/Math\.random\s*\(/.test(line)) {
        issues.push({
          severity: 'high',
          type: 'INSECURE_RANDOMNESS',
          file: filePath,
          line: index + 1,
          description: 'Math.random() is not suitable for security purposes',
          recommendation: 'Use crypto.randomBytes() or crypto.getRandomValues()',
          evidence: line.trim(),
        });
      }
    });
  }

  private checkMissingValidation(
    filePath: string,
    lines: string[],
    issues: SecurityIssue[]
  ): void {
    lines.forEach((line, index) => {
      if (
        /(req\.(body|query|params)\.[\w]+)(?!\s*[?!|&=]|\.validate|\.check|\.sanitize)/.test(
          line
        )
      ) {
        if (
          !line.includes('validate') &&
          !line.includes('sanitize') &&
          !line.includes('check')
        ) {
          issues.push({
            severity: 'high',
            type: 'MISSING_INPUT_VALIDATION',
            file: filePath,
            line: index + 1,
            description: 'User input used without validation or sanitization',
            recommendation: 'Validate and sanitize all user inputs',
            evidence: line.trim(),
          });
        }
      }
    });
  }

  private checkSQLInjectionRisk(
    filePath: string,
    lines: string[],
    issues: SecurityIssue[]
  ): void {
    lines.forEach((line, index) => {
      if (
        /\.query\s*\([`'"].*\$\{|sequelize\.literal|raw\s*\(/.test(line)
      ) {
        issues.push({
          severity: 'critical',
          type: 'SQL_INJECTION_RISK',
          file: filePath,
          line: index + 1,
          description: 'Potential SQL injection vulnerability with string interpolation',
          recommendation:
            'Use parameterized queries, prepared statements, or ORM methods',
          evidence: line.substring(0, 100),
        });
      }
    });
  }

  private checkXSSRisk(
    filePath: string,
    lines: string[],
    issues: SecurityIssue[]
  ): void {
    lines.forEach((line, index) => {
      if (
        /(innerHTML|dangerouslySetInnerHTML|v-html)\s*=/.test(line) &&
        !line.includes('sanitize')
      ) {
        issues.push({
          severity: 'high',
          type: 'XSS_RISK',
          file: filePath,
          line: index + 1,
          description: 'Unsanitized content assignment which could lead to XSS',
          recommendation:
            'Sanitize all user-supplied content before rendering, use textContent instead of innerHTML',
          evidence: line.trim(),
        });
      }
    });
  }

  private checkInsecureCrypto(
    filePath: string,
    lines: string[],
    issues: SecurityIssue[]
  ): void {
    lines.forEach((line, index) => {
      if (/(md5|sha1|DES|createCipher)\b/.test(line)) {
        issues.push({
          severity: 'high',
          type: 'INSECURE_CRYPTO',
          file: filePath,
          line: index + 1,
          description: 'Use of weak or deprecated cryptographic algorithm',
          recommendation:
            'Use SHA-256 or stronger, use createCipheriv instead of createCipher',
          evidence: line.trim(),
        });
      }
    });
  }

  private checkMissingAuthCheck(
    filePath: string,
    lines: string[],
    issues: SecurityIssue[]
  ): void {
    lines.forEach((line, index) => {
      if (
        /router\.(get|post|put|delete|patch)\s*\(.*,\s*(?!.*auth|async.*req.*res)/.test(
          line
        ) &&
        !line.includes('public') &&
        !line.includes('health') &&
        !line.includes('login') &&
        !line.includes('register')
      ) {
        if (!line.includes('middleware') && !line.includes('auth')) {
          issues.push({
            severity: 'medium',
            type: 'MISSING_AUTH_CHECK',
            file: filePath,
            line: index + 1,
            description: 'Endpoint may be missing authentication middleware',
            recommendation:
              'Apply authentication middleware to all protected endpoints',
            evidence: line.trim().substring(0, 80),
          });
        }
      }
    });
  }

  private checkOpenRedirects(
    filePath: string,
    lines: string[],
    issues: SecurityIssue[]
  ): void {
    lines.forEach((line, index) => {
      if (
        /(res\.redirect|location\s*=).*req\.(query|body|params)/.test(line)
      ) {
        issues.push({
          severity: 'high',
          type: 'OPEN_REDIRECT',
          file: filePath,
          line: index + 1,
          description:
            'Open redirect vulnerability - user-controlled URL used in redirect',
          recommendation: 'Validate and whitelist redirect URLs',
          evidence: line.trim(),
        });
      }
    });
  }

  private checkDependencies(
    filePath: string,
    content: string,
    issues: SecurityIssue[]
  ): void {
    if (
      filePath.includes('package.json') ||
      filePath.includes('package-lock.json')
    ) {
      const knownVulnerableDeps = [
        { name: 'express', minVersion: '4.18.0' },
        { name: 'lodash', minVersion: '4.17.0' },
      ];

      knownVulnerableDeps.forEach(dep => {
        const versionMatch = content.match(
          new RegExp(`"${dep.name}"\\s*:\\s*"([^"]+)"`)
        );
        if (versionMatch && versionMatch[1]) {
          issues.push({
            severity: 'info',
            type: 'DEPENDENCY_CHECK',
            file: filePath,
            description: `Ensure ${dep.name} is at least version ${dep.minVersion}`,
            recommendation: `Update ${dep.name} to latest stable version`,
            evidence: `"${dep.name}": "${versionMatch[1]}"`,
          });
        }
      });
    }
  }

  private shouldSkipDirectory(dirname: string): boolean {
    const skipDirs = [
      'node_modules',
      '.git',
      'dist',
      'build',
      'coverage',
      '.next',
    ];
    return skipDirs.includes(dirname);
  }

  private calculateRiskScore(summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  }): number {
    return (
      summary.critical * 10 +
      summary.high * 5 +
      summary.medium * 2 +
      summary.low * 1
    );
  }

  formatReport(report: AuditReport): string {
    let output = '\n=== SECURITY AUDIT REPORT ===\n';
    output += `Generated: ${report.timestamp}\n`;
    output += `Duration: ${report.duration}ms\n`;
    output += `Files Scanned: ${report.filesScanned}\n`;
    output += `Total Issues Found: ${report.issuesFound}\n`;
    output += `Risk Score: ${report.riskScore}\n\n`;

    output += `Summary:\n`;
    output += `  🔴 Critical: ${report.summary.critical}\n`;
    output += `  🟠 High: ${report.summary.high}\n`;
    output += `  🟡 Medium: ${report.summary.medium}\n`;
    output += `  🟢 Low: ${report.summary.low}\n`;
    output += `  ℹ️  Info: ${report.summary.info}\n\n`;

    if (report.issues.length > 0) {
      output += 'Issues:\n';
      report.issues.forEach((issue, index) => {
        const severityIcon = {
          critical: '🔴',
          high: '🟠',
          medium: '🟡',
          low: '🟢',
          info: 'ℹ️',
        };

        output += `\n${index + 1}. ${severityIcon[issue.severity]} ${issue.type}\n`;
        output += `   File: ${issue.file}`;
        if (issue.line) output += `:${issue.line}`;
        output += '\n';
        output += `   Description: ${issue.description}\n`;
        output += `   Recommendation: ${issue.recommendation}\n`;
        output += `   Evidence: ${issue.evidence}\n`;
      });
    }

    return output;
  }
}

export const securityAuditScanner = new SecurityAuditScanner();
export default SecurityAuditScanner;
