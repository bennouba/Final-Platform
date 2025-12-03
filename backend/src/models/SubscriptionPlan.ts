import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/database';

interface SubscriptionPlanAttributes {
  id: number;
  code: string;
  name: string;
  description?: string;
  features: string[];
  metadata: Record<string, any> | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type SubscriptionPlanCreationAttributes = Optional<
  SubscriptionPlanAttributes,
  'id' | 'description' | 'features' | 'metadata' | 'createdAt' | 'updatedAt'
>;

class SubscriptionPlan extends Model<SubscriptionPlanAttributes, SubscriptionPlanCreationAttributes> implements SubscriptionPlanAttributes {
  declare id: number;
  declare code: string;
  declare name: string;
  declare description?: string;
  declare features: string[];
  declare metadata: Record<string, any> | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

SubscriptionPlan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    features: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'subscription_plans',
    timestamps: true,
    underscored: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  }
);

export default SubscriptionPlan;
