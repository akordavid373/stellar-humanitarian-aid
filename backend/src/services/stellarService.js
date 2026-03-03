const { Server, Networks, TransactionBuilder, Operation, Asset, Keypair, Memo, MemoText } = require('@stellar/stellar-sdk');
const crypto = require('crypto');
const QRCode = require('qrcode');

class StellarService {
    constructor() {
        this.stellarServer = new Server(process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org');
        this.network = process.env.STELLAR_NETWORK === 'mainnet' ? Networks.PUBLIC : Networks.TESTNET;
        this.aidDistributionAccount = process.env.AID_DISTRIBUTION_ACCOUNT;
        this.aidDistributionSecret = process.env.AID_DISTRIBUTION_SECRET;
    }

    generateAidRequestId() {
        return `AID_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    }

    generateDistributionId() {
        return `DIST_${Date.now()}_${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    }

    generateBeneficiaryId() {
        return `BEN_${Date.now()}_${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    }

    async createAidCampaign(campaignData) {
        try {
            const campaignId = this.generateAidRequestId();
            const sourceKeypair = Keypair.fromSecret(this.aidDistributionSecret);
            const sourceAccount = await this.stellarServer.loadAccount(sourceKeypair.publicKey());

            const campaignMetadata = {
                campaignId,
                title: campaignData.title,
                description: campaignData.description,
                targetAmount: campaignData.targetAmount,
                category: campaignData.category || 'general',
                location: campaignData.location,
                urgency: campaignData.urgency || 'medium',
                createdAt: Date.now(),
                status: 'active'
            };

            const transaction = new TransactionBuilder(sourceAccount, {
                fee: await this.stellarServer.fetchBaseFee(),
                networkPassphrase: this.network
            })
                .addOperation(Operation.manageData({
                    name: `campaign_${campaignId}`,
                    value: Buffer.from(JSON.stringify(campaignMetadata)).toString('base64')
                }))
                .setTimeout(30)
                .addMemo(Memo.text(`AID Campaign: ${campaignId}`))
                .build();

            transaction.sign(sourceKeypair);
            const result = await this.stellarServer.submitTransaction(transaction);

            return {
                success: true,
                campaignId,
                transactionHash: result.hash,
                campaign: campaignMetadata,
                depositAddress: sourceKeypair.publicKey()
            };
        } catch (error) {
            throw new Error(`Failed to create aid campaign: ${error.message}`);
        }
    }

    async distributeAid(campaignId, recipientAddress, amount, distributionMemo = '') {
        try {
            const sourceKeypair = Keypair.fromSecret(this.aidDistributionSecret);
            const sourceAccount = await this.stellarServer.loadAccount(sourceKeypair.publicKey());

            const distributionId = this.generateDistributionId();
            const distributionData = {
                distributionId,
                campaignId,
                recipient: recipientAddress,
                amount: amount.toString(),
                timestamp: Date.now(),
                memo: distributionMemo || `Emergency aid distribution for campaign ${campaignId}`
            };

            const transaction = new TransactionBuilder(sourceAccount, {
                fee: await this.stellarServer.fetchBaseFee(),
                networkPassphrase: this.network
            })
                .addOperation(Operation.payment({
                    destination: recipientAddress,
                    asset: Asset.native(),
                    amount: amount.toString()
                }))
                .addOperation(Operation.manageData({
                    name: `distribution_${distributionId}`,
                    value: Buffer.from(JSON.stringify(distributionData)).toString('base64')
                }))
                .setTimeout(30)
                .addMemo(Memo.text(`AID Distribution: ${distributionId}`))
                .build();

            transaction.sign(sourceKeypair);
            const result = await this.stellarServer.submitTransaction(transaction);

            return {
                success: true,
                distributionId,
                transactionHash: result.hash,
                recipient: recipientAddress,
                amount: amount.toString(),
                campaignId,
                distributedAt: Date.now()
            };
        } catch (error) {
            throw new Error(`Aid distribution failed: ${error.message}`);
        }
    }

    async createBeneficiaryWallet(beneficiaryInfo) {
        try {
            const newKeypair = Keypair.random();
            const publicKey = newKeypair.publicKey();
            const secretKey = newKeypair.secret();

            const beneficiaryData = {
                beneficiaryId: this.generateBeneficiaryId(),
                publicKey,
                name: beneficiaryInfo.name,
                contact: beneficiaryInfo.contact,
                location: beneficiaryInfo.location,
                needs: beneficiaryInfo.needs || [],
                createdAt: Date.now(),
                status: 'registered'
            };

            // Create QR code for easy wallet access
            const qrCodeData = JSON.stringify({
                publicKey,
                beneficiaryId: beneficiaryData.beneficiaryId,
                name: beneficiaryInfo.name
            });

            const qrCode = await QRCode.toDataURL(qrCodeData);

            return {
                success: true,
                beneficiary: beneficiaryData,
                wallet: {
                    publicKey,
                    secretKey: secretKey // WARNING: Handle this securely in production
                },
                qrCode,
                instructions: `Save this QR code and secret key securely. This wallet can receive aid directly.`
            };
        } catch (error) {
            throw new Error(`Failed to create beneficiary wallet: ${error.message}`);
        }
    }

    async getCampaignStatus(campaignId) {
        try {
            const account = await this.stellarServer.loadAccount(this.aidDistributionAccount);
            const campaignDataEntry = account.data_entries?.find(entry => 
                entry.name === `campaign_${campaignId}`
            );

            if (!campaignDataEntry) {
                throw new Error('Campaign not found');
            }

            const campaign = JSON.parse(Buffer.from(campaignDataEntry.value, 'base64').toString());

            // Get all distributions for this campaign
            const distributions = [];
            for (const entry of account.data_entries || []) {
                if (entry.name.startsWith('distribution_')) {
                    const distribution = JSON.parse(Buffer.from(entry.value, 'base64').toString());
                    if (distribution.campaignId === campaignId) {
                        distributions.push(distribution);
                    }
                }
            }

            const totalDistributed = distributions.reduce((sum, dist) => sum + parseFloat(dist.amount), 0);

            return {
                campaign,
                distributions,
                totalDistributed,
                remaining: campaign.targetAmount - totalDistributed,
                progress: (totalDistributed / campaign.targetAmount) * 100
            };
        } catch (error) {
            throw new Error(`Failed to get campaign status: ${error.message}`);
        }
    }

    async verifyAidDistribution(distributionId) {
        try {
            const account = await this.stellarServer.loadAccount(this.aidDistributionAccount);
            const distributionDataEntry = account.data_entries?.find(entry => 
                entry.name === `distribution_${distributionId}`
            );

            if (!distributionDataEntry) {
                throw new Error('Distribution not found');
            }

            const distribution = JSON.parse(Buffer.from(distributionDataEntry.value, 'base64').toString());

            // Verify the transaction exists on the network
            const transactions = await this.stellarServer
                .transactions()
                .forAccount(this.aidDistributionAccount)
                .limit(100)
                .order('desc')
                .call();

            const verifyingTx = transactions.records.find(tx => 
                tx.memo && tx.memo.includes(distributionId)
            );

            return {
                verified: !!verifyingTx,
                distribution,
                transaction: verifyingTx,
                verifiedAt: Date.now()
            };
        } catch (error) {
            throw new Error(`Failed to verify distribution: ${error.message}`);
        }
    }

    async getTransactionHistory(accountId, limit = 10) {
        try {
            const transactions = await this.stellarServer
                .transactions()
                .forAccount(accountId)
                .limit(limit)
                .order('desc')
                .call();

            return transactions.records.map(tx => ({
                hash: tx.hash,
                createdAt: tx.created_at,
                successful: tx.successful,
                sourceAccount: tx.source_account,
                memo: tx.memo,
                operations: tx.operations
            }));
        } catch (error) {
            throw new Error(`Failed to get transaction history: ${error.message}`);
        }
    }
}

module.exports = StellarService;
