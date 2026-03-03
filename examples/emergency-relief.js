#!/usr/bin/env node

/**
 * Stellar Aid Network - Emergency Relief Example
 * 
 * This example demonstrates how to use the Stellar Aid Network
 * for emergency humanitarian aid distribution.
 */

const StellarService = require('../backend/src/services/stellarService');

// Initialize the Stellar service
const stellarService = new StellarService();

async function runEmergencyReliefExample() {
    console.log('🚀 Starting Stellar Aid Network Emergency Relief Example\n');

    try {
        // Step 1: Create an emergency campaign
        console.log('📋 Step 1: Creating Emergency Campaign');
        console.log('----------------------------------------');
        
        const campaignData = {
            title: 'Earthquake Relief - Haiti 2024',
            description: 'Emergency medical supplies, food, and shelter for earthquake victims in Port-au-Prince region. Immediate response needed for critical medical care and basic necessities.',
            targetAmount: 50000,
            category: 'medical',
            location: 'Port-au-Prince, Haiti',
            urgency: 'critical'
        };

        const campaign = await stellarService.createAidCampaign(campaignData);
        console.log('✅ Campaign created successfully!');
        console.log(`📄 Campaign ID: ${campaign.campaignId}`);
        console.log(`💰 Target Amount: ${campaign.campaign.targetAmount} XLM`);
        console.log(`📍 Location: ${campaign.campaign.location}`);
        console.log(`🆔 Deposit Address: ${campaign.depositAddress}`);
        console.log(`🔗 Transaction: ${campaign.transactionHash}\n`);

        // Step 2: Register beneficiaries
        console.log('👥 Step 2: Registering Beneficiaries');
        console.log('------------------------------------');
        
        const beneficiaries = [
            {
                name: 'Jean Pierre',
                contact: 'jean.pierre@email.com',
                location: 'Port-au-Prince, Haiti',
                needs: ['Medical supplies', 'Food', 'Shelter']
            },
            {
                name: 'Marie Dubois',
                contact: '+509 1234 5678',
                location: 'Port-au-Prince, Haiti',
                needs: ['Medical supplies', 'Clean water']
            },
            {
                name: 'Joseph Antoine',
                contact: 'joseph.antoine@email.com',
                location: 'Port-au-Prince, Haiti',
                needs: ['Food', 'Shelter', 'Clothing']
            }
        ];

        const registeredBeneficiaries = [];
        
        for (const beneficiary of beneficiaries) {
            const result = await stellarService.createBeneficiaryWallet(beneficiary);
            console.log(`✅ Registered: ${beneficiary.name}`);
            console.log(`📱 Contact: ${beneficiary.contact}`);
            console.log(`🆔 Wallet: ${result.wallet.publicKey}`);
            console.log(`📋 Needs: ${beneficiary.needs.join(', ')}`);
            console.log(`📱 QR Code: Generated for easy access\n`);
            
            registeredBeneficiaries.push({
                ...beneficiary,
                wallet: result.wallet
            });
        }

        // Step 3: Distribute aid to beneficiaries
        console.log('💰 Step 3: Distributing Emergency Aid');
        console.log('------------------------------------');
        
        const distributions = [
            {
                recipient: registeredBeneficiaries[0].wallet.publicKey,
                amount: 1000,
                memo: 'Emergency medical supplies and food for Jean Pierre'
            },
            {
                recipient: registeredBeneficiaries[1].wallet.publicKey,
                amount: 750,
                memo: 'Medical supplies and clean water for Marie Dubois'
            },
            {
                recipient: registeredBeneficiaries[2].wallet.publicKey,
                amount: 500,
                memo: 'Food and shelter assistance for Joseph Antoine'
            }
        ];

        const distributionResults = [];
        
        for (const distribution of distributions) {
            const result = await stellarService.distributeAid(
                campaign.campaignId,
                distribution.recipient,
                distribution.amount,
                distribution.memo
            );
            
            console.log(`✅ Aid distributed: ${distribution.amount} XLM`);
            console.log(`📤 Recipient: ${distribution.recipient}`);
            console.log(`📝 Memo: ${distribution.memo}`);
            console.log(`🆔 Distribution ID: ${result.distributionId}`);
            console.log(`🔗 Transaction: ${result.transactionHash}\n`);
            
            distributionResults.push(result);
        }

        // Step 4: Verify distributions
        console.log('🔍 Step 4: Verifying Distributions');
        console.log('-----------------------------------');
        
        for (const distribution of distributionResults) {
            const verification = await stellarService.verifyAidDistribution(distribution.distributionId);
            
            console.log(`🔍 Verifying: ${distribution.distributionId}`);
            console.log(`✅ Status: ${verification.verified ? 'Verified' : 'Not Verified'}`);
            console.log(`📊 Amount: ${verification.distribution.amount} XLM`);
            console.log(`👤 Recipient: ${verification.distribution.recipient}`);
            console.log(`📅 Timestamp: ${new Date(verification.distribution.timestamp).toLocaleString()}`);
            
            if (verification.transaction) {
                console.log(`🔗 Transaction Hash: ${verification.transaction.hash}`);
                console.log(`✅ Transaction Success: ${verification.transaction.successful}`);
            }
            console.log('');
        }

        // Step 5: Check campaign status
        console.log('📊 Step 5: Campaign Status Summary');
        console.log('----------------------------------');
        
        const campaignStatus = await stellarService.getCampaignStatus(campaign.campaignId);
        
        console.log(`📋 Campaign: ${campaignStatus.campaign.title}`);
        console.log(`🎯 Target: ${campaignStatus.campaign.targetAmount} XLM`);
        console.log(`💰 Distributed: ${campaignStatus.totalDistributed} XLM`);
        console.log(`📈 Progress: ${campaignStatus.progress.toFixed(2)}%`);
        console.log(`💵 Remaining: ${campaignStatus.remaining} XLM`);
        console.log(`📊 Total Distributions: ${campaignStatus.distributions.length}`);
        
        // Step 6: Get transaction history
        console.log('\n📜 Step 6: Transaction History');
        console.log('---------------------------------');
        
        const transactionHistory = await stellarService.getTransactionHistory(
            campaign.depositAddress,
            10
        );
        
        console.log(`📊 Total Transactions: ${transactionHistory.length}`);
        
        transactionHistory.forEach((tx, index) => {
            console.log(`${index + 1}. ${tx.hash.substring(0, 20)}...`);
            console.log(`   📅 Date: ${new Date(tx.createdAt).toLocaleString()}`);
            console.log(`   ✅ Success: ${tx.successful}`);
            console.log(`   📝 Memo: ${tx.memo || 'No memo'}`);
            console.log('');
        });

        // Summary
        console.log('🎉 Emergency Relief Example Completed!');
        console.log('=====================================');
        console.log(`📋 Campaign ID: ${campaign.campaignId}`);
        console.log(`👥 Beneficiaries Registered: ${registeredBeneficiaries.length}`);
        console.log(`💰 Total Aid Distributed: ${distributionResults.reduce((sum, d) => sum + parseFloat(d.amount), 0)} XLM`);
        console.log(`🔍 All Distributions Verified: ${distributionResults.every(d => d.verified)}`);
        console.log(`📊 Campaign Progress: ${campaignStatus.progress.toFixed(2)}%`);
        
        console.log('\n🌍 Real-World Impact:');
        console.log('• Immediate medical aid delivered to earthquake victims');
        console.log('• Transparent tracking of all aid flows');
        console.log('• Direct assistance to verified beneficiaries');
        console.log('• Complete audit trail for accountability');
        console.log('• Reduced administrative overhead');
        console.log('• Faster response time compared to traditional systems');

    } catch (error) {
        console.error('❌ Error in emergency relief example:', error.message);
        
        if (error.message.includes('Failed to create aid campaign')) {
            console.log('\n💡 Troubleshooting:');
            console.log('• Ensure your Stellar account has sufficient XLM balance');
            console.log('• Check that your account is funded on the testnet');
            console.log('• Verify your Stellar account credentials in .env file');
        }
        
        if (error.message.includes('Aid distribution failed')) {
            console.log('\n💡 Troubleshooting:');
            console.log('• Ensure recipient address is a valid Stellar address');
            console.log('• Check that you have sufficient balance for the distribution');
            console.log('• Verify the campaign exists and is active');
        }
        
        process.exit(1);
    }
}

