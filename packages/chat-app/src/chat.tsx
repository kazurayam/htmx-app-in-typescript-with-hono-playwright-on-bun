// src/chat.tsx
import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { Top } from './top';
import { upgradeWebSocket, websocket } from 'hono/bun';
import type { WSMessageReceive } from 'hono/ws';
import { WSContext } from 'hono/ws';

import { getLogger } from '@logtape/logtape';
import '../logtape.ts'
const logger = getLogger(["chat-app", "chat"]);

const app = new Hono();
app.use('*', serveStatic({ root: './static' }))

app.get('/', (c) => {
    const messages = ['']
    return c.render(
        <Top messages={messages}></Top>
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
                //console.log(event.data)
                let input_name = data.name;
                let input_msg = data.message;
                logger.debug(`data.message: ${input_msg}`);
                const now = new Date();
                const options: Intl.DateTimeFormatOptions = {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                }
                const now_jst = new Intl.DateTimeFormat('ja-JP', options).format(now);
                const tag = (
                    <div hx-swap-oob="beforeend:#messages" >
                        <span>
                            <span style="color:green; padding-right:0.5em;">{input_name}</span>
                            <span style="color:blue; padding-right:0.5em;">{now_jst}</span>
                            <span>{input_msg}</span>
                        </span>
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
