import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log('API Request:', config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log('API Response:', response.status, response.config.url);
        return response;
      },
      (error) => {
        console.error('Response error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Campaigns
  async createCampaign(campaignData) {
    const response = await this.client.post('/campaigns', campaignData);
    return response.data;
  }

  async getCampaignStatus(campaignId) {
    const response = await this.client.get(`/campaigns/${campaignId}/status`);
    return response.data;
  }

  async listCampaigns() {
    const response = await this.client.get('/campaigns');
    return response.data;
  }

  // Distributions
  async createDistribution(distributionData) {
    const response = await this.client.post('/distributions', distributionData);
    return response.data;
  }

  async getDistributions(campaignId) {
    const params = campaignId ? { campaignId } : {};
    const response = await this.client.get('/distributions', { params });
    return response.data;
  }

  async getDistribution(distributionId) {
    const response = await this.client.get(`/distributions/${distributionId}`);
    return response.data;
  }

  // Beneficiaries
  async createBeneficiary(beneficiaryData) {
    const response = await this.client.post('/beneficiaries', beneficiaryData);
    return response.data;
  }

  async getBeneficiaries() {
    const response = await this.client.get('/beneficiaries');
    return response.data;
  }

  async getBeneficiary(beneficiaryId) {
    const response = await this.client.get(`/beneficiaries/${beneficiaryId}`);
    return response.data;
  }

  // Verification
  async verifyDistribution(distributionId) {
    const response = await this.client.post(`/verification/distributions/${distributionId}`);
    return response.data;
  }

  async getTransactionHistory(accountId, limit = 10) {
    const response = await this.client.get(`/verification/transactions/${accountId}/history`, {
      params: { limit }
    });
    return response.data;
  }

  async verifyTransaction(transactionHash) {
    const response = await this.client.post(`/verification/transactions/${transactionHash}`);
    return response.data;
  }

  // Health Check
  async healthCheck() {
    const response = await this.client.get('/health');
    return response.data;
  }

  async detailedHealthCheck() {
    const response = await this.client.get('/health/detailed');
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