// Additional helper functions for different scenarios

async function demonstrateFoodDistribution() {
    console.log('\n🍽️ Food Distribution Scenario');
    console.log('=============================');
    
    const foodCampaign = {
        title: 'Famine Relief - East Africa 2024',
        description: 'Emergency food distribution for drought-affected communities in East Africa. Focus on nutrition for children and elderly.',
        targetAmount: 75000,
        category: 'food',
        location: 'East Africa Region',
        urgency: 'high'
    };
    
    const campaign = await stellarService.createAidCampaign(foodCampaign);
    console.log(`✅ Food campaign created: ${campaign.campaignId}`);
    
    // Register families needing food assistance
    const families = [
        {
            name: 'Hassan Family',
            contact: 'hassan.family@email.com',
            location: 'Nairobi, Kenya',
            needs: ['Food', 'Nutrition supplements']
        },
        {
            name: 'Amina Family',
            contact: '+254 712 345 678',
            location: 'Mogadishu, Somalia',
            needs: ['Food', 'Clean water']
        }
    ];
    
    for (const family of families) {
        const result = await stellarService.createBeneficiaryWallet(family);
        console.log(`✅ Registered family: ${family.name}`);
        
        // Distribute food assistance
        await stellarService.distributeAid(
            campaign.campaignId,
            result.wallet.publicKey,
            1500,
            `Emergency food assistance for ${family.name}`
        );
    }
}

