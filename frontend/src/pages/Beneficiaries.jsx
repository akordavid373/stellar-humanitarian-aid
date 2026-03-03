import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, MapPin, Phone, Mail, QrCode, Download, Eye } from 'lucide-react';
import { apiService } from '../services/api';

export function Beneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    location: '',
    needs: []
  });

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      // Mock data for now
      const mockBeneficiaries = [
        {
          id: 'BEN_1709433600_ABC123',
          name: 'Jean Pierre',
          contact: 'jean.pierre@email.com',
          location: 'Port-au-Prince, Haiti',
          needs: ['Medical supplies', 'Food', 'Shelter'],
          createdAt: '2024-03-03T10:00:00Z',
          status: 'registered',
          wallet: {
            publicKey: 'GABC1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890'
          },
          totalReceived: 1250.50
        },
        {
          id: 'BEN_1709437200_DEF456',
          name: 'Amina Hassan',
          contact: '+254 712 345 678',
          location: 'Nairobi, Kenya',
          needs: ['Food', 'Clean water'],
          createdAt: '2024-03-03T11:00:00Z',
          status: 'registered',
          wallet: {
            publicKey: 'GDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890'
          },
          totalReceived: 750.00
        }
      ];
      setBeneficiaries(mockBeneficiaries);
    } catch (error) {
      console.error('Failed to fetch beneficiaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.createBeneficiary(formData);
      setShowCreateForm(false);
      setFormData({
        name: '',
        contact: '',
        location: '',
        needs: []
      });
      fetchBeneficiaries();
    } catch (error) {
      console.error('Failed to create beneficiary:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNeedsChange = (need) => {
    setFormData(prev => ({
      ...prev,
      needs: prev.needs.includes(need)
        ? prev.needs.filter(n => n !== need)
        : [...prev.needs, need]
    }));
  };

  const showQRCode = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setShowQRModal(true);
  };

  const downloadQRCode = () => {
    // Mock download functionality
    alert('QR Code download functionality would be implemented here');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
        <p>Loading beneficiaries...</p>
      </div>
    );
  }

  const availableNeeds = ['Medical supplies', 'Food', 'Shelter', 'Clean water', 'Education', 'Clothing'];

  return (
    <div className="beneficiaries">
      <div className="beneficiaries-header">
        <div>
          <h1>Beneficiaries</h1>
          <p>Manage aid recipients and their digital wallets</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus size={18} />
          Register Beneficiary
        </button>
      </div>

      {/* Create Beneficiary Modal */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Register New Beneficiary</h2>
              <button
                className="btn btn-secondary"
                onClick={() => setShowCreateForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="beneficiary-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter beneficiary's full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact">Contact Information</label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                  placeholder="Email address or phone number"
                />
              </div>

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
                <label>Needs (Select all that apply)</label>
                <div className="needs-grid">
                  {availableNeeds.map(need => (
                    <label key={need} className="need-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.needs.includes(need)}
                        onChange={() => handleNeedsChange(need)}
                      />
                      <span>{need}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <Users size={18} />
                  Register Beneficiary
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

      {/* QR Code Modal */}
      {showQRModal && selectedBeneficiary && (
        <div className="modal-overlay">
          <div className="modal qr-modal">
            <div className="modal-header">
              <h2>Beneficiary Wallet QR Code</h2>
              <button
                className="btn btn-secondary"
                onClick={() => setShowQRModal(false)}
              >
                ×
              </button>
            </div>
            <div className="qr-content">
              <div className="beneficiary-info">
                <h3>{selectedBeneficiary.name}</h3>
                <p>{selectedBeneficiary.location}</p>
              </div>
              
              <div className="qr-code-placeholder">
                <QrCode size={200} />
                <p>QR Code would be generated here</p>
                <small>Contains wallet address and beneficiary ID</small>
              </div>

              <div className="wallet-details">
                <h4>Wallet Information</h4>
                <div className="wallet-info">
                  <label>Public Key:</label>
                  <code>{selectedBeneficiary.wallet.publicKey}</code>
                </div>
                <div className="wallet-info">
                  <label>Beneficiary ID:</label>
                  <code>{selectedBeneficiary.id}</code>
                </div>
              </div>

              <div className="qr-actions">
                <button className="btn btn-primary" onClick={downloadQRCode}>
                  <Download size={18} />
                  Download QR Code
                </button>
                <button className="btn btn-secondary">
                  <Eye size={18} />
                  Print QR Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Beneficiaries List */}
      <div className="beneficiaries-list">
        {beneficiaries.map((beneficiary) => (
          <div key={beneficiary.id} className="beneficiary-card">
            <div className="beneficiary-header">
              <div className="beneficiary-title">
                <Users size={20} />
                <div>
                  <h3>{beneficiary.name}</h3>
                  <p className="beneficiary-id">ID: {beneficiary.id}</p>
                </div>
              </div>
              <span className="status-badge status-success">Active</span>
            </div>

            <div className="beneficiary-details">
              <div className="detail-row">
                <div className="detail-item">
                  <Mail size={16} />
                  <div>
                    <span className="detail-label">Contact</span>
                    <span className="detail-value">{beneficiary.contact}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <MapPin size={16} />
                  <div>
                    <span className="detail-label">Location</span>
                    <span className="detail-value">{beneficiary.location}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <Users size={16} />
                  <div>
                    <span className="detail-label">Total Received</span>
                    <span className="detail-value amount">{beneficiary.totalReceived} XLM</span>
                  </div>
                </div>
              </div>

              <div className="beneficiary-needs">
                <span className="needs-label">Needs:</span>
                <div className="needs-tags">
                  {beneficiary.needs.map((need, index) => (
                    <span key={index} className="need-tag">
                      {need}
                    </span>
                  ))}
                </div>
              </div>

              <div className="wallet-info">
                <span className="wallet-label">Wallet:</span>
                <code className="wallet-address">
                  {beneficiary.wallet.publicKey.substring(0, 20)}...
                </code>
              </div>
            </div>

            <div className="beneficiary-actions">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => showQRCode(beneficiary)}
              >
                <QrCode size={16} />
                Show QR Code
              </button>
              <button className="btn btn-secondary btn-sm">
                View Details
              </button>
              <button className="btn btn-secondary btn-sm">
                Send Aid
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="beneficiaries-summary">
        <h2>Beneficiary Summary</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{beneficiaries.length}</h3>
            <p>Total Beneficiaries</p>
          </div>
          <div className="stat-card">
            <h3>
              {beneficiaries.reduce((sum, b) => sum + b.totalReceived, 0).toLocaleString()} XLM
            </h3>
            <p>Total Aid Received</p>
          </div>
          <div className="stat-card">
            <h3>
              {new Set(beneficiaries.flatMap(b => b.needs)).size}
            </h3>
            <p>Unique Need Categories</p>
          </div>
          <div className="stat-card">
            <h3>
              {new Set(beneficiaries.map(b => b.location.split(',')[1]?.trim())).size}
            </h3>
            <p>Countries Served</p>
          </div>
        </div>
      </div>
    </div>
  );
}
