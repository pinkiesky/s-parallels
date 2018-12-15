const { fork } = require('child_process');
const { cpus } = require('os');
const { join } = require('path');

const cpuCount = cpus().length;
const processCount = parseInt(process.env.PARALLEL_PROCESSES) || Math.max(1, cpuCount - 1);

console.log(`CPU count: ${cpuCount}`);
console.log(`Processes: ${processCount}`);

for (let i = 0; i < processCount; i++) {
    fork(join(__dirname, 'client_single.js'));
}