// src/top.tsx
import type { FC } from 'hono/jsx';
import { Layout } from "./layout";

export const Top: FC<{ messages: string[] }> = (props: {
    messages: string[]
}) => {
    return (
        <Layout>
            {
                props.messages.map((message) => {
                    return <p>{message}</p>;
                })
            }
            <div id="app">
                <h1>ToDo App</h1>
                <p>Hello World</p>
            </div>
        </Layout>
    );
}
