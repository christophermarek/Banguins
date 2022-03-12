// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

    import "./nft.sol";

interface IERC20 {
    function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _value, bytes calldata _data) external;
    function safeBatchTransferFrom(address _from, address _to, uint256[] calldata _ids, uint256[] calldata _values, bytes calldata _data) external;
    function balanceOf(address _owner, uint256 _id) external view returns (uint256);
    function balanceOfBatch(address[] calldata _owners, uint256[] calldata _ids) external view returns (uint256[] memory);
    function setApprovalForAll(address _operator, bool _approved) external;
    function isApprovedForAll(address _owner, address _operator) external view returns (bool);
}

contract Staking {

    address owner;


    address ceAddress; 
    BTokens ce = BTokens(ceAddress);
    
    mapping(address => User) users;
    struct User{
        uint rewardRate;
        uint stakedEnergy;
        uint stakedCurrency;
        uint lastWithdrawalTime;
    }
    
    uint currencyLiquidity;
    uint energyLiquidity;
    // Liquidity Calc
    uint swap; //
    uint rcvd; //
    uint swapPool18 = swap*10**18;
    uint rcvdPool9 = rcvd*10**9;
    uint rcvd18 = rcvd*10**18;
    
constructor() {
    owner = msg.sender;
}

    function setAddress(address _addr) external {
        require(owner==msg.sender, "This isn't for you");
        ceAddress = _addr;
        ce.setApprovalForAll(address(this), true);
    }         

    function StakeTokens(uint _currency, uint _energy) public returns (string memory) {
        //reentrancy modifier
        User memory u = users[msg.sender];
        require(ce.balanceOf(msg.sender, 0)>=_currency, "not enough currency");
        require(ce.balanceOf(msg.sender, 1)>=_energy, "not enough energy");
        u.rewardRate = CalculateRewardRate(_currency, _energy);
        ce.safeTransferFrom(msg.sender, address(this), 0, _currency, "currency has been Staked");
        ce.safeTransferFrom(msg.sender, address(this), 1, _energy, "Energy has been Staked");
        u.stakedEnergy += _energy;
        u.stakedCurrency += _currency;
        if(u.rewardRate>0){
            ClaimReward();
            return "Reward claimed. Thank you for staking";
        } else {return "Thank you for staking";}
    }

    function UnstakeTokens(uint _currency, uint _energy) public  {
        //reentrancy modifier 
        User memory u = users[msg.sender];
        require(u.stakedCurrency >= _currency, "not enough currency staked");
        require(u.stakedEnergy >= _energy, "not enough energy staked");
        u.rewardRate = CalculateRewardRate(_currency, _energy);
        u.stakedEnergy -= _energy;
        u.stakedCurrency -= _currency;
        ce.safeTransferFrom(address(this), msg.sender, 0, _currency, "currency withdrawn");
        ce.safeTransferFrom(address(this), msg.sender, 1, _energy, "energy withdrawn");
    }

    function CalculateRewardAmount(uint rewardRate, uint _lastClaim) public view returns (uint rewardAmount) {
        uint _rewardRate = rewardRate;
        uint _timeFrame = block.timestamp - _lastClaim;
        return rewardAmount = _rewardRate * _timeFrame;
    }

    function CalculateRewardRate(uint _currency, uint _energy) public view returns (uint rewardRate6) {
        uint _cStaking = users[msg.sender].stakedCurrency + _currency;
        uint _eStaking = users[msg.sender].stakedEnergy + _energy;
        uint _cStat = (100 * _cStaking) / currencyLiquidity;
        uint _eStat = (100 * _eStaking) / energyLiquidity;
        uint ProposedRewardRate = _cStat * _eStat;
        if (ProposedRewardRate > 25000){
            return 25000;
        } else {
            return ProposedRewardRate;
        }
    }

    function ClaimReward() public returns (uint _reward) {
        // add reentrancy 
        User memory u = users[msg.sender];
        _reward = CalculateRewardAmount(u.rewardRate, u.lastWithdrawalTime);
        ce.safeTransferFrom(address(this), msg.sender, 0, _reward, "Thank you for staking");
        u.lastWithdrawalTime = block.timestamp;
    }

    function swapCurrency(uint _id, uint _amount) external {
        // noReentrancy
        uint other;
        require(_amount<=100, "too much swap, this is game, not economy");
        if(_id==0){
            require(ce.balanceOf(msg.sender, 0)>=_amount+1, "not enough currency");
            swap = currencyLiquidity;
            rcvd = energyLiquidity;
            other = 1;
        } else if(_id==1) {
            require(ce.balanceOf(msg.sender, 1)>=_amount+1, "not enough energy");
            rcvd = currencyLiquidity;
            swap = energyLiquidity;
            other = 0;
        } else {
            revert("Invalid Token ID, go to uniswap or something");
        }
        //probably able to do a batch transfer for this one
        UpdatePools();
        uint returnValue = getSwapValue(_amount);
        ce.safeTransferFrom(msg.sender, address(this), _id, _amount+1, "Swap Token");
        ce.safeTransferFrom(address(this), msg.sender, _id, returnValue, "Receive Token");
        UpdatePools();
    }

    function UpdatePools() private {
        energyLiquidity = ce.balanceOf(address(this), 0);
        currencyLiquidity = ce.balanceOf(address(this), 1); 
    }

    // Liquidity Calculation

    function discountValue(uint swapAmount) private view returns (uint) {
        uint swapAmt18 = swapAmount*10**18; 
        uint newSwapPool18 = swapPool18 + swapAmt18;
        uint newSwapPool = newSwapPool18/10**18;
        uint discountRatio18 = swapPool18 / newSwapPool;
        uint discountRatio9 = discountRatio18/10**9;
        return (discountRatio9); 
    }

    function ratioEquivalence(uint discountedSwapAmount18) private view returns (uint) {
        uint ratio9 = swapPool18 / rcvdPool9;
        uint DRAmount9 = discountedSwapAmount18 / ratio9;
        return DRAmount9;
    }

    function discountValue2(uint DRAmount9) private view returns (uint) {
        uint DRAmount18 = DRAmount9 * 10**9;
        uint newrcvd18 = rcvd18 - DRAmount18;
        uint ratio9 = newrcvd18 / rcvdPool9;  // I think we may need to switch these numbers
        return ratio9; 
    }

    function Combine(uint swapAmt) private view returns (uint) {
        uint value9 = discountValue(swapAmt);
        uint swapAmt9 = swapAmt * 10**9;
        uint value18 = value9 * swapAmt9; 
        uint nothervalue9 = ratioEquivalence(value18);
        uint thirdvalue9 = discountValue2(nothervalue9);
        uint fourthvalue18 = nothervalue9 * thirdvalue9;
        uint fifthvalue = fourthvalue18/10**18;
        return  fifthvalue;
    }

    function getSwapValue(uint _amount) private view returns (uint returnAmount) {
         returnAmount = Combine(_amount);

    }

}