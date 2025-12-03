import { Response, NextFunction } from 'express';
import { AuthRequest, OrderStatus, PaymentStatus, UserRole } from '@shared-types/index';
import Order from '@models/Order';
import OrderItem from '@models/OrderItem';
import Product from '@models/Product';
import Store from '@models/Store';
import Coupon from '@models/Coupon';
import UnavailableNotification from '@models/UnavailableNotification';
import { sendSuccess, sendCreated, sendError, sendNotFound, sendUnauthorized, sendPaginated } from '@utils/response';
import { generateUUID, generateOrderNumber, calculatePagination } from '@utils/helpers';
import logger from '@utils/logger';
import { Op } from 'sequelize';

export const createOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendUnauthorized(res, 'User not authenticated');
      return;
    }

    const {
      customerFirstName,
      customerLastName,
      customerPhone,
      customerEmail,
      customerAddress,
      customerCity,
      customerArea,
      locationLatitude,
      locationLongitude,
      locationAccuracy,
      locationAddress,
      shippingType,
      paymentMethod,
      paymentPlan,
      couponCode,
      notes,
      items,
      storeId,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      sendError(res, 'Order must include at least one item', 400, 'ORDER_ITEMS_REQUIRED');
      return;
    }

    let subtotal = 0;
    let discountAmount = 0;
    let discountPercentage = 0;

    const productIds = items.map((item: any) => Number(item.productId)).filter((id: number) => !Number.isNaN(id));
    const products = await Product.findAll({ where: { id: productIds } });

    const productMap = new Map(products.map((p) => [p.id, p]));
    let resolvedStoreId = storeId ? Number(storeId) : undefined;

    for (const item of items) {
      const product = productMap.get(Number(item.productId));
      if (!product) {
        sendError(res, `Product ${item.productId} not found`, 404, 'PRODUCT_NOT_FOUND');
        return;
      }

      const quantity = Number(item.quantity);
      if (!Number.isFinite(quantity) || quantity <= 0) {
        sendError(res, `Invalid quantity for product ${product.name}`, 400, 'INVALID_QUANTITY');
        return;
      }

      if (product.quantity < quantity) {
        sendError(res, `Insufficient stock for product ${product.name}`, 400, 'INSUFFICIENT_STOCK');
        return;
      }

      if (product.storeId) {
        if (resolvedStoreId === undefined) {
          resolvedStoreId = product.storeId;
        } else if (resolvedStoreId !== product.storeId) {
          sendError(res, 'All items must belong to the same store', 400, 'MIXED_STORES_NOT_ALLOWED');
          return;
        }
      }

      const unitPrice = Number(item.price ?? product.price);
      subtotal += unitPrice * quantity;
    }

    let merchantId: string | undefined;
    if (resolvedStoreId) {
      const store = await Store.findByPk(resolvedStoreId);
      if (store?.merchantId) {
        merchantId = store.merchantId as string;
      }
    }

    let appliedCoupon: Coupon | null = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ where: { code: couponCode.toUpperCase() } });
      if (
        coupon &&
        coupon.isActive &&
        (coupon.maxUses === null || coupon.maxUses === undefined || coupon.currentUses < coupon.maxUses) &&
        (!coupon.expiresAt || new Date() <= coupon.expiresAt)
      ) {
        appliedCoupon = coupon;
        discountPercentage = coupon.discountPercentage;
        discountAmount = (subtotal * discountPercentage) / 100;
      }
    }

    const shippingCost = 5;
    const finalTotal = Math.round((subtotal - discountAmount + shippingCost) * 100) / 100;

    const orderId = generateUUID();
    const orderNumber = generateOrderNumber();

    const normalizedPaymentPlan = paymentPlan === 'qasatli' ? 'qasatli' : 'immediate';

    const order = await Order.create({
      id: orderId,
      orderNumber,
      customerId: req.user.id,
      customerFirstName,
      customerLastName,
      customerPhone,
      customerEmail,
      customerAddress,
      customerCity,
      customerArea,
      locationLatitude,
      locationLongitude,
      locationAccuracy,
      locationAddress,
      subtotal,
      discountAmount: Math.round(discountAmount * 100) / 100,
      discountPercentage,
      shippingCost,
      finalTotal,
      couponCode: couponCode?.toUpperCase(),
      shippingType,
      paymentMethod,
      paymentStatus: PaymentStatus.PENDING,
      orderStatus: OrderStatus.PENDING,
      notes,
      storeId: resolvedStoreId,
      merchantId,
      orderType: 'online',
      paymentPlan: normalizedPaymentPlan,
    });

    for (const item of items) {
      const product = productMap.get(Number(item.productId));
      if (product) {
        const quantity = Number(item.quantity);
        const unitPrice = Number(item.price ?? product.price);
        await OrderItem.create({
          orderId: order.id,
          productId: product.id,
          productName: product.name,
          productPrice: unitPrice,
          productImage: product.image,
          size: item.size,
          color: item.color,
          quantity,
          lineTotal: unitPrice * quantity,
        });

        const updatedQuantity = product.quantity - quantity;
        await product.update({ quantity: updatedQuantity, inStock: updatedQuantity > 0 });
      }
    }

    if (appliedCoupon) {
      await appliedCoupon.update({ currentUses: appliedCoupon.currentUses + 1 });
    }

    logger.info(`Order created: ${orderNumber} (${orderId})`);

    sendCreated(res, {
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        subtotal: order.subtotal,
        discountAmount: order.discountAmount,
        shippingCost: order.shippingCost,
        finalTotal: order.finalTotal,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    logger.error('Create order error:', error);
    next(error);
  }
};

