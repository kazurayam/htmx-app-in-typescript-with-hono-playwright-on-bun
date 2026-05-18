// e2e/section14.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import * as PW from '@playwright/test';

describe('test http://localhost:3001/section14', async () => {
    let browser: PW.Browser;
    let page: PW.Page;
    beforeAll(async () => {
        browser = await PW.chromium.launch({ headless: true });
    });
    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto('http://localhost:3001/section14')
        await page.waitForLoadState('load', { timeout: 20_000 });
    });

    it("継承 hx-targetの例", async () => {
        const div = page.locator('css=div[hx-target="#target1"]')
        const button1 = div.locator('css=button:nth-child(1)')
        const button2 = div.locator('css=button:nth-child(2)')
        const button3 = div.locator('xpath=following-sibling::button[1]')
        await PW.expect(button1).toBeVisible()
        await PW.expect(button2).toBeVisible()
        await PW.expect(button3).toBeVisible()
        // ボタン1をクリックするとp#target1の内容が変化する。なぜならbutton1はdivの子要素で、divにhx-target="#target1"が指定されているから。
        await button1.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button1).toBeEnabled();
        const responsePromise1: Promise<PW.Response> = page.waitForResponse(/\/random/, { timeout: 10000 });
        await button1.click()
        const response1 = await responsePromise1;
        expect(response1.status()).toBe(200);
        await PW.expect(page.locator('css=p#target1')).toContainText(/[0-9]+/)
        // ボタン2をクリックするとp#target2の内容が変化する。なぜならbutton2にhx-target="#target2"が指定されているから。親要素のdivのhx-targetは継承されない。
        await button2.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button2).toBeEnabled();
        const responsePromise2: Promise<PW.Response> = page.waitForResponse(/\/random/, { timeout: 10000 });
        await button2.click()
        const response2 = await responsePromise2;
        expect(response2.status()).toBe(200);
        await PW.expect(page.locator('css=p#target2')).toContainText(/[0-9]+/)
        // ボタン3をクリックするとbutton3の内容が変化する。なぜならbutton3はdivの子要素ではないから。buttonにhx-targetが指定されていないから、デフォルト動作としてbutton自身の内容文字列が変化する。
        await button3.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button3).toBeEnabled();
        const responsePromise3: Promise<PW.Response> = page.waitForResponse(/\/random/, { timeout: 10000 });
        await button3.click()
        const response3 = await responsePromise3;
        expect(response3.status()).toBe(200);
        await PW.expect(button3).toContainText(/[0-9]+/)
    })

    it("継承 hx-confirmの例", async () => {
        const div = page.locator('xpath=//h2[contains(text(),"hx-confirmの例")]/following-sibling::div[1]')
        await PW.expect(div).toBeVisible();
        let buttonName = ""
        page.on('dialog', async (dialog) => {
            await page.waitForTimeout(100)
            expect(dialog.message()).toMatch(/本当にこのボタンでいいですか/)
            expect(buttonName).toBeOneOf(['A', 'B'])
            dialog.accept()
        })
        //ボタンAとボタンBはクリックするとdialogを表示する
        //というのも親要素のdivが指定したhx-conformを継承するから
        const buttonA: PW.Locator = div.locator('xpath=button[1]')
        await buttonA.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(buttonA).toBeEnabled();
        buttonName = 'A'
        const responsePromiseA: Promise<PW.Response> = page.waitForResponse(/\/random/, { timeout: 10000 });
        await buttonA.click()
        const responseA = await responsePromiseA;
        expect(responseA.status()).toBe(200);
        await PW.expect(buttonA).toContainText(/[0-9]+/)
        //
        const buttonB: PW.Locator = div.locator('xpath=button[2]')
        await buttonB.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(buttonB).toBeEnabled();
        buttonName = 'B'
        const responsePromiseB: Promise<PW.Response> = page.waitForResponse(/\/random/, { timeout: 10000 });
        await buttonB.click()
        const responseB = await responsePromiseB;
        expect(responseB.status()).toBe(200);
        await PW.expect(buttonB).toContainText(/[0-9]+/)
        //しかしボタンCはdialogを表示しない。hx-confirm="unset"しているから。
        const buttonC: PW.Locator = div.locator('xpath=button[3]')
        await buttonC.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(buttonC).toBeEnabled();
        buttonName = 'C'
        const responsePromiseC: Promise<PW.Response> = page.waitForResponse(/\/random/, { timeout: 10000 });
        await buttonC.click()
        const responseC = await responsePromiseC;
        expect(responseC.status()).toBe(200);
        await PW.expect(buttonC).toContainText(/[0-9]+/)
    })

    it("継承 hx-disinherit hx-target指定なし", async () => {
        //buttonの親要素のdivにhx-target属性が指定されている
        //buttonをクリックするとhx-targetに指定されたp要素の内容が変化する
        const h3 = page.locator('xpath=//h3[contains(text(),"hx-target指定なし")]')
        await PW.expect(h3).toBeVisible()
        const button = h3.locator('xpath=following-sibling::div[1]/button')
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        //buttonをクリックするとp要素の内容が変化する。なぜならbuttonはdivの子要素で、divにhx-target="#no-disinherit-target1"が指定されているから。
        const responsePromise: Promise<PW.Response> = page.waitForResponse(/\/random/, { timeout: 10000 });
        await button.click()
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        const p = page.locator('p#no-disinherit-target1')
        await PW.expect(p).toContainText(/[0-9]+/)
    })

    it("継承 hx-disinherit hx-target指定あり", async () => {
        //buttonの親要素にhx-target属性が指定されているが
        //あわせてhx-disinherit="hx-target"と指定されているのでhx-targetが無効化される
        //buttonをクリックするとp要素は変化しないでbutton自身の内容が変化する
        const h3 = page.locator('xpath=//h3[contains(text(),"hx-targetを指定")]')
        await PW.expect(h3).toBeVisible()
        const button = h3.locator('xpath=following-sibling::div[1]/button')
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        const responsePromise: Promise<PW.Response> = page.waitForResponse(/\/random/, { timeout: 10000 });
        await button.click()
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        const p = page.locator('p#disinherit-target1')
        await PW.expect(p).toContainText(/foo/)
        await PW.expect(button).toContainText(/[0-9]+/)
    })

    it("継承 hx-disinheritに*を指定", async () => {
        //buttonの親要素にhx-target属性が指定されているが
        //合わせてhx-disinherit="*"と指定されているのでhx-targetが無効化される
        //buttonをクリックするとp要素は変化しないでbutton自身の内容が変化する
        const h3 = page.locator('xpath=//h3[contains(text(),"*を指定")]')
        await PW.expect(h3).toBeVisible()
        const button = h3.locator('xpath=following-sibling::div[1]/button')
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        await PW.expect(async () => {
            const responsePromise: Promise<PW.Response> = page.waitForResponse(/\/random/, { timeout: 10000 });
            await button.click()
            const response = await responsePromise;
            expect(response.status()).toBe(200);
        }).toPass({ timeout: 35000 });
        const p = page.locator('css=p#disinherit-target2')
        await PW.expect(p).toContainText(/foo/)
        await PW.expect(button).toContainText(/[0-9]+/)
    })

    afterEach(async () => {
        if (page) {
            await page.close();
        }
    }, 20_000);
    afterAll(async () => {
        if (browser) {
            await browser.close();
        }
    }, 20_000);
});
