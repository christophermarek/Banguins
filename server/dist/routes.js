"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lobby_1 = require("./lobby");
const nft_1 = require("./nft");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.send('Server is running!');
});
//nft routes 
router.get('/nft/:wallet_address', nft_1.generate_nfts_and_upload);
// game routes
router.get('/get_lobbies', lobby_1.get_lobbies);
router.post('/create_lobby', lobby_1.create_lobby);
router.post('/join_lobby', lobby_1.join_lobby);
exports.default = router;
