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
                <div id="app-contents">
                    <form hx-post="/add" hx-target="#task-list" hx-swap="beforeend" hx-on--after-request="this.reset()">
                        <input type="text" name="task" placeholder="新しいタスク" required />
                        <button type="submit">追加</button>
                    </form>
                    <ul id="task-list"></ul>
                </div>
            </div>
        </Layout>
    );
}
