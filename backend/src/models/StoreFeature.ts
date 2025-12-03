import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/database';

interface StoreFeatureAttributes {
  id: number;
  storeId: number;
  enabledFeatures: string[];
  disabledFeatures: string[];
  overrides: Record<string, any> | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type StoreFeatureCreationAttributes = Optional<
  StoreFeatureAttributes,
  'id' | 'enabledFeatures' | 'disabledFeatures' | 'overrides' | 'createdAt' | 'updatedAt'
>;

class StoreFeature extends Model<StoreFeatureAttributes, StoreFeatureCreationAttributes> implements StoreFeatureAttributes {
  declare id: number;
  declare storeId: number;
  declare enabledFeatures: string[];
  declare disabledFeatures: string[];
  declare overrides: Record<string, any> | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

StoreFeature.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    enabledFeatures: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    disabledFeatures: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    overrides: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'store_features',
    timestamps: true,
    underscored: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  }
);

export default StoreFeature;
