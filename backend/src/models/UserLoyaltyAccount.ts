import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/database';

interface UserLoyaltyAccountAttributes {
  id: number;
  userId: number;
  totalPoints: number;
  availablePoints: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalSpent: number;
  totalOrders: number;
  joinDate: Date;
  lastPointsUpdate: Date;
  isActive: boolean;
  isBlocked: boolean;
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface UserLoyaltyAccountCreationAttributes extends Optional<UserLoyaltyAccountAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class UserLoyaltyAccount extends Model<UserLoyaltyAccountAttributes, UserLoyaltyAccountCreationAttributes> implements UserLoyaltyAccountAttributes {
  public id!: number;
  public userId!: number;
  public totalPoints!: number;
  public availablePoints!: number;
  public tier!: 'bronze' | 'silver' | 'gold' | 'platinum';
  public totalSpent!: number;
  public totalOrders!: number;
  public joinDate!: Date;
  public lastPointsUpdate!: Date;
  public isActive!: boolean;
  public isBlocked!: boolean;
  public expiryDate?: Date;
  public createdAt!: Date;
  public updatedAt!: Date;
}

UserLoyaltyAccount.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: 'user_id',
    },
    totalPoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'total_points',
    },
    availablePoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'available_points',
    },
    tier: {
      type: DataTypes.ENUM('bronze', 'silver', 'gold', 'platinum'),
      defaultValue: 'bronze',
    },
    totalSpent: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      field: 'total_spent',
    },
    totalOrders: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'total_orders',
    },
    joinDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'join_date',
    },
    lastPointsUpdate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'last_points_update',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_blocked',
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'expiry_date',
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
    tableName: 'user_loyalty_accounts',
    timestamps: false,
    underscored: true,
  }
);

export default UserLoyaltyAccount;
