// e2e/recoveringFromBrowserCrash/connectionHeartbeatMonitoring.ts
import * as PW from '@playwright/test';

// Connection heartbeat pattern
export class BrowserHeartbeatMonitor {

    browser: PW.Browser | null;
    heartbeatInterval: number;
    intervalId: ReturnType<typeof setInterval> | null;
    onDisconnect: ((error: Error) => void) | null;

    constructor(browser: PW.Browser, heartbeatInterval = 5000) {
        this.browser = browser;
        this.heartbeatInterval= heartbeatInterval;
        this.intervalId = null;
        this.onDisconnect = null;
    }

    start(disconnectCallback: ((error: Error) => void)) {
        this.onDisconnect = disconnectCallback;

        this.intervalId = setInterval(async () => {
            try {
                // Simple version check to verify browser connection
                this.browser?.version();
            } catch (error: any) {
                console.error('Browser heartbeat failed:', error);
                clearInterval(this.intervalId);

                if (this.onDisconnect) {
                    this.onDisconnect(error);
                }
            }
        }, this.heartbeatInterval);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
