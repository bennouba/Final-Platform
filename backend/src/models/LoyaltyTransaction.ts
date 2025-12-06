import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/database';

interface LoyaltyTransactionAttributes {
  id: number;
  userId: number;
  type: 'earned' | 'redeemed' | 'expired' | 'adjusted' | 'refunded';
  pointsAmount: number;
  reason: string;
  description?: string;
  relatedOrderId?: number;
  relatedRedemptionId?: number;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: Date;
  updatedAt: Date;
}

interface LoyaltyTransactionCreationAttributes extends Optional<LoyaltyTransactionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class LoyaltyTransaction extends Model<LoyaltyTransactionAttributes, LoyaltyTransactionCreationAttributes> implements LoyaltyTransactionAttributes {
  public id!: number;
  public userId!: number;
  public type!: 'earned' | 'redeemed' | 'expired' | 'adjusted' | 'refunded';
  public pointsAmount!: number;
  public reason!: string;
  public description?: string;
  public relatedOrderId?: number;
  public relatedRedemptionId?: number;
  public balanceBefore!: number;
  public balanceAfter!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

LoyaltyTransaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
    type: {
      type: DataTypes.ENUM('earned', 'redeemed', 'expired', 'adjusted', 'refunded'),
      allowNull: false,
    },
    pointsAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'points_amount',
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    relatedOrderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'related_order_id',
    },
    relatedRedemptionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'related_redemption_id',
    },
    balanceBefore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'balance_before',
    },
    balanceAfter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'balance_after',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    tableName: 'loyalty_transactions',
    timestamps: false,
    underscored: true,
  }
);

export default LoyaltyTransaction;
