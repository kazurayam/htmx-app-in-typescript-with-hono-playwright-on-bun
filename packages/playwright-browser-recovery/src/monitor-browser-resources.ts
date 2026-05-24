import { Browser } from '@playwright/test';

// Resource monitoring integration
async function monitorBrowserResources(browser: Browser) {
    const pid = browser.process()?.pid;

    if (!pid) {
        console.warn('Unable to monitor resources - browser PID not found');
        return () => {};
    }

    // On Linux/Mac
    let command = `ps -p ${pid} -o %cpu,%mem`;

    // On Windows
    if (process.platform === 'win32') {
        command = `tasklist /FI "PID eq ${pid}" /FO CSV`;
    }

    // Check every 5 seconds
    const intervalId = setInterval(() => {
        exec(command, (error, stdout) => {
            if (error) {
                console.error('Failed to monitor resources:', error);
                return;
            }

            const output = stdout.toString();
            const lines = output.split('\n').filter(Boolean);

            if (lines.length > 1) {
                const stats = lines[1].trim().split(/\s+/);
                const cpuUsage = parseFloat(stats[0]);
                const memUsage = parseFloat(stats[1]);

                console.log(`Browser (PID ${pid}) - CPU: ${cpuUsage}%, Memory: ${memUsage}%`);

                // Alert on high resource usage
                if (cpuUsage > 90 || memUsage > 80) {
                    console.warn('Browser resource usage critical - potential crash risk');
                }
            }
        });
    }, 5000);

    return () => clearInterval(intervalId);
}
