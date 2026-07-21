// src/chat.tsx
import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { Top } from './top';
import { upgradeWebSocket, websocket } from 'hono/bun';
import type { WSMessageReceive } from 'hono/ws';
import { WSContext } from 'hono/ws';

import { configure, getConsoleSink, getLogger } from '@logtape/logtape';
import { getFileSink } from '@logtape/file';
await configure({
    sinks: {
        console: getConsoleSink(),
        file: getFileSink("./out/chat-app.log", {
            flushInterval: 1000,
            nonBlocking: true,
        })
    },
    loggers: [
        { category: ["chat-app"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["logtape","meta"], lowestLevel: "warning", sinks: ["console"] }
    ]
});
const logger = getLogger(["chat-app", "chat"]);

const app = new Hono();
app.use('*', serveStatic({ root: './static' }))

app.get('/', (c) => {
    const messages = ['']
    return c.render(
        <Top messages={ messages }></Top>
    );
})

//type Message = { message: string };

let clients: Set<WSContext> = new Set();

app.get(
    '/chatroom',
    upgradeWebSocket(() => {
        return {
            onOpen: () => {
                logger.debug('Connection opened');
            },
            onMessage: (event: MessageEvent<WSMessageReceive>, ws: WSContext) => {
                clients.add(ws);
                const data = JSON.parse(event.data.toString());
                logger.debug(`data.message: ${data.message}`);
                const tag = (
                    <div hx-swap-oob="beforeend:#messages" >
                        <span>{data.message}</span>
                    </div>
                );
                for (let client of clients) {
                    client.send(tag.toString());
                }
            },
            onClose: () => {
                logger.debug('Connection closed');
            }
        }
    })

);

export default {
    port: 8000,
    fetch: app.fetch,
    websocket
}
