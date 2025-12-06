import express, { Router } from 'express';
import {
  createCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
  startCampaign,
  pauseCampaign,
  resumeCampaign,
  completeCampaign,
  getCampaignMetrics,
  trackCampaignEvent,
  getTargetAudience,
  generateAutomaticCampaigns,
  scheduleAutomaticCampaigns,
  getSegmentAnalytics,
} from '@controllers/marketingCampaignController';

const router: Router = express.Router();

router.post('/', createCampaign);
router.get('/', getCampaigns);
router.get('/:campaignId', getCampaign);
router.put('/:campaignId', updateCampaign);
router.delete('/:campaignId', deleteCampaign);

router.post('/:campaignId/start', startCampaign);
router.post('/:campaignId/pause', pauseCampaign);
router.post('/:campaignId/resume', resumeCampaign);
router.post('/:campaignId/complete', completeCampaign);

router.get('/:campaignId/metrics', getCampaignMetrics);
router.post('/:campaignId/track', trackCampaignEvent);
router.get('/:campaignId/audience', getTargetAudience);

router.post('/auto/generate', generateAutomaticCampaigns);
router.post('/auto/schedule', scheduleAutomaticCampaigns);
router.get('/analytics/segment', getSegmentAnalytics);

export default router;
