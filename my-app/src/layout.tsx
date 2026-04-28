// layout.tsx
import type { FC } from 'hono/jsx'

const Layout: FC = (props) => {
    return (
        <html lang="ja">
            <head>
                <meta charset="UTF-8"></meta>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
                <title>server-side JSX with client-side htmx on Hono</title>
                <link rel="stylesheet" href="/styles/tutorial.css"></link>
                <script src="/htmx/htmx.min.js"></script>
                <script src="/htmx/ext/head-support.js" hx-preserve="true" defer></script>
                <link rel="icon" href="/favicon.ico"></link>
            </head>
            <body>
                <body>{props.children}</body>
            </body>
        </html>
    )
}

export default Layout
