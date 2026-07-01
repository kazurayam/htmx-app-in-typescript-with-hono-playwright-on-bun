import { configure, getConsoleSink } from "@logtape/logtape";
import { getFileSink } from "@logtape/file";

await configure({
    sinks: {
        console: getConsoleSink(),  // 出力先としてコンソールを宣言
        file: getFileSink("./out/my-app.log")  // 出力先としてファイルを宣言
    },
    loggers: [
        { category: ["my-app", "browser-helpers"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "browser-helpers.test"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "BrowserDriverChromium"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "index.test"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "main"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["my-app", "play-on-browser.test"], lowestLevel: "debug", sinks: ["console", "file"] },
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
        { category: ["logtape", "meta"], lowestLevel: "warning", sinks: ["console"] },
    ],
});
