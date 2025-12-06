import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/database';

interface LoyaltyRedemptionAttributes {
  id: number;
  userId: number;
  rewardId: string;
  rewardName: string;
  pointsSpent: number;
  rewardValue: number;
  rewardType: 'fixed' | 'percentage' | 'free_shipping' | 'gift';
  status: 'pending' | 'confirmed' | 'used' | 'expired' | 'cancelled';
  redeemCode?: string;
  redeemedDate?: Date;
  expiryDate?: Date;
  orderId?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface LoyaltyRedemptionCreationAttributes extends Optional<LoyaltyRedemptionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class LoyaltyRedemption extends Model<LoyaltyRedemptionAttributes, LoyaltyRedemptionCreationAttributes> implements LoyaltyRedemptionAttributes {
  public id!: number;
  public userId!: number;
  public rewardId!: string;
  public rewardName!: string;
  public pointsSpent!: number;
  public rewardValue!: number;
  public rewardType!: 'fixed' | 'percentage' | 'free_shipping' | 'gift';
  public status!: 'pending' | 'confirmed' | 'used' | 'expired' | 'cancelled';
  public redeemCode?: string;
  public redeemedDate?: Date;
  public expiryDate?: Date;
  public orderId?: number;
  public notes?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

LoyaltyRedemption.init(
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
    rewardId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'reward_id',
    },
    rewardName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'reward_name',
    },
    pointsSpent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'points_spent',
    },
    rewardValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'reward_value',
    },
    rewardType: {
      type: DataTypes.ENUM('fixed', 'percentage', 'free_shipping', 'gift'),
      allowNull: false,
      field: 'reward_type',
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'used', 'expired', 'cancelled'),
      defaultValue: 'pending',
    },
    redeemCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
      field: 'redeem_code',
    },
    redeemedDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'redeemed_date',
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'expiry_date',
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'order_id',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: 'loyalty_redemptions',
    timestamps: false,
    underscored: true,
  }
);

export default LoyaltyRedemption;
