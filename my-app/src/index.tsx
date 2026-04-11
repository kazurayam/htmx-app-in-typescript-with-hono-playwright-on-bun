import { Hono } from 'hono'
import type { FC } from 'hono/jsx'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'

const app = new Hono()

app.use('*', serveStatic({ root: './public' }))

const Layout: FC = (props) => {
    return (
        <html>
        <head>
            <title>htmx sample </title>
            <script src="/htmx.js" defer></script>
        </head>
            <body>{ props.children }</body>
        </html>
    )
}

const Top: FC<{ messages: string[] }> = (props: {
    messages: String[]
}) => {
    return (
        <Layout>
            {
                props.messages.map((message) => {
                    return <p>{message}</p>
                })
            }
            <buton hx-get="/hello" hx-target="#result">
                読み込み
            </buton>
            <div id="result">ここに結果が表示されます</div>
        </Layout>
    )
}

app.get('/', (c) => {
    const messages = ['Hello htmx']
    return c.render(
        <Top messages={messages} />
    )
})

app.get('/hello', (c) => {
    return c.render(
        <p>こんにちは! <code><b>/hello</b></code></p>
    )
})

const server = serve(app)

export default server
