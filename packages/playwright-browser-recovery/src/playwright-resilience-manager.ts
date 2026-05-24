// Complete recovery implementation
import * as PW from '@playwright/test';
import { BrowserHeartbeatMonitor } from './browser-heartbeat-monitor';
import fs from 'fs';

export class PlaywrightResilienceManager {
    options: {
        maxRetries: number;
        checkpointInterval: number;
        heartbeatInterval: number;
    };
    browser: PW.Browser | null;
    context: PW.BrowserContext | undefined | null;
    page: PW.Page | undefined | null;
    heartbeatMonitor: BrowserHeartbeatMonitor | undefined | null;
    checkpointData: any | null;

    constructor(options = {}) {
        this.options = {
            maxRetries: 3,
            checkpointInterval: 10000,
            heartbeatInterval: 5000,
            ...options
        };

        this.browser = null;
        this.context = null;
        this.page = null;
        this.heartbeatMonitor = null;
        this.checkpointData = null;
    }

    async initialize() {
        try {
            // Launch browser with crash detection
            this.browser = await PW.chromium.launch({
                headless: true,
                args: ['--disable-dev-shm-usage', '--no-sandbox']
            });

            // Restore session or create new
            await this._restoreOrCreateSession();

            // Set up heartbeat monitoring
            this._setupHeartbeatMonitor();

            return { browser: this.browser, context: this.context, page: this.page };

        } catch (error) {
            console.error('Initialization failed:', error);
            throw error;
        }
    }

    async _restoreOrCreateSession() {
        try {
            const stateFile = fs.readFileSync('session-state.json', 'utf8');
            const storageState = JSON.parse(stateFile);

            this.context = await this.browser?.newContext({ storageState });
        } catch (error) {
            // No saved state or invalid state
            this.context = await this.browser?.newContext();
        }

        this.page = await this.context?.newPage();

        // Set up error handlers
        this.page.on('crash', () => this._handlePageCrash());
        this.page.on('error', (error) => this._handlePageError(error));
    }

    _setupHeartbeatMonitor() {
        this.heartbeatMonitor = {
            intervalId: setInterval(async () => {
                try {
                    // Check browser connection
                    await this.browser.version();

                    // Save checkpoint data periodically
                    await this._saveCheckpoint();
                } catch (error) {
                    this._handleConnectionFailure(error);
                }
            }, this.options.heartbeatInterval)
        };
    }

    async _saveCheckpoint() {
        if (!this.checkpointData) return;

        try {
            // Save current state and checkpointData
            const storageState = await this.context?.storageState();
            fs.writeFileSync('session-state.json', JSON.stringify(storageState));
            fs.writeFileSync('checkpoint-data.json', JSON.stringify({
                timestamp: new Date().toISOString(),
                ...this.checkpointData
            }));
        } catch (error) {
            console.error('Failed to save checkpoint:', error);
        }
    }

    async _handlePageCrash() {
        console.warn('Page crash detected, attempting recovery');
        await this._recover();
    }

    async _handlePageError(error) {
        console.error('Page error:', error);
        if (error.message.includes('crash') || error.message.includes('closed')) {
            await this._recover();
        }
    }

    async _handleConnectionFailure(error) {
        console.error('Connection failure:', error);
        clearInterval(this.heartbeatMonitor?.intervalId);
        await this._recover();
    }

    async _recover() {
        let attempts = 0;
        let recovered = false;

        while (attempts < this.options.maxRetries && !recovered) {
            try {
                attempts++;
                console.log(`Recovery attempt ${attempts}/${this.options.maxRetries}`);

                // Close existing instances if they exist
                if (this.page) await this.page.close().catch(() => { });
                if (this.context) await this.context.close().catch(() => { });
                if (this.browser) await this.browser.close().catch(() => { });

                // Restart browser
                this.browser = await PW.chromium.launch({
                    headless: true,
                    args: ['--disable-dev-shm-usage', '--no-sandbox']
                });

                // Restore session
                await this._restoreOrCreateSession();

                // Re-setup heartbeat
                this._setupHeartbeatMonitor();

                // Load checkpoint data
                try {
                    const checkpointFile = fs.readFileSync('checkpoint-data.json', 'utf8');
                    this.checkpointData = JSON.parse(checkpointFile);
                    console.log('Restored from checkpoint:', this.checkpointData.timestamp);
                } catch (error) {
                    console.warn('No checkpoint data found');
                }

                recovered = true;
            } catch (error) {
                console.error(`Recovery attempt ${attempts} failed:`, error);
                await new Promise(r => setTimeout(r, 1000 * attempts));
            }
        }

        if (!recovered) {
            throw new Error('Failed to recover after maximum retry attempts');
        }

        return { browser: this.browser, context: this.context, page: this.page };
    }

    setCheckpointData(data: any) {
        this.checkpointData = { ...this.checkpointData, ...data };
    }

    async close() {
        // Save final checkpoint
        await this._saveCheckpoint();

        // Clear heartbeat
        if (this.heartbeatMonitor && this.heartbeatMonitor.intervalId) {
            clearInterval(this.heartbeatMonitor.intervalId);
        }

        // Close everything
        if (this.page) await this.page.close().catch(() => { });
        if (this.context) await this.context.close().catch(() => { });
        if (this.browser) await this.browser.close().catch(() => { });
    }
}
