const express = require('express');

const router = express.Router();

// GET /api/health - Basic health check
router.get('/', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: require('../../package.json').version
    });
});

// GET /api/health/detailed - Detailed health check
router.get('/detailed', async (req, res) => {
    try {
        // Check Stellar connection
        const { Server } = require('@stellar/stellar-sdk');
        const server = new Server(process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org');
        
        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            version: require('../../package.json').version,
            services: {
                stellar: 'connected',
                database: 'not_configured',
                redis: 'not_configured'
            },
            endpoints: {
                api: 'operational',
                stellar: process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org'
            }
        };

        // Test Stellar connection
        try {
            await server.root();
            health.services.stellar = 'healthy';
        } catch (error) {
            health.services.stellar = 'error';
            health.status = 'degraded';
        }

        res.json(health);
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

module.exports = router;
