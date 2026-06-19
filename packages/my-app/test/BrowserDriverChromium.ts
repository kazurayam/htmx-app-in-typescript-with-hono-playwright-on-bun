// test/BrowserDriverChromium.ts

import { Browser, BrowserContext, Page } from '@playwright/test';
import * as BH from './browser-helpers';
import { getLogger } from '@logtape/logtape';

const logger = getLogger(["my-app", "BrowserDriverChromium"]);

export class BrowserDriverChromium {
    private browser: Browser;
    private context: BrowserContext;

    // you should call create() instead of the private constructor
    private constructor(browser: Browser, context: BrowserContext) {
        this.browser = browser;
        this.context = context;
    }

    // static method for async initialization
    static async create(): Promise<BrowserDriverChromium> {
        const browser = await BH.launchChromium();
        const context = await BH.newContext(browser);
        return new BrowserDriverChromium(browser, context);
    }

    getBrowser(): Browser {
        return this.browser;
    }

    getContext(): BrowserContext {
        return this.context;
    }

    async navigateToUrl(url: string): Promise<Page> {
        try {
            const page = await BH.newPage(this.context);
            await page.goto(url, { timeout: 15_000 });
            await page.waitForLoadState('load', { timeout: 5_000 });
            return page;
        } catch (error) {
            logger.error(`${error}`);
            // when an error occured, restart the browser and retry
            this.browser.close();
            this.browser = await BH.launchChromium();
            this.context = await BH.newContext(this.browser);
            await this.context.tracing.start({ screenshots: true, snapshots: true })
            //
            const page = await BH.newPage(this.context);
            await page.goto(url, { timeout: 15_000 });
            await page.waitForLoadState('load', { timeout: 10_000 });
            logger.info(`[beforeEach] recreated the browser`)
            return page;
        }
    }
}
