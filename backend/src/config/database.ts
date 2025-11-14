import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from '@utils/logger';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/eishro_db', {
  dialect: 'postgres',
  timezone: '+00:00',
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: false,
  },
});

export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connection established successfully');
    return true;
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    return false;
  }
};

export const syncDatabase = async (force = false): Promise<void> => {
  try {
    await sequelize.sync({ force });
    logger.info('✅ Database synchronized successfully');
  } catch (error) {
    logger.error('❌ Database synchronization failed:', error);
    throw error;
  }
};

export default sequelize;
