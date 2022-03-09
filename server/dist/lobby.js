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
exports.join_lobby = exports.create_lobby = exports.get_lobbies = exports.lobbies = void 0;
const app_1 = require("./app");
exports.lobbies = [];
// increments every request until server restart
let lobby_id = 0;
const get_lobbies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ lobbies: exports.lobbies });
    }
    catch (error) {
        res.status(400).json({ error: error });
    }
});
exports.get_lobbies = get_lobbies;
const create_lobby = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check for errors?
        const player = req.body.wallet;
        // check if player already created a lobby
        for (let i = 0; i < exports.lobbies.length; i++) {
            if (exports.lobbies[i] !== undefined) {
                if (exports.lobbies[i].player1_addr === player || exports.lobbies[i].player2_addr === player) {
                    res.status(200).json({ message: 'Error Creating Lobby, you already have one' });
                    return;
                }
            }
        }
        const cards = req.body.cards;
        const socketId = req.body.socketId;
        exports.lobbies[lobby_id] = { lobby_id: lobby_id, player1_addr: player, player1_conn: socketId, player1_cards: cards, player2_addr: '', player2_conn: '', player2_cards: [], lobby_status: 'lobby', battle: { round: 0, player1move: null, player2move: null } };
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
        // check for errors?
        const player = req.body.wallet;
        const cards = req.body.cards;
        const param_lobby_id = req.body.lobby_id;
        const socketId = req.body.socketId;
        // check if lobby_id exists in lobbies
        if (exports.lobbies[param_lobby_id] === undefined) {
            res.status(400).json({ error: 'invalid lobby id' });
        }
        else {
            exports.lobbies[param_lobby_id].player2_addr = player;
            exports.lobbies[param_lobby_id].player2_cards = cards;
            exports.lobbies[param_lobby_id].player2_conn = socketId;
            exports.lobbies[param_lobby_id].lobby_status = 'match';
            res.status(200).json({ status: 'Match started' });
        }
        console.log(exports.lobbies[param_lobby_id]);
        app_1.io.to(exports.lobbies[param_lobby_id].player1_conn).emit('battle', exports.lobbies[param_lobby_id]);
        app_1.io.to(exports.lobbies[param_lobby_id].player2_conn).emit('battle', exports.lobbies[param_lobby_id]);
        // send start battle to smart contract
    }
    catch (error) {
        res.status(400).json({ error: error });
    }
});
exports.join_lobby = join_lobby;
