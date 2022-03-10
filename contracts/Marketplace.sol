// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./Players.sol";
import "./BTokens.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


contract Marketplace is AccessControl {

    Players private players;
    BTokens private token;

    constructor(BTokens _token, Players _player) {
        token = _token;
        players = _player;
    }

    function buyMonster(address from, address to, uint256 id, uint256 price) external onlyRole(DEFAULT_ADMIN_ROLE) {
        token.safeTransferFrom(from, to, id, 1, "");
        players.decreaseMonsters(from, 1);
        players.increaseMonsters(to, 1);
        token.safeTransferFrom(to, from, GameConstants.CRNCY, price, "");
    }
}