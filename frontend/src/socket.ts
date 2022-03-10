import { io } from "socket.io-client";
import { baseURL } from "./api/api";

export const socket = io(baseURL);

type Callback = {
    callbackId: string;
    callback: (data: any) => void;
};
let callbacks: { [key: string]: Array<Callback> } = {};

export const registerCallback = (callbackId: string, event: string, callback: (data: any) => void) => {
    const newCallbacks = { ...callbacks };
    newCallbacks[event] = [...(newCallbacks[event] ?? []), { callbackId, callback }];
    callbacks = newCallbacks;

    console.log("Registered callback", callbackId);
};

export const removeCallback = (callbackId: string, event: string) => {
    const newCallbacks = { ...callbacks };
    newCallbacks[event] = newCallbacks[event]?.filter((callback) => callback.callbackId !== callbackId);
    callbacks = newCallbacks;

    console.log("Removed callback", callbackId);
};

const callCallbacks = (event: string, data: any) => {
    const eventCallbacks = callbacks[event] ?? [];

    for (const item of eventCallbacks) {
        item.callback(data);
    }
};

socket.on("connect", () => {
    console.log("Connected");
});

socket.on("battle", (data) => {
    callCallbacks("battle", data);
});
