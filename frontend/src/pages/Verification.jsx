import React, { useState, useEffect } from 'react';
import { Shield, Search, CheckCircle, XCircle, Clock, ExternalLink, Copy, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';

export function Verification() {
  const [verificationResults, setVerificationResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('distribution');
  const [formData, setFormData] = useState({
    distributionId: '',
    transactionHash: '',
    accountId: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const verifyDistribution = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await apiService.verifyDistribution(formData.distributionId);
      setVerificationResults([result]);
    } catch (error) {
      console.error('Failed to verify distribution:', error);
      setVerificationResults([{
        error: true,
        message: error.message
      }]);
    } finally {
      setLoading(false);
    }
  };

  const verifyTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await apiService.verifyTransaction(formData.transactionHash);
      setVerificationResults([result]);
    } catch (error) {
      console.error('Failed to verify transaction:', error);
      setVerificationResults([{
        error: true,
        message: error.message
      }]);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionHistory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await apiService.getTransactionHistory(formData.accountId);
      setVerificationResults(Array.isArray(result.data) ? result.data : [result]);
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      setVerificationResults([{
        error: true,
        message: error.message
      }]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Show toast notification (implementation needed)
  };

  const getStatusIcon = (verified) => {
    if (verified === true) {
      return <CheckCircle size={20} className="status-success" />;
    } else if (verified === false) {
      return <XCircle size={20} className="status-error" />;
    } else {
      return <Clock size={20} className="status-warning" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatAmount = (amount) => {
    return parseFloat(amount).toLocaleString() + ' XLM';
  };

  return (
    <div className="verification">
      <div className="verification-header">
        <div>
          <h1>Verification Center</h1>
          <p>Verify and track aid distributions and transactions</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'distribution' ? 'active' : ''}`}
          onClick={() => setActiveTab('distribution')}
        >
          <Shield size={18} />
          Verify Distribution
        </button>
        <button
          className={`tab-button ${activeTab === 'transaction' ? 'active' : ''}`}
          onClick={() => setActiveTab('transaction')}
        >
          <Search size={18} />
          Verify Transaction
        </button>
        <button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <Clock size={18} />
          Transaction History
        </button>
      </div>

      {/* Verification Forms */}
      <div className="verification-content">
        {activeTab === 'distribution' && (
          <div className="verification-form">
            <h2>Verify Aid Distribution</h2>
            <form onSubmit={verifyDistribution}>
              <div className="form-group">
                <label htmlFor="distributionId">Distribution ID</label>
                <input
                  type="text"
                  id="distributionId"
                  name="distributionId"
                  value={formData.distributionId}
                  onChange={handleInputChange}
                  required
                  placeholder="DIST_1709437200_ABC123"
                  pattern="^DIST_\d+_[A-F0-9]{6}$"
                />
                <small>Format: DIST_timestamp_hash</small>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Shield size={18} />
                {loading ? 'Verifying...' : 'Verify Distribution'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'transaction' && (
          <div className="verification-form">
            <h2>Verify Transaction</h2>
            <form onSubmit={verifyTransaction}>
              <div className="form-group">
                <label htmlFor="transactionHash">Transaction Hash</label>
                <input
                  type="text"
                  id="transactionHash"
                  name="transactionHash"
                  value={formData.transactionHash}
                  onChange={handleInputChange}
                  required
                  placeholder="abc123def4567890123456789012345678901234567890123456789012345678"
                  pattern="^[a-f0-9]{64}$"
                />
                <small>64-character hexadecimal hash</small>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Search size={18} />
                {loading ? 'Verifying...' : 'Verify Transaction'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="verification-form">
            <h2>Transaction History</h2>
            <form onSubmit={getTransactionHistory}>
              <div className="form-group">
                <label htmlFor="accountId">Stellar Account Address</label>
                <input
                  type="text"
                  id="accountId"
                  name="accountId"
                  value={formData.accountId}
                  onChange={handleInputChange}
                  required
                  placeholder="GABC1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890"
                  pattern="^G[A-Z0-9]{55}$"
                />
                <small>Format: G followed by 55 alphanumeric characters</small>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Clock size={18} />
                {loading ? 'Loading...' : 'Get Transaction History'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Verification Results */}
      {verificationResults.length > 0 && (
        <div className="verification-results">
          <h2>Verification Results</h2>
          {verificationResults.map((result, index) => (
            <div key={index} className="result-card">
              {result.error ? (
                <div className="error-result">
                  <XCircle size={24} className="status-error" />
                  <div>
                    <h3>Verification Failed</h3>
                    <p>{result.message}</p>
                  </div>
                </div>
              ) : result.verified !== undefined ? (
                <div className="distribution-result">
                  <div className="result-header">
                    {getStatusIcon(result.verified)}
                    <div>
                      <h3>
                        Distribution {result.verified ? 'Verified' : 'Not Verified'}
                      </h3>
                      <p>Verification completed at {formatTimestamp(result.verifiedAt)}</p>
                    </div>
                  </div>
                  
                  {result.distribution && (
                    <div className="distribution-details">
                      <div className="detail-row">
                        <div className="detail-item">
                          <span className="detail-label">Distribution ID:</span>
                          <code>{result.distribution.distributionId}</code>
                          <button
                            className="btn-icon"
                            onClick={() => copyToClipboard(result.distribution.distributionId)}
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Campaign ID:</span>
                          <code>{result.distribution.campaignId}</code>
                        </div>
                      </div>
                      
                      <div className="detail-row">
                        <div className="detail-item">
                          <span className="detail-label">Recipient:</span>
                          <code>{result.distribution.recipient}</code>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Amount:</span>
                          <span className="amount">{formatAmount(result.distribution.amount)}</span>
                        </div>
                      </div>
                      
                      <div className="detail-row">
                        <div className="detail-item">
                          <span className="detail-label">Timestamp:</span>
                          <span>{formatTimestamp(result.distribution.timestamp)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Memo:</span>
                          <span>{result.distribution.memo || 'No memo'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {result.transaction && (
                    <div className="transaction-details">
                      <h4>Blockchain Transaction</h4>
                      <div className="detail-item">
                        <span className="detail-label">Transaction Hash:</span>
                        <code>{result.transaction.hash}</code>
                        <button
                          className="btn-icon"
                          onClick={() => copyToClipboard(result.transaction.hash)}
                        >
                          <Copy size={14} />
                        </button>
                        <a
                          href={`https://stellar.expert/explorer/testnet/tx/${result.transaction.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-icon"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                      <div className="detail-row">
                        <div className="detail-item">
                          <span className="detail-label">Created:</span>
                          <span>{formatTimestamp(result.transaction.created_at)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Status:</span>
                          <span className={`status-badge ${result.transaction.successful ? 'status-success' : 'status-error'}`}>
                            {result.transaction.successful ? 'Success' : 'Failed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : Array.isArray(result) ? (
                <div className="history-result">
                  <h3>Transaction History</h3>
                  <div className="transaction-list">
                    {result.map((tx, txIndex) => (
                      <div key={txIndex} className="transaction-item">
                        <div className="transaction-header">
                          {getStatusIcon(tx.successful)}
                          <div>
                            <code className="transaction-hash">
                              {tx.hash.substring(0, 20)}...
                            </code>
                            <span className="transaction-date">
                              {formatTimestamp(tx.created_at)}
                            </span>
                          </div>
                        </div>
                        <div className="transaction-meta">
                          <span className={`status-badge ${tx.successful ? 'status-success' : 'status-error'}`}>
                            {tx.successful ? 'Success' : 'Failed'}
                          </span>
                          <span className="operation-count">
                            {tx.operations?.length || 0} operations
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="info-result">
                  <AlertCircle size={24} className="status-info" />
                  <div>
                    <h3>Verification Result</h3>
                    <p>{result.message || 'Verification completed'}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Help Section */}
      <div className="verification-help">
        <h2>Verification Information</h2>
        <div className="help-grid">
          <div className="help-card">
            <h3>📋 Distribution Verification</h3>
            <p>Verify that aid distributions have been properly recorded on the Stellar blockchain. Enter the distribution ID to check its status and transaction details.</p>
          </div>
          <div className="help-card">
            <h3>🔗 Transaction Verification</h3>
            <p>Verify individual Stellar transactions by providing the 64-character transaction hash. This confirms the transaction exists and was processed correctly.</p>
          </div>
          <div className="help-card">
            <h3>📊 Transaction History</h3>
            <p>View the complete transaction history for any Stellar account address. This helps track all aid flows and ensure transparency.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
