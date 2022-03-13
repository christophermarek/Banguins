// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./BTokens.sol";
import "./Players.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./GameConstants.sol";

contract Battle is AccessControl {
    // Instance of BTokens to access balances of tokens for each player
    BTokens public tokens;
    Players public players;

    constructor(BTokens _tokens, Players _players) {
        tokens = _tokens;
        players = _players;
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    // Players submit their energy before a battle starts
    // In cases of disconnecting or rage quitting the energy will still be consumed
    function startBattle(
        address playerOne, 
        address playerTwo, 
        uint256 energyAmountOne, 
        uint256 energyAmountTwo
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        // Burn tokens
        tokens.burn(playerOne, GameConstants.NRGY, energyAmountOne);
        tokens.burn(playerTwo, GameConstants.NRGY, energyAmountTwo);
    }

    // Reward CRNCY to victor and update player stats
    function endBattle(address victor, address loser) external onlyRole(DEFAULT_ADMIN_ROLE) {
        players.increaseWins(victor);
        players.increaseLosses(loser);
        tokens.mint(victor, GameConstants.CRNCY, GameConstants.CRNCY_WIN_AMOUNT, "");
    }
}
