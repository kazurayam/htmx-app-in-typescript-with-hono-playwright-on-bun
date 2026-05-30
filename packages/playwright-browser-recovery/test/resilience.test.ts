import { describe, it, expect, beforeAll, beforeEach, afterEach, afterAll } from 'bun:test';
import * as PW from '@playwright/test';
import { PlaywrightResilienceManager } from '../src/playwright-resilience-manager';

describe('run resilience tests', async () => {
    let manager: PlaywrightResilienceManager;
    let page: PW.Page;
    beforeAll(async () => {
        manager = new PlaywrightResilienceManager();
    })
    beforeEach(async () => {
        // Initialize with recovery capabilities
        ({ page } = await manager.initialize());
    })

    it("step1 page.goto()", async () => {
        let step = async (p: PW.Page) => {
            await p.goto('https://example.com');
            manager.setCheckpointData({ step: 1, url: 'https://example.com' });
        }
        await process(page, manager, step)
    });

    it("step2 p.fill", async () => {
        let step = async (p: PW.Page) => {
            await p.fill('#username', 'testuser');
            await p.fill('#password', 'password123');
            manager.setCheckpointData({ step: 2, formFilled: true });
        }
        await process(page, manager, step)
    });

    it("step3 p.click", async () => {
        let step = async (p: PW.Page) => {
            await p.click('#login-button');
            await p.waitForNavigation();
            manager.setCheckpointData({ step: 3, loggedIn: true });
        }
        await process(page, manager, step)
    });

    it("step4 p.$$eval", async () => {
        let step = async (p: PW.Page) => {
            await p.goto('https://example.com/dashboard');
            const data = await p.$$eval('.data-item', items =>
                items.map(i => i.textContent)
            );
            manager.setCheckpointData({ step: 4, data });
        }
        await process(page, manager, step)
    })

    afterEach(async () => { });
    afterAll(async () => {
        await manager.close();
    })
});

async function process(page: PW.Page,
        manager: PlaywrightResilienceManager,
        step: (p: PW.Page) => Promise<void>) {
    try {
        await step(page);
    } catch (error) {
        // Let manager handle recovery
        const { page: recoveredPage } = await manager._recover();
        // Retry the step with recovered page
        await step(recoveredPage);
    }
}
