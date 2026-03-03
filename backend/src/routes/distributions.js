const express = require('express');
const distributionController = require('../controllers/distributionController');

const router = express.Router();

// POST /api/distributions - Create new distribution
router.post('/', distributionController.createDistribution);

// GET /api/distributions - List distributions (with optional campaign filter)
router.get('/', distributionController.getDistributions);

// GET /api/distributions/:distributionId - Get specific distribution
router.get('/:distributionId', distributionController.getDistribution);

module.exports = router;
