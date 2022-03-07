"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const socket_io_1 = require("socket.io");
const battle_1 = require("./battle");
const app = (0, express_1.default)();
const port = 8000;
// type defs i have no idea
const http = require('http');
// SOCKET IO DEFAULTS TO PORT 8000, how do i change or make both use the same port
const server = http.createServer(app);
exports.io = new socket_io_1.Server(server, { cors: {
        // change this to frontend prod url when we get there
        origin: "*",
        methods: ["GET", "POST"]
    } });
exports.io.on('connection', (socket) => {
    console.log('a user connected');
    let connId = socket.id;
    // number of users connected
    console.log(exports.io.engine.clientsCount);
    socket.on(('battle'), (socket) => {
        (0, battle_1.process_socket_message)(connId, socket);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
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
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(routes_1.default);
// This is for heroku, heroku dynamically assigns port
server.listen(process.env.PORT || port, () => {
    console.log(`Server is running on port ${port}.`);
});
