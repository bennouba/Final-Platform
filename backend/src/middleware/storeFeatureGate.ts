import { Response, NextFunction } from 'express';
import { AuthRequest } from '@shared-types/index';
import { sendError, sendForbidden } from '@utils/response';
import storeFeatureService from '@services/storeFeatureService';

export const requireStoreFeature = (featureCode: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const slug = (req.params as any).slug || (req.body as any).storeSlug;
      if (!slug) {
        sendError(res, 'Store slug is required', 400);
        return;
      }
      const store = await storeFeatureService.getStoreBySlug(slug);
      if (!store) {
        sendError(res, 'Store not found', 404);
        return;
      }
      const resolved = await storeFeatureService.resolveFeatures(store.id);
      (req as any).storeContext = { store, features: resolved.features };
      if (!resolved.features.includes(featureCode)) {
        sendForbidden(res, 'Feature not enabled for this store');
        return;
      }
      next();
    } catch (error) {
      sendError(res, 'Failed to validate store feature access', 500);
    }
  };
};
