// e2e/section11.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import * as PW from '@playwright/test';
import * as BH from './browser-helpers';

describe('test http://localhost:3001/section11', async () => {
    let browser: PW.Browser;
    let context: PW.BrowserContext;
    let page: PW.Page;
    beforeAll(async () => {
        browser = await BH.launchChromium();
        context = await BH.newContext(browser);
        await context.tracing.start({ screenshots: true, snapshots: true })
    });
    beforeEach(async () => {
        page = await BH.newPage(context);
        await page.goto('http://localhost:3001/section11', { timeout: 20_000})
        await page.waitForLoadState('load', { timeout: 10_000 });
    }, 20_000);

    it("drop", async () => {
        // check the initial state
        await PW.expect(page.locator('css=p#drop-target1')).toContainText(/foo/)
        await PW.expect(page.locator('css=p#drop-target2')).toContainText(/hoge/)
        // inter "abc" into the input field
        const form = page.locator('xpath=//h2[contains(.,"drop")]/following-sibling::form[1]')
        const input = form.locator('css=input')
        await input.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(input).toBeEnabled();
        const buttonResponsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/validate/);
        await input.fill('abc')
        await input.press('Enter')
        const buttonResponse = await buttonResponsePromise;
        expect(buttonResponse.status()).toBe(200);
        // then only <p id="drop-target2">hoge</p> will be updated, and <p id="drop-target1">foo</p> won't be updated because of hx-sync="this:drop"
        // the p#drop-target2 won't change
        const content1 = await page.locator('css=p#drop-target1').innerText()
        expect(content1).toMatch(/foo/)
        // the p#drop-target2 will change
        const content2 = await page.locator('css=p#drop-target2').innerText()
        expect(content2).toMatch(/正しい値を入力してください/)
        // Next, click the button
        const button = form.locator('css=button')
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        const formResponsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/send-form/);
        await button.click()
        const formResponse = await formResponsePromise;
        expect(formResponse.status()).toBe(200);
        // the p#drop-target1 will change to "送信完了しました"
        await PW.expect(page.locator('css=p#drop-target1')).toContainText(/送信完了しました/)
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

    afterEach(async () => {
        if (page) {
            await page.close();
        }
    });
    afterAll(async () => {
        if (browser) {
            await context.tracing.stop({ path: `./out/traces/${Date.now()}-section11.zip` });
            await browser.close();
        }
    });
});
