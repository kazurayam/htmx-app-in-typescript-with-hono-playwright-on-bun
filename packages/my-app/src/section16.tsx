// section16.tsx
import type { FC } from 'hono/jsx'
import { Layout } from './layout'

export const Section16: FC = () => {
    return (
        <Layout>
            <div class="section-contents">
                <h1>Section16</h1>

                <h2>validation</h2>
                <p id="target">入力して送信してください。</p>
                <form id="validate-form" hx-post="/send-form" hx-target="#target">
                    <input name="example" required
                        pattern="(ペンギン|クジラ|キリン)"></input>
                    <button class="btn btn-default">送信</button>
                </form>
            </div>
        </Layout>
    )
}
