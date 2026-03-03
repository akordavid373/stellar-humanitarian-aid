import React, { useState, useEffect } from 'react';
import { Send, Plus, Search, Filter, DollarSign, Calendar, User, CheckCircle } from 'lucide-react';
import { apiService } from '../services/api';

export function Distributions() {
  const [distributions, setDistributions] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    campaignId: '',
    recipientAddress: '',
    amount: '',
    memo: ''
  });

  useEffect(() => {
    fetchDistributions();
    fetchCampaigns();
  }, []);

  const fetchDistributions = async () => {
    try {
      // Mock data for now
      const mockDistributions = [
        {
          id: 'DIST_1709437200_ABC123',
          campaignId: 'AID_1709433600_ABC12345',
          campaignTitle: 'Earthquake Relief - Haiti 2024',
          recipientAddress: 'GABC1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890',
          recipientName: 'Jean Pierre',
          amount: 500,
          memo: 'Emergency medical supplies',
          timestamp: '2024-03-03T12:00:00Z',
          status: 'verified',
          transactionHash: 'abc123def4567890123456789012345678901234567890123456789012345678'
        },
        {
          id: 'DIST_1709440800_DEF456',
          campaignId: 'AID_1709437200_DEF67890',
          campaignTitle: 'Famine Relief - East Africa',
          recipientAddress: 'GDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890',
          recipientName: 'Amina Hassan',
          amount: 250,
          memo: 'Food distribution for family of 6',
          timestamp: '2024-03-03T13:00:00Z',
          status: 'pending',
          transactionHash: 'def456abc7890123456789012345678901234567890123456789012345678'
        }
      ];
      setDistributions(mockDistributions);
    } catch (error) {
      console.error('Failed to fetch distributions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      // Mock campaigns for dropdown
      const mockCampaigns = [
        { id: 'AID_1709433600_ABC12345', title: 'Earthquake Relief - Haiti 2024' },
        { id: 'AID_1709437200_DEF67890', title: 'Famine Relief - East Africa' }
      ];
      setCampaigns(mockCampaigns);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.createDistribution(formData);
      setShowCreateForm(false);
      setFormData({
        campaignId: '',
        recipientAddress: '',
        amount: '',
        memo: ''
      });
      fetchDistributions();
    } catch (error) {
      console.error('Failed to create distribution:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      verified: { color: 'status-success', icon: CheckCircle, text: 'Verified' },
      pending: { color: 'status-warning', icon: Clock, text: 'Pending' },
      failed: { color: 'status-error', icon: X, text: 'Failed' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`status-badge ${config.color}`}>
        <Icon size={14} />
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
        <p>Loading distributions...</p>
      </div>
    );
  }

  return (
    <div className="distributions">
      <div className="distributions-header">
        <div>
          <h1>Aid Distributions</h1>
          <p>Track and manage humanitarian aid distributions</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus size={18} />
          New Distribution
        </button>
      </div>

      {/* Create Distribution Modal */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Create New Distribution</h2>
              <button
                className="btn btn-secondary"
                onClick={() => setShowCreateForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="distribution-form">
              <div className="form-group">
                <label htmlFor="campaignId">Campaign</label>
                <select
                  id="campaignId"
                  name="campaignId"
                  value={formData.campaignId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a campaign</option>
                  {campaigns.map(campaign => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="recipientAddress">Recipient Stellar Address</label>
                <input
                  type="text"
                  id="recipientAddress"
                  name="recipientAddress"
                  value={formData.recipientAddress}
                  onChange={handleInputChange}
                  required
                  placeholder="G..."
                  pattern="^G[A-Z0-9]{55}$"
                />
                <small>Format: G followed by 55 alphanumeric characters</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="amount">Amount (XLM)</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    min="0.1"
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="memo">Memo (Optional)</label>
                  <input
                    type="text"
                    id="memo"
                    name="memo"
                    value={formData.memo}
                    onChange={handleInputChange}
                    placeholder="Distribution purpose"
                    maxLength="200"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <Send size={18} />
                  Distribute Aid
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Distributions List */}
      <div className="distributions-list">
        {distributions.map((distribution) => (
          <div key={distribution.id} className="distribution-card">
            <div className="distribution-header">
              <div className="distribution-title">
                <Send size={20} />
                <div>
                  <h3>{distribution.campaignTitle}</h3>
                  <p className="distribution-id">ID: {distribution.id}</p>
                </div>
              </div>
              {getStatusBadge(distribution.status)}
            </div>

            <div className="distribution-details">
              <div className="detail-row">
                <div className="detail-item">
                  <User size={16} />
                  <div>
                    <span className="detail-label">Recipient</span>
                    <span className="detail-value">{distribution.recipientName}</span>
                    <span className="detail-address">{distribution.recipientAddress}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <DollarSign size={16} />
                  <div>
                    <span className="detail-label">Amount</span>
                    <span className="detail-value amount">{distribution.amount} XLM</span>
                  </div>
                </div>

                <div className="detail-item">
                  <Calendar size={16} />
                  <div>
                    <span className="detail-label">Date</span>
                    <span className="detail-value">
                      {new Date(distribution.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {distribution.memo && (
                <div className="distribution-memo">
                  <span className="memo-label">Memo:</span>
                  <span className="memo-text">{distribution.memo}</span>
                </div>
              )}

              {distribution.transactionHash && (
                <div className="transaction-hash">
                  <span className="hash-label">Transaction:</span>
                  <code className="hash-value">
                    {distribution.transactionHash.substring(0, 20)}...
                  </code>
                </div>
              )}
            </div>

            <div className="distribution-actions">
              <button className="btn btn-secondary btn-sm">
                View Details
              </button>
              <button className="btn btn-secondary btn-sm">
                Verify Transaction
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="distributions-summary">
        <h2>Distribution Summary</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{distributions.length}</h3>
            <p>Total Distributions</p>
          </div>
          <div className="stat-card">
            <h3>
              {distributions.reduce((sum, d) => sum + d.amount, 0).toLocaleString()} XLM
            </h3>
            <p>Total Amount Distributed</p>
          </div>
          <div className="stat-card">
            <h3>
              {distributions.filter(d => d.status === 'verified').length}
            </h3>
            <p>Verified Distributions</p>
          </div>
          <div className="stat-card">
            <h3>
              {distributions.filter(d => d.status === 'pending').length}
            </h3>
            <p>Pending Distributions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
