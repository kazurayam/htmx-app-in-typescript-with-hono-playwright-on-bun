// math.ts called by app.test.ts

// カスタム関数をfunction命令で定義する
export function add(arg1: number, arg2: number): number {
    return arg1 + arg2;
}

// カスタム関数をfunctionリテラルで定義する
export const multiplycd = function (arg1: number, arg2: number): number {
    return arg1 * arg2;
}

export interface MyResult {
    status: string;
}
// カスタム関数をアロー関数で定義する
export let fetchData = (): MyResult => {
    return { status: 'success' };
}
