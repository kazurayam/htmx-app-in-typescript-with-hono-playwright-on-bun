import { Hono } from 'hono'
import type { FC } from 'hono/jsx'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'

const app = new Hono()

app.use('*', serveStatic({ root: './static' }))

const Layout: FC = (props) => {
    return (
        <html lang="ja">
            <head>
                <meta charset="UTF-8"></meta>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
                <title>server-side JSX with client-side htmx on Hono</title>
                <link rel="stylesheet" href="/styles/tutorial.css"></link>
                <script src="/htmx/htmx.min.js"></script>
                <link rel="icon" href="/favicon.ico"></link>
            </head>
            <body>
                <body>{ props.children }</body>
            </body>
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
            <div id="htmx-book-app">
                <h1>htmx Book App</h1>
                <div id="app-contents">
                    <ul>
                        <li><a href="/section3">Section 3</a></li>
                        <li><a href="/section4">Section 4</a></li>
                        <li><a href="/section5">Section 5</a></li>
                        <li><a href="/section6">Section 6</a></li>
                        <li><a href="/section7">Section 7</a></li>
                        <li><a href="/section8">Section 8</a></li>
                        <li><a href="/section9">Section 9</a></li>
                        <li><a href="/section10">Section 10</a></li>
                        <li><a href="/section11">Section 11</a></li>
                        <li><a href="/section12">Section 12</a></li>
                        <li><a href="/section13">Section 13</a></li>
                        <li><a href="/section14">Section 14</a></li>
                        <li><a href="/section15">Section 15</a></li>
                        <li><a href="/section16">Section 16</a></li>
                    </ul>
                </div>
            </div>
        </Layout>
    )
}

app.get('/', (c) => {
    const messages = ['Hello htmx']
    return c.render(
        <Top messages={ messages } />
    )
})

app.get('/hello', (c) => {
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


const Section3: FC<{ messages: string[] }> = (props: {
    messages: string[]
}) => {
    return (
        <Layout>
            <div class="section-contents">
                <h1>Section3</h1>

                <h2>hx-get</h2>
                <button hx-get="/hello">クリック</button>

                <h2>hx-post</h2>
                <button hx-post="/hello">クリック</button>

                <h2>hx-put</h2>
                <button hx-put="/hello">クリック</button>

                <h2>hx-patch</h2>
                <button hx-patch="/hello">クリック</button>

                <h2>hx-delete</h2>
                <button hx-delete="/hello">クリック</button>
            </div>
        </Layout>
    )
}
app.get('/section3', (c) => {
    const messages = ['Hello htmx']
    return c.render(
        <Section3 messages={messages} />
    )
})

const server = serve(app)

export default server
