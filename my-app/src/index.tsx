import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import Top from './top'

const app = new Hono()

app.use('*', serveStatic({ root: './static' }))

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
