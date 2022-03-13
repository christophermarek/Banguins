
import { io } from "./app";
import { card, lobbies } from "./lobby";




export const process_socket_message = (socket_id, msg: { move: card, target: string }) => {

    console.log('message recieved')
    for (let i = 0; i < lobbies.length; i++) {
        if (lobbies[i] !== undefined) {
            // valid message, player is in a lobby
            if (socket_id === lobbies[i].player1_conn || socket_id === lobbies[i].player2_conn) {

                // we only want to process messages from players in a match
                if (lobbies[i].lobby_status === 'match') {
                    // The only moves we expect to recieve from the clients are the move
                    let isPlayer1 = socket_id === lobbies[i].player1_conn ? true : false;

                    // let move: card = msg.move;
                    // let target: string = msg.target;

                    // save move to lobbies battle obj
                    if (isPlayer1) {

                        // need health, attack, id
                        // get your card
                        // get opponents card
                        lobbies[i].battle.player1move = msg;


                    } else {
                        lobbies[i].battle.player2move = msg;
                    }

                    // check if both players did move
                    if (lobbies[i].battle.player1move !== null && lobbies[i].battle.player2move !== null) {
                        console.log('both players attacked, processing');


                        // Player 1 first
                        let moveid = lobbies[i].battle.player1move.move;
                        let targetid = lobbies[i].battle.player1move.target;
                        // find player1 card to apply move
                        for (let j = 0; j < lobbies[i].player1_cards.length; j++) {
                            if (lobbies[i].player1_cards[j].id === moveid) {
                                if (lobbies[i].player1_cards[j].health > 0) {
                                    // find target
                                    for (let k = 0; k < lobbies[i].player2_cards.length; k++) {
                                        if (lobbies[i].player2_cards[k].id === targetid) {
                                            lobbies[i].player2_cards[k].health -= lobbies[i].player1_cards[j].attack;
                                            if (lobbies[i].player2_cards[k].health < 0) {
                                                lobbies[i].player2_cards[k].health = 0
                                            }
                                        }
                                    }
                                } else {
                                    // do nothing
                                }
                            }
                        }
                        // apply player 2 move
                        moveid = lobbies[i].battle.player2move.move;
                        targetid = lobbies[i].battle.player2move.target;
                        for (let j = 0; j < lobbies[i].player2_cards.length; j++) {
                            if (lobbies[i].player2_cards[j].id === moveid) {
                                if (lobbies[i].player2_cards[j].health > 0) {
                                    // find target
                                    for (let k = 0; k < lobbies[i].player1_cards.length; k++) {
                                        if (lobbies[i].player1_cards[k].id === targetid) {
                                            lobbies[i].player1_cards[k].health -= lobbies[i].player2_cards[j].attack;
                                            if (lobbies[i].player1_cards[k].health < 0) {
                                                lobbies[i].player1_cards[k].health = 0
                                            }
                                        }
                                    }
                                } else {
                                    // do nothing
                                }
                            }
                        }
                        
                        // check win condition
                        let p1_flag = true;
                        let p2_flag = true;
                        for (let j = 0; j < lobbies[i].player1_cards.length; j++) {
                            if (lobbies[i].player1_cards[j].health !== 0) {
                                p1_flag = false;
                            }
                            if (lobbies[i].player2_cards[j].health !== 0) {
                                p2_flag = false;
                            }
                        }
                        // if win send message with winner
                        // delete lobby from lobbies
                        if (p1_flag) {
                            // player 2 wins
                            io.to(lobbies[i].player1_conn).emit('battle', { winner: lobbies[i].player2_addr });
                            io.to(lobbies[i].player2_conn).emit('battle', { winner: lobbies[i].player2_addr });
                            lobbies.splice(i, 1)
                        } else if (p2_flag) {
                            io.to(lobbies[i].player1_conn).emit('battle', { winner: lobbies[i].player1_addr });
                            io.to(lobbies[i].player2_conn).emit('battle', { winner: lobbies[i].player1_addr });
                            lobbies.splice(i, 1)
                        } else {
                            // if no win  then incrememnt round count and
                            // reset selected cards back to null
                            lobbies[i].battle.round += 1;
                            lobbies[i].battle.player1move = null;
                            lobbies[i].battle.player2move = null;

                            // send back
                            io.to(lobbies[i].player1_conn).emit('battle', lobbies[i]);
                            io.to(lobbies[i].player2_conn).emit('battle', lobbies[i]);
                        }


                    } else {
                        // do nothing, maybe in future make this emit, waiting for opponents turn
                        // to update ui
                    }


                }

            }
        }
    }
}