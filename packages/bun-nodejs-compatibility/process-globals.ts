// process-globals.js
// Handling process and global object differences

// Most process properties work
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);
console.log('PID:', process.pid);
console.log('CWD:', process.cwd());

// process.nextTick works but consider using queueMicrotask
process.nextTick(() => {
    console.log('Next tick executed');
});

// Preferred modern approach
queueMicrotask(() => {
    console.log('Microtask executed');
});

// Signal handling
process.on('SIGINT', () => {
    console.log('Received SIGINT');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM');
    process.exit(0);
});
