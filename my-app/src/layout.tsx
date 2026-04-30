// layout.tsx
import type { FC } from 'hono/jsx'

const Layout: FC = (props) => {
    return (
        <html lang="ja">
            <head>
                <meta charset="UTF-8"></meta>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
                <title>htmx + JSX on Hono + bun</title>
                <link rel="stylesheet" href="/styles/tutorial.css"></link>
                <script src="/htmx/htmx.min.js" hx-preserve="true"></script>
                <script src="/htmx/ext/head-support.js" hx-preserve="true" defer></script>
                <script src="/htmx/ext/preload.js" hx-preserve="true" defer></script>
                <script src="/htmx/ext/response-targets.js" hx-preserve="true" defer></script>
                <script src="/htmx/ext/ajax-header.js" hx-preserve="true" defer></script>
                <script src="/htmx/ext/json-enc.js" hx-preserve="true" defer></script>
                <script src="/htmx/ext/debug.js" hx-preserve="true" defer></script>
                <script src="/htmx/ext/remove-me.js" hx-preserve="true" defer></script>
                <link rel="icon" href="/favicon.ico"></link>
            </head>
            <body>
                <body>{props.children}</body>
            </body>
        </html>
    )
}

export default Layout
