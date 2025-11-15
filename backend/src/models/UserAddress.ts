import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/database';

interface UserAddressAttributes {
  id: string;
  userId: string;
  city: string;
  area: string;
  address: string;
  phone: string;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserAddressCreationAttributes extends Optional<UserAddressAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class UserAddress extends Model<UserAddressAttributes, UserAddressCreationAttributes> implements UserAddressAttributes {
  declare id: string;
  declare userId: string;
  declare city: string;
  declare area: string;
  declare address: string;
  declare phone: string;
  declare isDefault: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

UserAddress.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    area: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'user_addresses',
    timestamps: true,
    underscored: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['isDefault'],
      },
    ],
  }
);

export default UserAddress;
