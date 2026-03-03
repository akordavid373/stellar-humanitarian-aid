# Stellar Aid Network API Documentation

## Overview

The Stellar Aid Network API provides endpoints for managing emergency aid campaigns, distributions, beneficiaries, and verification on the Stellar blockchain.

## Base URL

```
Development: http://localhost:3001/api
Production: https://your-domain.com/api
```

## Authentication

Currently, the API does not require authentication for basic operations. In production, implement proper authentication and authorization.

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

Error responses:
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Rate Limiting

API endpoints are rate-limited to 100 requests per 15 minutes per IP address.

## Endpoints

### Health Check

#### GET /health
Basic health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-03-03T12:00:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "version": "1.0.0"
}
```

#### GET /health/detailed
Detailed health check with service status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-03-03T12:00:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "version": "1.0.0",
  "services": {
    "stellar": "healthy",
    "database": "not_configured",
    "redis": "not_configured"
  },
  "endpoints": {
    "api": "operational",
    "stellar": "https://horizon-testnet.stellar.org"
  }
}
```

## Campaigns

### POST /campaigns
Create a new emergency aid campaign.

**Request Body:**
```json
{
  "title": "Earthquake Relief - Haiti 2024",
  "description": "Emergency medical supplies and shelter for earthquake victims",
  "targetAmount": 50000,
  "category": "medical",
  "location": "Port-au-Prince, Haiti",
  "urgency": "critical"
}
```

**Fields:**
- `title` (string, required): Campaign title (3-100 chars)
- `description` (string, required): Campaign description (10-1000 chars)
- `targetAmount` (number, required): Target amount in XLM (min: 1)
- `category` (string, required): One of: medical, food, shelter, water, general
- `location` (string, required): Location (3-100 chars)
- `urgency` (string, required): One of: critical, high, medium, low

**Response:**
```json
{
  "success": true,
  "message": "Campaign created successfully",
  "data": {
    "success": true,
    "campaignId": "AID_1709433600_ABC12345",
    "transactionHash": "abc123...",
    "campaign": {
      "campaignId": "AID_1709433600_ABC12345",
      "title": "Earthquake Relief - Haiti 2024",
      "description": "Emergency medical supplies...",
      "targetAmount": 50000,
      "category": "medical",
      "location": "Port-au-Prince, Haiti",
      "urgency": "critical",
      "createdAt": 1709433600000,
      "status": "active"
    },
    "depositAddress": "GABC1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890"
  }
}
```

### GET /campaigns/:campaignId/status
Get campaign status and progress.

**Path Parameters:**
- `campaignId` (string): Campaign ID in format `AID_timestamp_hash`

**Response:**
```json
{
  "success": true,
  "data": {
    "campaign": {
      "campaignId": "AID_1709433600_ABC12345",
      "title": "Earthquake Relief - Haiti 2024",
      "targetAmount": 50000,
      "status": "active"
    },
    "distributions": [
      {
        "distributionId": "DIST_1709437200_ABC123",
        "campaignId": "AID_1709433600_ABC12345",
        "recipient": "GDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
        "amount": "500",
        "timestamp": 1709437200000,
        "memo": "Emergency medical supplies"
      }
    ],
    "totalDistributed": 12500,
    "remaining": 37500,
    "progress": 25
  }
}
```

### GET /campaigns
List all campaigns (placeholder - requires database integration).

**Response:**
```json
{
  "success": true,
  "message": "Campaign listing not implemented yet - would require database integration",
  "data": []
}
```

## Distributions

### POST /distributions
Create a new aid distribution.

**Request Body:**
```json
{
  "campaignId": "AID_1709433600_ABC12345",
  "recipientAddress": "GDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
  "amount": 500,
  "memo": "Emergency medical supplies"
}
```

**Fields:**
- `campaignId` (string, required): Campaign ID
- `recipientAddress` (string, required): Stellar address (G followed by 55 chars)
- `amount` (number, required): Amount in XLM (min: 0.1)
- `memo` (string, optional): Distribution memo (max 200 chars)

**Response:**
```json
{
  "success": true,
  "message": "Aid distributed successfully",
  "data": {
    "success": true,
    "distributionId": "DIST_1709437200_ABC123",
    "transactionHash": "def456...",
    "recipient": "GDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
    "amount": "500",
    "campaignId": "AID_1709433600_ABC12345",
    "distributedAt": 1709437200000
  }
}
```

### GET /distributions
List distributions with optional campaign filter.

**Query Parameters:**
- `campaignId` (string, optional): Filter by campaign ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "distributionId": "DIST_1709437200_ABC123",
      "campaignId": "AID_1709433600_ABC12345",
      "recipient": "GDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
      "amount": "500",
      "timestamp": 1709437200000,
      "memo": "Emergency medical supplies"
    }
  ]
}
```

### GET /distributions/:distributionId
Get specific distribution details.

**Path Parameters:**
- `distributionId` (string): Distribution ID in format `DIST_timestamp_hash`

**Response:**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "distribution": {
      "distributionId": "DIST_1709437200_ABC123",
      "campaignId": "AID_1709433600_ABC12345",
      "recipient": "GDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
      "amount": "500",
      "timestamp": 1709437200000,
      "memo": "Emergency medical supplies"
    },
    "transaction": {
      "hash": "def456...",
      "created_at": "2024-03-03T12:00:00Z",
      "successful": true,
      "source_account": "GABC1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
      "memo": "AID Distribution: DIST_1709437200_ABC123"
    },
    "verifiedAt": 1709437260000
  }
}
```

