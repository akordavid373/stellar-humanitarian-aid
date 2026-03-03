const express = require('express');
const verificationController = require('../controllers/verificationController');

const router = express.Router();

// POST /api/verification/distributions/:distributionId - Verify specific distribution
router.post('/distributions/:distributionId', verificationController.verifyDistribution);

// GET /api/verification/transactions/:accountId/history - Get transaction history
router.get('/transactions/:accountId/history', verificationController.getTransactionHistory);

// POST /api/verification/transactions/:transactionHash - Verify transaction
router.post('/transactions/:transactionHash', verificationController.verifyTransaction);

module.exports = router;
