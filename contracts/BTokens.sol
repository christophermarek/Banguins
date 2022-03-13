// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import "@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";
import "./Players.sol";
import "./Monsters.sol";
import "./GameConstants.sol";


contract BTokens is ERC1155PresetMinterPauser {

    Players public players;
    Monsters public monsters;

    address payable owner;

    constructor(Players _players, Monsters _monsters) ERC1155PresetMinterPauser() {
        players = _players;
        monsters = _monsters;
        owner = payable(_msgSender());
    }

    // emit an event when a pack is minted
    function buyPack(address account) external payable returns (uint256[] memory, uint8[] memory) {
        // Handle payment
        require(msg.value == GameConstants.PACK_PRICE, "incorrect pay amount");
        (bool success,) = owner.call{value: msg.value}("");
        require(success, "payment failed");

        // Generate monsters, monsters contract handles increasing numMonsters and storing rarities
        (uint256[] memory ids, uint8[] memory rarities) = monsters.getRandomMonster(GameConstants.PACK_SIZE);
        uint256[] memory amounts = new uint256[](GameConstants.PACK_SIZE);
        for (uint8 i; i < GameConstants.PACK_SIZE; i++) {
            amounts[i] = 1;
        }

        // Mint tokens
        mintBatch(account, ids, amounts, "");
        players.increaseMonsters(account, GameConstants.PACK_SIZE);

        return (ids, rarities);
    }

    function balanceOfPlayer(address account) public view returns (uint256[] memory, uint256[] memory) {
        uint256 numTokens;
        for (uint256 i; i < monsters.numMonsters() + 2; i++) {
            if (balanceOf(account, i) > 0 || i < 2) {
                numTokens++;
            }
        }

        uint256[] memory ids = new uint256[](numTokens);
        uint256[] memory amounts = new uint256[](numTokens);
        uint8 counter;
        for (uint256 i; i < monsters.numMonsters() + 2; i++) {
            uint256 amount = balanceOf(account, i);
            if (amount > 0 || i < 2) {
                ids[counter] = i;
                amounts[counter] = amount;
                counter++;
            }
        }

        return (ids, amounts);
    }
    
    function generateDailyNRGY(address account) external {
        require(block.timestamp - players.getCheckIn(account) / 1 days > 1, "already checked in");
        // Set last check in timestamp to now
        players.doCheckIn(account);
        
        // Transfer amount of energy based on number of monsters, capped at limit
        ( , , uint256 numPlayerMonsters) = players.getStats(account);
        uint256 dailyNRGY = numPlayerMonsters * GameConstants.MONSTER_NRGY_RATE > GameConstants.MAX_DAILY_NRGY 
                                ? GameConstants.MAX_DAILY_NRGY 
                                : numPlayerMonsters * GameConstants.MONSTER_NRGY_RATE;
        mint(account, GameConstants.NRGY, dailyNRGY, "");
    }

    function setApprovalForPlayerTokens(address player, address operator) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setApprovalForAll(player, operator, true);
    }

    function grantAdmin(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(DEFAULT_ADMIN_ROLE, account);
    }

    function grantMinter(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(MINTER_ROLE, account);
    }
    
}