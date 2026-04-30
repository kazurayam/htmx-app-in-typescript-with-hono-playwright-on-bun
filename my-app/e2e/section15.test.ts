// e2e/section15.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { Browser, Page, Locator, chromium } from 'playwright-chromium';

describe('test http://localhost:3001/section15', async () => {
    let browser: Browser;
    let page: Page;
    beforeAll(async () => {
        browser = await chromium.launch({ headless: true });
        page = await browser.newPage();
        await page.goto('http://localhost:3001/section15')
    });

    it("hx-ext=head-support hx-head=merge", async () => {
        // click the button with hx-get="/update-head"
        const button = page.locator('css=div[hx-ext="head-support"] > button[hx-get="/update-head"]')
        await button.click()
        await page.waitForTimeout(500)
        // the response contains a head element with hx-head="merge", which should merge the new head with the existing head
        // assert that the background-color: yellow is applied
        const backgroundColor = await page.evaluate(() => {
            return window.getComputedStyle(document.body).backgroundColor;
        });
        expect(backgroundColor).toEqual("rgb(255, 255, 0)")   // yellow
    })


    it("hx-ext=head-support hx-head=re-eval", async () => {
        // Listen for the console log from the page
        page.on('console', msg => {
            expect(msg.type()).toBe('log');
            expect(msg.text()).toBe("foo.js is loaded");
        })
        // click the button with hx-get="/re-eval-head"
        const button = page.locator('css=div[hx-ext="head-support"] > button[hx-get="/re-eval-head"]')
        await button.click()
        // foo.js should be loaded and executed, which logs "foo.js is loaded" to the console
        await page.waitForTimeout(500)
    })

    it("hx-ext=head-support hx-head=append", async () => {
        // click the button with hx-get="/append-head"
        const button = page.locator('css=div[hx-ext="head-support"] > button[hx-get="/append-head"]')
        await button.click()
        await page.waitForTimeout(500)
        // the response contains a head element with hx-head="append", which should append the new head to the existing head
        // assert that the background-color: yellow is applied
        const backgroundColor = await page.evaluate(() => {
            return window.getComputedStyle(document.body).backgroundColor;
        });
        expect(backgroundColor).toEqual("rgb(255, 255, 0)")   // yellow
    })

    it("hx-ext=preload preloadあり", async () => {
        const button = page.locator('css=p#preload-target2 + button[preload]')
        // click the button with preload attribute
        await button.click()
        await page.waitForTimeout(500)
        // the target should be updated to "GETリクエスト!"
        const target = page.locator('css=#preload-target2')
        const text = await target.textContent()
        expect(text).toBe("GETリクエスト!")
    })


    afterAll(async () => {
        await browser.close();
    });
});
