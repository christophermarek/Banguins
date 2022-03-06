"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.join_lobby = exports.create_lobby = exports.get_lobbies = void 0;
let lobbies = [];
// increments every request until server restart
let lobby_id = 0;
const get_lobbies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ lobbies: lobbies });
    }
    catch (error) {
        res.status(400).json({ error: error });
    }
});
exports.get_lobbies = get_lobbies;
const create_lobby = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const player = req.body.wallet;
        const cards = req.body.cards;
        // check for errors?
        lobbies[lobby_id] = { lobby_id: lobby_id, player1_addr: player, player1_cards: cards, player2_addr: '', player2_cards: [] };
        res.status(200).json({ lobby_id: lobby_id });
        lobby_id += 1;
    }
    catch (error) {
        res.status(400).json({ error: error });
    }
});
exports.create_lobby = create_lobby;
const join_lobby = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const player = req.body.wallet;
        const cards = req.body.cards;
        const param_lobby_id = req.body.lobby_id;
        // check for errors?
        // check if lobby_id exists in lobbies
        if (lobbies[param_lobby_id] === undefined) {
            res.status(400).json({ error: 'invalid lobby id' });
        }
        else {
            lobbies[param_lobby_id].player2_addr = player;
            lobbies[param_lobby_id].player2_cards = cards;
            res.status(200).json({ status: 'Match started' });
        }
    }
    catch (error) {
        res.status(400).json({ error: error });
    }
});
exports.join_lobby = join_lobby;
