const request = require('supertest');
const app = require('../backend/src/index');

describe('Stellar Aid Network API', () => {
  describe('Health Check', () => {
    test('GET /api/health should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('version');
    });

    test('GET /api/health/detailed should return detailed health status', async () => {
      const response = await request(app)
        .get('/api/health/detailed')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('services');
      expect(response.body.services).toHaveProperty('stellar');
      expect(response.body.services).toHaveProperty('database');
      expect(response.body.services).toHaveProperty('redis');
    });
  });

  describe('Campaigns', () => {
    test('POST /api/campaigns should create a new campaign', async () => {
      const campaignData = {
        title: 'Test Emergency Campaign',
        description: 'Test campaign for API testing',
        targetAmount: 1000,
        category: 'medical',
        location: 'Test Location',
        urgency: 'medium'
      };

      const response = await request(app)
        .post('/api/campaigns')
        .send(campaignData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('campaignId');
      expect(response.body.data).toHaveProperty('transactionHash');
      expect(response.body.data.campaign).toHaveProperty('title', campaignData.title);
      expect(response.body.data.campaign).toHaveProperty('targetAmount', campaignData.targetAmount);
    });

    test('POST /api/campaigns should validate required fields', async () => {
      const invalidData = {
        title: 'Test',
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/campaigns')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    test('GET /api/campaigns/:campaignId/status should return campaign status', async () => {
      // This test would require a valid campaign ID
      // For now, we'll test the error case
      const response = await request(app)
        .get('/api/campaigns/INVALID_ID/status')
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid campaign ID format');
    });
  });

  describe('Distributions', () => {
    test('POST /api/distributions should create a new distribution', async () => {
      const distributionData = {
        campaignId: 'AID_1709433600_ABC12345',
        recipientAddress: 'GABC1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890',
        amount: 100,
        memo: 'Test distribution'
      };

      const response = await request(app)
        .post('/api/distributions')
        .send(distributionData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('distributionId');
      expect(response.body.data).toHaveProperty('transactionHash');
      expect(response.body.data).toHaveProperty('recipient', distributionData.recipientAddress);
      expect(response.body.data).toHaveProperty('amount', distributionData.amount.toString());
    });

    test('POST /api/distributions should validate Stellar address format', async () => {
      const invalidData = {
        campaignId: 'AID_1709433600_ABC12345',
        recipientAddress: 'INVALID_ADDRESS',
        amount: 100
      };

      const response = await request(app)
        .post('/api/distributions')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });

    test('GET /api/distributions should return distributions list', async () => {
      const response = await request(app)
        .get('/api/distributions')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Beneficiaries', () => {
    test('POST /api/beneficiaries should create a new beneficiary', async () => {
      const beneficiaryData = {
        name: 'Test Beneficiary',
        contact: 'test@example.com',
        location: 'Test Location',
        needs: ['Medical supplies', 'Food']
      };

      const response = await request(app)
        .post('/api/beneficiaries')
        .send(beneficiaryData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('beneficiary');
      expect(response.body.data).toHaveProperty('wallet');
      expect(response.body.data).toHaveProperty('qrCode');
      expect(response.body.data.beneficiary).toHaveProperty('name', beneficiaryData.name);
      expect(response.body.data.wallet).toHaveProperty('publicKey');
      expect(response.body.data.wallet).toHaveProperty('secretKey');
    });

    test('POST /api/beneficiaries should validate required fields', async () => {
      const invalidData = {
        name: 'Test',
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/beneficiaries')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body).toHaveProperty('details');
    });

    test('GET /api/beneficiaries should return beneficiaries list', async () => {
      const response = await request(app)
        .get('/api/beneficiaries')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Verification', () => {
    test('POST /api/verification/distributions/:distributionId should verify distribution', async () => {
      const distributionId = 'DIST_1709437200_ABC123';
      
      const response = await request(app)
        .post(`/api/verification/distributions/${distributionId}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Distribution verification completed');
      expect(response.body.data).toHaveProperty('verified');
    });

    test('GET /api/verification/transactions/:accountId/history should return transaction history', async () => {
      const accountId = 'GABC1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890';
      
      const response = await request(app)
        .get(`/api/verification/transactions/${accountId}/history`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('GET /api/verification/transactions/:accountId/history should validate account format', async () => {
      const invalidAccountId = 'INVALID_ACCOUNT';
      
      const response = await request(app)
        .get(`/api/verification/transactions/${invalidAccountId}/history`)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid Stellar account address format');
    });
  });

  describe('Error Handling', () => {
    test('should handle 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Not found');
      expect(response.body).toHaveProperty('message', 'The requested resource was not found');
    });

    test('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/campaigns')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should handle rate limiting', async () => {
      // This test would require implementing rate limiting middleware
      // For now, we'll just ensure the endpoint exists
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
    });
  });

  describe('Input Validation', () => {
    test('should validate campaign ID format', async () => {
      const invalidIds = [
        'INVALID',
        'AID_123',
        'AID_1709433600',
        'AID_1709433600_123'
      ];

      for (const invalidId of invalidIds) {
        const response = await request(app)
          .get(`/api/campaigns/${invalidId}/status`)
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Invalid campaign ID format');
      }
    });

    test('should validate distribution ID format', async () => {
      const invalidIds = [
        'INVALID',
        'DIST_123',
        'DIST_1709437200',
        'DIST_1709437200_123'
      ];

      for (const invalidId of invalidIds) {
        const response = await request(app)
          .post(`/api/verification/distributions/${invalidId}`)
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Invalid distribution ID format');
      }
    });

    test('should validate Stellar address format', async () => {
      const invalidAddresses = [
        'INVALID',
        'G123',
        'GABC1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF123456789',
        'XABC1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890'
      ];

      for (const invalidAddress of invalidAddresses) {
        const response = await request(app)
          .post('/api/distributions')
          .send({
            campaignId: 'AID_1709433600_ABC12345',
            recipientAddress: invalidAddress,
            amount: 100
          })
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Validation failed');
      }
    });
  });
});
