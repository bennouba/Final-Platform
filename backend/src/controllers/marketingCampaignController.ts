import { Request, Response } from 'express';
import MarketingCampaignService from '@services/marketingCampaignService';

export const createCampaign = async (req: Request, res: Response) => {
  try {
    const campaignConfig = req.body;

    const campaign = await MarketingCampaignService.createCampaign(campaignConfig);

    res.status(201).json({
      success: true,
      data: campaign,
      message: 'Campaign created successfully',
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await MarketingCampaignService.getAllCampaigns();

    res.json({
      success: true,
      data: campaigns,
      count: campaigns.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCampaign = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;

    const campaign = await MarketingCampaignService.getCampaign(campaignId);

    if (!campaign) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }

    res.json({
      success: true,
      data: campaign,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateCampaign = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;
    const updates = req.body;

    const campaign = await MarketingCampaignService.updateCampaign(campaignId, updates);

    res.json({
      success: true,
      data: campaign,
      message: 'Campaign updated successfully',
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteCampaign = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;

    const deleted = await MarketingCampaignService.deleteCampaign(campaignId);

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }

    res.json({
      success: true,
      message: 'Campaign deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const startCampaign = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;

    const campaign = await MarketingCampaignService.startCampaign(campaignId);

    res.json({
      success: true,
      data: campaign,
      message: 'Campaign started',
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const pauseCampaign = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;

    const campaign = await MarketingCampaignService.pauseCampaign(campaignId);

    res.json({
      success: true,
      data: campaign,
      message: 'Campaign paused',
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const resumeCampaign = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;

    const campaign = await MarketingCampaignService.resumeCampaign(campaignId);

    res.json({
      success: true,
      data: campaign,
      message: 'Campaign resumed',
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const completeCampaign = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;

    const campaign = await MarketingCampaignService.completeCampaign(campaignId);

    res.json({
      success: true,
      data: campaign,
      message: 'Campaign completed',
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getCampaignMetrics = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;

    const metrics = await MarketingCampaignService.getCampaignMetrics(campaignId);

    if (!metrics) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }

    res.json({
      success: true,
      data: metrics,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const trackCampaignEvent = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;
    const { event, data } = req.body;

    await MarketingCampaignService.trackCampaignMetrics(campaignId, event, data);

    res.json({
      success: true,
      message: `Event '${event}' tracked for campaign`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getTargetAudience = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;

    const campaign = await MarketingCampaignService.getCampaign(campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }

    const audience = await MarketingCampaignService.getTargetAudience(campaign);

    res.json({
      success: true,
      data: audience,
      count: audience.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const generateAutomaticCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await MarketingCampaignService.generateAutomaticCampaigns();

    res.json({
      success: true,
      data: campaigns,
      count: campaigns.length,
      message: 'Automatic campaigns generated',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const scheduleAutomaticCampaigns = async (req: Request, res: Response) => {
  try {
    await MarketingCampaignService.scheduleAutomaticCampaigns();

    res.json({
      success: true,
      message: 'Automatic campaigns scheduled',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getSegmentAnalytics = async (req: Request, res: Response) => {
  try {
    const { segment } = req.query;

    const analytics = await MarketingCampaignService.getSegmentAnalytics(segment as any);

    res.json({
      success: true,
      data: analytics,
      count: analytics.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export default {
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
};
