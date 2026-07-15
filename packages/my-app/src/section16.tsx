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
                        hx-on-blur="console.log('blur');
                        if (this.value != 'ペンギン') {
                            this.setCustomValidity('ペンギンと入力してください');
                            htmx.find('#validate-form').reportValidity();
                        }"></input>
                    <button class="btn btn-default">送信</button>
                </form>


                <h2>Logging</h2>
                <button hx-get="/random" hx-target="#content" hx-swap="innerHTML">
                    コンテンツをロード
                </button>
                <div id="content"></div>
                <script src="/js/section16.js"></script>

            </div>
        </Layout>
    )
}