async function demonstrateMedicalEmergency() {
    console.log('\n🏥 Medical Emergency Scenario');
    console.log('==============================');
    
    const medicalCampaign = {
        title: 'Pandemic Response - Medical Supplies',
        description: 'Emergency medical supplies for pandemic response. Focus on PPE, medications, and critical care equipment.',
        targetAmount: 100000,
        category: 'medical',
        location: 'Multiple Locations',
        urgency: 'critical'
    };
    
    const campaign = await stellarService.createAidCampaign(medicalCampaign);
    console.log(`✅ Medical campaign created: ${campaign.campaignId}`);
    
    // Register healthcare facilities
    const facilities = [
        {
            name: 'Central Hospital',
            contact: 'admin@centralhospital.org',
            location: 'Capital City',
            needs: ['Medical supplies', 'PPE', 'Ventilators']
        }
    ];
    
    for (const facility of facilities) {
        const result = await stellarService.createBeneficiaryWallet(facility);
        console.log(`✅ Registered facility: ${facility.name}`);
        
        // Distribute medical supplies
        await stellarService.distributeAid(
            campaign.campaignId,
            result.wallet.publicKey,
            5000,
            `Emergency medical supplies for ${facility.name}`
        );
    }
}

// Run the main example
if (require.main === module) {
    runEmergencyReliefExample()
        .then(() => {
            console.log('\n✨ Example completed successfully!');
            
            // Uncomment to run additional scenarios
            // demonstrateFoodDistribution();
            // demonstrateMedicalEmergency();
        })
        .catch(error => {
            console.error('❌ Example failed:', error);
            process.exit(1);
        });
}

module.exports = {
    runEmergencyReliefExample,
    demonstrateFoodDistribution,
    demonstrateMedicalEmergency
};
