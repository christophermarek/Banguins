import express from 'express';
import cors from 'cors'
import routes from './routes';
import { Server } from 'socket.io';
import { process_socket_message } from './battle';
import { lobbies } from './lobby';

const app = express();
const port = 8000;


const http = require('http');
const server = http.createServer(app);
export const io: Server = new Server(server,
    {
        cors: {
            // change this to frontend prod url when we get there
            origin: "*",
            methods: ["GET", "POST"]
        }
    });


io.on('connection', (socket) => {
    console.log('a user connected');

    let connId = socket.id;

    // number of users connected
    console.log(io.engine.clientsCount);

    socket.on(('battle'), (socket) => {
        process_socket_message(connId, socket)
    })


    socket.on('disconnect', () => {
        console.log('user disconnected');

        try {
            let index: number;
            let isPlayer1: boolean = false;
            for (let i = 0; i < lobbies.length; i++) {
                if (lobbies[i] != undefined) {
                    if (lobbies[i].player1_conn && lobbies[i].player1_conn === connId) {
                        index = i;
                        isPlayer1 = true;
                    }
                    if (lobbies[i].player2_conn && lobbies[i].player2_conn === connId) {
                        index = i;
                        isPlayer1 = false;
                    }
                }
            }
            if (index !== undefined) {
                // notify other player of disconnect
                if (isPlayer1) {
                    if (lobbies[index].player2_conn !== '') {
                        io.to(lobbies[index].player2_conn).emit('battle', { opponent_left: 'Opponent Disconnected' });
                    }
                } else {
                    // if theres a player 2 theres always a player 1
                    io.to(lobbies[index].player1_conn).emit('battle', { opponent_left: 'Opponent Disconnected' });
                }

                lobbies.splice(index, 1);
            }
        } catch (error) {
            console.log('error deleting opponent');
            console.log(error);
        }

    });
});






app.use(express.json());

app.use(cors())
app.use(routes)


// This is for heroku, heroku dynamically assigns port
server.listen(process.env.PORT || port, () => {
    console.log(`Server is running on port ${port}.`);
});


