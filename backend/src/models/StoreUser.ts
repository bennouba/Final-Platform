import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/database';

interface StoreUserAttributes {
  id: string;
  storeId: number;
  userId: string;
  role: 'owner' | 'manager' | 'staff';
  createdAt?: Date;
  updatedAt?: Date;
}

type StoreUserCreationAttributes = Optional<StoreUserAttributes, 'id' | 'role' | 'createdAt' | 'updatedAt'>;

class StoreUser extends Model<StoreUserAttributes, StoreUserCreationAttributes> implements StoreUserAttributes {
  declare id: string;
  declare storeId: number;
  declare userId: string;
  declare role: 'owner' | 'manager' | 'staff';
  declare createdAt: Date;
  declare updatedAt: Date;
}

StoreUser.init(
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
    userId: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('owner', 'manager', 'staff'),
      allowNull: false,
      defaultValue: 'owner',
    },
  },
  {
    sequelize,
    tableName: 'store_users',
    timestamps: true,
    underscored: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    indexes: [{ fields: ['storeId'] }, { fields: ['userId'] }],
  }
);

export default StoreUser;
