// src/chat.tsx
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Top } from './top';
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

const server = serve({
    port: 8000,
    fetch: app.fetch
});

console.log(`start http://localhost:8000`);

export default server;
