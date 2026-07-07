// src/task.tsx
import type { FC } from 'hono/jsx';

export const Task: FC<{ task: string }> = (props: { task: string }) => {
    return (
        <li>
            <p>{props.task}</p>
            <button className="delete-btn">削除</button>
        </li>
    );
}
