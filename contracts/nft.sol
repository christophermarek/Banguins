// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";
import "players.sol";
import "monsters.sol";

contract BTokens is ERC1155PresetMinterPauser {
    uint256 public constant NRGY = 0;
    uint256 public constant CRNCY = 1;
    uint256 public constant MONSTER_NRGY_RATE = 5;
    uint256 public constant MAX_DAILY_NRGY = MONSTER_NRGY_RATE * 10;
    uint256 public constant PACK_PRICE = 1000;
    uint8 public constant PACK_SIZE = 3;
    
    uint256[] private amountCoin = [10**9, 10**9];
    uint256[] private coinIds = [NRGY, CRNCY];

    Players private players;
    Monsters private monsters;

    address payable owner;

    event PackBought(address indexed player);

    constructor(Players _players, Monsters _monsters) ERC1155PresetMinterPauser("ipfs-base-uri-goes-here") {
        players = _players;
        monsters = _monsters;
        owner = payable(_msgSender());
        mintBatch(_msgSender(), coinIds, amountCoin, "");
    }

    modifier checkAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Must have admin role to run this function");
        _;
    }

    // emit an event when a pack is minted
    function buyPack(address account) external payable returns (uint256[] memory, uint8[] memory) {
        // Handle payment
        require(msg.value == 3, "incorrect amount paid for pack");
        (bool success,) = owner.call{value: msg.value}("");
        require(success, "Failed to submit payment");

        // Generate monsters
        (uint256[] memory ids, uint8[] memory rarities) = monsters.getRandomMonster(PACK_SIZE);
        uint256[] memory amounts = new uint256[](PACK_SIZE);
        for (uint8 i; i < PACK_SIZE; i++) {
            amounts[i] = 1;
        }

        // Mint tokens
        mintBatch(account, ids, amounts, "");

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
        require(block.timestamp - players.getCheckIn(account) / 1 days > 1, "NRGY already claimed in past 24 hours");
        _;
    }

    
    function generateDailyNRGY(address account) external checkOneDayPassed(account) {
        // Set last check in timestamp to now
        players.setCheckIn(account);
        
        // Transfer amount of energy based on number of monsters, capped at limit
        uint256 numPlayerMonsters = players.getNumMonsters(account);
        uint256 dailyNRGY = numPlayerMonsters * MONSTER_NRGY_RATE > MAX_DAILY_NRGY? MAX_DAILY_NRGY : numPlayerMonsters * MONSTER_NRGY_RATE;
        mint(account, NRGY, dailyNRGY, "");
    }

    function buyMonster(address from, address to, uint256 id, uint256 price) external checkAdmin {
        safeTransferFrom(from, to, id, 1, "");
        safeTransferFrom(to, from, CRNCY, price, "");
    }
    
}