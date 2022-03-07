
import { io } from "./app";
import { lobbies } from "./lobby";


interface card {
    health: number,
    attack: number,
    address: string
}

export const process_socket_message = (socket_id, msg: { move: card, target: string }) => {

    for (let i = 0; i < lobbies.length; i++) {
        // valid message, player is in a lobby
        if (socket_id === lobbies[i].player1_conn || socket_id === socket_id[i].player2_conn) {

            // we only want to process messages from players in a match
            if (lobbies[i].lobby_status === 'match') {

                // The only moves we expect to recieve from the clients are the move
                let isPlayer1 = socket_id === lobbies[i].player1_conn ? true : false;

                // let move: card = msg.move;
                // let target: string = msg.target;

                // save move to lobbies battle obj
                if (isPlayer1) {
                    lobbies[i].battle.player1move = msg;
                } else {
                    lobbies[i].battle.player2move = msg;
                }

                // check if both players did move
                if (lobbies[i].battle.player1move !== null && lobbies[i].battle.player1move !== null) {
                    // calculate move on cards (random chance who goes first)
                    if (Math.random() >= 0.5) {
                        io.to(lobbies[i].player1_conn).emit('battle', {winner: lobbies[i].player1_addr});
                        io.to(lobbies[i].player2_conn).emit('battle', {winner: lobbies[i].player1_addr});
                    } else {
                        // player 2 first
                        io.to(lobbies[i].player1_conn).emit('battle', {winner: lobbies[i].player2_addr});
                        io.to(lobbies[i].player2_conn).emit('battle', {winner: lobbies[i].player2_addr});

                    }

                    // send back

                    // check win condition
                    // if win send message with winner
                    // delete lobby from lobbies

                    // if no win  then incrememnt round count and
                    // reset selected cards back to null

                } else {
                    // do nothing, maybe in future make this emit, waiting for opponents turn
                    // to update ui
                }


            }

        }
    }
}