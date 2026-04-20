// section9.tsx
import type { FC } from 'hono/jsx'
import Layout from "./layout"

const Section9: FC = () => {
    return (
        <Layout>
            <div class="section-contents">
                <h1>Section9</h1>

                <h2>hx-indicator</h2>
                <h3>スピナー</h3>
                <img id="spinner" class="htmx-indicator" src="/spinner.svg" />
                <div>
                    <button hx-get="/heavy" hx-indicator="#spinner">
                        クリック
                    </button>
                </div>
                <h3>スピナー2</h3>
                <img id="spinner2" class="htmx-indicator"
                    style="position:fixed; top:50%; left:50%; z-index:1000; transform: translate(-50%, -50%);"
                    src="/spinner.svg" />
                <div>
                    <button hx-get="/heavy" hx-indicator="#spinner2">
                        クリック２
                    </button>
                </div>
            </div>
        </Layout>
    )
}

export default Section9
