// main.tsx
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import Top from './top'
import Section3 from './section3'
import Section4 from './section4'
import Section5 from './section5'
import Section6 from './section6'
import Section7 from './section7'
import Section8 from './section8'
import Section9 from './section9'
import Section10 from './section10'
import Section11 from './section11'
import Section12 from './section12'

const app = new Hono()

app.use('*', serveStatic({ root: './static' }))

app.get('/', (c) => {
    const messages = ['Hello htmx']
    return c.render(
        <Top messages={ messages } />
    )
})

app.on(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], '/hello', (c) => {
    if (c.req.method == "GET") {
        return c.render(<span style='color:#ff0000;'>GETリクエスト!</span>)
    } else if (c.req.method == "POST") {
        return c.render(<span style='color:#00bf00;'>POSTリクエスト!</span>)
    } else if (c.req.method == "PUT") {
        return c.render(<span style='color:#0000ff;'>PUTリクエスト!</span>)
    } else if (c.req.method == "PATCH") {
        return c.render(<span style='color:#ff00ff;'>PATCHリクエスト!</span>)
    } else if (c.req.method == "DELETE") {
        return c.render(<span style='color:#ff0000;'>DELETEリクエスト!</span>)
    } else {
        throw new Error('unexpected c.req.method=' + c.req.method)
    }
})

app.get('/yahoo', (c) => {
    return c.render(<span style='color:#ff0000'>やっほー!</span>)
})

app.get('/section3', (c) => {
    const messages = ['Hello htmx']
    return c.render(
        <Section3 messages={messages} />
    )
})

app.get('/section4', (c) => {
    const messages = ['Hello htmx']
    return c.render(
        <Section4 messages={messages} />
    )
})

app.get('/section5', (c) => {
    const messages = ['Hello htmx']
    return c.render(
        <Section5 messages={messages} />
    )
})

app.get('/section6', (c) => {
    const messages = ['Hello htmx']
    return c.render(
        <Section6 messages={messages} />
    )
})

app.get('/section7', (c) => {
    const messages = ['Hello htmx']
    return c.render(
        <Section7 messages={messages} />
    )
})

app.get('/section8', (c) => {
    const messages = ['Hello htmx']
    return c.render(
        <Section8 messages={messages} />
    )
})

app.get('/section9', (c) => {
    const messages = ['Hello htmx']
    return c.render(
        <Section9 messages={messages} />
    )
})

app.get('/section10', (c) => {
    const messages = ['Hello htmx']
    return c.render(
        <Section10 messages={messages} />
    )
})

app.get('/section11', (c) => {
    const messages = ['Hello htmx']
    return c.render(
        <Section11 messages={messages} />
    )
})

app.get('/section12', (c) => {
    const messages = ['Hello htmx']
    return c.render(
        <Section12 messages={messages} />
    )
})

app.get("/random", (c) => {
    const random_number: number = getRandomInt(100);
    const html_content: string =
        `<p style='color:#ff0000;'>${random_number}</p>`;
    return c.render(html_content);
})

app.get("/random_polling", (c) => {
    const random_number: number = getRandomInt(100);
    const html_content: string =
        `<p style='color:#ff0000;' hx-get='random_polling'
            hx-trigger='load delay:1s'>${random_number}</p>`;
    return c.render(html_content);
})

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

app.post("/now", (c) => {
    const now: string = new Date().toLocaleString();
    return c.render(`<div>${now}</div>`)
})

const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
app.get("/heavy", async (c) => {
    await sleep(5000);    // sleep for 5s
    return c.render(`<span style='color:#ff0000;'>ロード完了!</span>`)
})

app.get("/ja-saying", async (c) => {
    return c.render(`
        <p>挑戦を受け入れよう。それらは成長への踏み石なのだから。</p>
    <button hx-get='/en-saying' hx-swap='innerHTML transition:true' hx-target='closest div'>
        原文に戻す
    </button>
        `)
})

app.get("/en-saying", async (c) => {
    return c.render(`
        <p>Embrace challenges, for they are the stepping stones to growth.</p>
    <button hx-get='/ja-saying' hx-swap='innerHTML transition:true' hx-target='closest div'>
        翻訳する
    </button>
        `)
})

app.get("/update-title", async (c) => {
    return c.render(`
        <title>New Title</title>
        <p>hello!</p>
        `)
})

app.post("/send-form", async (c) => {
    await sleep(1000);    // sleep for 1s
    console.log("Content-Type: " + c.req.header('Content-Type'))
    return c.render(`<span style='color:#ff0000; font-weight: bold;'>送信完了しました。${await c.req.text()}</span>`)
})

app.post("/validate", async (c) => {
    await sleep(1000);    // sleep for 1s
    return c.render(`<span style='color:#ff0000; font-weight: bold;'>正しい値を入力してください</span>`)
})

app.on(["GET", "POST"], "/greeting", async (c) => {
    return c.render(`<span style='color:#ff0000; font-weight: bold;'>送信完了しました! ${await c.req.text()}</span>`)
})

app.on(["GET", "POST"], "/last-key", async (c) => {
    return c.render(`<span style="color:#ff0000; font-weight: bold;">最後に押したキーは「${await c.req.text()}」です。</span>`)
})

const server = serve({
    port: 3001,
    fetch: app.fetch
})

export default server
