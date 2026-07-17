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
            </div>
        </Layout>
    );
}
