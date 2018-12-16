const net = require('net');
const _ = require('lodash');
const { Spinner } = require('clui');
const Task = require('../parallels/Task');
const createQueueWorker = require('../parallels/queueWorker');
const getPlan = require('../parallels/defaultExecutePlan');
const { prepareDataRaw } = require('../math');

const clients = [];

const countdown = new Spinner('waiting for clients...', ['|', '/', '—', '\\']);
countdown.update = () => {
    countdown.message(`clients count: ${clients.length}       `);
};

const server = net.createServer((socket) => {
    clients.push(socket);
    countdown.update();

    socket.once('close', () => {
        _.remove(clients, socket);
        countdown.update();
    });
});

process.stdin.once('data', () => {
    countdown.stop();
    server.close();

    if (!clients.length) {
        process.exit(1);
        return;
    }

    console.info('[!] Start execute');
    console.debug('[*] Clients:');

    clients.forEach((socket, index) => {
        console.debug(`[*] ${index + 1}: ${socket.remoteAddress}`);
    });

    const startMs = Date.now();
    const queue = createQueueWorker(clients);

    const plan = getPlan(prepareDataRaw(10 ** 5), 5000);
    plan.forEach(p => queue.push(p));

    queue.on('task_finish', (taskId, result) => {
        console.log('TASK FINISH!', taskId, result);
        console.log(queue.length);
    });

    queue.on('task_failed', (taskId, error) => {
        console.log('TASK failed!', taskId, error);
    });

    queue.on('empty', () => {
        console.log('Complete!');
        console.log(`Time total:   ${Date.now() - startMs}`);
        console.log(`Time average: ${queue.getStats().average}`);
    });
});

const address = process.env.PARALLEL_ADDRESS || '0.0.0.0';
const port = parseInt(process.env.PARALLEL_PORT, 10) || 9000;
server.listen(port, address, () => {
    console.info(`[i] Server is up: ${address}:${port}`);
    console.info(`[i] Execute command: ${process.argv}`);
    console.info("[!] Press 'CTRL+C' for exit, press 'Enter' for start execute");

    countdown.start();
});
