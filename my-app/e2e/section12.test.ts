// e2e/section12.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { Browser, Page, Locator, chromium } from 'playwright-chromium';

describe('test http://localhost:3001/section12', async () => {
    let browser: Browser;
    let page: Page;
    beforeAll(async () => {
        browser = await chromium.launch();
        page = await browser.newPage();
        await page.goto('http://localhost:3001/section12')
        await page.waitForLoadState('networkidle', { timeout: 10_000 });
    });

    it("hx-params=*", async () => {
        const form = page.locator('css=form[hx-params="*"]')
        // send texts in the input fields
        await form.locator('css=input[name="title"]').fill('greeting')
        await form.locator('css=input[name="name"]').fill('kazurayam')
        await form.locator('css=input[name="age"]').fill('66')
        // click the button
        const button = form.locator('button')
        await button.click()
        await page.waitForTimeout(1500)
        // assert the target to contain "title=aaa&name=bbb&age=66"
        const text = await page.locator('css=p#all-target').innerText()
        expect(text).toMatch(/title=greeting&name=kazurayam&age=66/)
    })

    it("hx-params=none", async () => { /* omit */ })

    it("hx-params=title,age", async () => {
        const form = page.locator('css=form[hx-params="title,age"]')
        // send texts in the input fields
        await form.locator('css=input[name="title"]').fill('greeting')
        await form.locator('css=input[name="name"]').fill('kazurayam')
        await form.locator('css=input[name="age"]').fill('66')
        // click the button
        const button = form.locator('css=button')
        await button.click()
        await page.waitForTimeout(1500)
        // assert the target to contain "title=aaa&age=66"
        const text = await page.locator('css=p#param-target').innerText()
        expect(text).toMatch(/title=greeting&age=66/)
    })

    it("hx-param=not param-list", async () => { /* omit */ })

    it("hx-include=previous [name='name']", async () => {
        // fill the input[name='name'] with my name
        const div = page.locator('xpath=//p[@id="include-target"]/following-sibling::div[1]')
        const input = div.locator('input[name="name"]')
        input.fill("kazurayam")
        // click the button
        const button = div.locator('css=button')
        await button.click()
        await page.waitForTimeout(1500)
        // assert the target <p> contains "name=kazurayam"
        const p = page.locator('p#include-target')
        expect(await p.innerText()).toMatch(/kazurayam/)
    })

    it("hx-vals", async () => {
        // click the button
        const h2 = page.locator('xpath=//h2[contains(text(),"hx-vals")]')
        const button = h2.locator('xpath=following-sibling::button[1]')
        await button.click()
        await page.waitForTimeout(500)
        // assert the target <p> contains "title=Hello&name=Taro"
        const p = page.locator('css=p#vals-target1')
        expect(await p.innerText()).toMatch(/title=Hello&name=Taro/)
    })

    it("hx-vals=js:{lastkey: event.key}", async () => {
        // into the input field, press keys 'L', 'O', 'V', 'E'
        const input = page.locator('css=div[hx-target="#vals-target2"] input')
        input.press("L")
        input.press("O")
        input.press("V")
        input.press("E")
        await page.waitForTimeout(500)
        // asser the target <p> contains "lastkey=E"
        const p = page.locator('css=p#vals-target2')
        expect(await p.innerText()).toMatch(/lastkey=E/)
    })

    afterAll(async () => {
        await browser.close();
    });
});
