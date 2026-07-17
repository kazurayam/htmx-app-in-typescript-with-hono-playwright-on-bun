// src/top.tsx
import type { FC } from 'hono/jsx';
import { Layout } from "./layout";

export const Top: FC<{ messages: string[] }> = (props: {
    messages: String[]
}) => {
    return (
        <Layout>
            <div id="chat-app">
                <h1>Chat App</h1>
                <div hx-ext="ws" ws-connect="/chatroom">
                    <form id="form" ws-send>
                        <input name="message" type="text" placeholder="メッセージ" required></input>
                        <button type="submit">送信</button>
                    </form>
                </div>
                <div id="messages"></div>
            </div>
        </Layout>
    );
}
