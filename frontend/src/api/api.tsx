import axios, { AxiosRequestConfig } from "axios";

export const baseURL = "https://banguins.herokuapp.com";
//  "http://localhost:8000";
// "http://localhost:8000";
// "https://banguins.herokuapp.com";
// process.env.NODE_ENV === "development" ? "localhost:8000" : "https://banguins.herokuapp.com";
    

const instance = axios.create({
    baseURL,
    timeout: 10000,
});

export const joinLobby = (data: any) => instance.post("/join_lobby", data);

export const getLobbies = () => instance.get("/get_lobbies");

export const createLobby = (data: any) => instance.post("/create_lobby", data);

export const getBalance = (data: any) => instance.get(`/balance/${data.wallet_address}`, data);

export const getImagesFromIds = (data: any) => instance.get(`/images/${data.id}`, data);

