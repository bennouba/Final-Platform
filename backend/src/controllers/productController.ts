import { Response, NextFunction } from 'express';
import { AuthRequest, UserRole } from '@shared-types/index';
import Product from '@models/Product';
import ProductImage from '@models/ProductImage';
import Store from '@models/Store';
import { sendSuccess, sendCreated, sendError, sendNotFound, sendUnauthorized, sendPaginated } from '@utils/response';
import { calculatePagination } from '@utils/helpers';
import logger from '@utils/logger';
import { Op } from 'sequelize';

export const createProduct = async (
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
      sendError(res, 'Only merchants and admins can create products', 403, 'FORBIDDEN');
      return;
    }

    const {
      name,
      description,
      price,
      quantity,
      stock,
      inStock,
      category,
      sku,
      images = [],
      brand,
      thumbnail,
    } = req.body;

    let storeId: number | undefined;

    if (req.user.role === UserRole.MERCHANT) {
      const store = await Store.findOne({ where: { merchantId: req.user.id } });
      if (!store) {
        sendError(res, 'Merchant store not found', 404, 'STORE_NOT_FOUND');
        return;
      }
      storeId = store.id;
    }

    const resolvedQuantity = quantity ?? stock ?? 0;
    const resolvedInStock = inStock ?? resolvedQuantity > 0;

    const product = await Product.create({
      storeId,
      name,
      description,
      price,
      quantity: resolvedQuantity,
      inStock: resolvedInStock,
      category,
      sku,
      image: Array.isArray(images) && images.length > 0 ? images[0] : '',
      ...(brand !== undefined && { brand }),
      ...(thumbnail !== undefined && { thumbnail }),
    });

    if (Array.isArray(images) && images.length > 0) {
      await Promise.all(
        images.map((imageUrl: string, index: number) =>
          ProductImage.create({
            productId: product.id,
            imageUrl,
            sortOrder: index,
            isPrimary: index === 0,
          })
        )
      );
    }

    logger.info(`Product created: ${product.id} by user ${req.user.id}`);

    const createdProduct = await Product.findByPk(product.id, {
      include: [{ model: ProductImage, as: 'images' }],
    });

    sendCreated(res, createdProduct ?? product);
  } catch (error) {
    logger.error('Create product error:', error);
    next(error);
  }
};

export const getProducts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10, category, search, sortBy = 'createdAt', order = 'DESC' } = req.query;
    const { page: validPage, limit: validLimit, offset } = calculatePagination(
      parseInt(page as string) || 1,
      parseInt(limit as string) || 10
    );

    let whereClause: any = {};

    if (category) {
      whereClause.category = category;
    }

    if (search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      offset,
      limit: validLimit,
      order: [[sortBy as string, order as string]],
      include: [{ model: ProductImage, as: 'images' }],
    });

    logger.info(`Fetched ${products.length} products`);

    sendPaginated(res, products, validPage, validLimit, count);
  } catch (error) {
    logger.error('Get products error:', error);
    next(error);
  }
};

export const getProductById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productId = Number(req.params.productId);
    if (Number.isNaN(productId)) {
      sendError(res, 'Invalid product identifier', 400, 'INVALID_PRODUCT_ID');
      return;
    }

    const product = await Product.findByPk(productId, {
      include: [{ model: ProductImage, as: 'images' }],
    });

    if (!product) {
      sendNotFound(res, 'Product not found');
      return;
    }

    sendSuccess(res, product);
  } catch (error) {
    logger.error('Get product by ID error:', error);
    next(error);
  }
};

export const updateProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendUnauthorized(res, 'User not authenticated');
      return;
    }

    const productId = Number(req.params.productId);
    if (Number.isNaN(productId)) {
      sendError(res, 'Invalid product identifier', 400, 'INVALID_PRODUCT_ID');
      return;
    }

    const {
      name,
      description,
      price,
      originalPrice,
      discountPercent,
      discountType,
      discountStart,
      discountEnd,
      quantity,
      stock,
      inStock,
      category,
      images = [],
      brand,
      thumbnail,
    } = req.body;

    const product = await Product.findByPk(productId, {
      include: [{ model: ProductImage, as: 'images' }],
    });
    if (!product) {
      sendNotFound(res, 'Product not found');
      return;
    }

    if (req.user.role === UserRole.MERCHANT && product.storeId) {
      const store = await Store.findByPk(product.storeId);
      if (!store || store.merchantId !== req.user.id) {
        sendError(res, 'You do not have permission to update this product', 403, 'FORBIDDEN');
        return;
      }
    }

    const resolvedQuantity = quantity ?? stock;
    const updates: Record<string, unknown> = {};

    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = price;
    if (originalPrice !== undefined) updates.originalPrice = originalPrice;
    if (discountPercent !== undefined) updates.discountPercent = discountPercent;
    if (discountType !== undefined) updates.discountType = discountType;
    if (discountStart !== undefined) updates.discountStart = discountStart;
    if (discountEnd !== undefined) updates.discountEnd = discountEnd;
    if (category !== undefined) updates.category = category;
    if (brand !== undefined) updates.brand = brand;
    if (thumbnail !== undefined) updates.thumbnail = thumbnail;

    if (resolvedQuantity !== undefined) {
      updates.quantity = resolvedQuantity;
      updates.inStock = inStock ?? resolvedQuantity > 0;
    } else if (inStock !== undefined) {
      updates.inStock = inStock;
    }

    await product.update(updates);

    if (Array.isArray(images)) {
      await ProductImage.destroy({ where: { productId: product.id } });
      if (images.length > 0) {
        await Promise.all(
          images.map((imageUrl: string, index: number) =>
            ProductImage.create({
              productId: product.id,
              imageUrl,
              sortOrder: index,
              isPrimary: index === 0,
            })
          )
        );
      }
    }

    await product.reload({ include: [{ model: ProductImage, as: 'images' }] });

    logger.info(`Product updated: ${product.id}`);

    sendSuccess(res, product);
  } catch (error) {
    logger.error('Update product error:', error);
    next(error);
  }
};

export const deleteProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendUnauthorized(res, 'User not authenticated');
      return;
    }

    const productId = Number(req.params.productId);
    if (Number.isNaN(productId)) {
      sendError(res, 'Invalid product identifier', 400, 'INVALID_PRODUCT_ID');
      return;
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      sendNotFound(res, 'Product not found');
      return;
    }

    if (req.user.role === UserRole.MERCHANT && product.storeId) {
      const store = await Store.findByPk(product.storeId);
      if (!store || store.merchantId !== req.user.id) {
        sendError(res, 'You do not have permission to delete this product', 403, 'FORBIDDEN');
        return;
      }
    }

    await product.destroy();

    logger.info(`Product deleted: ${productId}`);

    sendSuccess(res, null, 200, 'Product deleted successfully');
  } catch (error) {
    logger.error('Delete product error:', error);
    next(error);
  }
};
