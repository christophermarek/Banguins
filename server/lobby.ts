import { Response, Request } from "express"

interface lobby_i{
    lobby_id: number
    player1_addr: string,
    player1_cards: [],
    player2_addr: string,
    player2_cards: []
}

let lobbies: lobby_i[] = [];

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

        const player = req.body.wallet;
        const cards = req.body.cards;
        // check for errors?
        
        lobbies[lobby_id] = {lobby_id: lobby_id, player1_addr: player, player1_cards: cards, player2_addr: '', player2_cards: []};
        res.status(200).json({ lobby_id: lobby_id });
        lobby_id += 1;

    } catch (error) {

        res.status(400).json({ error: error });

    }
}


export const join_lobby = async (req: Request, res: Response): Promise<void> => {
    try {

        const player = req.body.wallet;
        const cards = req.body.cards;
        const param_lobby_id = req.body.lobby_id;
        // check for errors?

        
        // check if lobby_id exists in lobbies
        if(lobbies[param_lobby_id] === undefined){
            res.status(400).json({ error: 'invalid lobby id'});
        }else{
            lobbies[param_lobby_id].player2_addr = player;
            lobbies[param_lobby_id].player2_cards = cards;
            res.status(200).json({ status: 'Match started' });
        }


    } catch (error) {

        res.status(400).json({ error: error });

    }
}