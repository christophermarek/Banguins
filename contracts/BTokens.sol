// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import "@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";
import "./players.sol";
import "./monsters.sol";
import "./GameConstants.sol";


contract BTokens is ERC1155PresetMinterPauser {

    Players private players;
    Monsters private monsters;

    address payable owner;

    event PackBought(address indexed player);

    constructor(Players _players, Monsters _monsters) ERC1155PresetMinterPauser("ipfs-base-uri-goes-here") {
        players = _players;
        monsters = _monsters;
        owner = payable(_msgSender());
    }

    modifier checkAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Admin required");
        _;
    }

    // emit an event when a pack is minted
    function buyPack(address account) external payable returns (uint256[] memory, uint8[] memory) {
        // Handle payment
        require(msg.value == GameConstants.PACK_PRICE, "incorrect pay amount");
        (bool success,) = owner.call{value: msg.value}("");
        require(success, "payment failed");

        // Generate monsters
        (uint256[] memory ids, uint8[] memory rarities) = monsters.getRandomMonster(GameConstants.PACK_SIZE);
        uint256[] memory amounts = new uint256[](GameConstants.PACK_SIZE);
        for (uint8 i; i < GameConstants.PACK_SIZE; i++) {
            amounts[i] = 1;
        }

        // Mint tokens
        mintBatch(account, ids, amounts, "");
        players.increaseMonsters(account, GameConstants.PACK_SIZE);

        // Emit pack bought event
        emit PackBought(account);

        return (ids, rarities);
    }

    function balanceOfPlayer(address account) public view returns (uint256[] memory, uint256[] memory) {
        uint256 numTokens;
        for (uint256 i; i < monsters.numMonsters(); i++) {
            if (balanceOf(account, i) > 0) {
                numTokens++;
            }
        }

        uint256[] memory ids = new uint256[](numTokens);
        uint256[] memory amounts = new uint256[](numTokens);
        uint256 counter;
        for (uint256 i; i < monsters.numMonsters(); i++) {
            uint256 amount = balanceOf(account, i);
            if (amount > 0 || i < 2) {
                ids[counter] = i;
                amounts[counter] = amount;
                counter++;
            }
        }

        return (ids, amounts);
    }

    modifier checkOneDayPassed(address account) {
        require(block.timestamp - players.getCheckIn(account) / 1 days > 1, "already checked in");
        _;
    }

    
    function generateDailyNRGY(address account) external checkOneDayPassed(account) {
        // Set last check in timestamp to now
        players.setCheckIn(account);
        
        // Transfer amount of energy based on number of monsters, capped at limit
        ( , , uint256 numPlayerMonsters) = players.getStats(account);
        uint256 dailyNRGY = numPlayerMonsters * GameConstants.MONSTER_NRGY_RATE > GameConstants.MAX_DAILY_NRGY 
                                ? GameConstants.MAX_DAILY_NRGY 
                                : numPlayerMonsters * GameConstants.MONSTER_NRGY_RATE;
        mint(account, GameConstants.NRGY, dailyNRGY, "");
    }

    function buyMonster(address from, address to, uint256 id, uint256 price) external checkAdmin {
        _safeTransferFrom(from, to, id, 1, "");
        players.decreaseMonsters(from, 1);
        _safeTransferFrom(to, from, GameConstants.CRNCY, price, "");
    }

    function setApprovalForPlayerTokens(address player, address operator) external checkAdmin {
        _setApprovalForAll(player, operator, true);
    }
    
}