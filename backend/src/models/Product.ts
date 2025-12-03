import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/database';

interface ProductAttributes {
  id: number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  discountType?: string;
  discountStart?: Date;
  discountEnd?: Date;
  category: string;
  brand?: string;
  image: string;
  thumbnail?: string;
  images?: string[];
  storeId?: number;
  inStock: boolean;
  quantity: number;
  sku?: string;
  productCode?: string;
  barcode?: string;
  rating?: number;
  reviewCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type ProductCreationAttributes = Optional<
  ProductAttributes,
  'id' | 'createdAt' | 'updatedAt' | 'reviewCount'
>;

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  declare id: number;
  declare name: string;
  declare description?: string;
  declare price: number;
  declare originalPrice?: number;
  declare discountPercent?: number;
  declare discountType?: string;
  declare discountStart?: Date;
  declare discountEnd?: Date;
  declare category: string;
  declare brand?: string;
  declare image: string;
  declare thumbnail?: string;
  declare images?: string[];
  declare storeId?: number;
  declare inStock: boolean;
  declare quantity: number;
  declare sku?: string;
  declare productCode?: string;
  declare barcode?: string;
  declare rating?: number;
  declare reviewCount: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    originalPrice: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    discountPercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100,
      },
    },
    discountType: {
      type: DataTypes.ENUM('season_end', 'eid_al_fitr', 'summer', 'spring', 'new_year', 'store_clearance', 'custom'),
      allowNull: true,
    },
    discountStart: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    discountEnd: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'stores',
        key: 'id',
      },
    },
    inStock: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    productCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    barcode: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
      validate: {
        min: 0,
        max: 5,
      },
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: true,
    underscored: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    indexes: [
      {
        fields: ['category'],
      },
      {
        fields: ['storeId'],
      },
      {
        fields: ['discountType'],
      },
      {
        fields: ['discountStart', 'discountEnd'],
      },
      {
        fields: ['productCode'],
      },
      {
        fields: ['barcode'],
      },
    ],
  }
);

export default Product;
