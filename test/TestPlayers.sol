// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "truffle/Assert.sol";
import "../contracts/Players.sol";

contract TestPlayers {

    address player1 = 0xe7315b26Ab091c676C8eEd405730463B2903C98d;
    address player2 = 0x359F200176b6514bcEb10dF9DdD0674dEAdd03DB;

    Players players = new Players();

    function testStats() public {
        players.increaseWins(player1);
        players.increaseWins(player1);
        players.increaseLosses(player1);
        players.increaseMonsters(player1, 5);
        players.decreaseMonsters(player1, 3);

        (uint256 p1wins, uint256 p1loss, uint256 p1mon) = players.getStats(player1);
        Assert.equal(p1wins, 2, "player1 wins should be 2");
        Assert.equal(p1loss, 1, "player1 losses should be 1");
        Assert.equal(p1mon, 2, "player1 number of monsters should be 2");

        players.increaseWins(player2);
        players.increaseLosses(player2);
        players.increaseLosses(player2);
        players.increaseMonsters(player2, 2);
        try players.decreaseMonsters(player2, 3) {
            Assert.fail("was able to decrease monsters below zero");
        } catch {
            // do nothing as this is expected behavior
        }

        (p1wins, p1loss, ) = players.getStats(player1);
        (uint256 p2wins, uint256 p2loss, ) = players.getStats(player2);
        Assert.isAbove(p1wins, p2wins, "player1 wins should be higher than player2");
        Assert.isAbove(p2loss, p1loss, "player2 losses should be higher than player1");
        
    }
}