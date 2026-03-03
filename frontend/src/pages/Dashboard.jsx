import React, { useState, useEffect } from 'react';
import { Activity, Heart, Users, Send, TrendingUp, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';

export function Dashboard() {
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalDistributions: 0,
    totalBeneficiaries: 0,
    totalAmount: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data for now - would fetch from API
      const mockStats = {
        totalCampaigns: 12,
        totalDistributions: 156,
        totalBeneficiaries: 89,
        totalAmount: 45678.50
      };

      const mockActivity = [
        {
          id: 1,
          type: 'distribution',
          description: 'Emergency aid sent to Haiti earthquake victims',
          amount: 500,
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString()
        },
        {
          id: 2,
          type: 'campaign',
          description: 'New campaign: Flood Relief - Southeast Asia',
          amount: 25000,
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString()
        },
        {
          id: 3,
          type: 'beneficiary',
          description: 'New beneficiary registered: Marie Dubois',
          amount: 0,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
        }
      ];

      setStats(mockStats);
      setRecentActivity(mockActivity);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Emergency Aid Dashboard</h1>
        <p>Real-time overview of humanitarian assistance operations</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Heart size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalCampaigns}</h3>
            <p>Active Campaigns</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Send size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalDistributions}</h3>
            <p>Total Distributions</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalBeneficiaries}</h3>
            <p>Beneficiaries Helped</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalAmount.toLocaleString()} XLM</h3>
            <p>Total Aid Distributed</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {activity.type === 'distribution' && <Send size={16} />}
                {activity.type === 'campaign' && <Heart size={16} />}
                {activity.type === 'beneficiary' && <Users size={16} />}
              </div>
              <div className="activity-content">
                <p className="activity-description">{activity.description}</p>
                <div className="activity-meta">
                  <span className="activity-time">
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                  {activity.amount > 0 && (
                    <span className="activity-amount">
                      {activity.amount} XLM
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="btn btn-primary">
            <Heart size={18} />
            Create Campaign
          </button>
          <button className="btn btn-secondary">
            <Users size={18} />
            Register Beneficiary
          </button>
          <button className="btn btn-secondary">
            <Send size={18} />
            Distribute Aid
          </button>
        </div>
      </div>

      {/* Alerts */}
      <div className="alerts-section">
        <h2>System Alerts</h2>
        <div className="alert-item">
          <AlertCircle size={16} />
          <div>
            <strong>High Priority:</strong> 3 campaigns require immediate attention
          </div>
        </div>
      </div>
    </div>
  );
}
