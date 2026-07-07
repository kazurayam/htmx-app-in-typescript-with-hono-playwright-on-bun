import { Hono } from 'hono'
import { Top } from './top';
import { serveStatic } from '@hono/node-server/serve-static'
import { Task } from './task';

const app = new Hono();
app.use('*', serveStatic({ root: './static' }))

app.get('/', (c) => {
    const messages = [''];
    return c.render(
        <Top messages={messages} />
    )
});

app.post("/add", async (c) => {
    const formData = await c.req.formData();
    const task = formData.get("task") as string;
    return c.html(`<li>
        <p>${task}</p>
        <button class="delete-btn" hx-target="closest li" hx-delete="/delete"
            hx-trigger='click' hx-ext='json-enc'
            hx-vals='{"task": "${task}"}' hx-swap="delete"
            hx-confirm="${task} を本当に削除しますか？">削除</button>
    </li>`);
});

app.delete("/delete", async (c) => {
    c.status(204);
    return c.text('');
});

export default app;
