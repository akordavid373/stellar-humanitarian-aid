const StellarService = require('../services/stellarService');
const Joi = require('joi');

const stellarService = new StellarService();

const campaignSchema = Joi.object({
    title: Joi.string().required().min(3).max(100),
    description: Joi.string().required().min(10).max(1000),
    targetAmount: Joi.number().required().min(1),
    category: Joi.string().valid('medical', 'food', 'shelter', 'water', 'general').required(),
    location: Joi.string().required().min(3).max(100),
    urgency: Joi.string().valid('critical', 'high', 'medium', 'low').required()
});

class CampaignController {
    async createCampaign(req, res) {
        try {
            // Validate input
            const { error, value } = campaignSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: error.details.map(detail => detail.message)
                });
            }

            // Create campaign
            const campaign = await stellarService.createAidCampaign(value);

            res.status(201).json({
                success: true,
                message: 'Campaign created successfully',
                data: campaign
            });
        } catch (error) {
            console.error('Create campaign error:', error);
            res.status(500).json({
                error: 'Failed to create campaign',
                message: error.message
            });
        }
    }

    async getCampaignStatus(req, res) {
        try {
            const { campaignId } = req.params;

            if (!campaignId || !campaignId.match(/^AID_\d+_[A-F0-9]{8}$/)) {
                return res.status(400).json({
                    error: 'Invalid campaign ID format'
                });
            }

            const status = await stellarService.getCampaignStatus(campaignId);

            res.json({
                success: true,
                data: status
            });
        } catch (error) {
            console.error('Get campaign status error:', error);
            
            if (error.message.includes('Campaign not found')) {
                return res.status(404).json({
                    error: 'Campaign not found',
                    message: error.message
                });
            }

            res.status(500).json({
                error: 'Failed to get campaign status',
                message: error.message
            });
        }
    }

    async listCampaigns(req, res) {
        try {
            // This would typically query a database
            // For now, return a placeholder response
            res.json({
                success: true,
                message: 'Campaign listing not implemented yet - would require database integration',
                data: []
            });
        } catch (error) {
            console.error('List campaigns error:', error);
            res.status(500).json({
                error: 'Failed to list campaigns',
                message: error.message
            });
        }
    }

    async updateCampaign(req, res) {
        try {
            const { campaignId } = req.params;
            const updates = req.body;

            // This would typically update campaign in database
            res.json({
                success: true,
                message: 'Campaign update not implemented yet - would require database integration',
                data: { campaignId, updates }
            });
        } catch (error) {
            console.error('Update campaign error:', error);
            res.status(500).json({
                error: 'Failed to update campaign',
                message: error.message
            });
        }
    }

    async deleteCampaign(req, res) {
        try {
            const { campaignId } = req.params;

            // This would typically delete campaign from database
            res.json({
                success: true,
                message: 'Campaign deletion not implemented yet - would require database integration',
                data: { campaignId }
            });
        } catch (error) {
            console.error('Delete campaign error:', error);
            res.status(500).json({
                error: 'Failed to delete campaign',
                message: error.message
            });
        }
    }
}

module.exports = new CampaignController();
