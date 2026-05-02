// e2e/section15.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { Browser, Page, Locator, chromium, BrowserContext } from 'playwright-chromium';

describe('test http://localhost:3001/section15', async () => {
    let browser: Browser;
    let context: BrowserContext;
    let page: Page;
    /*
     * I use "beforeEach" instead of "beforeAll" because I want to start with
     * a fresh browser and page for each test case, and I want to navigate to
     * the page before each test case to ensure that I am testing
     * the same initial state for each test case. Some extensions may modify
     * the page state, so starting with a fresh page for each test case helps
     * to avoid interference between test cases.
     */
    beforeEach(async () => {
        browser = await chromium.launch({ headless: false });
        context = await browser.newContext();
        page = await context.newPage();
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
        await page.waitForTimeout(500)
        // by clicking the button, foo.js should be loaded and executed,
        // which logs "foo.js is loaded" to the console
    })

    /*
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
        //const button = page.locator('xpath=//p[@id="preload-target2"]/following-sibling::button[1]')
        // click the button with preload attribute
        await button.click()
        await page.waitForTimeout(500)
        // the target should be updated to "GETリクエスト!"
        const target = page.locator('css=#preload-target2')
        const text = await target.textContent()
        expect(text).toBe("GETリクエスト!")
    })

    it("hx-ext=response-targets hx-get=/success", async () => {
        // click the button with hx-get="/success"
        const button = page.locator('css=button[hx-get="/success"]')
        await button.click()
        await page.waitForTimeout(500)
        // the target with id "success" should be updated to "Success!"
        const successTarget = page.locator('css=#success')
        const successText = await successTarget.textContent()
        expect(successText).toBe("Success!")
    })

    it("hx-ext=response-targets hx-get=/not-found", async () => {
        // click the button with hx-get="/not-found"
        const button = page.locator('css=button[hx-get="/not-found"]')
        await button.click()
        await page.waitForTimeout(500)
        // the target with id "not-found" should be updated to "Not Found!"
        const notFoundTarget = page.locator('css=#not-found')
        const notFoundText = await notFoundTarget.textContent()
        expect(notFoundText).toBe("Not Found!")
    })

    it("hx-ext=response-targets hx-get=/server-error", async () => {
        // click the button with hx-get="/server-error"
        const button = page.locator('css=button[hx-get="/server-error"]')
        await button.click()
        await page.waitForTimeout(500)
        // the target with id "server-error" should be updated to "Server Error!"
        const serverErrorTarget = page.locator('css=#server-error')
        const serverErrorText = await serverErrorTarget.textContent()
        expect(serverErrorText).toBe("Internal Server Error!")
    })
*/

    afterEach(async () => {
        console.log("afterEach: closing context")
        await context.close();
        console.log("afterEach: closing browser")
        await browser.close();
        console.log("afterEach: done")
    });
});
