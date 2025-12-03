import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/database';

interface CategoryAttributes {
  id: number;
  name: string;
  nameAr?: string;
  description?: string;
  image?: string;
  parentId?: number;
  storeId?: number;
  sortOrder: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type CategoryCreationAttributes = Optional<CategoryAttributes, 'id' | 'createdAt' | 'updatedAt' | 'sortOrder' | 'isActive'>;

class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  declare id: number;
  declare name: string;
  declare nameAr?: string;
  declare description?: string;
  declare image?: string;
  declare parentId?: number;
  declare storeId?: number;
  declare sortOrder: number;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    nameAr: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'stores',
        key: 'id',
      },
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'categories',
    timestamps: true,
    underscored: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    indexes: [
      {
        fields: ['storeId'],
      },
      {
        fields: ['parentId'],
      },
      {
        fields: ['sortOrder'],
      },
      {
        fields: ['isActive'],
      },
    ],
  }
);

// Self-referencing relationship for hierarchical categories
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parentId' });
Category.hasMany(Category, { as: 'children', foreignKey: 'parentId' });

export default Category;
