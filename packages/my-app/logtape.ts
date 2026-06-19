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
        { category: ["my-app", "browser-helpers"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "browser-helpers.test"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "BrowserDriverChromium"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "index.test"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "main"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "section3.test"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "section4.test"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "section5.test"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "section6.test"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "section7.test"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "section8.test"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "section9.test"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "section10.test"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "section11.test"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "section12.test"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "section13.test"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "section14.test"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "section15.test"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "promise-utils"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "promise-utils.test"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "withTimeout.test"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["logtape", "meta"], lowestLevel: "warning", sinks: ["console"] },
    ],
});
