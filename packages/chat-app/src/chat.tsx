// src/chat.tsx
import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { Top } from './top';
import { upgradeWebSocket, websocket } from 'hono/bun';
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

app.get(
    '/chatroom',
    upgradeWebSocket(() => {
        return {
            onOpen: () => {
                logger.debug('Connection opened');
            },
            onMessage: (event, ws) => {
                const data = JSON.parse(event.data.toString());
                logger.debug(`Message from client: ${data.message}`)
                const tag = (
                    <div hx-swap-oob="beforeend:#messages" >
                        <span>{data.message}</span>
                    </div>
                );
                ws.send(tag.toString());
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
