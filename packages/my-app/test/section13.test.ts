// e2e/section13.test.ts
import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import * as PW from '@playwright/test';
import { BrowserDriverChromium } from './BrowserDriverChromium';
import { getLogger } from '@logtape/logtape';

const logger = getLogger(["my-app", "section13.test"]);
const url = 'http://localhost:3001/section13';

describe(`test ${url}`, async () => {
    // Here I assume that the server at http://localhost:3001 is already up and running.
    let driver: BrowserDriverChromium;
    let page: PW.Page;
    beforeAll(async () => {
        driver = await BrowserDriverChromium.create();
        await driver.getContext().tracing.start({ screenshots: true, snapshots: true })
    });
    beforeEach(async () => {
        page = await driver.navigateToUrl(url);
    }, 20_000);

    test("ダイアログ", async () => {
        page.on('dialog', async (dialog) => {
            await page.waitForTimeout(100)
            expect(dialog.message()).toMatch(/ハロー/)
            dialog.accept()
        });
        const button = page.locator('css=button[hx-confirm="ハロー"]')
        await button.click()
    })

    test("hx-boost(有効時) リンクの例", async () => {
        // I don't see what's the use
    })

    test("hx-boost(無効時) リンクの例", async () => {
        // I don't see what's the use
    })

    test("hx-boost(有効時) formの例", async () => {
        // I don't see what's the use
    })

    test("hx-push-url(true)", async () => {
        // I don't see what's the use
    })

    test("hx-push-url(false)", async () => {
        // I don't see what's the use
    })

    test("hx-push-url(カスタムURL)", async () => {
        // I don't see what's the use
    })

    test("hx-on", async () => {
        // I don't see what's the use
    })

    test("htmx:before-request", async () => {
        // I don't see what's the use
    })

    test("htmx:after-request", async () => {
        // I don't see what's the use
    })

    afterEach(async () => {
        if (page) {
            await page.close();
        }
    });
    afterAll(async () => {
        if (driver.getContext()) {
            await driver.getContext().tracing.stop({ path: `./out/traces/${Date.now()}-section4.zip` });
            await driver.getContext().close()
        }
        if (driver.getBrowser()) {
            await driver.getBrowser().close()
        }
    })
});
