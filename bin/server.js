const net = require('net');
const _ = require('lodash');
const { Spinner } = require('clui');
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

    countdown.start();

    const startMs = Date.now();
    const queue = createQueueWorker(clients);

    const plan = getPlan(prepareDataRaw(10 ** 5), 2500);
    // FIXME
    plan.forEach((chunk, id) => queue.push({ chunk, id: id + 1 }));

    queue.on('task_finish', (taskId, result) => {
        // FIXME
        const task = plan[taskId - 1];
        task.result = result;
        countdown.message(`waiting: ${queue.length}/${plan.length}           `);
    });

    queue.on('task_failed', (taskId, error) => {
        console.log('[!] TASK failed!', taskId, error);
    });

    queue.on('empty', () => {
        console.log('\n[+] Complete!');
        console.log(`[+] Time total: ${Date.now() - startMs}`);

        const {
            m1, m2, m3, m4,
        } = plan.reduce((sum, { module, result }) => {
            // eslint-disable-next-line no-param-reassign
            sum[module.name] = (sum[module.name] || 0) + result[0];
            return sum;
        }, {});

        console.log(`[+] Result: ${(m1 - m2) / (m3 - m4)}`);

        process.exit(0);
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
