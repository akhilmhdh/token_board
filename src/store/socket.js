import io from "socket.io-client";
import { writable } from "svelte/store";

const socket = io();

const messageStore = writable("");

socket.on("message", function (message) {
    console.log("message", message);
});

socket.on("user joined", function (message) {
    console.log("message", message);
});

const sendMessage = (message) => {
    socket.emit("message", { message });
};

export default {
    subscribe: messageStore.subscribe,
    sendMessage,
};
