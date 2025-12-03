import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@config/database';
import { PaymentStatus, PaymentGateway } from '@shared-types/index';
import securityManager from '@config/security';
import logger from '@utils/logger';

interface PaymentAttributes {
  id: string;
  orderId: string;
  transactionId?: string;
  amount: number;
  currency: string;
  gateway: PaymentGateway;
  gatewayResponse?: string;
  status: PaymentStatus;
  secureHash?: string;
  merchantReference?: string;
  systemReference?: string;
  networkReference?: string;
  createdAt?: Date;
  updatedAt?: Date;
  completedAt?: Date;
}

type PaymentCreationAttributes = Optional<
  PaymentAttributes,
  'id' | 'createdAt' | 'updatedAt' | 'completedAt'
>;

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  declare id: string;
  declare orderId: string;
  declare transactionId?: string;
  declare amount: number;
  declare currency: string;
  declare gateway: PaymentGateway;
  declare gatewayResponse?: string;
  declare status: PaymentStatus;
  declare secureHash?: string;
  declare merchantReference?: string;
  declare systemReference?: string;
  declare networkReference?: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare completedAt?: Date;
}

Payment.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id',
      },
    },
    transactionId: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'LYD',
    },
    gateway: {
      type: DataTypes.ENUM(...(Object.values(PaymentGateway) as string[])),
      allowNull: false,
    },
    gatewayResponse: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...(Object.values(PaymentStatus) as string[])),
      defaultValue: PaymentStatus.PENDING,
    },
    secureHash: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    merchantReference: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    systemReference: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    networkReference: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'payments',
    timestamps: true,
    underscored: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    indexes: [
      {
        name: 'payments_order_id_unique',
        unique: true,
        fields: ['orderId'],
      },
      {
        name: 'payments_transaction_id_unique',
        unique: true,
        fields: ['transactionId'],
      },
      {
        name: 'payments_status_idx',
        fields: ['status'],
      },
      {
        name: 'payments_merchant_reference_unique',
        unique: true,
        fields: ['merchantReference'],
      },
      {
        name: 'payments_system_reference_idx',
        fields: ['systemReference'],
      },
      {
        name: 'payments_network_reference_idx',
        fields: ['networkReference'],
      },
    ],
    hooks: {
      beforeCreate: async (payment: Payment) => {
        // Encrypt sensitive payment data
        if (payment.gatewayResponse) {
          payment.gatewayResponse = securityManager.encrypt(payment.gatewayResponse);
        }
        if (payment.secureHash) {
          payment.secureHash = securityManager.encrypt(payment.secureHash);
        }
      },
      beforeUpdate: async (payment: Payment) => {
        // Encrypt sensitive data if being updated
        if (payment.changed('gatewayResponse') && payment.gatewayResponse) {
          payment.gatewayResponse = securityManager.encrypt(payment.gatewayResponse);
        }
        if (payment.changed('secureHash') && payment.secureHash) {
          payment.secureHash = securityManager.encrypt(payment.secureHash);
        }
      },
      afterCreate: async (payment: Payment) => {
        // Log payment creation (without sensitive data)
        logger.info(`💳 Payment created: ${payment.id} for order ${payment.orderId} (${payment.amount} ${payment.currency})`);
      },
      afterUpdate: async (payment: Payment) => {
        // Log payment status changes
        if (payment.changed('status')) {
          logger.info(`📊 Payment status updated: ${payment.id} - ${payment.status}`);
        }
      },
      afterFind: async (payments: Payment | Payment[]) => {
        // Decrypt sensitive data when retrieving from database
        const decryptPayment = (payment: Payment) => {
          if (payment.gatewayResponse) {
            try {
              payment.gatewayResponse = securityManager.decrypt(payment.gatewayResponse);
            } catch (error) {
              logger.warn(`Failed to decrypt gateway response for payment ${payment.id}`);
            }
          }
          if (payment.secureHash) {
            try {
              payment.secureHash = securityManager.decrypt(payment.secureHash);
            } catch (error) {
              logger.warn(`Failed to decrypt secure hash for payment ${payment.id}`);
            }
          }
        };

        if (Array.isArray(payments)) {
          payments.forEach(decryptPayment);
        } else if (payments) {
          decryptPayment(payments);
        }
      }
    }
  }
);

export default Payment;
