// e2e/section8.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import * as PW from '@playwright/test';
import * as BH from './playwright-browser-helpers';

describe('test http://localhost:3001/section8', async () => {
    let browser: PW.Browser;
    let context: PW.BrowserContext;
    let page: PW.Page;
    beforeAll(async () => {
        browser = await BH.launchChromium();
        context = await BH.newContext(browser);
    });
    beforeEach(async () => {
        page = await BH.newPage(context);
        await page.goto('http://localhost:3001/section8', { timeout: 20_000 })
        //await page.waitForLoadState('load', { timeout: 10_000 });
        await page.waitForLoadState('domcontentloaded', { timeout: 10_000 });
    }, 20_000);

    /*
     * hx-trigger="every 1s" causes the page continues interacting with the target URL.
     * We can not expect to observe a pair of request and response to finish.
     */
    it("hx-trigger=every 1s", async () => {
        const p_as_target = page.locator('css=p#every-target');
        const content1 = await p_as_target.innerText();
        expect(content1).toMatch(/foo/);
        await page.waitForTimeout(1100)
        const content2 = await p_as_target.innerText();
        expect(content2).toMatch(/[0-9]+/);
        expect(content2).not.toEqual(content1)
        await page.waitForTimeout(1100)
        const content3 = await p_as_target.innerText();
        expect(content3).toMatch(/[0-9]+/);
        expect(content3).not.toEqual(content2)
    })

    /**
     * the page will send a request to the target URL after 3s from the page load,
     * and then will continue updating the content of the target element every 1 second.
     */
    it("hx-trigger=load delay:3s", async () => {
        const p1 = page.locator('css=p[hx-trigger="load delay:3s"]');
        await PW.expect(p1).toContainText(/hoge/);
        await page.waitForTimeout(3100);
        const content1 = await p1.innerText();
        expect(content1).toMatch(/[0-9]+/);
        await page.waitForTimeout(1000);
        const content2 = await p1.innerText();
        expect(content2).toMatch(/[0-9]+/);
        expect(content2).not.toEqual(content1);
    })

    it("hx-trigger=load, click delay: 0.5s", async () => {
        const p = page.locator('css=p#multiple-trigger-target')
        const content1 = await p.innerText();
        expect(content1).toMatch(/[0-9]+/);
        //
        const button = page.locator('css=button[hx-target="#multiple-trigger-target"]')
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        const responsePromise: Promise<PW.Response> =
                    page.waitForResponse(/\/random/, { timeout: 20000 });
        await button.click();
        await page.waitForTimeout(500);
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        //
        const content2 = await p.innerText()
        expect(content2).toMatch(/[0-9]+/);
        expect(content1).not.toEqual(content2)
    }, 20_000)

    afterEach(async () => {
        if (page) {
            await page.close();
        }
    });
    afterAll(async () => {
        if (browser) {
            await context.tracing.stop({ path: `./out/traces/${Date.now()}-section8.zip` });
            await browser.close();
        }
    });
});
