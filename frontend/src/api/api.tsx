import axios from "axios";

export const baseURL =
    process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000" : "https://banguins.herokuapp.com";

const instance = axios.create({
    baseURL,
    timeout: 10000,
});

export const joinLobby = (data: any) => instance.post("/join_lobby", data);

export const getLobbies = () => instance.get("/get_lobbies");

export const createLobby = (data: any) => instance.post("/create_lobby", data);
