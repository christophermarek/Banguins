// Deploys all contracts in the correct order based on dependencies
// The order is as follow:
//   VRFRandomNumbers
//   GameConstants
//   Monsters
//   Players
//   BTokens
//   Marketplace
//   Battle

const VRFRandomNumbers = artifacts.require("VRFRandomNumbers");
const GameConstants = artifacts.require("GameConstants");
const Monsters = artifacts.require("Monsters");
const Players = artifacts.require("Players");
const BTokens = artifacts.require("BTokens");
const Marketplace = artifacts.require("Marketplace");
const Battle = artifacts.require("Battle");
const subId = 878;

module.exports = async function (deployer) {
    // VRFRandomNumbers
    await deployer.deploy(VRFRandomNumbers, subId);
    let vrf = await VRFRandomNumbers.deployed();
    // GameConstants
    await deployer.deploy(GameConstants);
    await deployer.link(GameConstants, [BTokens, Battle]);
    // Monsters
    await deployer.deploy(Monsters, vrf.address);
    let monsters = await Monsters.deployed();
    // Players
    await deployer.deploy(Players);
    let players = await Players.deployed();
    // BTokens
    await deployer.deploy(BTokens, players.address, monsters.address);
    let tokens = await BTokens.deployed();
    // Marketplace
    await deployer.deploy(Marketplace, tokens.address, players.address);
    let market = await Marketplace.deployed();
    // Battle
    await deployer.deploy(Battle, tokens.address, players.address);
    let battle = await Battle.deployed();

    // Set permissions
    await tokens.grantAdmin(market.address);
    await players.grantAdmin(market.address);
    await tokens.grantMinter(battle.address);
    await players.grantAdmin(battle.address);

};
