import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/database';
import SubscriptionPlan from './SubscriptionPlan';

interface StoreSubscriptionAttributes {
  id: number;
  storeId: number;
  planId: number;
  status: 'active' | 'trial' | 'expired' | 'canceled';
  startsAt: Date;
  expiresAt: Date | null;
  metadata: Record<string, any> | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type StoreSubscriptionCreationAttributes = Optional<
  StoreSubscriptionAttributes,
  'id' | 'expiresAt' | 'metadata' | 'createdAt' | 'updatedAt'
>;

class StoreSubscription extends Model<StoreSubscriptionAttributes, StoreSubscriptionCreationAttributes> implements StoreSubscriptionAttributes {
  declare id: number;
  declare storeId: number;
  declare planId: number;
  declare status: 'active' | 'trial' | 'expired' | 'canceled';
  declare startsAt: Date;
  declare expiresAt: Date | null;
  declare metadata: Record<string, any> | null;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare plan?: SubscriptionPlan;
}

StoreSubscription.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    planId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'trial', 'expired', 'canceled'),
      allowNull: false,
      defaultValue: 'trial',
    },
    startsAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'store_subscriptions',
    timestamps: true,
    underscored: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  }
);

export default StoreSubscription;
