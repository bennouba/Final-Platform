import User from './User';
import Product from './Product';
import Store from './Store';
import Order from './Order';
import OrderItem from './OrderItem';
import Coupon from './Coupon';
import Payment from './Payment';
import UserAddress from './UserAddress';
import ProductImage from './ProductImage';

export { User, Product, Store, Order, OrderItem, Coupon, Payment, UserAddress, ProductImage };

export const initializeModels = (): void => {
  defineAssociations();
};

const defineAssociations = (): void => {
  User.hasMany(Store, {
    foreignKey: 'merchantId',
    as: 'stores',
    onDelete: 'CASCADE',
  });
  Store.belongsTo(User, {
    foreignKey: 'merchantId',
    as: 'merchant',
  });

  Store.hasMany(Product, {
    foreignKey: 'storeId',
    as: 'products',
  });
  Product.belongsTo(Store, {
    foreignKey: 'storeId',
    as: 'store',
  });

  Product.hasMany(ProductImage, {
    foreignKey: 'productId',
    as: 'images',
    onDelete: 'CASCADE',
  });
  ProductImage.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product',
  });

  User.hasMany(Order, {
    foreignKey: 'customerId',
    as: 'orders',
    onDelete: 'SET NULL',
  });
  Order.belongsTo(User, {
    foreignKey: 'customerId',
    as: 'customer',
  });

  Order.hasMany(OrderItem, {
    foreignKey: 'orderId',
    as: 'items',
    onDelete: 'CASCADE',
  });
  OrderItem.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order',
  });

  Product.hasMany(OrderItem, {
    foreignKey: 'productId',
    as: 'orderItems',
  });
  OrderItem.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product',
  });

  Order.hasOne(Payment, {
    foreignKey: 'orderId',
    as: 'payment',
    onDelete: 'CASCADE',
  });
  Payment.belongsTo(Order, {
    foreignKey: 'orderId',
    as: 'order',
  });

  User.hasMany(UserAddress, {
    foreignKey: 'userId',
    as: 'addresses',
    onDelete: 'CASCADE',
  });
  UserAddress.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });
};

export const getModels = () => ({
  User,
  Product,
  Store,
  Order,
  OrderItem,
  Coupon,
  Payment,
  UserAddress,
  ProductImage,
});
