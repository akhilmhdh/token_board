import { writable } from "svelte/store";

let socket;
if (process.browser) {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    socket = new WebSocket(`${protocol}//${window?.location?.host}`);
    socket.addEventListener("open", function (event) {
        console.log("It's open");
    });

    socket.addEventListener("message", function (event) {
        console.log(event.data);
    });
}

const messageStore = writable("");

const sendMessage = (message) => {
    if (socket.readyState <= 1) {
        socket.send(message);
    }
};

export default {
    subscribe: messageStore.subscribe,
    sendMessage,
};