## Beneficiaries

### POST /beneficiaries
Register a new beneficiary and create their wallet.

**Request Body:**
```json
{
  "name": "Jean Pierre",
  "contact": "jean.pierre@email.com",
  "location": "Port-au-Prince, Haiti",
  "needs": ["Medical supplies", "Food", "Shelter"]
}
```

**Fields:**
- `name` (string, required): Beneficiary name (2-100 chars)
- `contact` (string, required): Email or phone (5-200 chars)
- `location` (string, required): Location (3-100 chars)
- `needs` (array, optional): Array of needs

**Response:**
```json
{
  "success": true,
  "message": "Beneficiary wallet created successfully",
  "data": {
    "success": true,
    "beneficiary": {
      "beneficiaryId": "BEN_1709433600_ABC123",
      "publicKey": "GDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
      "name": "Jean Pierre",
      "contact": "jean.pierre@email.com",
      "location": "Port-au-Prince, Haiti",
      "needs": ["Medical supplies", "Food", "Shelter"],
      "createdAt": 1709433600000,
      "status": "registered"
    },
    "wallet": {
      "publicKey": "GDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
      "secretKey": "SABC1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABC123"
    },
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "instructions": "Save this QR code and secret key securely. This wallet can receive aid directly."
  }
}
```

### GET /beneficiaries
List all beneficiaries (placeholder - requires database integration).

**Response:**
```json
{
  "success": true,
  "message": "Beneficiary listing not implemented yet - would require database integration",
  "data": []
}
```

### GET /beneficiaries/:beneficiaryId
Get specific beneficiary details.

**Path Parameters:**
- `beneficiaryId` (string): Beneficiary ID in format `BEN_timestamp_hash`

**Response:**
```json
{
  "success": true,
  "message": "Beneficiary details not implemented yet - would require database integration",
  "data": {
    "beneficiaryId": "BEN_1709433600_ABC123"
  }
}
```

## Verification

### POST /verification/distributions/:distributionId
Verify a specific distribution.

**Path Parameters:**
- `distributionId` (string): Distribution ID to verify

**Response:**
```json
{
  "success": true,
  "message": "Distribution verification completed",
  "data": {
    "verified": true,
    "distribution": {
      "distributionId": "DIST_1709437200_ABC123",
      "campaignId": "AID_1709433600_ABC12345",
      "recipient": "GDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
      "amount": "500",
      "timestamp": 1709437200000,
      "memo": "Emergency medical supplies"
    },
    "transaction": {
      "hash": "def456...",
      "created_at": "2024-03-03T12:00:00Z",
      "successful": true,
      "source_account": "GABC1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
      "memo": "AID Distribution: DIST_1709437200_ABC123"
    },
    "verifiedAt": 1709437260000
  }
}
```

### GET /verification/transactions/:accountId/history
Get transaction history for an account.

**Path Parameters:**
- `accountId` (string): Stellar account address

**Query Parameters:**
- `limit` (number, optional): Number of transactions to return (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "hash": "def456...",
      "created_at": "2024-03-03T12:00:00Z",
      "successful": true,
      "sourceAccount": "GABC1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
      "memo": "AID Distribution: DIST_1709437200_ABC123",
      "operations": [
        {
          "type": "payment",
          "amount": "500.0000000"
        }
      ]
    }
  ]
}
```

### POST /verification/transactions/:transactionHash
Verify a specific transaction.

**Path Parameters:**
- `transactionHash` (string): 64-character hexadecimal transaction hash

**Response:**
```json
{
  "success": true,
  "message": "Transaction verification not implemented yet",
  "data": {
    "transactionHash": "def456..."
  }
}
```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## SDK Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 30000
});

// Create campaign
const campaign = await api.post('/campaigns', {
  title: 'Emergency Relief Fund',
  description: 'Emergency medical supplies',
  targetAmount: 10000,
  category: 'medical',
  location: 'Crisis Zone',
  urgency: 'critical'
});

// Create distribution
const distribution = await api.post('/distributions', {
  campaignId: 'AID_1709433600_ABC12345',
  recipientAddress: 'GDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890',
  amount: 500,
  memo: 'Emergency aid'
});
```

### Python

```python
import requests

base_url = 'http://localhost:3001/api'

# Create campaign
campaign = requests.post(f'{base_url}/campaigns', json={
    'title': 'Emergency Relief Fund',
    'description': 'Emergency medical supplies',
    'targetAmount': 10000,
    'category': 'medical',
    'location': 'Crisis Zone',
    'urgency': 'critical'
})

# Create distribution
distribution = requests.post(f'{base_url}/distributions', json={
    'campaignId': 'AID_1709433600_ABC12345',
    'recipientAddress': 'GDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890',
    'amount': 500,
    'memo': 'Emergency aid'
})
```

## Testing

Use the provided test endpoints to verify API functionality:

```bash
# Health check
curl http://localhost:3001/api/health

# Create campaign
curl -X POST http://localhost:3001/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Campaign","description":"Test","targetAmount":1000,"category":"medical","location":"Test","urgency":"medium"}'
```

## Support

For API support and questions:
- GitHub Issues: [Create an issue](https://github.com/akordavid373/stellar-humanitarian-aid/issues)
- Documentation: [API Reference](https://github.com/akordavid373/stellar-humanitarian-aid/blob/main/docs/API.md)
