// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./VRFRandomNumbers.sol";
import "./PseudoRandomNumbers.sol";

contract Monsters is AccessControl {
    enum Rarity {
        Common,
        Rare,
        Epic,
        Legendary
    }

    mapping(Rarity => uint256[]) public rarityToMonsters;
    mapping(Rarity => uint256) private _rarityToProbability;
    uint256 private maxProbability;
    uint256 public numMonsters;

    // VRFRandomNumbers chainlinkRNG;
    PseudoRandomNumbers rng;

    // constructor(VRFRandomNumbers _chainlinkRNG) {
    //     /* Set default chances for each rarity level
    //      * Common = 60%
    //      * Rare = 25%
    //      * Epic = 12.5%
    //      * Legendary = 2.5%
    //      */
    //     maxProbability = 100000;
    //     _rarityToProbability[Rarity.Common] = 60000;
    //     _rarityToProbability[Rarity.Rare] = 85000;
    //     _rarityToProbability[Rarity.Epic] = 97500;
    //     _rarityToProbability[Rarity.Legendary] = 100000;

    //     // Use chainlink for random number generation
    //     chainlinkRNG = _chainlinkRNG;

    //     // Setup roles for creator
    //     _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    // }

    constructor(PseudoRandomNumbers _rng) {
        /* Set default chances for each rarity level
         * Common = 60%
         * Rare = 25%
         * Epic = 12.5%
         * Legendary = 2.5%
         */
        maxProbability = 100000;
        _rarityToProbability[Rarity.Common] = 60000;
        _rarityToProbability[Rarity.Rare] = 85000;
        _rarityToProbability[Rarity.Epic] = 97500;
        _rarityToProbability[Rarity.Legendary] = 100000;

        // Use keccak256 for random number generation
        rng = _rng;

        // Setup roles for creator
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    modifier checkAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Must have admin role to run this function");
        _;
    }

    function addMonster(uint256 id, Rarity rarity) external checkAdmin {
        require(id == numMonsters + 2, "can only add new monsters ids");
        require(rarity <= Rarity.Legendary, "not a valid rarity enum");
        numMonsters++;
        rarityToMonsters[rarity].push(id); 
    }

    // function getRandomMonster(uint8 num) external checkAdmin returns (uint256[] memory, uint8[] memory) {
    //     // VRFCoordinatorV2 on Chainlink limits the number of random numbers we can generate at once to 500
    //     require(num <= 250, "cannot mint more than 250 monsters at a time");

    //     // Store monster ids and their rarities
    //     uint256[] memory monsterIds = new uint256[](num);
    //     uint8[] memory monsterRarities = new uint8[](num);
    //     // Send one request for random numbers to be used for selecting rarity class, and monster
    //     chainlinkRNG.requestRandomNumbers(2 * num);
    //     uint256[] memory rand = chainlinkRNG.getRandomNumbers();

    //     for (uint8 i; i < num; i++) {
    //         // Determine rarity
    //         uint256 rollRarity = rand[2 * i] % maxProbability;
    //         uint8 rarity = _getRarityFromRandomNumber(rollRarity);
    //         Rarity monsterRarity = Rarity(rarity);
            
    //         // If rarity class already has monsters minted, randomly select one 
    //         if (rarityToMonsters[monsterRarity].length > 0) {
    //             uint256 index = rand[2 * i + 1] % rarityToMonsters[monsterRarity].length;
    //             monsterIds[i] = rarityToMonsters[monsterRarity][index];
    //             monsterRarities[i] = uint8(monsterRarity);
    //         }
    //         else { // otherwise, create a new monster. Minting should be handled by BTokens contract.
    //             monsterIds[i] = numMonsters + 2;
    //             monsterRarities[i] = uint8(monsterRarity);
    //             rarityToMonsters[monsterRarity].push(numMonsters + 2);
    //             numMonsters++;
    //         }
    //     }

    //     return (monsterIds, monsterRarities);
    // }

    function getRandomMonster(uint8 num) external  returns (uint256[] memory, uint8[] memory) {
        // VRFCoordinatorV2 on Chainlink limits the number of random numbers we can generate at once to 500
        require(num <= 250, "cannot mint more than 250 monsters at a time");

        // Store monster ids and their rarities
        uint256[] memory monsterIds = new uint256[](num);
        uint8[] memory monsterRarities = new uint8[](num);
        // Send one request for random numbers to be used for selecting rarity class, and monster
        uint256[] memory rand = rng.getRandomNumbers(2 * num);

        for (uint8 i; i < num; i++) {
            // Determine rarity
            uint256 rollRarity = rand[2 * i] % maxProbability;
            uint8 rarity = _getRarityFromRandomNumber(rollRarity);
            Rarity monsterRarity = Rarity(rarity);
            // Determine index to pick monster from
            uint256 index = rand[2 * i + 1] % (numMonsters + 1);
            
            // If index is present in monsters array for selected rarity, take existing monster
            // Otherwise, create a new. This enables random chance for getting new monsters. 
            if (index < rarityToMonsters[monsterRarity].length) {
                monsterIds[i] = rarityToMonsters[monsterRarity][index];
                monsterRarities[i] = uint8(monsterRarity);
            }
            else { // otherwise, create a new monster. Minting should be handled by BTokens contract.
                monsterIds[i] = numMonsters + 2;
                monsterRarities[i] = uint8(monsterRarity);
                rarityToMonsters[monsterRarity].push(numMonsters + 2);
                numMonsters++;
            }
        }

        return (monsterIds, monsterRarities);
    }

    // Use probability thresholds to select a rarity from random roll based on assigned percentages
    function _getRarityFromRandomNumber(uint256 num) private view returns (uint8) {
        uint8 rarity = uint8(Rarity.Common);
        for (uint8 i = uint8(Rarity.Common); i <= uint8(Rarity.Legendary); i++) {
            Rarity rarityKey = Rarity(i);
            if (num < _rarityToProbability[rarityKey]) {
                rarity = i;
                break;
            }
        }
        return rarity;
    }

    function setRarityProbability(Rarity rarity, uint256 prob) external checkAdmin {
        _rarityToProbability[rarity] = prob;
    }

    function getRarityProbability(Rarity rarity) external view checkAdmin returns (uint256) {
        return _rarityToProbability[rarity];
    }

    function setMaxProbability(uint256 prob) external checkAdmin {
        maxProbability = prob;
    }

    function getMaxProbability() external view checkAdmin returns (uint256) {
        return maxProbability;
    }

    function grantAdmin(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(DEFAULT_ADMIN_ROLE, account);
    }
}
