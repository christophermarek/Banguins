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

    uint256[] ids = [2,3,4];
    uint256[] amounts = [2,2,2];

    function testMintingAndBalance() public {
        token.mintBatch(player1, ids, amounts, "");
        players.increaseMonsters(player1, 6);
        for (uint8 i; i < 3; i++) {
            monsters.addMonster(ids[i], Monsters.Rarity.Common);
        }

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
}