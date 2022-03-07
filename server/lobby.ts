import { Response, Request } from "express"
import { io } from "./app";

interface lobby_i{
    lobby_id: number
    player1_addr: string,
    player1_conn: string,
    player1_cards: [],
    player2_addr: string,
    player2_conn: string,
    player2_cards: [],
    lobby_status: string
    battle: {round: number, player1move: any, player2move: any}
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
        const cards = req.body.cards;
        const socketId = req.body.socketId;
        
        lobbies[lobby_id] = {lobby_id: lobby_id, player1_addr: player, player1_conn: socketId, player1_cards: cards, player2_addr: '', player2_conn: '', player2_cards: [], lobby_status: 'lobby', battle:{round:0, player1move: null, player2move: null}};
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
        if(lobbies[param_lobby_id] === undefined){
            res.status(400).json({ error: 'invalid lobby id'});
        }else{
            lobbies[param_lobby_id].player2_addr = player;
            lobbies[param_lobby_id].player2_cards = cards;
            lobbies[param_lobby_id].player2_conn = socketId;
            lobbies[param_lobby_id].lobby_status = 'match';
            
            res.status(200).json({ status: 'Match started' });
        }

        console.log(lobbies[param_lobby_id])

        io.to(lobbies[param_lobby_id].player1_conn).emit('battle', lobbies[param_lobby_id]);
        io.to(lobbies[param_lobby_id].player2_conn).emit('battle', lobbies[param_lobby_id]);



    } catch (error) {

        res.status(400).json({ error: error });

    }
}