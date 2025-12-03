import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import logger from '@utils/logger';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(process.cwd(), 'database.sqlite'),
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
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
