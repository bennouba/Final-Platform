import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/database';

interface AbandonedCartAttributes {
  id: string;
  storeId: number;
  source: string;
  items: any[];
  customerContact: Record<string, any> | null;
  status: 'open' | 'contacted' | 'recovered' | 'dismissed';
  lastActivityAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

type AbandonedCartCreationAttributes = Optional<AbandonedCartAttributes, 'id' | 'customerContact' | 'status' | 'createdAt' | 'updatedAt'>;

class AbandonedCart extends Model<AbandonedCartAttributes, AbandonedCartCreationAttributes> implements AbandonedCartAttributes {
  declare id: string;
  declare storeId: number;
  declare source: string;
  declare items: any[];
  declare customerContact: Record<string, any> | null;
  declare status: 'open' | 'contacted' | 'recovered' | 'dismissed';
  declare lastActivityAt: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

AbandonedCart.init(
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
    source: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    customerContact: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('open', 'contacted', 'recovered', 'dismissed'),
      allowNull: false,
      defaultValue: 'open',
    },
    lastActivityAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'abandoned_carts',
    timestamps: true,
    underscored: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    indexes: [{ fields: ['storeId'] }, { fields: ['status'] }, { fields: ['lastActivityAt'] }],
  }
);

export default AbandonedCart;
