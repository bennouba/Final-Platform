import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/database';
import { UserRole } from '@shared-types/index';
import securityManager from '@config/security';
import logger from '@utils/logger';

interface UserAttributes {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  storeName?: string;
  storeSlug?: string;
  storeCategory?: string;
  storeDescription?: string;
  storeLogo?: string;
  merchantVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}

type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'createdAt' | 'updatedAt' | 'lastLogin' | 'merchantVerified'
>;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: string;
  declare email: string;
  declare password: string;
  declare firstName: string;
  declare lastName: string;
  declare phone: string;
  declare role: UserRole;
  declare storeName?: string;
  declare storeSlug?: string;
  declare storeCategory?: string;
  declare storeDescription?: string;
  declare storeLogo?: string;
  declare merchantVerified: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare lastLogin?: Date;

  declare getFullName: () => string;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...(Object.values(UserRole) as string[])),
      defaultValue: UserRole.CUSTOMER,
    },
    storeName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    storeSlug: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: true,
    },
    storeCategory: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    storeDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    storeLogo: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    merchantVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    indexes: [
      {
        fields: ['role'],
      },
    ],
    hooks: {
      beforeCreate: async (user: User) => {
        // Hash password before saving
        if (user.password) {
          user.password = await securityManager.hashPassword(user.password);
        }
      },
      beforeUpdate: async (user: User) => {
        // Hash password if it's being updated
        if (user.changed('password') && user.password) {
          user.password = await securityManager.hashPassword(user.password);
        }
      },
      afterCreate: async (user: User) => {
        // Log user creation
        logger.info(`👤 New user created: ${user.email} (${user.role})`);
      },
      afterUpdate: async (user: User) => {
        // Log user updates (excluding password changes)
        const changes = user.changed();
        if (changes && changes.length > 0) {
          const sanitizedChanges = changes.filter(field => field !== 'password');
          if (sanitizedChanges.length > 0) {
            logger.info(`📝 User updated: ${user.email}, changed: ${sanitizedChanges.join(', ')}`);
          }
        }
      },
      afterDestroy: async (user: User) => {
        // Log user deletion
        logger.info(`🗑️  User deleted: ${user.email}`);
      }
    }
  }
);

User.prototype.getFullName = function (): string {
  return `${this.firstName} ${this.lastName}`;
};

export default User;
