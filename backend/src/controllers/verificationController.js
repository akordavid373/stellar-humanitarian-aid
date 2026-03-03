const StellarService = require('../services/stellarService');
const Joi = require('joi');

const stellarService = new StellarService();

const verificationSchema = Joi.object({
    distributionId: Joi.string().required().pattern(/^DIST_\d+_[A-F0-9]{6}$/)
});

class VerificationController {
    async verifyDistribution(req, res) {
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
                message: 'Distribution verification completed',
                data: verification
            });
        } catch (error) {
            console.error('Verify distribution error:', error);
            res.status(500).json({
                error: 'Failed to verify distribution',
                message: error.message
            });
        }
    }

    async getTransactionHistory(req, res) {
        try {
            const { accountId } = req.params;
            const { limit = 10 } = req.query;

            if (!accountId || !accountId.match(/^G[A-Z0-9]{55}$/)) {
                return res.status(400).json({
                    error: 'Invalid Stellar account address format'
                });
            }

            const history = await stellarService.getTransactionHistory(accountId, parseInt(limit));

            res.json({
                success: true,
                data: history
            });
        } catch (error) {
            console.error('Get transaction history error:', error);
            res.status(500).json({
                error: 'Failed to get transaction history',
                message: error.message
            });
        }
    }

    async verifyTransaction(req, res) {
        try {
            const { transactionHash } = req.params;

            if (!transactionHash || !transactionHash.match(/^[a-f0-9]{64}$/)) {
                return res.status(400).json({
                    error: 'Invalid transaction hash format'
                });
            }

            // This would typically verify transaction on Stellar network
            res.json({
                success: true,
                message: 'Transaction verification not implemented yet',
                data: { transactionHash }
            });
        } catch (error) {
            console.error('Verify transaction error:', error);
            res.status(500).json({
                error: 'Failed to verify transaction',
                message: error.message
            });
        }
    }
}

module.exports = new VerificationController();
