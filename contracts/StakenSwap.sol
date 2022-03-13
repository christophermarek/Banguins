// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "./BTokens.sol";

contract Staking {

    bool internal locked;

    uint256[] ids = [0,1];// energy,currency
    BTokens ce;

    
    mapping(address => User) users;
    struct User{
        uint rewardRate;
        uint stakedEnergy;
        uint stakedCurrency;
        uint lastWithdrawalTime;
        uint[] inputAmounts;
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
    //owner = msg.sender;
    address ceAddress = 0x066b7E91e85d37Ba79253dd8613Bf6fB16C1F7B7; 
    ce = BTokens(ceAddress);
}

modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
        }


    function StakeTokens(uint _currency, uint _energy) public noReentrant returns (string memory)  {
        require(ce.balanceOf(msg.sender, 1)>=_currency, "not enough currency");
        require(ce.balanceOf(msg.sender, 0)>=_energy, "not enough energy");
        User memory u = users[msg.sender];
        u.rewardRate = CalculateRewardRate(_currency, _energy);
        u.inputAmounts[0] = _energy;
        u.inputAmounts[1] = _currency;
        ce.safeBatchTransferFrom(msg.sender, address(this), ids, u.inputAmounts, "");
        u.stakedEnergy += _energy;
        u.stakedCurrency += _currency;
        if(u.rewardRate>0){
            ClaimReward();
            return "Reward claimed. Thank you for staking";
        } else {return "Thank you for staking";}
    }

    function UnstakeTokens(uint _currency, uint _energy) noReentrant public  {
        User memory u = users[msg.sender];
        require(u.stakedCurrency >= _currency, "not enough currency staked");
        require(u.stakedEnergy >= _energy, "not enough energy staked");
        u.rewardRate = CalculateRewardRate(_currency, _energy);
        u.stakedEnergy -= _energy;
        u.stakedCurrency -= _currency;
        u.inputAmounts[0] = _energy;
        u.inputAmounts[1] = _currency;
        ce.safeBatchTransferFrom(address(this), msg.sender, ids, u.inputAmounts, "");
    }

    function CalculateRewardAmount() public view returns (uint rewardAmount) {
        User memory u = users[msg.sender];
        uint _rewardRate = u.rewardRate;
        uint _timeFrame = block.timestamp - u.lastWithdrawalTime;
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

    function ClaimReward() public noReentrant returns (uint _reward) {
        // add reentrancy 
        User memory u = users[msg.sender];
        _reward = CalculateRewardAmount();
        ce.safeTransferFrom(address(this), msg.sender, 1, _reward, "");
        u.lastWithdrawalTime = block.timestamp;
    }

    function swapCurrency(uint _id, uint _amount) external {
        // noReentrancy
        uint other;
        require(_amount<=100, "too much swap, this is game, not economy");
        if(_id==1){
            require(ce.balanceOf(msg.sender, 1)>=_amount+1, "not enough currency");
            swap = currencyLiquidity;
            rcvd = energyLiquidity;
            other = 0;
        } else if(_id==0) {
            require(ce.balanceOf(msg.sender, 0)>=_amount+1, "not enough energy");
            rcvd = currencyLiquidity;
            swap = energyLiquidity;
            other = 1;
        } else {
            revert("Invalid Token ID, go to uniswap or something");
        }
        //probably able to do a batch transfer for this one
        UpdatePools();
        uint returnValue = getSwapValue(_amount);
        ce.safeTransferFrom(msg.sender, address(this), _id, _amount+1, "");
        ce.safeTransferFrom(address(this), msg.sender, other, returnValue, "");
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

    function getSwapValue(uint _amount) public view returns (uint returnAmount) {
         returnAmount = Combine(_amount);
    }

}