// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "truffle/Assert.sol";
import "../contracts/Players.sol";
import "../contracts/Monsters.sol";
import "../contracts/GameConstants.sol";
import "../contracts/BTokens.sol";
import "../contracts/Marketplace.sol";


contract TestBTokens {

    address player1 = 0xe7315b26Ab091c676C8eEd405730463B2903C98d;
    address player2 = 0x359F200176b6514bcEb10dF9DdD0674dEAdd03DB;

    Players players = new Players();
    VRFRandomNumbers random = new VRFRandomNumbers(878);
    Monsters monsters = new Monsters(random);
    BTokens token = new BTokens(players, monsters);
    Marketplace market = new Marketplace(token, players);

    uint256[] ids = [2,3,4];
    uint256[] amounts = [2,2,2];

    function beforeEach() public {
        token.mintBatch(player1, ids, amounts, "");
        players.increaseMonsters(player1, 6);
        for (uint8 i; i < 3; i++) {
            monsters.addMonster(ids[i], Monsters.Rarity.Common);
        }
    }

    function testMintingAndBalance() public {
        (uint256[] memory player_ids, uint256[] memory player_amounts) = token.balanceOfPlayer(player1);
        ( , , uint256 p1mon) = players.getStats(player1);
        Assert.equal(monsters.numMonsters(), 3, "incorrect total number of monsters");
        Assert.equal(p1mon, 6, "incorrect player number of monsters");
        uint256 rarityId;
        for (uint8 i; i < 3; i++) {
            rarityId = monsters.rarityToMonsters(Monsters.Rarity.Common, i);
            Assert.equal(rarityId, ids[i], "monster id not correctly added to rarities");
            Assert.equal(player_ids[i+2], ids[i], "incorrect player monster ids");
            Assert.equal(player_amounts[i+2], amounts[i], "incorrect player monster amounts");
        }
    }

    function testBuyMonster() public {
        token.setApprovalForPlayerTokens(player1, address(market));
        token.setApprovalForPlayerTokens(player2, address(market));
        token.grantRole(token.DEFAULT_ADMIN_ROLE(), address(market));

        token.mint(player2, GameConstants.CRNCY, 20, "");
        market.buyMonster(player1, player2, 2, 10);

        (uint256[] memory player1_ids, uint256[] memory player1_amounts) = token.balanceOfPlayer(player1);
        (uint256[] memory player2_ids, uint256[] memory player2_amounts) = token.balanceOfPlayer(player2);
        ( , , uint256 p1mon) = players.getStats(player1);
        ( , , uint256 p2mon) = players.getStats(player2);
        Assert.equal(p1mon, 5, "incorrect player number of monsters");
        Assert.equal(p2mon, 1, "incorrect player number of monsters");
        // player 1: [1,2,3,4] ids
        // player 1: [10,2,2,1] amounts
        // player 2: [1,4] ids
        // player 2: [10,1] amounts
        uint8[] memory expected_ids = new uint8[](4);
        expected_ids[0] = GameConstants.CRNCY;
        expected_ids[1] = 2;
        expected_ids[2] = 3;
        expected_ids[3] = 4;

        uint8[] memory expected_amounts = new uint8[](4);
        expected_amounts[0] = 10;
        expected_amounts[1] = 2;
        expected_amounts[2] = 2;
        expected_amounts[3] = 1;

        for (uint8 i; i < player1_ids.length; i++) {
            Assert.equal(player1_ids[i], expected_ids[i], "incorrect player monster ids");
            Assert.equal(player1_amounts[i], expected_amounts[i], "incorrect player monster amounts");
        }

        expected_ids[1] = 4;
        expected_amounts[1] = 1;
        for (uint8 i; i < player2_ids.length; i++) {
            Assert.equal(player2_ids[i], expected_ids[i], "incorrect player monster ids");
            Assert.equal(player2_amounts[i], expected_amounts[i], "incorrect player monster amounts");
        }
    }
}