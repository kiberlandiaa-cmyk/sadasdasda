const express = require("express");
const app = express();
const { Server } = require("ws")
app.use(express.json())
app.use(express.static("."))


const httpServer = app.listen(3000, () => console.log("server started"));


const wsS = new Server({ server: httpServer });
const clients = new Set();
let counter = 0;

wsS.on("connection", (ws) => {
    clients.add(ws);    

    ws.on("message", (message) => {
        let data = message.toString()
        let parsed = null;
        try {
            parsed = JSON.parse(data)
        } catch {}

        
        if (parsed && parsed.type == "delete"){
            for (const client of clients){
                client.send(JSON.stringify({ type: "delete", div: parsed.div }));
            }
            return
        }


        const msg = JSON.stringify({ type: "message", id: `msg-${++counter}`, text: data });
        for (const client of clients) {
            client.send(msg);
        }
    });

    ws.on("close", () => clients.delete(ws));
});