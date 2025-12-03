import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/database';

interface UnavailableNotificationAttributes {
  id: string;
  storeId?: number;
  storeSlug?: string;
  productId: number;
  productName: string;
  customerName: string;
  phone: string;
  email: string;
  quantity: number;
  notificationTypes: string;
  status: 'pending' | 'notified' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

type UnavailableNotificationCreationAttributes = Optional<UnavailableNotificationAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'>;

class UnavailableNotification
  extends Model<UnavailableNotificationAttributes, UnavailableNotificationCreationAttributes>
  implements UnavailableNotificationAttributes
{
  declare id: string;
  declare storeId?: number;
  declare storeSlug?: string;
  declare productId: number;
  declare productName: string;
  declare customerName: string;
  declare phone: string;
  declare email: string;
  declare quantity: number;
  declare notificationTypes: string;
  declare status: 'pending' | 'notified' | 'cancelled';
  declare createdAt: Date;
  declare updatedAt: Date;
}

UnavailableNotification.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    storeSlug: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productName: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    customerName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    notificationTypes: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'notified', 'cancelled'),
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    tableName: 'unavailable_notifications',
    timestamps: true,
    underscored: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    indexes: [
      { fields: ['storeId'] },
      { fields: ['storeSlug'] },
      { fields: ['productId'] },
      { fields: ['status'] },
    ],
  }
);

export default UnavailableNotification;
