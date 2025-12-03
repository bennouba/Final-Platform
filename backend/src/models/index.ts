import User from './User';
import Product from './Product';
import Store from './Store';
import Category from './Category';
import Order from './Order';
import OrderItem from './OrderItem';
import Coupon from './Coupon';
import Payment from './Payment';
import UserAddress from './UserAddress';
import ProductImage from './ProductImage';
import UnavailableNotification from './UnavailableNotification';
import ManualOrder from './ManualOrder';
import AbandonedCart from './AbandonedCart';
import StoreFeature from './StoreFeature';
import SubscriptionPlan from './SubscriptionPlan';
import StoreSubscription from './StoreSubscription';
import StoreSlider from './StoreSlider';
import StoreUser from './StoreUser';
import StoreAd from './StoreAd';

export {
  User,
  Product,
  Store,
  Category,
  Order,
  OrderItem,
  Coupon,
  Payment,
  UserAddress,
  ProductImage,
  UnavailableNotification,
  ManualOrder,
  AbandonedCart,
  StoreFeature,
  SubscriptionPlan,
  StoreSubscription,
  StoreSlider,
  StoreUser,
  StoreAd,
};

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

  Store.hasMany(Category, {
    foreignKey: 'storeId',
    as: 'categories',
  });
  Category.belongsTo(Store, {
    foreignKey: 'storeId',
    as: 'store',
  });

  Store.hasMany(Product, {
    foreignKey: 'storeId',
    as: 'products',
  });
  Product.belongsTo(Store, {
    foreignKey: 'storeId',
    as: 'store',
  });

  Store.hasMany(ManualOrder, {
    foreignKey: 'storeId',
    as: 'manualOrders',
  });
  ManualOrder.belongsTo(Store, {
    foreignKey: 'storeId',
    as: 'store',
  });

  Store.hasMany(AbandonedCart, {
    foreignKey: 'storeId',
    as: 'abandonedCarts',
  });
  AbandonedCart.belongsTo(Store, {
    foreignKey: 'storeId',
    as: 'store',
  });

  Category.hasMany(Product, {
    foreignKey: 'category',
    as: 'products',
  });
  Product.belongsTo(Category, {
    foreignKey: 'category',
    as: 'productCategory',
  });

  Product.hasMany(ProductImage, {
    foreignKey: 'productId',
    as: 'productImages',
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

  Store.hasOne(StoreFeature, {
    foreignKey: 'storeId',
    as: 'featureConfig',
  });
  StoreFeature.belongsTo(Store, {
    foreignKey: 'storeId',
    as: 'store',
  });

  Store.hasMany(StoreSlider, {
    foreignKey: 'storeId',
    as: 'sliders',
  });
  StoreSlider.belongsTo(Store, {
    foreignKey: 'storeId',
    as: 'store',
  });

  Store.hasMany(StoreSubscription, {
    foreignKey: 'storeId',
    as: 'subscriptions',
  });
  StoreSubscription.belongsTo(Store, {
    foreignKey: 'storeId',
    as: 'store',
  });
  SubscriptionPlan.hasMany(StoreSubscription, {
    foreignKey: 'planId',
    as: 'storeSubscriptions',
  });
  StoreSubscription.belongsTo(SubscriptionPlan, {
    foreignKey: 'planId',
    as: 'plan',
  });

  Store.hasMany(StoreUser, {
    foreignKey: 'storeId',
    as: 'members',
  });
  StoreUser.belongsTo(Store, {
    foreignKey: 'storeId',
    as: 'store',
  });
  User.hasMany(StoreUser, {
    foreignKey: 'userId',
    as: 'storeMemberships',
  });
  StoreUser.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });

  Store.hasMany(StoreAd, {
    foreignKey: 'storeId',
    as: 'ads',
    onDelete: 'CASCADE',
  });
  StoreAd.belongsTo(Store, {
    foreignKey: 'storeId',
    as: 'store',
  });
};

export const getModels = () => ({
  User,
  Product,
  Store,
  Category,
  Order,
  OrderItem,
  Coupon,
  Payment,
  UserAddress,
  ProductImage,
  UnavailableNotification,
  ManualOrder,
  AbandonedCart,
  StoreFeature,
  SubscriptionPlan,
  StoreSubscription,
  StoreSlider,
  StoreUser,
  StoreAd,
});
