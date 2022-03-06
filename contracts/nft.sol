// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";

contract BTokens is ERC1155PresetMinterPauser {
    uint256 public numMonsters = 10;
    uint256 public constant NRGY = 0;
    uint256 public constant CRNCY = 1;
    uint256[] private amountCoinAndMonster = [10**9, 10**9, 20, 20, 20, 10, 10, 5, 5, 5, 3, 2];
    uint256[] private coinAndMonsterIds = [NRGY, CRNCY, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    mapping(uint256 => uint256) monsterRarities;
    

    constructor() ERC1155PresetMinterPauser("ipfs-base-uri-goes-here") {
        for (uint8 i = 2; i < numMonsters + 2; i++) {
            monsterRarities[i] = amountCoinAndMonster[i];
        }
        mintBatch(_msgSender(), coinAndMonsterIds, amountCoinAndMonster, "");
    }

    function addMonster(uint256 amount) external {
        require(hasRole(MINTER_ROLE, _msgSender()), "BTokens: must have minter role");
        
        mint(_msgSender(), numMonsters, amount, "");

        numMonsters++;
    } 

    function buyPack() external {
        // Need to use Chainlink VRF for randomly choosing monsters
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
}