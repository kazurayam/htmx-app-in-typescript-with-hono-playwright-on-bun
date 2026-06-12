// e2e/section6.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import * as PW from '@playwright/test';
import * as BH from './browser-helpers';

describe('test http://localhost:3001/section6', async () => {
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
        await page.goto('http://localhost:3001/section6')
        await page.waitForLoadState('load', { timeout: 20_000 });
    }, 20_000);

    it("hx-trigger=click onceなし", async () => {
        const button = page.locator('css=button[hx-target="#once-target1"]');
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        //
        await PW.expect(page.locator('css=p#once-target1')).toContainText(/onceなし/);
        await PW.expect(async () => {
            const responsePromise: Promise<PW.Response> =
                page.waitForResponse(/\/random/, { timeout: 10000 });
            await button.click();
            const response = await responsePromise;
            expect(response.status()).toBe(200);
        }).toPass({ timeout: 20000 });
        const content1 = await page.locator('css=p#once-target1').innerText();
        expect(content1).toMatch(/[0-9]/);   // ランダムな数字
        // click the button once again
        await PW.expect(async () => {
            const responsePromise2: Promise<PW.Response> =
                page.waitForResponse(/\/random/, { timeout: 10000 });
            await button.click();
            const response = await responsePromise2;
            expect(response.status()).toBe(200);
        }).toPass({ timeout: 20000 });
        const content2 = await page.locator('css=p#once-target1').innerText();
        expect(content2).toMatch(/[0-9]/);   // さっきとは違うランダムな数字
        // the text would change
        expect(content1).not.toEqual(content2);
        // 二つのstringが同じでないということをJestのexpectを使ってassertしてみた。
        // waitする必要がない場合にはPlaywrightのPW.expectでなくJestのexpectを使いたくなる。
        // Jestのexpectに慣れているから。ただしPlaywrightのPW.expectも自動的なwaitを伴わない
        // ジェネリックなassertionをサポートしている。例えば
        //     PW.expect(content1).not.toEqual(content2);
        // で同じことができる。awaitする必要はない。
    })

    it("hx-trigger=click onceあり", async () => {
        const button = page.locator('css=button[hx-target="#once-target2"]');
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        await PW.expect(async () => {
            const responsePromise: Promise<PW.Response > =
            page.waitForResponse(/\/random/, { timeout: 10000 });
            await button.click();
            const response = await responsePromise;
            expect(response.status()).toBe(200);
        }).toPass({ timeout: 20000 });
        const content1 = await page.locator('css=p#once-target2').innerText();
        expect(content1).toMatch(/[0-9]/);
        // click the button once again
        await button.click();
        await page.waitForTimeout(500)
        const content2 = await page.locator('css=p#once-target2').innerText();
        expect(content1).toMatch(/[0-9]/);
        // the text would stay the same
        expect(content1).toEqual(content2);
    })

    it("hx-trigger=keyup without changed", async () => {
        const input = page.locator('css=input[hx-target="#changed-target1"]');
        await input.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(input).toBeEnabled();
        await PW.expect(async () => {
            const responsePromise: Promise<PW.Response> =
                page.waitForResponse(/\/random/, { timeout: 10000 });
            await input.press('Enter');
            const response = await responsePromise;
            expect(response.status()).toBe(200);
        }).toPass({ timeout: 20000 });
        const content1 = await page.locator('css=p#changed-target1').innerText();
        expect(content1).toMatch(/[0-9]+/);
    })

    it("hx-trigger=keyup with changed", async () => {
        const input = page.locator('css=input[hx-target="#changed-target2"]');
        await input.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(input).toBeEnabled();
        //
        await PW.expect(async () => {
            const responsePromise: Promise<PW.Response> =
                page.waitForResponse(/\/random/, { timeout: 10000 });
            // type some characters into the <input> element
            await input.fill('abc')
            await input.press('Enter')
            const response = await responsePromise;
            expect(response.status()).toBe(200);
        }).toPass({timeout: 20000})
        // assert the content of <p id="changed-target2"> is changed
        const content1 = await page.locator('css=p#changed-target2').innerText();
        expect(content1).toMatch(/[0-9]/);
        // press the <input> element with no character changed
        await input.press('Enter')
        // then the <p> element won't change
        const content2 = await page.locator('css=p#changed-target2').innerText();
        expect(content2).toEqual(content1);
    })

    it("hx-trigger=keyup without delay", async () => {
        const input = page.locator('css=input[hx-target="#delay-target1"]');
        await input.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(input).toBeEnabled();
        //
        await PW.expect(async () => {
            const responsePromise: Promise<PW.Response> =
                page.waitForResponse(/\/random/, { timeout: 10000 });
            await input.fill('a');
            await input.press('Enter');
            const response = await responsePromise;
            expect(response.status()).toBe(200);
        }).toPass({ timeout: 20000 });
        await PW.expect(page.locator('css=p#delay-target1')).toContainText(/[0-9]+/);
    })

    it("hx-trigger=keyup with delay of 3s", async () => {
        const input = page.locator('css=input[hx-target="#delay-target2"]');
        await input.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(input).toBeEnabled();
        // before keyup, the <p id="delay-target2"> has content of "delay 3秒"
        const content1 = await page.locator('css=p#delay-target2').innerText()
        expect(content1).toMatch(/delay 3秒/);
        // key in characters and send, with wait for response, which will take approximately 3 seconds
        await PW.expect(async () => {
            const responsePromise: Promise<PW.Response> =
                page.waitForResponse(/\/random/, { timeout: 10000 });
            await input.fill('abc')
            await input.press('Enter')
            const response = await responsePromise;
            expect(response.status()).toBe(200);
        }).toPass({timeout: 20000})
        // after keyup, the <p id="delay-target"> has new content
        const content2 = await page.locator('css=p#delay-target2').innerText()
        expect(content2).toMatch(/[0-9]+/);
    })

    it("hx-trigger=keyup change throttle:3s", async () => {
        const input = page.locator('css=input[hx-target="#throttle-target2"]');
        await input.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(input).toBeEnabled();
        //
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/random/, { timeout: 5_000 });
        await input.pressSequentially("a")
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        const content1 = await page.locator('css=p#throttle-target2').innerText();
        expect(content1).toMatch(/[0-9]+/);
        // Typing "1" will trigger web interaction only after 3 seconds, as the "throttle:3s" is given.
        // Therefore, immediately after typing, the <p id="throttle-target2"> won't change
        await input.pressSequentially("1")
        const content2 = await page.locator('css=p#throttle-target2').innerText()
        expect(content2).toEqual(content1);
        // Typing "X" will trigger web interaction after 3 seconds, as the "throttle:3s" is given.
        // Let's wait for the request to finish which will change the <p id="throttle-target2">
        await page.waitForTimeout(3000)
        const responsePromise2: Promise<PW.Response> =
            page.waitForResponse(/\/random/, { timeout: 5_000 });
        await input.pressSequentially("X");
        await page.keyboard.up("Shift");
        const response2 = await responsePromise2;
        expect(response2.status()).toBe(200);
        const content3 = await page.locator('css=p#throttle-target2').innerText();
        //console.log(content1, content2, content3);
        expect(content3).not.toEqual(content2);
    }, 10_000)

    it("hx-trigger=from:CSS selector", async () => {
        const input4 = page.locator('css=input#input4');
        await input4.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(input4).toBeEnabled();
        //
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/random/, { timeout: 10000 });
        await input4.fill("abc");
        await input4.press('Enter');
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        await PW.expect(page.locator('css=#from-target')).toContainText(/[0-9]+/);
    })

    it("hx-trigger=target:CSS selector", async () => {
        const button3 = page.locator('css=div[hx-trigger="click target:.btn"] div button')
        await button3.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button3).toBeEnabled();
        //
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/random/, { timeout: 10000 });
        await button3.click()
        const response = await responsePromise;
        expect(response.status()).toBe(200)
        await PW.expect(page.locator('css=p#target-target')).toContainText(/[0-9]+/);
    })

    it("hx-trigger=consume", async () => {
        const button = page.locator('css=button[hx-trigger="click consume"]')
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        //
        await button.click()
        // no interaction will be fired becase of hx-tregger="click consume"
        const p = page.locator('css=p#consume-target2');
        await PW.expect(p).toContainText(/consumeあり/);
    })

    it("hx-trigger=queue", async () => {
        const button = page.locator('css=button[hx-trigger="click queue:all"]');
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        //
        await button.click()
        await button.click()
        await page.waitForTimeout(500)
        const result = await page.locator('css=div#result1').locator('css=div').count()
        expect(result).toEqual(2);
    })

    afterEach(async () => {
        if (page) {
            await page.close();
        }
    });
    afterAll(async () => {
        if (browser) {
            await context.tracing.stop({ path: `./out/traces/${Date.now()}-section6.zip` });
            await browser.close();
        }
    });
});
