import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/database';
import { OrderStatus, PaymentMethod, PaymentStatus, ShippingType } from '@shared-types/index';

interface OrderAttributes {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  customerCity: string;
  customerArea: string;
  locationLatitude?: number;
  locationLongitude?: number;
  locationAccuracy?: number;
  locationAddress?: string;
  subtotal: number;
  discountAmount: number;
  discountPercentage: number;
  shippingCost: number;
  finalTotal: number;
  couponCode?: string;
  shippingType: ShippingType;
  shippingEstimatedTime?: string;
  paymentMethod: PaymentMethod;
  paymentType?: string;
  transactionId?: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
}

interface OrderCreationAttributes
  extends Optional<OrderAttributes, 'id' | 'createdAt' | 'updatedAt' | 'shippedAt' | 'deliveredAt'> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  declare id: string;
  declare orderNumber: string;
  declare customerId?: string;
  declare customerFirstName: string;
  declare customerLastName: string;
  declare customerPhone: string;
  declare customerEmail: string;
  declare customerAddress: string;
  declare customerCity: string;
  declare customerArea: string;
  declare locationLatitude?: number;
  declare locationLongitude?: number;
  declare locationAccuracy?: number;
  declare locationAddress?: string;
  declare subtotal: number;
  declare discountAmount: number;
  declare discountPercentage: number;
  declare shippingCost: number;
  declare finalTotal: number;
  declare couponCode?: string;
  declare shippingType: ShippingType;
  declare shippingEstimatedTime?: string;
  declare paymentMethod: PaymentMethod;
  declare paymentType?: string;
  declare transactionId?: string;
  declare paymentStatus: PaymentStatus;
  declare orderStatus: OrderStatus;
  declare notes?: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare shippedAt?: Date;
  declare deliveredAt?: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    orderNumber: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    customerFirstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    customerLastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    customerPhone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    customerEmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    customerAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    customerCity: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    customerArea: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    locationLatitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    locationLongitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    locationAccuracy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    locationAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 3),
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    discountPercentage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    shippingCost: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    finalTotal: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    couponCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    shippingType: {
      type: DataTypes.ENUM(...Object.values(ShippingType)),
      defaultValue: ShippingType.NORMAL,
    },
    shippingEstimatedTime: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.ENUM(...Object.values(PaymentMethod)),
      allowNull: false,
    },
    paymentType: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    transactionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    paymentStatus: {
      type: DataTypes.ENUM(...Object.values(PaymentStatus)),
      defaultValue: PaymentStatus.PENDING,
    },
    orderStatus: {
      type: DataTypes.ENUM(...Object.values(OrderStatus)),
      defaultValue: OrderStatus.PENDING,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    shippedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'orders',
    timestamps: true,
    underscored: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  }
);

export default Order;
