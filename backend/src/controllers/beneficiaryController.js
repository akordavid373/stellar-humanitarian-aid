const StellarService = require('../services/stellarService');
const Joi = require('joi');

const stellarService = new StellarService();

const beneficiarySchema = Joi.object({
    name: Joi.string().required().min(2).max(100),
    contact: Joi.string().required().min(5).max(200),
    location: Joi.string().required().min(3).max(100),
    needs: Joi.array().items(Joi.string()).optional()
});

class BeneficiaryController {
    async createBeneficiary(req, res) {
        try {
            // Validate input
            const { error, value } = beneficiarySchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: error.details.map(detail => detail.message)
                });
            }

            // Create beneficiary wallet
            const beneficiary = await stellarService.createBeneficiaryWallet(value);

            res.status(201).json({
                success: true,
                message: 'Beneficiary wallet created successfully',
                data: beneficiary
            });
        } catch (error) {
            console.error('Create beneficiary error:', error);
            res.status(500).json({
                error: 'Failed to create beneficiary wallet',
                message: error.message
            });
        }
    }

    async getBeneficiaries(req, res) {
        try {
            // This would typically query a database
            res.json({
                success: true,
                message: 'Beneficiary listing not implemented yet - would require database integration',
                data: []
            });
        } catch (error) {
            console.error('Get beneficiaries error:', error);
            res.status(500).json({
                error: 'Failed to get beneficiaries',
                message: error.message
            });
        }
    }

    async getBeneficiary(req, res) {
        try {
            const { beneficiaryId } = req.params;

            // This would typically query database by beneficiaryId
            res.json({
                success: true,
                message: 'Beneficiary details not implemented yet - would require database integration',
                data: { beneficiaryId }
            });
        } catch (error) {
            console.error('Get beneficiary error:', error);
            res.status(500).json({
                error: 'Failed to get beneficiary',
                message: error.message
            });
        }
    }

    async updateBeneficiary(req, res) {
        try {
            const { beneficiaryId } = req.params;
            const updates = req.body;

            // This would typically update beneficiary in database
            res.json({
                success: true,
                message: 'Beneficiary update not implemented yet - would require database integration',
                data: { beneficiaryId, updates }
            });
        } catch (error) {
            console.error('Update beneficiary error:', error);
            res.status(500).json({
                error: 'Failed to update beneficiary',
                message: error.message
            });
        }
    }
}

module.exports = new BeneficiaryController();
