import { Hono } from 'hono'
import { Top } from './top';
import { serveStatic } from '@hono/node-server/serve-static'

const app = new Hono();
app.use('*', serveStatic({ root: './static' }))

app.get('/', (c) => {
    const messages = [''];
    return c.render(
        <Top messages={messages} />
    )
});

export default app;
