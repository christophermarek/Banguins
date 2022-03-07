import express from 'express';
import cors from 'cors'
import routes from './routes';
import { Server } from 'socket.io';
import { process_socket_message } from './battle';
import { lobbies } from './lobby';

const app = express();
const port = 8000;


// type defs i have no idea
const http = require('http');
// SOCKET IO DEFAULTS TO PORT 8000, how do i change or make both use the same port
const server = http.createServer(app);
export const io: Server = new Server(server,
    {cors: {
        // change this to frontend prod url when we get there
        origin: "*",
        methods: ["GET", "POST"]
    }});


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
        //THIS LOGIC DOES NOT WORK
        // for(let i = 0; i < lobbies.length; i++){
        //     if(lobbies[i].player1_conn && lobbies[i].player1_conn === connId){
        //         // remove lobby from list
        //         lobbies.splice(i, 1);
        //         if(lobbies[i].player2_conn !== ''){
        //             io.to(lobbies[i].player2_conn).emit('battle', {opponent_left: true})
        //             break;
        //         }
        //     }
        //     if(lobbies[i].player2_conn && lobbies[i].player2_conn === connId){
        //         // remove lobby from list
        //         lobbies.splice(i, 1);
        //         if(lobbies[i].player1_conn !== ''){
        //             io.to(lobbies[i].player1_conn).emit('battle', {opponent_left: true})
        //             break;
        //         }
        //     }
        // }
    });
});






app.use(express.json());

app.use(cors())
app.use(routes)


// This is for heroku, heroku dynamically assigns port
server.listen(process.env.PORT || port, () => {
  console.log(`Server is running on port ${port}.`);
});


