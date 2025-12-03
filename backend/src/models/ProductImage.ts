import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/database';

interface ProductImageAttributes {
  id: number;
  productId: number;
  imageUrl: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
  createdAt?: Date;
}

type ProductImageCreationAttributes = Optional<ProductImageAttributes, 'id' | 'createdAt'>;

class ProductImage extends Model<ProductImageAttributes, ProductImageCreationAttributes> implements ProductImageAttributes {
  declare id: number;
  declare productId: number;
  declare imageUrl: string;
  declare altText?: string;
  declare sortOrder: number;
  declare isPrimary: boolean;
  declare createdAt: Date;
}

ProductImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    altText: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'product_images',
    timestamps: true,
    underscored: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    indexes: [
      {
        fields: ['productId'],
      },
    ],
  }
);

export default ProductImage;