export const createManualOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendUnauthorized(res, 'User not authenticated');
      return;
    }

    if (req.user.role === UserRole.CUSTOMER) {
      sendError(res, 'Only merchants and admins can create manual orders', 403, 'FORBIDDEN');
      return;
    }

    const {
      customerFirstName,
      customerLastName,
      customerPhone,
      customerEmail,
      customerAddress,
      customerCity,
      customerArea,
      shippingType,
      paymentMethod,
      paymentPlan,
      identityNumber,
      deliveryNote,
      deliveryAgent,
      notes,
      items,
      storeId,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      sendError(res, 'Order must include at least one item', 400, 'ORDER_ITEMS_REQUIRED');
      return;
    }

    const productIds = items.map((it: any) => Number(it.productId));
    const products = await Product.findAll({ where: { id: productIds } });
    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    let resolvedStoreId = storeId ? Number(storeId) : undefined;

    for (const item of items) {
      const product = productMap.get(Number(item.productId));
      if (!product) {
        sendError(res, `Product ${item.productId} not found`, 404, 'PRODUCT_NOT_FOUND');
        return;
      }

      const quantity = Number(item.quantity);
      if (!Number.isFinite(quantity) || quantity <= 0) {
        sendError(res, `Invalid quantity for product ${product.name}`, 400, 'INVALID_QUANTITY');
        return;
      }

      if (product.quantity < quantity) {
        sendError(res, `Insufficient stock for product ${product.name}`, 400, 'INSUFFICIENT_STOCK');
        return;
      }

      if (product.storeId) {
        if (resolvedStoreId === undefined) {
          resolvedStoreId = product.storeId;
        } else if (resolvedStoreId !== product.storeId) {
          sendError(res, 'All items must belong to the same store', 400, 'MIXED_STORES_NOT_ALLOWED');
          return;
        }
      }

      const unitPrice = Number(item.price ?? product.price);
      subtotal += unitPrice * quantity;
    }

    let merchantId: string | undefined;
    if (resolvedStoreId) {
      const store = await Store.findByPk(resolvedStoreId);
      if (store?.merchantId) {
        merchantId = store.merchantId as string;
      }
    }

    const orderId = generateUUID();
    const orderNumber = generateOrderNumber();
    const normalizedPaymentPlan = paymentPlan === 'qasatli' ? 'qasatli' : 'immediate';
    const extendedNotes = [
      notes,
      identityNumber ? `ID/Record: ${identityNumber}` : '',
      deliveryAgent ? `Courier: ${deliveryAgent}` : '',
      deliveryNote ? `Delivery Note: ${deliveryNote}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const order = await Order.create({
      id: orderId,
      orderNumber,
      customerFirstName,
      customerLastName,
      customerPhone,
      customerEmail,
      customerAddress,
      customerCity,
      customerArea,
      subtotal,
      discountAmount: 0,
      discountPercentage: 0,
      shippingCost: 0,
      finalTotal: subtotal,
      shippingType,
      paymentMethod,
      paymentStatus: PaymentStatus.PENDING,
      orderStatus: OrderStatus.PENDING,
      notes: extendedNotes,
      storeId: resolvedStoreId,
      merchantId,
      orderType: 'manual',
      paymentPlan: normalizedPaymentPlan,
    });

    for (const item of items) {
      const product = productMap.get(Number(item.productId));
      if (!product) continue;
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.price ?? product.price);
      await OrderItem.create({
        orderId: order.id,
        productId: product.id,
        productName: product.name,
        productPrice: unitPrice,
        productImage: product.image,
        size: item.size,
        color: item.color,
        quantity,
        lineTotal: unitPrice * quantity,
      });

      const updatedQuantity = product.quantity - quantity;
      await product.update({ quantity: updatedQuantity, inStock: updatedQuantity > 0 });
    }

    logger.info(`Manual order created: ${orderNumber} (${orderId})`);

    sendCreated(res, { orderId: order.id, orderNumber: order.orderNumber });
  } catch (error) {
    logger.error('Create manual order error:', error);
    next(error);
  }
};

export const getOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendUnauthorized(res, 'User not authenticated');
      return;
    }

    const { page = 1, limit = 10, status, type } = req.query;
    const { page: validPage, limit: validLimit, offset } = calculatePagination(
      parseInt(page as string) || 1,
      parseInt(limit as string) || 10
    );

    const whereClause: any = {};

    if (req.user.role === UserRole.CUSTOMER) {
      whereClause.customerId = req.user.id;
    }

    if (req.user.role === UserRole.MERCHANT) {
      whereClause.merchantId = req.user.id;
    }

    if (status) {
      whereClause.orderStatus = status;
    }

    if (type) {
      whereClause.orderType = type;
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      offset,
      limit: validLimit,
      order: [['createdAt', 'DESC']],
      include: [{ model: OrderItem, as: 'items' }],
    });

    logger.info(`Fetched ${orders.length} orders for user: ${req.user.id}`);

    sendPaginated(res, orders, validPage, validLimit, count);
  } catch (error) {
    logger.error('Get orders error:', error);
    next(error);
  }
};

export const getOrderById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendUnauthorized(res, 'User not authenticated');
      return;
    }

    const { orderId } = req.params;

    const order = await Order.findByPk(orderId, {
      include: [{ model: OrderItem, as: 'items' }],
    });

    if (!order) {
      sendNotFound(res, 'Order not found');
      return;
    }

    if (req.user.role === UserRole.CUSTOMER && order.customerId !== req.user.id) {
      sendError(res, 'You do not have permission to access this order', 403, 'FORBIDDEN');
      return;
    }

    sendSuccess(res, order);
  } catch (error) {
    logger.error('Get order by ID error:', error);
    next(error);
  }
};

export const updateOrderStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendUnauthorized(res, 'User not authenticated');
      return;
    }

    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) {
      sendNotFound(res, 'Order not found');
      return;
    }

    if (req.user.role === UserRole.CUSTOMER) {
      sendError(res, 'Only merchants and admins can update order status', 403, 'FORBIDDEN');
      return;
    }

    await order.update({ orderStatus });

    logger.info(`Order status updated: ${orderId}, status: ${orderStatus}`);

    sendSuccess(res, {
      orderId: order.id,
      orderStatus: order.orderStatus,
      message: 'Order status updated successfully',
    });
  } catch (error) {
    logger.error('Update order status error:', error);
    next(error);
  }
};

export const getUnavailableForMerchant = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendUnauthorized(res, 'User not authenticated');
      return;
    }

    const stores = await Store.findAll({ where: { merchantId: req.user.id } });
    const storeIds = stores.map((store) => store.id);
    const storeSlugs = stores.map((store) => store.slug);

    const orClauses: any[] = [];
    if (storeIds.length) {
      orClauses.push({ storeId: { [Op.in]: storeIds } });
    }
    if (storeSlugs.length) {
      orClauses.push({ storeSlug: { [Op.in]: storeSlugs } });
    }

    const items = await UnavailableNotification.findAll({
      where: orClauses.length ? { [Op.or]: orClauses } : {},
      order: [['createdAt', 'DESC']],
    });

    sendSuccess(res, { items });
  } catch (error) {
    logger.error('Get unavailable notifications error:', error);
    next(error);
  }
};

export const cancelOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendUnauthorized(res, 'User not authenticated');
      return;
    }

    const { orderId } = req.params;

    const order = await Order.findByPk(orderId);
    if (!order) {
      sendNotFound(res, 'Order not found');
      return;
    }

    if (req.user.role === UserRole.CUSTOMER && order.customerId !== req.user.id) {
      sendError(res, 'You do not have permission to cancel this order', 403, 'FORBIDDEN');
      return;
    }

    if (order.orderStatus === OrderStatus.CANCELLED) {
      sendError(res, 'Order is already cancelled', 400, 'INVALID_ORDER_STATUS');
      return;
    }

    if (order.orderStatus === OrderStatus.DELIVERED) {
      sendError(res, 'Cannot cancel a delivered order', 400, 'INVALID_ORDER_STATUS');
      return;
    }

    const orderItems = await OrderItem.findAll({ where: { orderId: order.id } });

    for (const item of orderItems) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        const restoredQuantity = product.quantity + item.quantity;
        await product.update({ quantity: restoredQuantity, inStock: restoredQuantity > 0 });
      }
    }

    await order.update({ orderStatus: OrderStatus.CANCELLED });

    logger.info(`Order cancelled: ${orderId}`);

    sendSuccess(res, {
      orderId: order.id,
      orderStatus: OrderStatus.CANCELLED,
      message: 'Order cancelled successfully',
    });
  } catch (error) {
    logger.error('Cancel order error:', error);
    next(error);
  }
};
