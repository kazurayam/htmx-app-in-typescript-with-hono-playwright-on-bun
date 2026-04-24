// e2e/section11.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { Browser, Page, Locator, chromium } from 'playwright-chromium';

describe('test http://localhost:3001/section11', async () => {
    let browser: Browser;
    let page: Page;
    beforeAll(async () => {
        browser = await chromium.launch({ timeout: 10000 });
        page = await browser.newPage();
        await page.goto('http://localhost:3001/section11')
    });

    it("drop", async () => {
        // check the initial state
        const p1 = page.locator('css=p#drop-target1')
        const p2 = page.locator('css=p#drop-target2')
        expect(await p1.innerText()).toMatch(/foo/)
        expect(await p2.innerText()).toMatch(/hoge/)
        // inter "abc" into the input field, click the button
        const form = page.locator('xpath=//h2[contains(.,"drop")]/following-sibling::form[1]')
        const input = form.locator('css=input')
        await input.fill('abc')
        await input.press('Enter')
        const button = form.locator('css=button')
        await button.click()
        await page.waitForTimeout(1500)  // wait for 1.5s for the response from the /validate
        // the p#drop-target2 won't change
        const content1 = page.locator('css=p#drop-target1').innerText()
        expect(content1).toMatch(/foo/)
        // the p#drop-target2 will change
        const content2 = page.locator('css=p#drop-target2').innerText()
        expect(content2).toMatch(/正しい値を入力してください/)
    })

    it("abort", async () => {
        // for what use? I don't understand this.
    })

    it("replace", async () => {
        // for what use? I don't understand this.
    })

    it("queue", async () => {
        // for what use? I don't have any idea how to use this.
    })

    afterAll(async () => {
        await browser.close();
    });
});
