// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title StellarAidContract
 * @dev Smart contract for humanitarian aid distribution
 * Note: This is a conceptual representation for Ethereum compatibility
 * Actual implementation uses Stellar's native features
 */
contract StellarAidContract {
    struct Campaign {
        string id;
        string title;
        string description;
        uint256 targetAmount;
        string category;
        string location;
        string urgency;
        uint256 createdAt;
        bool active;
        address creator;
    }

    struct Distribution {
        string id;
        string campaignId;
        address recipient;
        uint256 amount;
        string memo;
        uint256 timestamp;
        bool verified;
    }

    struct Beneficiary {
        string id;
        string name;
        string contact;
        string location;
        string[] needs;
        uint256 createdAt;
        bool registered;
    }

    mapping(string => Campaign) public campaigns;
    mapping(string => Distribution) public distributions;
    mapping(string => Beneficiary) public beneficiaries;
    
    string[] public campaignIds;
    string[] public distributionIds;
    string[] public beneficiaryIds;
    
    address public owner;
    uint256 public totalAidDistributed;
    
    event CampaignCreated(string indexed campaignId, string title, uint256 targetAmount);
    event DistributionMade(string indexed distributionId, string indexed campaignId, address recipient, uint256 amount);
    event BeneficiaryRegistered(string indexed beneficiaryId, string name);
    event AidVerified(string indexed distributionId, bool verified);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
        totalAidDistributed = 0;
    }

    function createCampaign(
        string memory _id,
        string memory _title,
        string memory _description,
        uint256 _targetAmount,
        string memory _category,
        string memory _location,
        string memory _urgency
    ) public {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_targetAmount > 0, "Target amount must be positive");
        
        campaigns[_id] = Campaign({
            id: _id,
            title: _title,
            description: _description,
            targetAmount: _targetAmount,
            category: _category,
            location: _location,
            urgency: _urgency,
            createdAt: block.timestamp,
            active: true,
            creator: msg.sender
        });
        
        campaignIds.push(_id);
        emit CampaignCreated(_id, _title, _targetAmount);
    }

    function distributeAid(
        string memory _distributionId,
        string memory _campaignId,
        address _recipient,
        uint256 _amount,
        string memory _memo
    ) public {
        require(campaigns[_campaignId].active, "Campaign must be active");
        require(_amount > 0, "Amount must be positive");
        require(_recipient != address(0), "Invalid recipient address");
        
        distributions[_distributionId] = Distribution({
            id: _distributionId,
            campaignId: _campaignId,
            recipient: _recipient,
            amount: _amount,
            memo: _memo,
            timestamp: block.timestamp,
            verified: false
        });
        
        distributionIds.push(_distributionId);
        totalAidDistributed += _amount;
        
        emit DistributionMade(_distributionId, _campaignId, _recipient, _amount);
    }

    function registerBeneficiary(
        string memory _id,
        string memory _name,
        string memory _contact,
        string memory _location,
        string[] memory _needs
    ) public {
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        beneficiaries[_id] = Beneficiary({
            id: _id,
            name: _name,
            contact: _contact,
            location: _location,
            needs: _needs,
            createdAt: block.timestamp,
            registered: true
        });
        
        beneficiaryIds.push(_id);
        emit BeneficiaryRegistered(_id, _name);
    }

    function verifyDistribution(string memory _distributionId, bool _verified) public onlyOwner {
        require(bytes(distributions[_distributionId].id).length > 0, "Distribution not found");
        
        distributions[_distributionId].verified = _verified;
        emit AidVerified(_distributionId, _verified);
    }

    function getCampaign(string memory _id) public view returns (Campaign memory) {
        return campaigns[_id];
    }

    function getDistribution(string memory _id) public view returns (Distribution memory) {
        return distributions[_id];
    }

    function getBeneficiary(string memory _id) public view returns (Beneficiary memory) {
        return beneficiaries[_id];
    }

    function getCampaignCount() public view returns (uint256) {
        return campaignIds.length;
    }

    function getDistributionCount() public view returns (uint256) {
        return distributionIds.length;
    }

    function getBeneficiaryCount() public view returns (uint256) {
        return beneficiaryIds.length;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid new owner");
        owner = newOwner;
    }
}
