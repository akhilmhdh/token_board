import { writable } from "svelte/store";

let socket;
const messageStore = writable("");
if (process.browser) {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    socket = new WebSocket(`${protocol}//${window?.location?.host}`);

    socket.addEventListener("open", function (msg) {
        messageStore.set(msg.data);
    });

    socket.addEventListener("message", function (msg) {
        messageStore.set(msg.data);
    });
}

const sendMessage = (message) => {
    if (socket.readyState <= 1) {
        socket.send(message);
    }
};

export default {
    subscribe: messageStore.subscribe,
    sendMessage,
};
