// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "truffle/Assert.sol";
import "../contracts/Players.sol";
import "../contracts/BTokens.sol";
import "../contracts/Battle.sol";
import "../contracts/Monsters.sol";
import "../contracts/VRFRandomNumbers.sol";
import "../contracts/GameConstants.sol";

contract TestBattle {
    address player1 = 0xe7315b26Ab091c676C8eEd405730463B2903C98d;
    address player2 = 0x359F200176b6514bcEb10dF9DdD0674dEAdd03DB;

    Players players = new Players();
    VRFRandomNumbers random = new VRFRandomNumbers(878);
    Monsters monsters = new Monsters(random);
    BTokens token = new BTokens(players, monsters);
    Battle battle = new Battle(token, players);

    function testStartBattle() public {
        token.setApprovalForPlayerTokens(player1, address(battle));
        token.setApprovalForPlayerTokens(player2, address(battle));
        token.grantRole(token.MINTER_ROLE(), address(battle));

        token.mint(player1, GameConstants.NRGY, 5, "");
        token.mint(player2, GameConstants.NRGY, 5, "");

        battle.startBattle(player1, player2, 4, 3);

        Assert.equal(token.balanceOf(player1, GameConstants.NRGY), 1, "player 1 NRGY after start battle not spent correctly");
        Assert.equal(token.balanceOf(player2, GameConstants.NRGY), 2, "player 2 NRGY after start battle not spent correctly");
    }

    function testEndBattle() public {
        players.grantRole(players.DEFAULT_ADMIN_ROLE(), address(battle));
        battle.endBattle(player1, player2);
        (uint256 p1wins, , ) = players.getStats(player1);
        ( , uint256 p2loss, ) = players.getStats(player2);
        Assert.equal(p1wins, 1, "player1 wins should be 1");
        Assert.equal(p2loss, 1, "player2 losses should be 1");
        Assert.equal(token.balanceOf(player1, GameConstants.CRNCY), GameConstants.CRNCY_WIN_AMOUNT, "winner did not earn proper CRNCY after battle");
    }
}

