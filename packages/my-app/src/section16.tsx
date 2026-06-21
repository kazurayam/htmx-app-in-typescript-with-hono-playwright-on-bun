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

                <h2>Server-side validation</h2>
                <p><a href="https://htmx.org/examples/inline-validation/">https://htmx.org/examples/inline-validation/</a></p>
                <h3>Singup Form</h3>
                <p>Enter an email into the input below and on tab out it will validated. Only "test@test.com" will pass.</p>
                <form hx-post="/contact">
                    <div ht-target="this" hx-swap="outerHTML">
                        <label>Email Address</label>
                        <input name="email" hx-post="/contact/email"
                            hx-indicator="#ind"></input>
                        <img id="ind" src="/img/bars.svg" alt="Checking..."
                            class="htmx-indicator"></img>
                    </div>
                    <div class="form-group">
                        <label>First Name</label>
                        <input type="text" class="form-control" name="firstName"></input>
                    </div>
                    <div class="form-group">
                        <label>Last Name</label>
                        <input type="text" class="form-control" name="lastName"></input>
                    </div>
                    <button class="btn primary">Submit</button>
                </form>


            </div>
        </Layout>
    )
}
