// e2e/section14.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { Browser, Page, Locator, chromium } from 'playwright-chromium';

describe('test http://localhost:3001/section14', async () => {
    let browser: Browser;
    let page: Page;
    beforeAll(async () => {
        browser = await chromium.launch({ headless: true });
        page = await browser.newPage();
        await page.goto('http://localhost:3001/section14')
    });

    it("継承 hx-targetの例", async () => {
        const div = page.locator('css=div[hx-target="#target1"]')
        const button1 = div.locator('css=button:nth-child(1)')
        const button2 = div.locator('css=button:nth-child(2)')
        const button3 = page.locator('xpath=//h2[contains(text(),"hx-targetの例")]/following-sibling::button[1]')
        //
        await button1.click()
        await page.waitForTimeout(500)
        expect(await page.locator('css=p#target1').innerText()).toMatch(/[0-9]+/)
        //
        await button2.click()
        await page.waitForTimeout(500)
        expect(await page.locator('css=p#target2').innerText()).toMatch(/[0-9]+/)
        //
        await button3.click()
        await page.waitForTimeout(500)
        expect(await button3.innerText()).toMatch(/[0-9]+/)
    })

    it("継承 hx-confirmの例", async () => {
        const div = page.locator('xpath=//h2[contains(text(),"hx-confirmの例")]/following-sibling::div[1]')
        //ボタンAとボタンBはクリックするとdialogを表示する
        //というのも親要素のdivが指定したhx-conformを継承するから
        let buttonName = ""
        page.on('dialog', async (dialog) => {
            await page.waitForTimeout(100)
            expect(dialog.message()).toMatch(/本当にこのボタンでいいですか/)
            expect(buttonName).toBeOneOf(['A','B'])
            dialog.accept()
        })
        const buttonA = div.locator('xpath=button[1]')
        buttonName = 'A'
        await buttonA.click()
        await page.waitForTimeout(100)
        expect(await buttonA.innerText()).toMatch(/[0-9]+/)
        //
        const buttonB = div.locator('xpath=button[2]')
        buttonName = 'B'
        await buttonB.click()
        await page.waitForTimeout(100)
        expect(await buttonB.innerText()).toMatch(/[0-9]+/)
        //しかしボタンCはdialogを表示しない。hx-confirm="unset"しているから。
        const buttonC = div.locator('xpath=button[3]')
        buttonName = 'C'
        await buttonC.click()
        await page.waitForTimeout(100)
        expect(await buttonC.innerText()).toMatch(/[0-9]+/)
    })

    it("継承 hx-disinherit hx-target指定なし", async () => {
        //buttonの親要素のdivにhx-target属性が指定されている
        //buttonをクリックするとhx-targetに指定されたp要素の内容が変化する
        const h3 = page.locator('xpath=//h3[contains(text(),"hx-target指定なし")]')
        const button = h3.locator('xpath=following-sibling::div[1]/button')
        await button.click()
        await page.waitForTimeout(500)
        const p = page.locator('p#no-disinherit-target1')
        expect(await p.innerText()).toMatch(/[0-9]+/)
    })

    it("継承 hx-disinherit hx-target指定あり", async () => {
        //buttonの親要素にhx-target属性が指定されているが
        //あわせてhx-disinherit="hx-target"と指定されているのでhx-targetが無効化される
        //buttonをクリックするとp要素は変化しないでbutton自身の内容が変化する
        const h3 = page.locator('xpath=//h3[contains(text(),"hx-targetを指定")]')
        const button = h3.locator('xpath=following-sibling::div[1]/button')
        await button.click()
        await page.waitForTimeout(500)
        const p = page.locator('p#disinherit-target1')
        expect(await p.innerText()).toMatch(/foo/)
        expect(await button.innerText()).toMatch(/[0-9]+/)
    })

    it("継承 hx-disinheritに*を指定", async () => {
        //buttonの親要素にhx-target属性が指定されているが
        //合わせてhx-disinherit="*"と指定されているのでhx-targetが無効化される
        //buttonをクリックするとp要素は変化しないでbutton自身の内容が変化する
        const h3 = page.locator('xpath=//h3[contains(text(),"*を指定")]')
        const button = h3.locator('xpath=following-sibling::div[1]/button')
        await button.click()
        await page.waitForTimeout(500)
        const p = page.locator('css=p#disinherit-target2')
        expect(await p.innerText()).toMatch(/foo/)
        expect(await button.innerText()).toMatch(/[0-9+]/)
    })


    afterAll(async () => {
        await browser.close();
    });
});
