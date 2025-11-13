import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/database';

interface OrderItemAttributes {
  id: number;
  orderId: string;
  productId: number;
  productName: string;
  productPrice: number;
  productImage?: string;
  size?: string;
  color?: string;
  quantity: number;
  lineTotal: number;
  createdAt?: Date;
}

interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, 'id' | 'createdAt'> {}

class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
  declare id: number;
  declare orderId: string;
  declare productId: number;
  declare productName: string;
  declare productPrice: number;
  declare productImage?: string;
  declare size?: string;
  declare color?: string;
  declare quantity: number;
  declare lineTotal: number;
  declare createdAt: Date;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    productName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    productPrice: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    productImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    size: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    lineTotal: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize,
    tableName: 'order_items',
    timestamps: true,
    underscored: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  }
);

export default OrderItem;
