// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "nft.sol";
import "players.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Battle is AccessControl {
    // Fixed reward for currency
    uint256 public constant CRNCY_WIN_AMOUNT = 100;

    // Instance of BTokens to access balances of tokens for each player
    BTokens private tokens;
    Players private players;

    constructor(BTokens _tokens, Players _players) {
        tokens = _tokens;
        players = _players;
    }

    modifier checkAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Must have admin role to start a battle");
        _;
    }

    // Players submit their energy before a battle starts
    // In cases of disconnecting or rage quitting the energy will still be consumed
    function startBattle(address playerOne, address playerTwo, uint256 energyAmountOne, uint256 energyAmountTwo) external checkAdmin {
        // Burn tokens
        tokens.burn(playerOne, tokens.getNRGYConstant(), energyAmountOne);
        tokens.burn(playerTwo, tokens.getNRGYConstant(), energyAmountTwo);
    }

    // Reward CRNCY to victor and update player stats
    function endBattle(address victor, address loser) external checkAdmin {
        players.increaseWins(victor);
        players.increaseLosses(loser);
        tokens.mint(victor, tokens.getCRNCYConstant(), CRNCY_WIN_AMOUNT, "");
    }
}
