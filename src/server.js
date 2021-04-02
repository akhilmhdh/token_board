import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";
import http from "http";
import WebSocket from "ws";

import dotenv from "dotenv";

dotenv.config();
import { Booth, BoothSync } from "./db";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

BoothSync();

const server = http.createServer();

polka({ server }) // You can also use Express
    .use(compression({ threshold: 0 }), sirv("static", { dev }), sapper.middleware())
    .listen(PORT, "0.0.0.0", (err) => {
        if (err) console.log("error", err);
    });

let numUsers = 0;

const wss = new WebSocket.Server({
    server,
});

function broadcast(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

wss.on("connection", async (ws, req) => {
    const booths = await Booth.findAll();
    ++numUsers;
    ws.send(`p-${JSON.stringify(booths)}`);

    ws.on("message", async (data) => {
        switch (data) {
            case "c":
                const booth = await Booth.create({ counter: 0, token: 0 });
                broadcast(`n-${JSON.stringify(booth)}`);
                break;
            default:
                broadcast(data);
                break;
        }
    });

    ws.on("close", () => {
        console.log("user left");
        --numUsers;
        ws.send("exit");
    });
});
