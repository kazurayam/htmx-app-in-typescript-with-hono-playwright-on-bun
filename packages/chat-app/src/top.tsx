// src/top.tsx
import type { FC } from 'hono/jsx';
import { Layout } from "./layout";

export const Top: FC<{ messages: string[] }> = (props: {
    messages: String[]
}) => {
    const reset = { 'hx-on:htmx:ws-after-message': "document.querySelector('form').reset()" }
    return (
        <Layout>
            <div id="chat-app">
                <h1>Chat App</h1>
                <div hx-ext="ws" ws-connect="/chatroom" {...reset}>
                    <form id="form" ws-send>
                        <input name="name" type="text" placeholder="名前" required></input>
                        <input name="message" type="text" placeholder="メッセージ" required></input>
                        <button type="submit">送信</button>
                    </form>
                </div>
                <div id="messages"></div>
            </div>
        </Layout>
    );
}
