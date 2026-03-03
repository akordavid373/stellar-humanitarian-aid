#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting deployment process for Stellar Aid Network...\n');

// Check if required directories exist
const requiredDirs = ['backend', 'frontend', 'contracts'];
for (const dir of requiredDirs) {
    if (!fs.existsSync(dir)) {
        console.error(`❌ Required directory '${dir}' not found`);
        process.exit(1);
    }
}

console.log('✅ All required directories found');

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Root dependencies installed');
    
    execSync('cd backend && npm install', { stdio: 'inherit' });
    console.log('✅ Backend dependencies installed');
    
    execSync('cd frontend && npm install', { stdio: 'inherit' });
    console.log('✅ Frontend dependencies installed');
} catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
}

// Build frontend
console.log('\n🏗️ Building frontend...');
try {
    execSync('cd frontend && npm run build', { stdio: 'inherit' });
    console.log('✅ Frontend built successfully');
} catch (error) {
    console.error('❌ Failed to build frontend:', error.message);
    process.exit(1);
}

// Run tests
console.log('\n🧪 Running tests...');
try {
    execSync('npm test', { stdio: 'inherit' });
    console.log('✅ All tests passed');
} catch (error) {
    console.warn('⚠️ Some tests failed, but continuing deployment');
}

// Create production environment file
console.log('\n📝 Creating production environment file...');
const envExample = fs.readFileSync('.env.example', 'utf8');
const envProd = envExample
    .replace('testnet', 'mainnet')
    .replace('development', 'production')
    .replace('localhost:3000', 'your-production-domain.com');

fs.writeFileSync('.env', envProd);
console.log('✅ Production environment file created');

// Create deployment documentation
console.log('\n📚 Creating deployment documentation...');
const deployDoc = `# Deployment Instructions

## Prerequisites
- Node.js 16.0.0 or higher
- Docker and Docker Compose (optional)
- Stellar mainnet account with sufficient XLM
- Domain name (optional)

## Environment Setup
1. Copy \`.env.example\` to \`.env\`
2. Update the following variables:
   - \`STELLAR_NETWORK=mainnet\`
   - \`AID_DISTRIBUTION_ACCOUNT\` - Your mainnet account
   - \`AID_DISTRIBUTION_SECRET\` - Your mainnet secret key
   - \`NODE_ENV=production\`
   - \`FRONTEND_URL\` - Your production domain

## Deployment Options

### Option 1: Direct Deployment
\`\`\`bash
# Install dependencies
npm run install:all

# Build frontend
npm run build:frontend

# Start production server
npm start
\`\`\`

### Option 2: Docker Deployment
\`\`\`bash
# Build Docker image
docker build -t stellar-aid-network .

# Run container
docker run -d \\
  --name stellar-aid-network \\
  -p 3001:3001 \\
  --env-file .env \\
  stellar-aid-network
\`\`\`

### Option 3: Docker Compose
\`\`\`bash
# Create docker-compose.yml
cat > docker-compose.yml << EOF
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3001:3001"
    env_file:
      - .env
    restart: unless-stopped
EOF

# Deploy
docker-compose up -d
\`\`\`

## Post-Deployment
1. Configure reverse proxy (nginx/Apache)
2. Set up SSL certificates
3. Configure monitoring and logging
4. Set up backup procedures
5. Test all functionality

## Monitoring
- Health check: \`GET /api/health\`
- Detailed health: \`GET /api/health/detailed\`
- Logs: Check application logs for errors

## Security Considerations
- Use environment variables for secrets
- Enable rate limiting
- Set up firewall rules
- Regular security updates
- Monitor for suspicious activity
`;

fs.writeFileSync('DEPLOYMENT.md', deployDoc);
console.log('✅ Deployment documentation created');

console.log('\n🎉 Deployment preparation completed!');
console.log('\n📋 Next steps:');
console.log('1. Review and update .env file with your production values');
console.log('2. Choose a deployment method from DEPLOYMENT.md');
console.log('3. Deploy to your preferred hosting platform');
console.log('4. Configure domain and SSL');
console.log('5. Test all functionality in production');
console.log('\n🌍 Your Stellar Aid Network is ready to save lives!');
