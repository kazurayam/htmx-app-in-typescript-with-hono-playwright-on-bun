// src/index.tsx
import { Hono } from 'hono'
import type { FC } from 'hono/jsx'

export const app = new Hono()
    .get('/', (c) => {
        const messages = ['Hello htmx!']
        return c.render(
            <Top messages={messages} />
        )
    })
    .get('/hello', (c) => {
        return c.render(
            <p>こんにちは!</p>
        )
    })

const Layout: FC = (props) => {
    return (
        <html>
            <head>
                <title>htmx sample</title>
                <script src="https://unpkg.com/htmx.org@2"></script>
            </head>
            <body>{props.children}</body>
        </html>
    )
}

const Top: FC<{ messages: string[] }> = (props: {
    messages: string[]
}) => {
    return (
        <Layout>
            {
                props.messages.map((message) => {
                    return <p>{message}</p>
                })
            }
            <button hx-get="/hello" hx-target="#result">
                読み込み
            </button>
            <div id="result">ここに結果が表示されます</div>
        </Layout>
    )
}

export { BrowserDriverChromium } from '../tests/BrowserDriverChromium'
export { }
