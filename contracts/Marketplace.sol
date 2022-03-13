// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./Players.sol";
import "./BTokens.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


contract Marketplace is AccessControl {

    Players public players;
    BTokens public token;

    constructor(BTokens _token, Players _player) {
        token = _token;
        players = _player;
        // Setup roles for creator
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function buyMonster(address from, address to, uint256 id, uint256 price) external {
        token.safeTransferFrom(from, to, id, 1, "");
        players.decreaseMonsters(from, 1);
        players.increaseMonsters(to, 1);
        token.safeTransferFrom(to, from, GameConstants.CRNCY, price, "");
    }
}