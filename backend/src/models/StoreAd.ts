import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/database';

interface StoreAdAttributes {
  id: number;
  storeId: number;
  templateId: string;
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl?: string;
  placement: 'banner' | 'between_products';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type StoreAdCreationAttributes = Optional<StoreAdAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class StoreAd extends Model<StoreAdAttributes, StoreAdCreationAttributes> implements StoreAdAttributes {
  declare id: number;
  declare storeId: number;
  declare templateId: string;
  declare title: string;
  declare description: string;
  declare imageUrl?: string;
  declare linkUrl?: string;
  declare placement: 'banner' | 'between_products';
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

StoreAd.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'stores',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    templateId: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    linkUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    placement: {
      type: DataTypes.ENUM('banner', 'between_products'),
      allowNull: false,
      defaultValue: 'banner',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'StoreAd',
    tableName: 'store_ads',
    timestamps: true,
  }
);

export default StoreAd;
