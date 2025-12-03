import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/database';

interface CouponAttributes {
  id: number;
  code: string;
  description?: string;
  discountPercentage: number;
  discountAmount?: number;
  minOrderAmount?: number;
  maxOrderAmount?: number;
  maxUses?: number;
  currentUses: number;
  maxUsesPerUser: number;
  isActive: boolean;
  createdAt?: Date;
  expiresAt?: Date;
}

type CouponCreationAttributes = Optional<CouponAttributes, 'id' | 'createdAt' | 'currentUses' | 'isActive' | 'maxUsesPerUser'>;

class Coupon extends Model<CouponAttributes, CouponCreationAttributes> implements CouponAttributes {
  declare id: number;
  declare code: string;
  declare description?: string;
  declare discountPercentage: number;
  declare discountAmount?: number;
  declare minOrderAmount?: number;
  declare maxOrderAmount?: number;
  declare maxUses?: number;
  declare currentUses: number;
  declare maxUsesPerUser: number;
  declare isActive: boolean;
  declare createdAt: Date;
  declare expiresAt?: Date;
}

Coupon.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    discountPercentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    minOrderAmount: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    maxOrderAmount: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    maxUses: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
      },
    },
    currentUses: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    maxUsesPerUser: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'coupons',
    timestamps: true,
    underscored: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  }
);

export default Coupon;
