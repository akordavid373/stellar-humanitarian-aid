const express = require('express');
const beneficiaryController = require('../controllers/beneficiaryController');

const router = express.Router();

// POST /api/beneficiaries - Create new beneficiary
router.post('/', beneficiaryController.createBeneficiary);

// GET /api/beneficiaries - List all beneficiaries
router.get('/', beneficiaryController.getBeneficiaries);

// GET /api/beneficiaries/:beneficiaryId - Get specific beneficiary
router.get('/:beneficiaryId', beneficiaryController.getBeneficiary);

// PUT /api/beneficiaries/:beneficiaryId - Update beneficiary
router.put('/:beneficiaryId', beneficiaryController.updateBeneficiary);

module.exports = router;
