import dotenv from 'dotenv';

dotenv.config({
  path: '.env.test',
});

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-do-not-use-in-production';
process.env.SESSION_SECRET = 'test-session-secret-key';
process.env.ENABLE_2FA = 'false';
process.env.ENABLE_CSRF_PROTECTION = 'true';
process.env.ENABLE_XSS_PROTECTION = 'true';
process.env.ENABLE_SQL_INJECTION_PROTECTION = 'true';
process.env.ENABLE_RATE_LIMITING = 'false';

jest.clearAllMocks();
