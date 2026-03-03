import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Heart, MapPin, Clock, DollarSign } from 'lucide-react';
import { apiService } from '../services/api';

export function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    category: 'general',
    location: '',
    urgency: 'medium'
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      // Mock data for now
      const mockCampaigns = [
        {
          id: 'AID_1709433600_ABC12345',
          title: 'Earthquake Relief - Haiti 2024',
          description: 'Emergency medical supplies and shelter for earthquake victims in Port-au-Prince region',
          targetAmount: 50000,
          category: 'medical',
          location: 'Port-au-Prince, Haiti',
          urgency: 'critical',
          status: 'active',
          createdAt: '2024-03-03T10:00:00Z',
          progress: 65
        },
        {
          id: 'AID_1709437200_DEF67890',
          title: 'Famine Relief - East Africa',
          description: 'Emergency food distribution for drought-affected communities',
          targetAmount: 75000,
          category: 'food',
          location: 'East Africa Region',
          urgency: 'high',
          status: 'active',
          createdAt: '2024-03-03T11:00:00Z',
          progress: 42
        }
      ];
      setCampaigns(mockCampaigns);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.createCampaign(formData);
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        targetAmount: '',
        category: 'general',
        location: '',
        urgency: 'medium'
      });
      fetchCampaigns();
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
        <p>Loading campaigns...</p>
      </div>
    );
  }

  return (
    <div className="campaigns">
      <div className="campaigns-header">
        <div>
          <h1>Emergency Campaigns</h1>
          <p>Manage humanitarian aid campaigns</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus size={18} />
          New Campaign
        </button>
      </div>

      {/* Create Campaign Modal */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Create Emergency Campaign</h2>
              <button
                className="btn btn-secondary"
                onClick={() => setShowCreateForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="campaign-form">
              <div className="form-group">
                <label htmlFor="title">Campaign Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Earthquake Relief Fund"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe the emergency situation and aid needed"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="targetAmount">Target Amount (XLM)</label>
                  <input
                    type="number"
                    id="targetAmount"
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleInputChange}
                    required
                    min="1"
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="medical">Medical Emergency</option>
                    <option value="food">Food Security</option>
                    <option value="shelter">Shelter & Housing</option>
                    <option value="water">Clean Water</option>
                    <option value="general">General Relief</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="City, Country"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="urgency">Urgency Level</label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="critical">Critical - Immediate</option>
                    <option value="high">High - Within 24 hours</option>
                    <option value="medium">Medium - Within 3 days</option>
                    <option value="low">Low - Within 1 week</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Create Campaign
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

      {/* Campaigns List */}
      <div className="campaigns-list">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="campaign-card">
            <div className="campaign-header">
              <div className="campaign-title">
                <Heart size={20} />
                <h3>{campaign.title}</h3>
              </div>
              <span className={`urgency-badge urgency-${campaign.urgency}`}>
                {campaign.urgency}
              </span>
            </div>

            <p className="campaign-description">{campaign.description}</p>

            <div className="campaign-meta">
              <div className="meta-item">
                <MapPin size={16} />
                <span>{campaign.location}</span>
              </div>
              <div className="meta-item">
                <Clock size={16} />
                <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="meta-item">
                <DollarSign size={16} />
                <span>{campaign.targetAmount.toLocaleString()} XLM</span>
              </div>
            </div>

            <div className="campaign-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${campaign.progress}%` }}
                ></div>
              </div>
              <span className="progress-text">{campaign.progress}% Complete</span>
            </div>

            <div className="campaign-actions">
              <button className="btn btn-primary btn-sm">
                View Details
              </button>
              <button className="btn btn-secondary btn-sm">
                Distribute Aid
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
