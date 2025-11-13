import app from './app';
import sequelize, { testConnection, syncDatabase } from '@config/database';
import { initializeModels } from '@models/index';
import config from '@config/environment';
import logger from '@utils/logger';

const PORT = config.port;

const startServer = async (): Promise<void> => {
  try {
    logger.info('🚀 Starting EISHRO Backend Server...');
    logger.info(`📡 Environment: ${config.environment}`);
    logger.info(`🔌 Port: ${PORT}`);

    logger.info('🔄 Initializing database models...');
    initializeModels();

    logger.info('🔗 Testing database connection...');
    const connected = await testConnection();

    if (!connected) {
      throw new Error('Database connection failed');
    }

    logger.info('📊 Synchronizing database schema...');
    await syncDatabase(false);

    const server = app.listen(PORT, (): void => {
      logger.info(`✅ Server is running on http://localhost:${PORT}`);
      logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
      logger.info(`📚 API prefix: ${config.apiPrefix}`);
    });

    process.on('unhandledRejection', (reason: any, promise: Promise<any>): void => {
      logger.error('🔥 Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (error: Error): void => {
      logger.error('🔥 Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('SIGTERM', async (): Promise<void> => {
      logger.info('SIGTERM received, shutting down gracefully...');
      server.close(async (): Promise<void> => {
        await sequelize.close();
        logger.info('✅ Server shut down successfully');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
