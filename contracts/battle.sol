// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "nft.sol";

contract Battle {
    BTokens private _tokens;
    uint256 private battleCounter;

    constructor(BTokens tokens) {
        _tokens = tokens;
    }

    function startBattle(address player1, address player2, uint256 energy_amount1, uint256 energy_amount2) external {
        uint256 NRGY = _tokens.getNRGYConstant();
        _tokens.safeTransferFrom(player1, address(this), NRGY, energy_amount1, "");
        _tokens.safeTransferFrom(player2, address(this), NRGY, energy_amount2, "");
    }

    function endBattle(address victor) {

    }
}
