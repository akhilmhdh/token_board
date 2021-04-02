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
    const booths = await Booth.findAll({ order: [["createdAt", "ASC"]] });
    ws.send(`p-${JSON.stringify(booths)}`);

    ws.on("message", async (data) => {
        if (!data) return;
        const key = data.charAt(0) === "t" ? "u" : data.charAt(0);
        const payload = data.substr(2);
        try {
            switch (key) {
                case "c":
                    {
                        const booth = await Booth.create({ counter: 0, token: 0 });
                        broadcast(`n-${JSON.stringify(booth)}`);
                    }
                    break;
                case "d":
                    {
                        await Booth.destroy({ where: { id: payload } });
                        const booths = await Booth.findAll({ order: [["counter", "ASC"]] });
                        broadcast(`p-${JSON.stringify(booths)}`);
                    }
                    break;
                case "u":
                    {
                        const [counter, token, id] = payload.trim().split("-");
                        await Booth.update(
                            { counter, token },
                            {
                                where: {
                                    id,
                                },
                            }
                        );
                        broadcast(data);
                    }
                    break;
                default:
                    broadcast(data);
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    });

    ws.on("close", () => {
        console.log("user left");
        ws.send("exit");
    });
});
