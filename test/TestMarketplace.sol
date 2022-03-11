// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "truffle/Assert.sol";
import "../contracts/Players.sol";
import "../contracts/Monsters.sol";
import "../contracts/GameConstants.sol";
import "../contracts/BTokens.sol";
import "../contracts/Marketplace.sol";


contract TestMarketplace {

    address player1 = 0xe7315b26Ab091c676C8eEd405730463B2903C98d;
    address player2 = 0x359F200176b6514bcEb10dF9DdD0674dEAdd03DB;

    Players players = new Players();
    VRFRandomNumbers random = new VRFRandomNumbers(878);
    Monsters monsters = new Monsters(random);
    BTokens token = new BTokens(players, monsters);
    Marketplace market = new Marketplace(token, players);

    function beforeEach() public {
        token.setApprovalForPlayerTokens(player1, address(market));
        token.setApprovalForPlayerTokens(player2, address(market));
        token.grantRole(token.DEFAULT_ADMIN_ROLE(), address(market));
        players.grantRole(players.DEFAULT_ADMIN_ROLE(), address(market));
    }


    function testBuyMonster() public {
        token.mint(player2, GameConstants.CRNCY, 10, "");
        token.mint(player1, 2, 1, "");
        players.increaseMonsters(player1, 1);
        monsters.addMonster(2, Monsters.Rarity.Common);

        market.buyMonster(player1, player2, 2, 10);

        (uint256[] memory player1_ids, uint256[] memory player1_amounts) = token.balanceOfPlayer(player1);
        (uint256[] memory player2_ids, uint256[] memory player2_amounts) = token.balanceOfPlayer(player2);
        ( , , uint256 p1mon) = players.getStats(player1);
        ( , , uint256 p2mon) = players.getStats(player2);
        // player1: [0,1] ids
        // player1: [0,10] amounts
        // player2: [0,1,2] ids
        // player2: [0,0,1]
        Assert.equal(p1mon, 0, "incorrect player number of monsters");
        Assert.equal(p2mon, 1, "incorrect player number of monsters");
        Assert.equal(player1_ids[0], GameConstants.NRGY, "incorrect player monster ids");
        Assert.equal(player1_ids[1], GameConstants.CRNCY, "incorrect player monster ids");
        Assert.equal(player2_ids[0], GameConstants.NRGY, "incorrect player monster ids");
        Assert.equal(player2_ids[1], GameConstants.CRNCY, "incorrect player monster ids");
        Assert.equal(player2_ids[2], 2, "incorrect player monster ids");
        Assert.equal(player1_amounts[0], 0, "incorrect player monster amounts");
        Assert.equal(player1_amounts[1], 10, "incorrect player monster amounts");
        Assert.equal(player2_amounts[0], 0, "incorrect player monster amounts");
        Assert.equal(player2_amounts[1], 0, "incorrect player monster amounts");
        Assert.equal(player2_amounts[2], 1, "incorrect player monster amounts");
        Assert.equal(player1_ids.length, 2, "incorrect array length for player ids");
        Assert.equal(player2_ids.length, 3, "incorrect array length for player ids");
    }
}