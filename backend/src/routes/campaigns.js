const express = require('express');
const campaignController = require('../controllers/campaignController');

const router = express.Router();

// POST /api/campaigns - Create new campaign
router.post('/', campaignController.createCampaign);

// GET /api/campaigns/:campaignId/status - Get campaign status
router.get('/:campaignId/status', campaignController.getCampaignStatus);

// GET /api/campaigns - List all campaigns (placeholder)
router.get('/', campaignController.listCampaigns);

// PUT /api/campaigns/:campaignId - Update campaign (placeholder)
router.put('/:campaignId', campaignController.updateCampaign);

// DELETE /api/campaigns/:campaignId - Delete campaign (placeholder)
router.delete('/:campaignId', campaignController.deleteCampaign);

module.exports = router;
