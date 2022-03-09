import { io } from "socket.io-client";

// export const socket = io("localhost:8000");
export const socket = io("https://banguins.herokuapp.com/");

export let socket_id = '';
socket.on('connect', () => {
    socket_id = socket.id;
})       
                    

