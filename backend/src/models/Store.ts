import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/database';

interface StoreAttributes {
  id: number;
  merchantId: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
  logo?: string;
  banner?: string;
  isActive: boolean;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface StoreCreationAttributes extends Optional<StoreAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Store extends Model<StoreAttributes, StoreCreationAttributes> implements StoreAttributes {
  declare id: number;
  declare merchantId: string;
  declare name: string;
  declare slug: string;
  declare category: string;
  declare description?: string;
  declare logo?: string;
  declare banner?: string;
  declare isActive: boolean;
  declare rating?: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Store.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    merchantId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      index: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
      index: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    logo: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    banner: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
      validate: {
        min: 0,
        max: 5,
      },
    },
  },
  {
    sequelize,
    tableName: 'stores',
    timestamps: true,
    underscored: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  }
);

export default Store;
