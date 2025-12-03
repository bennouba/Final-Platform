import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/database';

interface ManualOrderAttributes {
  id: string;
  storeId: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address?: string;
  city?: string;
  status: 'draft' | 'pending' | 'confirmed' | 'cancelled';
  paymentMethod?: string;
  totalAmount: number;
  currency: string;
  items: any[];
  notes?: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type ManualOrderCreationAttributes = Optional<ManualOrderAttributes, 'id' | 'customerEmail' | 'address' | 'city' | 'paymentMethod' | 'notes' | 'createdAt' | 'updatedAt'>;

class ManualOrder extends Model<ManualOrderAttributes, ManualOrderCreationAttributes> implements ManualOrderAttributes {
  declare id: string;
  declare storeId: number;
  declare orderNumber: string;
  declare customerName: string;
  declare customerPhone: string;
  declare customerEmail?: string;
  declare address?: string;
  declare city?: string;
  declare status: 'draft' | 'pending' | 'confirmed' | 'cancelled';
  declare paymentMethod?: string;
  declare totalAmount: number;
  declare currency: string;
  declare items: any[];
  declare notes?: string;
  declare createdBy: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

ManualOrder.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orderNumber: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    customerName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    customerPhone: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    customerEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('draft', 'pending', 'confirmed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    paymentMethod: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(8),
      allowNull: false,
      defaultValue: 'LYD',
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'manual_orders',
    timestamps: true,
    underscored: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    indexes: [{ fields: ['storeId'] }, { fields: ['orderNumber'] }, { fields: ['status'] }],
  }
);

export default ManualOrder;
