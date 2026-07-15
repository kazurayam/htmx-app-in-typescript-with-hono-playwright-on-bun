// $PROJECT/logtape.ts
import { configure, getConsoleSink } from "@logtape/logtape";
import { getFileSink } from "@logtape/file";

await configure({
    sinks: {
        console: getConsoleSink(),
        file: getFileSink("./out/my-app.log", {
            flushInterval: 1000, // flush every 1 second
            nonBlocking: true,
        })
    },
    loggers: [
        { category: ["my-app"], lowestLevel: "debug", sinks: ["file"] },
        { category: ["logtape", "meta"], lowestLevel: "warning", sinks: ["console"] },
    ],
});
