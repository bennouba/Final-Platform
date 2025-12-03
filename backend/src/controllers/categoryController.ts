import { Response, NextFunction } from 'express';
import { Op, type WhereOptions } from 'sequelize';
import Category from '@models/Category';
import Store from '@models/Store';
import { AuthRequest, UserRole } from '@shared-types/index';
import { sendBadRequest, sendCreated, sendForbidden, sendNotFound, sendSuccess } from '@utils/response';
import logger from '@utils/logger';

async function findMerchantStoreId(merchantId: string): Promise<number | null> {
  const store = await Store.findOne({ where: { merchantId } });
  return store ? store.id : null;
}

async function resolveStoreId(req: AuthRequest, explicitStoreId?: number): Promise<number | null> {
  if (req.user?.role === UserRole.ADMIN) {
    return explicitStoreId ?? null;
  }
  if (req.user?.role === UserRole.MERCHANT && req.user.id) {
    return findMerchantStoreId(req.user.id);
  }
  return explicitStoreId ?? null;
}

function buildSearchFilters(query: Record<string, unknown>, storeId?: number): WhereOptions {
  let filters: WhereOptions = {};
  if (storeId) {
    filters = { ...filters, storeId };
  }
  const includeInactive = typeof query.includeInactive === 'string' ? query.includeInactive === 'true' : false;
  if (!includeInactive) {
    filters = { ...filters, isActive: true };
  }
  const searchTerm = typeof query.search === 'string' ? query.search.trim() : '';
  if (searchTerm) {
    filters = {
      ...filters,
      [Op.or]: [
        { name: { [Op.like]: `%${searchTerm}%` } },
        { nameAr: { [Op.like]: `%${searchTerm}%` } },
      ],
    };
  }
  return filters;
}

export const getCategories = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let storeIdFilter: number | undefined;
    if (req.user?.role === UserRole.MERCHANT) {
      const merchantStoreId = await resolveStoreId(req);
      if (!merchantStoreId) {
        sendNotFound(res, 'Store not found for merchant');
        return;
      }
      storeIdFilter = merchantStoreId;
    } else if (typeof req.query.storeId === 'string') {
      const parsed = Number(req.query.storeId);
      if (!Number.isNaN(parsed)) {
        storeIdFilter = parsed;
      }
    }
    const filters = buildSearchFilters(req.query, storeIdFilter);
    const categories = await Category.findAll({
      where: filters,
      order: [
        ['sortOrder', 'ASC'],
        ['id', 'ASC'],
      ],
    });
    sendSuccess(res, categories);
  } catch (error) {
    logger.error('Error fetching categories:', error);
    next(error);
  }
};

export const getCategoryById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categoryId = Number(req.params.categoryId);
    if (Number.isNaN(categoryId)) {
      sendBadRequest(res, 'Invalid category identifier');
      return;
    }
    const category = await Category.findByPk(categoryId);
    if (!category) {
      sendNotFound(res, 'Category not found');
      return;
    }
    if (req.user?.role === UserRole.MERCHANT) {
      const merchantStoreId = await resolveStoreId(req);
      if (!merchantStoreId || category.storeId !== merchantStoreId) {
        sendForbidden(res, 'Access denied for this category');
        return;
      }
    }
    sendSuccess(res, category);
  } catch (error) {
    logger.error('Error retrieving category:', error);
    next(error);
  }
};

export const createCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, nameAr, description, image, sortOrder = 0, isActive = true, storeId } = req.body;
    const resolvedStoreId = await resolveStoreId(req, typeof storeId === 'number' ? storeId : undefined);
    if (!resolvedStoreId) {
      sendBadRequest(res, 'Store identifier is required');
      return;
    }
    const category = await Category.create({
      name,
      nameAr,
      description,
      image,
      sortOrder,
      isActive,
      storeId: resolvedStoreId,
    });
    sendCreated(res, category);
  } catch (error) {
    logger.error('Error creating category:', error);
    next(error);
  }
};

export const updateCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categoryId = Number(req.params.categoryId);
    if (Number.isNaN(categoryId)) {
      sendBadRequest(res, 'Invalid category identifier');
      return;
    }
    const category = await Category.findByPk(categoryId);
    if (!category) {
      sendNotFound(res, 'Category not found');
      return;
    }
    if (req.user?.role === UserRole.MERCHANT) {
      const merchantStoreId = await resolveStoreId(req);
      if (!merchantStoreId || category.storeId !== merchantStoreId) {
        sendForbidden(res, 'Access denied for this category');
        return;
      }
    }
    const updates: Record<string, unknown> = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.nameAr !== undefined) updates.nameAr = req.body.nameAr;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.image !== undefined) updates.image = req.body.image;
    if (req.body.sortOrder !== undefined) updates.sortOrder = req.body.sortOrder;
    if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;
    if (req.user?.role === UserRole.ADMIN && req.body.storeId !== undefined) {
      updates.storeId = req.body.storeId;
    }
    await category.update(updates);
    sendSuccess(res, category);
  } catch (error) {
    logger.error('Error updating category:', error);
    next(error);
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categoryId = Number(req.params.categoryId);
    if (Number.isNaN(categoryId)) {
      sendBadRequest(res, 'Invalid category identifier');
      return;
    }
    const category = await Category.findByPk(categoryId);
    if (!category) {
      sendNotFound(res, 'Category not found');
      return;
    }
    if (req.user?.role === UserRole.MERCHANT) {
      const merchantStoreId = await resolveStoreId(req);
      if (!merchantStoreId || category.storeId !== merchantStoreId) {
        sendForbidden(res, 'Access denied for this category');
        return;
      }
    }
    await category.destroy();
    sendSuccess(res, { id: categoryId });
  } catch (error) {
    logger.error('Error deleting category:', error);
    next(error);
  }
};
