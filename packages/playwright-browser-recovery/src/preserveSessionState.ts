// e2e/recoveringFromBrowserCrash/sessionstatepreservation.ts
// quoted from https://markaicode.com/playwright-mcp-browser-crash-recovery-patterns-2025/

import type { Browser, Page } from '@playwright/test';
import fs from 'fs';

// Session state preservation pattern
export async function preserveSessionState(page: Page) {
    // Save storage state including cookies and localStorage
    const storageState = await page.context().storageState();

    // Write to temporary file
    fs.writeFileSync('build/session-state.json', JSON.stringify(storageState));

    return storageState;
}

export async function restoreSessionState(browser: Browser) {
    try {
        // Read stored state
        const stateData = fs.readFileSync('build/session-state.json', 'utf8');
        const storageState = JSON.parse(stateData);

        // Create new context with preserved state
        const context = await browser.newContext({ storageState });
        const page = await context.newPage();

        return { context, page };
    } catch (error) {
        console.error('Failed to restore session:', error);
        // Fall back to clean session
        const context = await browser.newContext();
        const page = await context.newPage();

        return { context, page };
    }
}
