import { configure, getConsoleSink } from "@logtape/logtape";
import { getFileSink, getRotatingFileSink } from "@logtape/file";


// 単純なファイル出力
const fileSink = getFileSink("app.log");

// ローテーション付き（10MBで切り替え、5ファイルまで保持）
/*
const rotatingFileSink = getRotatingFileSink("app.log", {
    maxSize: 10 * 1024 * 1024,
    maxFiles: 5,
});
*/

await configure({
    sinks: {
        console: getConsoleSink(),  // 出力先としてコンソールを宣言
        file: getFileSink("./out/app.log")  // 出力先としてファイルを宣言
    },
    loggers: [
        { category: ["my-app", "promise-utils"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "promise-utils.test"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["logtape", "meta"], lowestLevel: "warning", sinks: ["console"] },
    ],
});
