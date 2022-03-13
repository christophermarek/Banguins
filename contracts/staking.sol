// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "./BTokens.sol";

contract Staking {

    address ceAddress; 
    address owner;

    uint[2] constant ids = [0,1];
    BTokens ce = BTokens(ceAddress);

safeBatchTransferFrom(msg.sender, address(this), ids, inputAmounts, "Tokens have been staked");    

    
    mapping(address => User) users;
    struct User{
        uint rewardRate;
        uint stakedEnergy;
        uint stakedCurrency;
        uint lastWithdrawalTime;
    }
    
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
        require(ce.balanceOf(msg.sender, 0)>=_currency, "not enough currency");
        require(ce.balanceOf(msg.sender, 1)>=_energy, "not enough energy");
        User memory u = users[msg.sender];
        u.rewardRate = CalculateRewardRate(_currency, _energy);
        uint[2] inputAmounts = [_currency, _energy]
        ce.safeBatchTransferFrom(msg.sender, address(this), ids, inputAmounts, "Tokens have been staked");   
        //ce.safeTransferFrom(msg.sender, address(this), 0, _currency, "currency has been Staked");
        //ce.safeTransferFrom(msg.sender, address(this), 1, _energy, "Energy has been Staked");
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
        uint[2] inputAmounts = [_currency, _energy]
        ce.safeBatchTransferFrom(address(this), msg.sender, ids, inputAmounts, "Tokens Withdrawn");
        u.stakedEnergy -= _energy;
        u.stakedCurrency -= _currency;

    }

    function CalculateRewardAmount(uint rewardRate, uint _lastClaim) public view returns (uint rewardAmount) {
        uint _rewardRate = rewardRate;
        uint _timeFrame = block.timestamp - _lastClaim;
        return rewardAmount = _rewardRate * _timeFrame;
    }
    function CalculateRewardRate(uint _currency, uint _energy) public view returns (uint rewardRate6) {
        uint _energyLiquidity = ce.balanceOf(address(this), 0);
        uint _currencyLiquidity = ce.balanceOf(address(this), 1); 
        uint _cStaking = users[msg.sender].stakedCurrency + _currency;
        uint _eStaking = users[msg.sender].stakedEnergy + _energy;
        uint _cStat = (100 * _cStaking) / _currencyLiquidity;
        uint _eStat = (100 * _eStaking) / _energyLiquidity;
        uint ProposedRewardRate = _cStat * _eStat;
        if (ProposedRewardRate > 25000){
            return 25000;
        } else {
            return ProposedRewardRate;
        }
    }
    function ClaimReward() public returns (uint _reward) {
        User memory u = users[msg.sender];
        _reward = CalculateRewardAmount(u.rewardRate, u.lastWithdrawalTime);
        ce.safeTransferFrom(address(this), msg.sender, 0, _reward, "Thank you for staking");
        u.lastWithdrawalTime = block.timestamp;
    }
}