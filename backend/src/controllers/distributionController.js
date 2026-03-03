const StellarService = require('../services/stellarService');
const Joi = require('joi');

const stellarService = new StellarService();

const distributionSchema = Joi.object({
    campaignId: Joi.string().required().pattern(/^AID_\d+_[A-F0-9]{8}$/),
    recipientAddress: Joi.string().required().pattern(/^G[A-Z0-9]{55}$/),
    amount: Joi.number().required().min(0.1),
    memo: Joi.string().optional().max(200)
});

class DistributionController {
    async createDistribution(req, res) {
        try {
            // Validate input
            const { error, value } = distributionSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: error.details.map(detail => detail.message)
                });
            }

            // Create distribution
            const distribution = await stellarService.distributeAid(
                value.campaignId,
                value.recipientAddress,
                value.amount,
                value.memo
            );

            res.status(201).json({
                success: true,
                message: 'Aid distributed successfully',
                data: distribution
            });
        } catch (error) {
            console.error('Create distribution error:', error);
            res.status(500).json({
                error: 'Failed to distribute aid',
                message: error.message
            });
        }
    }

    async getDistributions(req, res) {
        try {
            const { campaignId } = req.query;

            if (campaignId) {
                const campaignStatus = await stellarService.getCampaignStatus(campaignId);
                return res.json({
                    success: true,
                    data: campaignStatus.distributions
                });
            }

            // This would typically query a database for all distributions
            res.json({
                success: true,
                message: 'Distribution listing not implemented yet - would require database integration',
                data: []
            });
        } catch (error) {
            console.error('Get distributions error:', error);
            res.status(500).json({
                error: 'Failed to get distributions',
                message: error.message
            });
        }
    }

    async getDistribution(req, res) {
        try {
            const { distributionId } = req.params;

            if (!distributionId || !distributionId.match(/^DIST_\d+_[A-F0-9]{6}$/)) {
                return res.status(400).json({
                    error: 'Invalid distribution ID format'
                });
            }

            const verification = await stellarService.verifyAidDistribution(distributionId);

            res.json({
                success: true,
                data: verification
            });
        } catch (error) {
            console.error('Get distribution error:', error);
            res.status(500).json({
                error: 'Failed to get distribution',
                message: error.message
            });
        }
    }
}

module.exports = new DistributionController();
