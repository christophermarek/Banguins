import { Response, Request } from "express"
import { io } from "./app";
import monsters from "./monsters";

interface lobby_i {
    lobby_id: number
    player1_addr: string,
    player1_conn: string,
    player1_cards: any[],
    player2_addr: string,
    player2_conn: string,
    player2_cards: any[],
    lobby_status: string
    battle: { round: number, player1move: any, player2move: any }
}

export interface card {
    health: number,
    attack: number,
    address: string
}

export let lobbies: lobby_i[] = [];

// increments every request until server restart
let lobby_id = 0;

export const get_lobbies = async (req: Request, res: Response): Promise<void> => {
    try {

        res.status(200).json({ lobbies: lobbies });

    } catch (error) {

        res.status(400).json({ error: error });

    }
}

export const create_lobby = async (req: Request, res: Response): Promise<void> => {
    try {
        // check for errors?

        const player = req.body.wallet;

        // check if player already created a lobby
        for (let i = 0; i < lobbies.length; i++) {
            if (lobbies[i] !== undefined) {
                if (lobbies[i].player1_addr === player || lobbies[i].player2_addr === player) {
                    res.status(200).json({ message: 'Error Creating Lobby, you already have one' });
                    return;
                }
            }
        }

        const cards = req.body.cards;
        const socketId = req.body.socketId;

        lobbies[lobby_id] = { lobby_id: lobby_id, player1_addr: player, player1_conn: socketId, player1_cards: cards, player2_addr: '', player2_conn: '', player2_cards: [], lobby_status: 'lobby', battle: { round: 0, player1move: null, player2move: null } };
        res.status(200).json({ lobby_id: lobby_id });
        lobby_id += 1;

    } catch (error) {

        res.status(400).json({ error: error });

    }
}


export const join_lobby = async (req: Request, res: Response): Promise<void> => {
    try {
        // check for errors?
        const player = req.body.wallet;
        const cards = req.body.cards;
        const param_lobby_id = req.body.lobby_id;
        const socketId = req.body.socketId;


        // check if lobby_id exists in lobbies
        if (lobbies[param_lobby_id] === undefined) {
            res.status(400).json({ error: 'invalid lobby id' });
        } else {

            if (lobbies[param_lobby_id].player2_addr === '') {
                lobbies[param_lobby_id].player2_addr = player;
                lobbies[param_lobby_id].player2_cards = cards;
                lobbies[param_lobby_id].player2_conn = socketId;
                lobbies[param_lobby_id].lobby_status = 'match';

                res.status(200).json({ status: 'Match started' });
                io.to(lobbies[param_lobby_id].player1_conn).emit('battle', lobbies[param_lobby_id]);
                io.to(lobbies[param_lobby_id].player1_conn).emit('battle', lobbies[param_lobby_id]);
                io.to(lobbies[param_lobby_id].player2_conn).emit('battle', lobbies[param_lobby_id]);
            } else {
                // player 1 initiating game after navigating to battle page
                console.log(lobbies[param_lobby_id])

                // convert id's to values
                for (let i = 0; i < lobbies[param_lobby_id].player1_cards.length; i++) {
                    let card = monsters[lobbies[param_lobby_id].player1_cards[i]]
                    lobbies[param_lobby_id].player1_cards[i] = { health: card.health, attack: card.attack, id: lobbies[param_lobby_id].player1_cards[i] }
                }
                for (let i = 0; i < lobbies[param_lobby_id].player2_cards.length; i++) {
                    let card = monsters[lobbies[param_lobby_id].player2_cards[i]]
                    lobbies[param_lobby_id].player2_cards[i] = { health: card.health, attack: card.attack, id: lobbies[param_lobby_id].player2_cards[i] }
                }

                io.to(lobbies[param_lobby_id].player1_conn).emit('battle', lobbies[param_lobby_id]);
                io.to(lobbies[param_lobby_id].player1_conn).emit('battle', lobbies[param_lobby_id]);
                io.to(lobbies[param_lobby_id].player2_conn).emit('battle', lobbies[param_lobby_id]);
                // send start battle to smart contract
            }
        }

    } catch (error) {

        res.status(400).json({ error: error });

    }
}