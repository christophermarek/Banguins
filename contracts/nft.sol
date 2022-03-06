// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";
import "players.sol";

contract BTokens is ERC1155PresetMinterPauser {
    uint256 public constant NRGY = 0;
    uint256 public constant CRNCY = 1;
    uint256 public constant MONSTER_NRGY_RATE = 5;
    uint256 public constant MAX_DAILY_NRGY = MONSTER_NRGY_RATE * 10;
    
    uint256 public numMonsters = 10;
    uint256[] private amountCoinAndMonster = [10**9, 10**9, 20, 20, 20, 10, 10, 5, 5, 5, 3, 2];
    uint256[] private coinAndMonsterIds = [NRGY, CRNCY, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    mapping(uint256 => uint256) monsterRarities;

    Players private players;

    constructor(Players _players) ERC1155PresetMinterPauser("ipfs-base-uri-goes-here") {
        players = _players;
        for (uint8 i = 2; i < numMonsters + 2; i++) {
            monsterRarities[i] = amountCoinAndMonster[i];
        }
        mintBatch(_msgSender(), coinAndMonsterIds, amountCoinAndMonster, "");
    }

    function addMonster(uint256 amount) external {
        require(hasRole(MINTER_ROLE, _msgSender()), "BTokens: must have minter role");
        
        monsterRarities[numMonsters] = amount;
        mint(_msgSender(), numMonsters, amount, "");

        numMonsters++;
    } 

    function buyPack() external {
        // Need to use Chainlink VRF for randomly choosing monsters
    }

    function balanceOfPlayer(address account) public view returns (uint256[] memory, uint256[] memory) {
        uint256 numTokens;
        for (uint256 i; i < numMonsters; i++) {
            if (balanceOf(account, i) > 0) {
                numTokens++;
            }
        }

        uint256[] memory ids = new uint256[](numTokens);
        uint256[] memory amounts = new uint256[](numTokens);
        uint256 counter;
        for (uint256 i; i < numMonsters; i++) {
            uint256 amount = balanceOf(account, i);
            if (amount > 0 || i < 2) {
                ids[counter] = i;
                amounts[counter] = amount;
                counter++;
            }
        }

        return (ids, amounts);
    }

    function getNRGYConstant() public pure returns (uint256) {
        return NRGY;
    }

    function getCRNCYConstant() public pure returns (uint256) {
        return CRNCY;
    }

    function getNumMonsters() public view returns (uint256) {
        return numMonsters;
    }

    modifier checkOneDayPassed(address account) {
        require(block.timestamp - players.getCheckIn(account) / 1 days > 1, "NRGY already claimed in past 24 hours");
        _;
    }

    function getDailyNRGY(address account) external checkOneDayPassed(account) {
        // Set last check in timestamp to now
        players.setCheckIn(account);
        
        // Transfer amount of energy based on number of monsters, capped at limit
        uint256 numPlayerMonsters = players.getNumMonsters(account);
        uint256 dailyNRGY = numPlayerMonsters * MONSTER_NRGY_RATE > MAX_DAILY_NRGY? MAX_DAILY_NRGY : numPlayerMonsters * MONSTER_NRGY_RATE;
        mint(account, NRGY, dailyNRGY, "");
    }
    
}