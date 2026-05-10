// e2e/section15.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import * as PW from '@playwright/test';

describe('test http://localhost:3001/section15', async () => {
    let browser: PW.Browser;
    let page: PW.Page;
    beforeAll(async () => {
        browser = await PW.chromium.launch({ headless: true });
    });
    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto('http://localhost:3001/section15')
        await page.waitForLoadState('load', { timeout: 10_000 });
    });

    it("hx-ext=head-support hx-head=merge", async () => {
        // click the button with hx-get="/update-head"
        const button = page.locator('css=div[hx-ext="head-support"] > button[hx-get="/update-head"]')
        await PW.expect(button).toBeVisible()
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/update-head/, { timeout: 10000 });
        await button.click()
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        // the response contains a head element with hx-head="merge",
        // which should merge the new head with the existing head elements.
        // Assert that the background-color: yellow is applied
        const backgroundColor = await page.evaluate(() => {
            return window.getComputedStyle(document.body).backgroundColor;
        });
        expect(backgroundColor).toEqual("rgb(255, 255, 0)")   // yellow
    })


    it("hx-ext=head-support hx-head=re-eval", async () => {
        // Let's listen for the console log from the page
        page.on('console', msg => {
            expect(msg.type()).toBe('log');
            expect(msg.text()).toBe("foo.js is loaded");
        })
        // click the button with hx-get="/re-eval-head"
        const button = page.locator('css=div[hx-ext="head-support"] > button[hx-get="/re-eval-head"]')
        await PW.expect(button).toBeVisible()
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/re-eval-head/, { timeout: 10000 });
        await button.click()
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        // by clicking the button, foo.js should be loaded and executed,
        // which will log "foo.js is loaded" to the console
    })

    it("hx-ext=head-support hx-head=append", async () => {
        // click the button with hx-get="/append-head"
        const button = page.locator('css=div[hx-ext="head-support"] > button[hx-get="/append-head"]')
        await PW.expect(button).toBeVisible()
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/append-head/, { timeout: 10000 });
        await button.click();
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        // the response contains a head element with hx-head="append",
        // which should append the new head to the existing head
        // assert that the background-color: yellow is applied
        const backgroundColor = await page.evaluate(() => {
            return window.getComputedStyle(document.body).backgroundColor;
        });
        expect(backgroundColor).toEqual("rgb(255, 255, 0)")   // yellow
    })

    it("hx-ext=preload preloadあり", async () => {
        const button = page.locator('css=p#preload-target2 + button[preload]')
        await PW.expect(button).toBeVisible();
        // click the button with preload attribute
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/hello/, { timeout: 10000 });
        await button.click()
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        // the target should be updated to "GETリクエスト!"
        const target = page.locator('css=#preload-target2')
        await PW.expect(target).toContainText(/GETリクエスト!/)
    })

    it("hx-ext=response-targets hx-get=/success", async () => {
        const button = page.locator('css=button[hx-get="/success"]')
        await PW.expect(button).toBeVisible();
        // click the button with hx-get="/success"
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/success/, { timeout: 10000 });
        await button.click()
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        // the target with id "success" should be updated to "Success!"
        const divSuccess = page.locator('css=#success')
        await PW.expect(divSuccess).toContainText(/Success!/)
    })

    it("hx-ext=response-targets hx-get=/not-found", async () => {
        const button = page.locator('css=button[hx-get="/not-found"]')
        await PW.expect(button).toBeVisible();
        // click the button with hx-get="/not-found"
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/not-found/, { timeout: 10000 });
        await button.click()
        const response = await responsePromise;
        expect(response.status()).toBe(404);
        // the target with id "not-found" should be updated to "Not Found!"
        const divNotFound = page.locator('css=#not-found')
        await PW.expect(divNotFound).toContainText(/Not Found!/)
    })

    it("hx-ext=response-targets hx-get=/server-error", async () => {
        const button = page.locator('css=button[hx-get="/server-error"]')
        await PW.expect(button).toBeVisible();
        // click the button with hx-get="/server-error"
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/server-error/, { timeout: 10000 });
        await button.click()
        const response = await responsePromise;
        expect(response.status()).toBe(500);
        // the target with id "server-error" should be updated to "Server Error!"
        const divServerError = page.locator('css=#server-error')
        await PW.expect(divServerError).toContainText("Internal Server Error!")
    })

    // TODO: test hx-ext=ajax-header
    // TODO: test hx-ext=json-enc
    // TODO: test hx-ext=debug
    // TODO: test hx-ext=remove-/**

    afterEach(async () => {
        await page.close();
    });
    afterAll(async () => {
        await browser.close();
    });
});
