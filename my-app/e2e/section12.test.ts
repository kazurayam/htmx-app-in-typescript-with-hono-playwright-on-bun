// e2e/section12.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import * as PW from '@playwright/test';

describe('test http://localhost:3001/section12', async () => {
    let browser: PW.Browser;
    let page: PW.Page;
    beforeAll(async () => {
        browser = await PW.chromium.launch();
    });
    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto('http://localhost:3001/section12')
        await page.waitForLoadState('load', { timeout: 10_000 });
    });

    it("hx-params=*", async () => {
        const form = page.locator('css=form[hx-params="*"]')
        await PW.expect(form).toBeVisible()
        // send texts in the input fields
        await form.locator('css=input[name="title"]').fill('greeting')
        await form.locator('css=input[name="name"]').fill('kazurayam')
        await form.locator('css=input[name="age"]').fill('66')
        const button = form.locator('button')
        // make sure the button is clickable
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        // click the button
        // hx-post="/send-form" will take longer longer than 1 second
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/send-form/, { timeout: 10_000 });
        await button.click()
        const response: PW.Response = await responsePromise;
        expect(response.status()).toBe(200);
        // assert the target to contain "title=aaa&name=bbb&age=66"
        await PW.expect(page.locator('css=p#all-target'))
            .toContainText(/title=greeting&name=kazurayam&age=66/)
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
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/send-form/, { timeout: 10_000 });
        await button.click();
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        // assert the target to contain "title=aaa&age=66"
        await PW.expect(page.locator('css=p#param-target'))
            .toContainText(/title=greeting&age=66/)
    })

    it("hx-param=not param-list", async () => { /* omit */ })

    it("hx-include=previous [name='name']", async () => {
        // fill the input[name='name'] with my name
        const div = page.locator('xpath=//p[@id="include-target"]/following-sibling::div[1]')
        const input = div.locator('input[name="name"]')
        input.fill("kazurayam")
        // click the button
        const button = div.locator('css=button')
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/send-form/, { timeout: 10_000 });
        await button.click()
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        // assert the target <p> contains "name=kazurayam"
        const p = page.locator('p#include-target')
        expect(await p.innerText()).toMatch(/kazurayam/)
    })

    it("hx-vals", async () => {
        // click the button
        const h2 = page.locator('xpath=//h2[contains(text(),"hx-vals")]')
        const button = h2.locator('xpath=following-sibling::button[1]')
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/greeting/, { timeout: 20_000 });
        await button.click()
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        // assert the target <p> contains "title=Hello&name=Taro"
        const p = page.locator('css=p#vals-target1')
        expect(await p.innerText()).toMatch(/title=Hello&name=Taro/)
    })

    it("hx-vals=js:{lastkey: event.key}", async () => {
        // into the input field, press keys 'L', 'O', 'V', 'E'
        const input = page.locator('css=div[hx-target="#vals-target2"] input')
        await input.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(input).toBeEnabled();
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/last-key/, { timeout: 20_000 });
        input.pressSequentially("LOVE")
        const response = await responsePromise
        expect(response.status()).toBe(200);
        // asser the target <p> contains "lastkey=E"
        const p = page.locator('css=p#vals-target2')
        expect(await p.innerText()).toMatch(/lastkey=E/)
    })

    afterEach(async () => {
        await page.close();
    })
    afterAll(async () => {
        await browser.close();
    });
});
