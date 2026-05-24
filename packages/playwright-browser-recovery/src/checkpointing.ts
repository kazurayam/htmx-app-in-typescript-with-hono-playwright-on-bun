// e2e/recoveringFromBrowserCrash/checkpointingLongOperation.ts
import * as PW from '@playwright/test';
import fs from 'fs/promises';

// Checkpointing pattern
async function performLongOperationWithCheckpoints(page: PW.Page, steps) {
    // Load previous checkpoint if exists
    let startStep = 0;
    try {
        const checkpoint = JSON.parse(await fs.readFile('operation-checkpoint.json', 'utf8'));
        startStep = checkpoint.completedStep + 1;
        console.log(`Resuming from step ${startStep}`);
    } catch (error) {
        // No checkpoint found, start from beginning
    }

    // Execute steps with checkpointing
    for (let i = startStep; i < steps.length; i++) {
        try {
            await steps[i](page);

            // Save checkpoint after each step
            await fs.writeFile('operation-checkpoint.json', JSON.stringify({
                completedStep: i,
                timestamp: new Date().toISOString()
            }));
        } catch (error) {
            console.error(`Failed at step ${i}:`, error);
            throw error;
        }
    }

    // Clear checkpoint after successful completion
    await fs.unlink('operation-checkpoint.json').catch(() => { });
}

