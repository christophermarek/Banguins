// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Players is AccessControl {
    // Schema to be used to keep track of player wins/losses, number of monsters, last daily check in
    struct PlayerSchema {
        uint256 wins;
        uint256 losses;
        uint256 numPlayerMonsters;
        uint lastCheckIn;
    }

    mapping(address => PlayerSchema) public playerDb;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    modifier checkAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Must have admin role to run this function");
        _;
    }

    function increaseWins(address player) external checkAdmin {
        playerDb[player].wins += 1;
    }

    function increaseLosses(address player) external checkAdmin  {
        playerDb[player].losses += 1;
    }

    function increaseMonsters(address player, uint8 amount) external checkAdmin {
        playerDb[player].numPlayerMonsters += amount;
    }

    function decreaseMonsters(address player, uint8 amount) external checkAdmin {
        require(playerDb[player].numPlayerMonsters >= amount, "cannot decrease number of monsters below zero");
        playerDb[player].numPlayerMonsters -= amount;
    }

    function doCheckIn(address player) external {
        playerDb[player].lastCheckIn = block.timestamp;
    }

    function setCheckIn(address player, uint timestamp) external checkAdmin {
        playerDb[player].lastCheckIn = timestamp;
    }

    function getCheckIn(address player) external view returns (uint) {
        return playerDb[player].lastCheckIn;
    }

    function getStats(address player) external view returns (uint256, uint256, uint256) {
        return (playerDb[player].wins,
                playerDb[player].losses,
                playerDb[player].numPlayerMonsters);
    }

    function grantAdmin(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(DEFAULT_ADMIN_ROLE, account);
    }

}